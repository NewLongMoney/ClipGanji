import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

// ─── Input sanitizer — strips HTML tags to prevent XSS in email body ──────────
function sanitize(str: unknown): string {
    if (typeof str !== "string") return ""
    return str.replace(/<[^>]*>/g, "").trim().slice(0, 2000)
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
    // ─── 1. Block non-JSON requests ───────────────────────────────────────────
    const contentType = req.headers.get("content-type") ?? ""
    if (!contentType.includes("application/json")) {
        return NextResponse.json({ error: "Invalid content type" }, { status: 415 })
    }

    // ─── 2. Body size guard (prevent large payload attacks) ───────────────────
    const raw = await req.text()
    if (raw.length > 20_000) {
        return NextResponse.json({ error: "Payload too large" }, { status: 413 })
    }

    let body: Record<string, unknown>
    try {
        body = JSON.parse(raw)
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    // ─── 3. Validate and sanitize inputs ──────────────────────────────────────
    const companyName = sanitize(body.companyName)
    const name = sanitize(body.name)
    const email = sanitize(body.email)
    const budget = sanitize(body.budget)
    const message = sanitize(body.message)

    if (!name || !email || !message) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!isValidEmail(email)) {
        return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // ─── 4. Confirm server-side env vars are present ──────────────────────────
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) {
        console.error("Missing GMAIL_USER or GMAIL_APP_PASS env vars")
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASS,
            },
        })

        // ─── 5. Notify ClipGanji ──────────────────────────────────────────────
        await transporter.sendMail({
            from: `"ClipGanji Website" <${process.env.GMAIL_USER}>`,
            to: "clipganji@gmail.com",
            subject: `📩 New Campaign Brief from ${companyName || name}`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:8px">
                    <h1 style="color:#ca8a04;font-size:28px;margin-bottom:4px">New Campaign Brief</h1>
                    <p style="color:#aaa;margin-top:0;margin-bottom:24px">Received via clipganji.com</p>
                    <table style="width:100%;border-collapse:collapse">
                        <tr><td style="padding:10px 0;color:#888;width:140px">Company</td><td style="padding:10px 0;color:#fff;font-weight:bold">${companyName || "—"}</td></tr>
                        <tr><td style="padding:10px 0;color:#888">Name</td><td style="padding:10px 0;color:#fff;font-weight:bold">${name}</td></tr>
                        <tr><td style="padding:10px 0;color:#888">Email</td><td style="padding:10px 0;color:#fff"><a href="mailto:${email}" style="color:#ca8a04">${email}</a></td></tr>
                        <tr><td style="padding:10px 0;color:#888">Budget</td><td style="padding:10px 0;color:#fff">${budget || "—"}</td></tr>
                    </table>
                    <div style="margin-top:24px;padding:16px;background:#111;border-left:4px solid #ca8a04;border-radius:4px">
                        <p style="color:#888;margin:0 0 8px 0;font-size:12px;text-transform:uppercase;letter-spacing:1px">Message</p>
                        <p style="color:#fff;margin:0;line-height:1.6">${message}</p>
                    </div>
                    <p style="color:#555;margin-top:24px;font-size:12px">Reply directly to this email to respond to ${name}.</p>
                </div>
            `,
            replyTo: email,
        })

        // ─── 6. Auto-reply to enquirer ────────────────────────────────────────
        await transporter.sendMail({
            from: `"ClipGanji" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: `✅ We got your brief, ${name.split(" ")[0]}!`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:8px">
                    <h1 style="color:#ca8a04;font-size:28px;margin-bottom:4px">Brief Received 🎬</h1>
                    <p style="color:#aaa;margin-top:0;margin-bottom:24px">Thanks for reaching out to ClipGanji</p>
                    <p style="color:#fff;line-height:1.7">Hi <strong>${name.split(" ")[0]}</strong>,</p>
                    <p style="color:#ccc;line-height:1.7">
                        We've received your campaign brief and we're excited to work with <strong>${companyName || "you"}</strong>.<br/>
                        Our team will review your requirements and get back to you within <strong style="color:#ca8a04">24 hours</strong>.
                    </p>
                    <div style="margin:28px 0;padding:20px;background:#111;border-radius:8px;border:1px solid #222">
                        <p style="color:#888;margin:0 0 12px 0;font-size:12px;text-transform:uppercase;letter-spacing:1px">Your Submission Summary</p>
                        <p style="color:#ccc;margin:4px 0"><span style="color:#888">Budget: </span>${budget || "Not specified"}</p>
                        <p style="color:#ccc;margin:4px 0"><span style="color:#888">Brief: </span>${message.slice(0, 200)}${message.length > 200 ? "…" : ""}</p>
                    </div>
                    <p style="color:#ccc;line-height:1.7">
                        In the meantime, feel free to call us at <strong style="color:#ca8a04">0702 005 560</strong> or <strong style="color:#ca8a04">0704 096 417</strong>.
                    </p>
                    <hr style="border:none;border-top:1px solid #222;margin:28px 0"/>
                    <p style="color:#555;font-size:12px;margin:0">ClipGanji · Kenya's #1 Short-Form Video Ad Network · Nairobi, Kenya</p>
                </div>
            `,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Email send error:", error)
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }
}

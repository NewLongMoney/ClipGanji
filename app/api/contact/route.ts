import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { companyName, name, email, budget, message } = body;

        if (!companyName || !name || !email || !budget || !message) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'clipganji@gmail.com',
                pass: 'iubnbigigmosavtu',
            },
        });

        const mailOptions = {
            from: 'clipganji@gmail.com',
            to: 'clipganji@gmail.com',
            replyTo: email,
            subject: `New Campaign Brief from ${companyName}`,
            text: `Company: ${companyName}\nName: ${name}\nEmail: ${email}\nBudget: ${budget}\nMessage:\n${message}`,
        };

        const submitterHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border-radius: 8px;">
                <img src="https://clip-ganji.vercel.app/images/logo2.png" alt="ClipGanji Logo" style="height: 40px; margin-bottom: 30px;" />
                <h2 style="color: #00C853; text-transform: uppercase; margin-bottom: 20px;">Campaign Brief Received</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #eee; margin-bottom: 20px;">
                    Hi ${name},<br/><br/>
                    Thanks for reaching out to ClipGanji. We've received your brief for <strong>${companyName}</strong> and our team is reviewing it now.
                </p>
                <p style="font-size: 16px; line-height: 1.6; color: #eee; margin-bottom: 30px;">
                    We typically respond within 24 hours to discuss next steps and get your campaign launched.
                </p>
                <hr style="border-color: #333; margin: 30px 0;" />
                <p style="font-size: 14px; color: #888; line-height: 1.5;">
                    ClipGanji Team<br/>
                    <a href="https://clip-ganji.vercel.app" style="color: #F5B800; text-decoration: none;">clip-ganji.vercel.app</a>
                </p>
            </div>
        `;

        const submitterMailOptions = {
            from: 'ClipGanji Network <clipganji@gmail.com>',
            to: email,
            subject: 'We received your campaign brief — ClipGanji',
            html: submitterHtml,
        };

        const info = await transporter.sendMail(mailOptions);
        await transporter.sendMail(submitterMailOptions);

        return NextResponse.json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error('Email error:', error);
        return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
    }
}

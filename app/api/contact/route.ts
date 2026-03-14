import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import {
    sanitizeString,
    isValidEmail,
    contactLimits,
    rateLimitContact,
    escapeHtml,
} from '@/lib/security';

export async function POST(req: Request) {
    if (!rateLimitContact(req)) {
        return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });
    }
    try {
        const body = await req.json();
        const { companyName, name, email, budget, message, requestRateCard } = body;

        const companyNameS = sanitizeString(companyName, contactLimits.companyName);
        const nameS = sanitizeString(name, contactLimits.name);
        const emailS = sanitizeString(email, contactLimits.email);
        const budgetS = sanitizeString(budget, contactLimits.budget);
        const messageS = sanitizeString(message, contactLimits.message);

        if (!companyNameS || !nameS || !emailS || !budgetS || !messageS) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }
        if (!isValidEmail(emailS)) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
        }

        const requestRateCardBool = requestRateCard === true || requestRateCard === 'on' || String(requestRateCard).toLowerCase() === 'true';

        await prisma.contactSubmission.create({
            data: {
                companyName: companyNameS,
                name: nameS,
                email: emailS,
                budget: budgetS,
                message: messageS,
                requestRateCard: requestRateCardBool,
            },
        });

        // Try to send email if configured (optional)
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;
        if (emailUser && emailPass) {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: { user: emailUser, pass: emailPass },
                });

                const adminHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border-radius: 8px; border: 1px solid #333;">
                <img src="https://clipganji.com/images/LogoNoBackground.png" alt="ClipGanji Logo" style="height: 40px; margin-bottom: 30px;" />
                <h2 style="color: #F5B800; text-transform: uppercase; margin-bottom: 20px;">New Campaign Brief</h2>
                <div style="background: #111; padding: 20px; border-radius: 4px; border-left: 4px solid #F5B800;">
                    <p style="margin: 0 0 10px 0;"><strong style="color: #aaa;">Company:</strong> <br/>${escapeHtml(companyNameS)}</p>
                    <p style="margin: 0 0 10px 0;"><strong style="color: #aaa;">Name:</strong> <br/>${escapeHtml(nameS)}</p>
                    <p style="margin: 0 0 10px 0;"><strong style="color: #aaa;">Email:</strong> <br/>${escapeHtml(emailS)}</p>
                    <p style="margin: 0 0 10px 0;"><strong style="color: #aaa;">Budget:</strong> <br/>${escapeHtml(budgetS)}</p>
                    <p style="margin: 0 0 10px 0;"><strong style="color: #aaa;">Requested Rate Card?:</strong> <br/>${requestRateCardBool ? '<span style="color: #00C853; font-weight: bold;">YES</span>' : 'No'}</p>
                </div>
                <h3 style="color: #eee; margin-top: 30px; margin-bottom: 10px;">Message:</h3>
                <div style="background: #111; padding: 20px; border-radius: 4px; color: #ddd; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
                    ${escapeHtml(messageS)}
                </div>
                <hr style="border-color: #333; margin: 30px 0;" />
                <p style="font-size: 14px; color: #888; line-height: 1.5;">
                    Action Required: Please review and reply to ${escapeHtml(emailS)}
                </p>
            </div>
        `;

        const mailOptions = {
            from: 'clipganji@gmail.com',
            to: 'clipganji@gmail.com',
            replyTo: emailS,
            subject: `New Campaign Brief from ${escapeHtml(companyNameS)}`,
            html: adminHtml,
        };

        const submitterHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border-radius: 8px; border: 1px solid #1e40af;">
                <img src="https://clipganji.com/images/LogoNoBackground.png" alt="ClipGanji Logo" style="height: 50px; margin-bottom: 30px;" />
                <h2 style="color: #00C853; text-transform: uppercase; margin-bottom: 20px;">Campaign Brief Received</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #eee; margin-bottom: 20px;">
                    Hi ${escapeHtml(nameS)},<br/><br/>
                    Thanks for reaching out to ClipGanji. We've received your brief for <strong style="color: #F5B800;">${escapeHtml(companyNameS)}</strong> and our team is reviewing it now.
                </p>
                <div style="background: #111; padding: 20px; border-radius: 4px; border-left: 4px solid #00C853; margin-bottom: 20px;">
                    <p style="margin: 0; font-size: 14px; color: #ccc;">
                        "Your brand inside every clip. Every view verified."
                    </p>
                </div>
                <p style="font-size: 16px; line-height: 1.6; color: #eee; margin-bottom: 30px;">
                    We typically respond within 24 hours to discuss next steps and get your campaign launched.
                </p>
                <hr style="border-color: #333; margin: 30px 0;" />
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td valign="top" style="padding-right: 20px;">
                            <img src="https://clipganji.com/images/LogoNoBackground.png" alt="ClipGanji Logo Bug" style="height: 40px;" />
                        </td>
                        <td valign="top">
                            <p style="font-size: 14px; color: #888; line-height: 1.5; margin: 0;">
                                <strong>The ClipGanji Team</strong><br/>
                                <a href="https://clipganji.com" style="color: #F5B800; text-decoration: none;">clipganji.com</a><br/>
                                <a href="mailto:clipganji@gmail.com" style="color: #888; text-decoration: none;">clipganji@gmail.com</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
        `;

        const submitterMailOptions = {
            from: 'ClipGanji Network <clipganji@gmail.com>',
            to: emailS,
            subject: 'We received your campaign brief — ClipGanji',
            html: submitterHtml,
            attachments: [
                {
                    filename: 'ClipGanji_PitchDeck.pdf',
                    path: 'https://clipganji.com/downloads/ClipGanji_PitchDeck.pdf'
                }
            ]
        };

                await transporter.sendMail(mailOptions);
                await transporter.sendMail(submitterMailOptions);
            } catch (emailErr) {
                console.error('Contact: email send failed (brief saved to DB):', emailErr);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Contact submission error');
        return NextResponse.json({ error: 'Error saving your message. Please try again.' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { companyName, name, email, budget, message, requestRateCard } = body;

        // Basic validation
        if (!companyName || !name || !email || !budget || !message) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const adminHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border-radius: 8px; border: 1px solid #333;">
                <img src="https://www.clipganji.com/images/logo2.png" alt="ClipGanji Logo" style="height: 40px; margin-bottom: 30px;" />
                <h2 style="color: #F5B800; text-transform: uppercase; margin-bottom: 20px;">New Campaign Brief</h2>
                <div style="background: #111; padding: 20px; border-radius: 4px; border-left: 4px solid #F5B800;">
                    <p style="margin: 0 0 10px 0;"><strong style="color: #aaa;">Company:</strong> <br/>${companyName}</p>
                    <p style="margin: 0 0 10px 0;"><strong style="color: #aaa;">Name:</strong> <br/>${name}</p>
                    <p style="margin: 0 0 10px 0;"><strong style="color: #aaa;">Email:</strong> <br/>${email}</p>
                    <p style="margin: 0 0 10px 0;"><strong style="color: #aaa;">Budget:</strong> <br/>${budget}</p>
                    <p style="margin: 0 0 10px 0;"><strong style="color: #aaa;">Requested Rate Card?:</strong> <br/>${requestRateCard ? '<span style="color: #00C853; font-weight: bold;">YES</span>' : 'No'}</p>
                </div>
                <h3 style="color: #eee; margin-top: 30px; margin-bottom: 10px;">Message:</h3>
                <div style="background: #111; padding: 20px; border-radius: 4px; color: #ddd; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
                    ${message}
                </div>
                <hr style="border-color: #333; margin: 30px 0;" />
                <p style="font-size: 14px; color: #888; line-height: 1.5;">
                    Action Required: Please review and reply to ${email}
                </p>
            </div>
        `;

        const mailOptions = {
            from: 'clipganji@gmail.com',
            to: 'clipganji@gmail.com',
            replyTo: email,
            subject: `New Campaign Brief from ${companyName}`,
            html: adminHtml,
        };

        const submitterHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border-radius: 8px; border: 1px solid #1e40af;">
                <img src="https://www.clipganji.com/images/logo2.png" alt="ClipGanji Logo" style="height: 50px; margin-bottom: 30px;" />
                <h2 style="color: #00C853; text-transform: uppercase; margin-bottom: 20px;">Campaign Brief Received</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #eee; margin-bottom: 20px;">
                    Hi ${name},<br/><br/>
                    Thanks for reaching out to ClipGanji. We've received your brief for <strong style="color: #F5B800;">${companyName}</strong> and our team is reviewing it now.
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
                            <img src="https://www.clipganji.com/images/logo1.png" alt="ClipGanji Logo Bug" style="height: 40px;" />
                        </td>
                        <td valign="top">
                            <p style="font-size: 14px; color: #888; line-height: 1.5; margin: 0;">
                                <strong>The ClipGanji Team</strong><br/>
                                <a href="https://www.clipganji.com" style="color: #F5B800; text-decoration: none;">clipganji.com</a><br/>
                                <a href="mailto:clipganji@gmail.com" style="color: #888; text-decoration: none;">clipganji@gmail.com</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
        `;

        const submitterMailOptions = {
            from: 'ClipGanji Network <clipganji@gmail.com>',
            to: email,
            subject: 'We received your campaign brief — ClipGanji',
            html: submitterHtml,
            attachments: [
                {
                    filename: 'ClipGanji_PitchDeck.pdf',
                    path: 'https://www.clipganji.com/downloads/ClipGanji_PitchDeck.pdf'
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        await transporter.sendMail(submitterMailOptions);

        return NextResponse.json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error('Email error:', error);
        return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
    }
}

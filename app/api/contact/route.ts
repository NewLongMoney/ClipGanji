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

        const info = await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error('Email error:', error);
        return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
    }
}

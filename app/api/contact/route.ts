import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { companyName, name, email, budget, message } = await request.json();

    // Send to ClipGanji
    await resend.emails.send({
      from: 'ClipGanji <onboarding@resend.dev>',
      to: ['clipganji@gmail.com'],
      subject: `New Campaign Brief from ${companyName}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #060809;">
          <h2 style="color: #00C853;">New Campaign Brief</h2>
          <p><strong>Company:</strong> ${companyName}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Budget:</strong> ${budget}</p>
          <p style="margin-top: 20px;"><strong>Message:</strong></p>
          <div style="background: #f2f2f2; padding: 15px; border-radius: 4px;">${message}</div>
        </div>
      `,
    });

    // Send confirmation to User
    await resend.emails.send({
      from: 'ClipGanji <onboarding@resend.dev>',
      to: [email],
      subject: `We've received your brief - ClipGanji`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #1E2428; border-radius: 8px; overflow: hidden;">
          <div style="background: #060809; padding: 30px; text-align: center;">
            <h1 style="color: #FFFFFF; font-family: sans-serif; font-weight: bold; letter-spacing: 2px; margin: 0; text-transform: uppercase;">
              CLIP<span style="color: #00C853;">GANJI</span>
            </h1>
          </div>
          <div style="padding: 40px; color: #0E1214; line-height: 1.6;">
            <h2 style="font-size: 24px; margin-bottom: 20px;">Hello ${name},</h2>
            <p>Thank you for reaching out to ClipGanji. We've received your campaign brief and our team is already reviewing it.</p>
            <p><strong>What happens next?</strong></p>
            <p>One of our specialists will contact you within the next 24 hours to discuss the next steps and align on your vision.</p>
            <div style="margin-top: 30px; padding: 20px; background: rgba(0, 200, 83, 0.1); border-left: 4px solid #00C853;">
              <p style="margin: 0; font-weight: bold;">Your Brief Summary:</p>
              <p style="margin: 5px 0 0 0; color: #4A5259;">Company: ${companyName}</p>
              <p style="margin: 5px 0 0 0; color: #4A5259;">Budget: ${budget}</p>
            </div>
            <p style="margin-top: 30px;">Best regards,<br>The ClipGanji Team</p>
          </div>
          <div style="background: #f2f2f2; padding: 20px; text-align: center; font-size: 12px; color: #8A949C;">
            &copy; 2026 ClipGanji. Kenya's first short-form video advertising network.
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error });
  }
}

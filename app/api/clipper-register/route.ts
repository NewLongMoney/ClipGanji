import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Basic validation
    if (!body.fullName || !body.phone || !body.email || !body.county || !body.audienceScreenshotBase64 || !body.bestClipUrl || !body.payoutMethod) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const attachments = [];
    if (body.audienceScreenshotBase64) {
      attachments.push({
        filename: 'audience_screenshot.png',
        path: body.audienceScreenshotBase64
      });
    }

    // Send notification to ClipGanji
    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border-radius: 8px; border: 1px solid #333;">
        <img src="https://clipganji.com/images/logo2.png" alt="ClipGanji Logo" style="height: 40px; margin-bottom: 30px;" />
        <h2 style="color: #00C853; text-transform: uppercase; margin-bottom: 20px;">New Clipper Application</h2>
        
        <h3 style="color: #F5B800;">Personal Info</h3>
        <p><strong>Name:</strong> ${body.fullName}</p>
        <p><strong>Phone:</strong> ${body.phone}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>County:</strong> ${body.county}</p>
        
        <h3 style="color: #F5B800; margin-top: 20px;">Platforms</h3>
        <p><strong>TikTok:</strong> ${body.tiktokHandle} (${body.tiktokFollowers} followers)</p>
        <p><strong>Instagram:</strong> ${body.instagramHandle} (${body.instagramFollowers} followers)</p>
        <p><strong>YouTube:</strong> ${body.youtubeChannel} (${body.youtubeSubscribers} subscribers)</p>
        <p><strong>Posting Frequency:</strong> ${body.postingFrequency}</p>

        <h3 style="color: #F5B800; margin-top: 20px;">Content</h3>
        <p><strong>Content type:</strong> ${body.contentTypes?.join(', ')}</p>
        <p><strong>Audience Screenshot:</strong> Attached to this email.</p>
        <p><strong>Best clip:</strong> <a href="${body.bestClipUrl}" style="color: #00C853;">${body.bestClipUrl}</a></p>
        
        <h3 style="color: #F5B800; margin-top: 20px;">Payment Info</h3>
        <p><strong>Payout method:</strong> ${body.payoutMethod}</p>
        ${body.payoutMethod === 'M-Pesa' 
          ? `<p><strong>M-Pesa Number:</strong> ${body.mpesaNumber}</p>` 
          : `<p><strong>Bank Name:</strong> ${body.bankName}</p><p><strong>Account Number:</strong> ${body.accountNumber}</p>`
        }
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: body.email,
      subject: `New Clipper Application — ${body.fullName}`,
      html: adminHtml,
      attachments
    };

    const userHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border-radius: 8px; border: 1px solid #00C853;">
        <img src="https://clipganji.com/images/logo2.png" alt="ClipGanji Logo" style="height: 50px; margin-bottom: 30px;" />
        <h2 style="color: #00C853; text-transform: uppercase; margin-bottom: 20px;">Application Received</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #eee; margin-bottom: 20px;">
          Hi ${body.fullName},<br/><br/>
          Thanks for applying to join the ClipGanji network. We've received your profile and will be reviewing it shortly.
        </p>
        <div style="background: #111; padding: 20px; border-radius: 4px; border-left: 4px solid #F5B800; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 14px; color: #ccc;">
                "Kenya's largest short-form video ad network."
            </p>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #eee; margin-bottom: 30px;">
          Our team typically reaches out within 48 hours to confirm your status and share next steps for your first campaign.
        </p>
        <hr style="border-color: #333; margin: 30px 0;" />
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td valign="top" style="padding-right: 20px;">
                    <img src="https://clipganji.com/images/logo1.png" alt="ClipGanji Logo Bug" style="height: 40px;" />
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

    // Send confirmation to the applicant
    const userMailOptions = {
      from: `ClipGanji Network <${process.env.EMAIL_USER}>`,
      to: body.email,
      subject: 'Application Received — ClipGanji',
      html: userHtml
    };

    const info = await transporter.sendMail(mailOptions);
    await transporter.sendMail(userMailOptions);

    return NextResponse.json({ success: true, data: info })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Nodemailer error:", errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}


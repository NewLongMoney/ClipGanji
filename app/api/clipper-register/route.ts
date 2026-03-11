import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Basic validation
    if (!body.fullName || !body.phone || !body.email || !body.county || !body.audienceDescription || !body.bestClipUrl || !body.payoutMethod) {
      return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Send notification to ClipGanji
    const data = await resend.emails.send({
      from: 'ClipGanji Network <onboarding@resend.dev>',
      to: 'clipganji@gmail.com',
      subject: `New Clipper Application — ${body.fullName}`,
      html: `
        <h2>New Clipper Application</h2>
        <hr />
        <h3>Personal Info</h3>
        <p><strong>Name:</strong> ${body.fullName}</p>
        <p><strong>Phone:</strong> ${body.phone}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>County:</strong> ${body.county}</p>
        
        <h3>Platforms</h3>
        <p><strong>TikTok:</strong> ${body.tiktokHandle} (${body.tiktokFollowers} followers)</p>
        <p><strong>Instagram:</strong> ${body.instagramHandle} (${body.instagramFollowers} followers)</p>
        <p><strong>YouTube:</strong> ${body.youtubeChannel} (${body.youtubeSubscribers} subscribers)</p>
        <p><strong>Posting Frequency:</strong> ${body.postingFrequency}</p>

        <h3>Content</h3>
        <p><strong>Content type:</strong> ${body.contentTypes?.join(', ')}</p>
        <p><strong>Audience description:</strong> ${body.audienceDescription}</p>
        <p><strong>Best clip:</strong> <a href="${body.bestClipUrl}">${body.bestClipUrl}</a></p>
        
        <h3>Payment Info</h3>
        <p><strong>Payout method:</strong> ${body.payoutMethod}</p>
        ${body.payoutMethod === 'M-Pesa' 
          ? `<p><strong>M-Pesa Number:</strong> ${body.mpesaNumber}</p>` 
          : `<p><strong>Bank Name:</strong> ${body.bankName}</p><p><strong>Account Number:</strong> ${body.accountNumber}</p>`
        }
      `
    })

    const userHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border-radius: 8px;">
        <img src="https://clip-ganji.vercel.app/images/logo2.png" alt="ClipGanji Logo" style="height: 40px; margin-bottom: 30px;" />
        <h2 style="color: #00C853; text-transform: uppercase; margin-bottom: 20px;">Application Received</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #eee; margin-bottom: 20px;">
          Hi ${body.fullName},<br/><br/>
          Thanks for applying to join the ClipGanji network. We've received your profile and will be reviewing it shortly.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #eee; margin-bottom: 30px;">
          Our team typically reaches out within 48 hours to confirm your status and share next steps for your first campaign.
        </p>
        <hr style="border-color: #333; margin: 30px 0;" />
        <p style="font-size: 14px; color: #888; line-height: 1.5;">
          Keep an eye on this email and your WhatsApp for updates.<br/>
          — The ClipGanji Team
        </p>
      </div>
    `;

    // Send confirmation to the applicant
    await resend.emails.send({
      from: 'ClipGanji Network <onboarding@resend.dev>',
      to: body.email,
      subject: 'Application Received — ClipGanji',
      html: userHtml
    });

    return Response.json({ success: true, data })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Resend error:", errorMessage);
    return Response.json({ success: false, error: errorMessage }, { status: 500 })
  }
}

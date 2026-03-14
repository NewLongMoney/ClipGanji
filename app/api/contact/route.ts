import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
    sanitizeString,
    isValidEmail,
    contactLimits,
    rateLimitContact,
    escapeHtml,
} from '@/lib/security';
import {
    isEmailConfigured,
    sendMail,
    ADMIN_EMAIL,
    buildContactAdminHtml,
    buildContactSenderHtml,
} from '@/lib/email';

const RATE_CARD_URL = 'https://clipganji.com/downloads/ClipGanji_RateCard.pdf';
const PITCH_DECK_URL = 'https://clipganji.com/downloads/ClipGanji_PitchDeck.pdf';

async function fetchAttachment(url: string): Promise<Buffer | null> {
    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return null;
        const arrayBuffer = await res.arrayBuffer();
        return Buffer.from(arrayBuffer);
    } catch {
        return null;
    }
}

function toBool(val: unknown): boolean {
    return val === true || val === 'on' || String(val).toLowerCase() === 'true';
}

export async function POST(req: Request) {
    if (!rateLimitContact(req)) {
        return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });
    }
    try {
        const body = await req.json();
        const { companyName, name, email, budget, message, requestRateCard, requestPitchDeck } = body;

        const companyNameS = sanitizeString(companyName, contactLimits.companyName);
        const nameS = sanitizeString(name, contactLimits.name);
        const emailS = sanitizeString(email, contactLimits.email);
        const budgetS = sanitizeString(budget, contactLimits.budget);
        const messageS = sanitizeString(message, contactLimits.message);

        if (!companyNameS || !nameS || !emailS || !budgetS || !messageS) {
            return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
        }
        if (!isValidEmail(emailS)) {
            return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
        }

        const requestRateCardBool = toBool(requestRateCard);
        const requestPitchDeckBool = toBool(requestPitchDeck);

        if (!isEmailConfigured()) {
            return NextResponse.json(
                { error: 'Email is not configured. Please contact the site administrator.' },
                { status: 503 }
            );
        }

        await prisma.contactSubmission.create({
            data: {
                companyName: companyNameS,
                name: nameS,
                email: emailS,
                budget: budgetS,
                message: messageS,
                requestRateCard: requestRateCardBool,
                requestPitchDeck: requestPitchDeckBool,
            },
        });

        const fromAddress = process.env.EMAIL_USER!;
        const adminHtml = buildContactAdminHtml({
            companyName: companyNameS,
            name: nameS,
            email: emailS,
            budget: budgetS,
            message: messageS,
            requestRateCard: requestRateCardBool,
            requestPitchDeck: requestPitchDeckBool,
        });

        await sendMail({
            from: `ClipGanji <${fromAddress}>`,
            to: ADMIN_EMAIL,
            replyTo: emailS,
            subject: `New Campaign Brief from ${escapeHtml(companyNameS)}`,
            html: adminHtml,
        });

        const senderAttachments: Array<{ filename: string; content: Buffer }> = [];
        if (requestRateCardBool) {
            const rateCardPdf = await fetchAttachment(RATE_CARD_URL);
            if (rateCardPdf && rateCardPdf.length > 0) {
                senderAttachments.push({ filename: 'ClipGanji_RateCard.pdf', content: rateCardPdf });
            }
        }
        if (requestPitchDeckBool) {
            const pitchDeckPdf = await fetchAttachment(PITCH_DECK_URL);
            if (pitchDeckPdf && pitchDeckPdf.length > 0) {
                senderAttachments.push({ filename: 'ClipGanji_PitchDeck.pdf', content: pitchDeckPdf });
            }
        }

        const senderHtml = buildContactSenderHtml({
            name: nameS,
            companyName: companyNameS,
            requestRateCard: requestRateCardBool,
            requestPitchDeck: requestPitchDeckBool,
            rateCardAttached: requestRateCardBool && senderAttachments.some((a) => a.filename.includes('RateCard')),
            pitchDeckAttached: requestPitchDeckBool && senderAttachments.some((a) => a.filename.includes('PitchDeck')),
        });

        await sendMail({
            from: `ClipGanji <${fromAddress}>`,
            to: emailS,
            subject: 'We received your campaign brief — ClipGanji',
            html: senderHtml,
            attachments: senderAttachments.length > 0 ? senderAttachments : undefined,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Contact submission error:', error);
        const message = error instanceof Error ? error.message : 'Error sending your message. Please try again.';
        return NextResponse.json(
            { error: message.includes('configured') ? message : 'Error sending your message. Please try again.' },
            { status: 500 }
        );
    }
}

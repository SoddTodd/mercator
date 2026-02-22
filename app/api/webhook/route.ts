import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  isCheckoutSessionProcessed,
  markCheckoutSessionProcessed,
} from '../../../lib/checkout-idempotency-store';

const FALLBACK_PRINT_IMAGE = 'https://raw.githubusercontent.com/Arto/mercator-assets/main/preview.jpg';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  return new Stripe(key);
}

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const printfulApiKey = process.env.PRINTFUL_API_KEY;
  const printfulStoreId = process.env.PRINTFUL_STORE_ID;
  if (!webhookSecret || !printfulApiKey || !printfulStoreId) {
    return NextResponse.json({ error: 'Webhook env is not fully configured' }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const stripe = getStripe();
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid webhook signature';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const sessionId = session.id;
  if (!sessionId) {
    return NextResponse.json({ error: 'Session id is missing' }, { status: 400 });
  }

  if (await isCheckoutSessionProcessed(sessionId)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    let shipping: Stripe.PaymentIntent.Shipping | null = null;
    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id;

    if (!shipping && paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      shipping = paymentIntent.shipping;
    }

    const variantIdStr = session.metadata?.printfulVariantId;
    const variantIdNum = Number.parseInt(variantIdStr ?? '', 10);
    if (!Number.isFinite(variantIdNum) || variantIdNum <= 0) {
      return NextResponse.json({ error: 'Invalid printful variant id metadata' }, { status: 400 });
    }

    let printImageUrl = session.metadata?.printful_file_url || FALLBACK_PRINT_IMAGE;
    if (printImageUrl.includes('drive.google.com/file/d/')) {
      const fileIdMatch = printImageUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch?.[1]) {
        printImageUrl = `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
      }
    }

    const orderData = {
      external_id: sessionId,
      recipient: {
        name: shipping?.name || session.customer_details?.name || 'Customer',
        address1: shipping?.address?.line1 || session.customer_details?.address?.line1 || '',
        city: shipping?.address?.city || session.customer_details?.address?.city || '',
        state_code: shipping?.address?.state || session.customer_details?.address?.state || '',
        country_code: shipping?.address?.country || session.customer_details?.address?.country || '',
        zip: shipping?.address?.postal_code || session.customer_details?.address?.postal_code || '',
      },
      items: [
        {
          variant_id: variantIdNum,
          quantity: 1,
          files: [{ url: printImageUrl }],
        },
      ],
      confirm: false,
    };

    if (!orderData.recipient.address1 || !orderData.recipient.country_code || !orderData.recipient.zip) {
      console.error('Missing address info');
      return NextResponse.json({ error: 'Incomplete shipping address' }, { status: 400 });
    }

    const response = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${printfulApiKey}`,
        'Content-Type': 'application/json',
        'X-PF-Store-Id': printfulStoreId,
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('Printful Error Response:', JSON.stringify(result));
      return NextResponse.json({ error: 'Printful order creation failed' }, { status: 500 });
    }

    const retailPrice = (session.amount_total ?? 0) / 100;
    const stripeFee = (retailPrice * 0.05) + 0.05;
    const printfulCost = Number(result?.result?.costs?.total ?? 0);
    const netProfit = retailPrice - stripeFee - printfulCost;

    console.log('--- ECONOMICS ---');
    console.log(`Retail: $${retailPrice.toFixed(2)}`);
    console.log(`Stripe Fee: -$${stripeFee.toFixed(2)}`);
    console.log(`Printful Cost: -$${printfulCost.toFixed(2)}`);
    console.log(`ESTIMATED NET PROFIT: $${netProfit.toFixed(2)}`);
    console.log('-----------------');

    await markCheckoutSessionProcessed({
      sessionId,
      eventId: event.id,
      printfulOrderId: String(result?.result?.id ?? ''),
      processedAt: new Date().toISOString(),
    });

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook processing failed';
    console.error('Webhook processing error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
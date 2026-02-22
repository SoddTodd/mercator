import { NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  return new Stripe(key);
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    const { variantId, name, price, printImage } = await req.json();
    const safePrintImage = printImage || 'https://raw.githubusercontent.com/Arto/mercator-assets/main/preview.jpg';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: name,
              images: [safePrintImage], 
            },
            unit_amount: Math.round(price * 100), // Округляем до центов
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR'] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Free Worldwide Shipping',
          },
        },
      ],
      metadata: {
        printfulVariantId: variantId,
        printful_file_url: safePrintImage,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown checkout error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
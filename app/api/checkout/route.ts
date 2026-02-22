import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getMapBySlug } from '../../../lib/maps-store';

const FALLBACK_PRINT_IMAGE = 'https://raw.githubusercontent.com/Arto/mercator-assets/main/preview.jpg';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  return new Stripe(key);
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) {
      throw new Error('NEXT_PUBLIC_SITE_URL is not set');
    }

    const { mapSlug, sizeId } = await req.json();
    if (!mapSlug || !sizeId) {
      return NextResponse.json({ error: 'mapSlug and sizeId are required' }, { status: 400 });
    }

    const map = await getMapBySlug(String(mapSlug));
    if (!map) {
      return NextResponse.json({ error: 'Map not found' }, { status: 404 });
    }

    const selectedSize = (map.sizes ?? []).find((size) => size.id === String(sizeId));
    if (!selectedSize) {
      return NextResponse.json({ error: 'Invalid size selected' }, { status: 400 });
    }

    const safePrintImage = map.printFiles?.[selectedSize.ratio] || map.printImage || FALLBACK_PRINT_IMAGE;
    const safeName = `Mercator Atlas: ${map.title}`;
    const safeUnitAmount = Math.round(selectedSize.price * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: safeName,
              images: [safePrintImage],
            },
            unit_amount: safeUnitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/`,
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
        mapSlug: map.slug,
        sizeId: selectedSize.id,
        printfulVariantId: selectedSize.id,
        printful_file_url: safePrintImage,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown checkout error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
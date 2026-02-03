// route.ts (Webhook)
import { NextResponse } from 'next/server';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('--- DEBUG WEBHOOK START ---');
    
    // 1. Извлекаем адрес
    let shipping = session.shipping_details;
    if (!shipping && session.payment_intent) {
      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
      shipping = paymentIntent.shipping;
    }

    // 2. Получаем ID варианта (теперь это будет "1", "2" или "3876")
    const variantIdStr = session.metadata?.printfulVariantId;
    const variantIdNum = parseInt(variantIdStr, 10);

    // 3. Получаем URL изображения из metadata (cloud storage URL)
    let printImageUrl = session.metadata?.printful_file_url;
    
    // Если это Google Drive sharing URL, конвертируем в direct download URL
    if (printImageUrl && printImageUrl.includes('drive.google.com/file/d/')) {
      const fileIdMatch = printImageUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        printImageUrl = `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
      }
    }

    console.log('Final Shipping Object:', JSON.stringify(shipping, null, 2));
    console.log('Variant ID for Printful:', variantIdNum);
    console.log('Print Image URL:', printImageUrl);

    // 4. Данные для заказа
    const orderData = {
      recipient: {
        name: shipping?.name || session.customer_details?.name || 'Customer',
        address1: shipping?.address?.line1 || '',
        city: shipping?.address?.city || '',
        state_code: shipping?.address?.state || '',
        country_code: shipping?.address?.country || '',
        zip: shipping?.address?.postal_code || '',
      },
      items: [{
        variant_id: variantIdNum, // Используем прямой Catalog ID
        quantity: 1,
        files: [{
          url: printImageUrl || "https://drive.google.com/uc?export=download&id=1b-f2b6WN17REvm0I3kr4kXNgr2-QZ89K" // Fallback если URL не найден
        }]
      }],
      confirm: false,
    };

    if (!orderData.recipient.address1) {
      console.error('Missing address info');
      return NextResponse.json({ error: 'No address' });
    }

    // 5. Запрос в Printful
    try {
      const response = await fetch('https://api.printful.com/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
          'X-PF-Store-Id': process.env.PRINTFUL_STORE_ID || '',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      console.log('Printful Result:', JSON.stringify(result, null, 2));

      const retailPrice = session.amount_total / 100;
const stripeFee = (retailPrice * 0.05) + 0.05;
const printfulCost = result.result?.costs?.total || 0; // Берем общую сумму (base + shipping + tax)
const netProfit = retailPrice - stripeFee - printfulCost;

console.log('--- ECONOMICS ---');
console.log(`Retail: $${retailPrice.toFixed(2)}`);
console.log(`Stripe Fee: -$${stripeFee.toFixed(2)}`);
console.log(`Printful Cost: -$${printfulCost}`);
console.log(`ESTIMATED NET PROFIT: $${netProfit.toFixed(2)}`);
console.log('-----------------');

    } catch (error) {
      console.error('Printful Error:', error);
    }
    
    console.log('--- DEBUG WEBHOOK END ---');
  }

  return NextResponse.json({ received: true });
}
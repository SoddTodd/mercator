This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Panel

This project includes an admin page at `/admin` for managing maps without editing code.

Set an admin password in `.env.local`:

```bash
ADMIN_PASSWORD=your-strong-password
```

Then restart dev server and open:

- [http://localhost:3000/admin](http://localhost:3000/admin)

## Upload Storage (Cloudflare R2)

Admin uploads now use Cloudflare R2 (S3-compatible API).

Required environment variables:

```bash
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=your-r2-bucket-name
R2_PUBLIC_BASE_URL=https://your-public-r2-domain
```

Notes:

- `R2_PUBLIC_BASE_URL` should be a public endpoint to your bucket (for example your custom domain or `https://<public-id>.r2.dev`).
- The upload API currently allows files up to 100 MB.

## Cookie Consent and Tracking

The storefront includes a consent banner with three choices: accept all, reject optional, and customize.

- Essential cookies are always on.
- Analytics and marketing scripts load only after consent.

Optional tracking environment variables:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=123456789012345
```

If these variables are not set, no corresponding tracking script is injected.

You will be redirected to `/admin/login` and prompted for the password.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

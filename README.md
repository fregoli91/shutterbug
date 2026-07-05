# Shutterbug Camera Shop

Next.js + Tailwind ecommerce site for `shutterbugcamerashop.com`, focused on tested vintage digital cameras, film cameras, and used camera gear.

## Run Locally

```bash
npm install
cp .env.example .env.local
npm run prisma:generate
npm run dev
```

Open `http://127.0.0.1:3000`.

Use `npm.cmd run build` on Windows PowerShell if script execution policy blocks `npm run build`.

## Environment Variables

Required for the full ecommerce flow:

```env
NEXT_PUBLIC_SITE_URL=https://shutterbugcamerashop.com
NEXT_PUBLIC_AMAZON_STORE_URL=https://www.amazon.com/shops/shutterbugcamera
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me
ADMIN_SESSION_SECRET=replace-with-a-long-random-secret
CUSTOMER_SESSION_SECRET=replace-with-another-long-random-secret
STRIPE_SECRET_KEY=sk_live_or_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_FOLDER=shutterbug-products
```

PayPal variables are reserved for the future PayPal phase:

```env
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

## Database

Use Supabase Postgres, Neon, Prisma Postgres, or another Vercel-compatible PostgreSQL database.

Generate the Prisma client after schema changes:

```bash
npm run prisma:generate
```

Apply migrations to production:

```bash
npm run prisma:migrate
```

Current schema includes products, product images, customers, orders, order items, and order status history.

## Admin Access

Admin route:

```txt
/admin
```

Login route:

```txt
/admin/login
```

Admin auth uses environment variables:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Unauthenticated users are redirected to `/admin/login`. Product creation, editing, deletion, image upload, and order management routes are protected by the admin session.

There is a small footer `Admin` link so the owner can reach the admin area without making it prominent to shoppers.

## Customer Accounts

Customer routes:

- `/signup`
- `/login`
- `/account`
- `/account/orders`

Customer passwords are hashed with Node `scrypt`; plain-text passwords are never stored. Customer sessions use signed HTTP-only cookies and `CUSTOMER_SESSION_SECRET`.

Logged-in customers see `Account` in the navbar. Logged-out shoppers see `Login`. Customers can still check out as guests, but logging in before checkout saves the order to account history.

## Checkout

Stripe Checkout route:

```txt
/api/checkout/stripe
```

Stripe webhook route:

```txt
/api/webhooks/stripe
```

Configure Stripe webhook events:

```txt
checkout.session.completed
```

Payment flow:

1. Cart posts items to `/api/checkout/stripe`.
2. Server validates product stock and creates a pending order.
3. Stripe Checkout collects payment and shipping details.
4. Successful payment redirects to `/checkout/success`.
5. Stripe webhook marks the order paid, stores customer details, links the order to a customer when possible, and decrements inventory.

## Image Uploads

Admin product image uploads use Cloudinary. Set:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_FOLDER`

Do not store uploaded product images directly in the repo.

## Deployment

The site is deployed on Vercel. Before pushing live:

1. Add all production environment variables in Vercel.
2. Run production Prisma migrations against the production `DATABASE_URL`.
3. Configure the Stripe webhook endpoint.
4. Confirm `/admin/login`, `/signup`, `/login`, `/account`, `/cart`, and `/shop` work in the deployed environment.

## Build

```bash
npm run build
```

The build must pass before deploying.

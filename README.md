# Remix of Remix of Auto Decor Buli Showcase

make it like this website https://autodekorbuli.com/

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://baxha01.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d5b7a0d4-95e6-4211-99b9-b3277b1a93cb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Activate checkout and order emails

Orders are validated and saved on the server before EmailJS is called. The owner
recipient is fixed to **jondallku@gmail.com**. Payment is cash on delivery.

1. Run `drizzle/migrations/0000_create_shop_orders.sql` in your Supabase SQL editor
   if the table does not exist, then run `drizzle/migrations/0001_order_email.sql`
   once. These tables have RLS enabled and no public customer-data access.
2. Add the values from `.env.example` to your existing local `.env` and the
   deployed app's server secrets. Obtain `SUPABASE_SERVICE_ROLE_KEY` from the same
   Supabase project as `SUPABASE_URL`. Never prefix server secrets with `VITE_`.
   `.env` was already tracked by this repository: do not commit private keys into
   it; untrack it with `git rm --cached .env` before committing secrets.
3. In EmailJS, connect an email service and create an order notification template.
   Set **To Email** to the literal `jondallku@gmail.com`, **Subject** to
   `{{subject}}`, and the body to `{{message}}` (or `<pre>{{message}}</pre>` in the
   HTML editor). Keep normal escaped double-brace variables. Use the connected
   service's default sender; the customer supplies a phone number, not an email.
4. Enable requests from non-browser applications in EmailJS **Account → Security**.
   Copy the service ID, template ID and public key into the corresponding
   `EMAILJS_*` server secrets. If private-key authorization is enabled, also set
   `EMAILJS_PRIVATE_KEY`. Restart the local server or redeploy after adding secrets.
5. Place a small test order and check both `shop_orders` and the Gmail inbox/spam
   folder. The checkout receipt distinguishes a saved order from an email accepted
   by EmailJS. The retry button reuses the same order ID without inserting another
   order. Notification states are `pending`, `sending`, `sent`, and `failed`.

The template also receives `order_id`, `customer_name`, `customer_phone`, `address`,
`city`, `country`, `car`, `items`, `subtotal`, `shipping`, `total`, and `payment_method`.
All prices and totals come from the server catalog. Products without prices stay
in the basket for a separate WhatsApp quote.

Email failures preserve the order and can be retried from the receipt. There is no
background email worker: monitor failed/pending orders in Supabase if a customer
leaves before retrying. Concurrent sends for one order are locked for two minutes.
EmailJS has no send idempotency key; a worker interruption after sending but before
recording delivery can cause a duplicate email on retry, but never a duplicate order.

EmailJS references: [REST send API](https://www.emailjs.com/docs/rest-api/send/)
and [server API access](https://github.com/emailjs-com/emailjs-nodejs#readme).

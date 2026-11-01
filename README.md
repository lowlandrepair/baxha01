# autoprojoni — Car Parts & Accessories Store

An Albanian-language storefront for car parts and styling accessories in Vushtrri,
Kosovë. Customers can browse products, search and filter the catalog, manage a
basket, ask about parts on WhatsApp, and place a cash-on-delivery order.

**Live website:** [baxha01.lovable.app](https://baxha01.lovable.app)

**Project editor:** [Lovable](https://lovable.dev/projects/d5b7a0d4-95e6-4211-99b9-b3277b1a93cb)

## Start here: where is the homepage code?

Open **[src/routes/index.tsx](src/routes/index.tsx)** first. It defines the `/`
route and the `Index()` React component, which assembles the homepage in the same
order that its sections appear on screen.

**The navbar is directly inside this file's `<header>` and `<nav>` tags.** There
is no separate `Navbar.tsx` file. The footer, product quick-view dialog, basket
drawer, and mobile menu are also defined inside `Index()`.

Reusable sections are imported from
[`src/components/storefront/`](src/components/storefront). For example,
`<HeroCarousel />` inserts the component defined in `hero-carousel.tsx`.

Use your editor's **Find** command to search for the markers below. Markers are
more reliable than memorizing line numbers, which change when code is edited.

### Homepage map: top to bottom

In this table, **Home** means [src/routes/index.tsx](src/routes/index.tsx).
The Albanian labels are the text visible on the website.

| Website section                            | Code location                                                          | Search for / what it does                                                                   |
| ------------------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Top delivery and location bar              | Home, before `<header>`                                                | `Kosovë 2.5€` — delivery text and contact-section link.                                     |
| Sticky header, logo, search, basket button | Home                                                                   | `<header` — logo, search form, basket count, and subtotal.                                  |
| Category navigation bar                    | Home                                                                   | `Kategoritë kryesore` — `<nav>` renders buttons from `categories`.                          |
| Mobile hamburger button                    | Home                                                                   | `Hap menunë` — calls `setMobile(true)`.                                                     |
| Large opening image slider / hero          | [hero-carousel.tsx](src/components/storefront/hero-carousel.tsx)       | `HeroCarousel` and `slides` — photos, text, category buttons, arrows, dots, and pause/play. |
| Three highlights below the hero            | Home                                                                   | `Dërgesa në Kosovë` — delivery, car models, and styling highlights.                         |
| “Eksploro kategoritë” tiles                | Home                                                                   | `category-title` — category images, names, and product counts.                              |
| “Pjesët në fokus” featured products        | Home                                                                   | `featured-title` — a `Carousel` containing `ProductCard` components.                        |
| Product image, title, price, add button    | [product-card.tsx](src/components/storefront/product-card.tsx)         | `ProductCard` — reusable layout for featured and collection products.                       |
| Two promotional image tiles                | Home                                                                   | `Koleksionet styling` — styling and accessories banners.                                    |
| “Pjesë & aksesorë” product collection      | Home                                                                   | `id="produktet"` — controls, product grid, and empty-results message.                       |
| Search, brand, category, sorting           | Home + [catalog-browsing.ts](src/lib/catalog-browsing.ts)              | `Kërko në koleksion`, `Marka e veturës`, `Rendit produktet`, and `filterProducts`.          |
| Numbered product pages                     | Home + [catalog-browsing.ts](src/lib/catalog-browsing.ts)              | `Faqet e produkteve`, `turnPage`, and `PAGE_SIZE`.                                          |
| Clickable car-brand names                  | Home                                                                   | `PËR MARKËN TUAJ` — sets the brand filter and scrolls to the collection.                    |
| “Pse të bleni online” benefits             | [shop-info.tsx](src/components/storefront/shop-info.tsx)               | `ShoppingBenefits` — delivery, quality, and support information.                            |
| Footer and contact details                 | Home                                                                   | `<footer id="kontakt"` — logo, WhatsApp, category links, delivery text, and copyright.      |
| Google Maps location                       | [shop-info.tsx](src/components/storefront/shop-info.tsx)               | `ShopMap` — Maps iframe and directions link.                                                |
| Product quick-view popup                   | Home                                                                   | `<Dialog open={Boolean(quick)}` — selected product details and enquiry controls.            |
| Basket drawer and quantity controls        | Home                                                                   | `<Sheet open={open}` — plus/minus/remove, subtotal, and checkout link.                      |
| Mobile category menu                       | Home                                                                   | `<Sheet open={mobile}` — the left-side category drawer.                                     |
| “Pyet në WhatsApp” product enquiry         | [whatsapp-enquiry.tsx](src/components/storefront/whatsapp-enquiry.tsx) | `WhatsAppEnquiry` — car-details field and encoded `wa.me` link.                             |

## Quick answers for your professor

These answers describe the implementation currently in this repository.

| If the professor asks…                         | You can explain…                                                                                                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| “Where is your homepage?”                      | “`src/routes/index.tsx` defines `/`. Its `Index()` component assembles the sections.”                                                                   |
| “Where is the navbar?”                         | “Inside the `<header>` in `index.tsx`. The category links are in the `<nav>` labelled `Kategoritë kryesore`.”                                           |
| “Where do the products come from?”             | “`catalog.ts` exports products and categories. It combines original entries with `catalog-additions.ts`; the page maps that data into cards.”           |
| “Why make a product component?”                | “`ProductCard` keeps the featured section and collection consistent without repeating the card markup.”                                                 |
| “How does search work?”                        | “The query is React state called `q`. `filterProducts()` checks title, category, and brand, ignoring case and Albanian accents.”                        |
| “How does the basket survive navigation?”      | “`CartProvider` wraps the routes in `__root.tsx`. Both pages use `useCart()`, and the provider persists the basket in session storage after hydration.” |
| “What happens when you click Add?”             | “The card calls `onAdd`, which reaches `buy()` in `index.tsx`. It updates quantities through `add()` and opens the basket.”                             |
| “Where is checkout?”                           | “`src/routes/checkout.tsx` defines `/checkout`: delivery form, order summary, receipt, and email retry button.”                                         |
| “Can someone change a price in their browser?” | “The server takes IDs and quantities. `priceOrder()` looks up catalog prices again and calculates the amount on the server.”                            |
| “Where does the order go?”                     | “The server stores it in Supabase's `shop_orders` table, then notifies `jondallku@gmail.com` through EmailJS.”                                          |
| “What if email fails?”                         | “The order stays saved. The receipt can retry its notification using the same order ID without inserting another order.”                                |
| “Where are the colors and fonts?”              | “Global variables are in `src/styles.css`; font links are in `__root.tsx`. Section layout classes are beside the JSX.”                                  |

### Suggested presentation walkthrough

1. Open `index.tsx` and point out `<header>`, `<nav>`, `<main>`, and `<footer>`.
2. Show `<HeroCarousel />`, then open its file to explain how components compose a page.
3. Show a product in `catalog.ts` and how `ProductCard` displays it.
4. Demonstrate search, category/brand filtering, sorting, and pagination.
5. Add a product, change its quantity, and open checkout to show the shared basket.
6. Explain the server flow below. Label any demonstration submission
   **TEST — MOS E PROCESONI**: it creates a stored order and can email the owner.

## How the homepage interactions work

Most homepage state and handlers are near the beginning of `Index()`.

| Variable or function                  | Responsibility                                                                            |
| ------------------------------------- | ----------------------------------------------------------------------------------------- |
| `cart`, `setCart`                     | Shared product quantities from `useCart()`.                                               |
| `open`, `setOpen`                     | Opens/closes the basket drawer.                                                           |
| `mobile`, `setMobile`                 | Opens/closes the mobile menu.                                                             |
| `q`, `cat`, `brand`, `sort`           | Search text, category, brand, and sort order.                                             |
| `quick`, `setQuick`                   | Selected quick-view product; `null` closes the dialog.                                    |
| `page`, `currentPage`, `pageProducts` | Requested page, valid page number, and visible products.                                  |
| `add(id, delta)`                      | Changes quantity, removes zero-quantity items, and caps quantity at 99.                   |
| `buy(id)`                             | Adds a product, closes quick view, and opens the basket.                                  |
| `selectCategory(name)`                | Selects a category, clears search/brand, closes the mobile menu, and scrolls to products. |
| `filterProducts(...)`                 | Filters and sorts data; defined in `catalog-browsing.ts`.                                 |
| `turnPage(next)`                      | Changes the collection page and scrolls to its heading.                                   |
| `reset()`                             | Clears search, category, and brand selections.                                            |

Search/filter changes reset pagination to the first page. `PAGE_SIZE` sets 12
products per collection page. Lists use `.map()` to create elements from data, and
product IDs provide stable React keys.

### Shared basket and browser storage

[`cart-provider.tsx`](src/components/storefront/cart-provider.tsx) creates a React
context containing product IDs and quantities, for example `{ 9: 2, 3: 1 }`.
The pages look up product details from the catalog instead of storing copies.

The provider reads `autoprojoni-cart` from `sessionStorage` inside `useEffect`,
then saves changes after initialization. This avoids reading browser storage during
server rendering. Selections survive navigation and refresh in the browser session;
the basket is not an account-based cart shared across devices.

## Checkout, database, and email flow

```text
ProductCard → buy()/add() → CartProvider → /checkout
    → orderSchema validates the form
    → submitOrder server function
    → finalizeOrder recalculates prices and saves shop_orders
    → claims the order's email notification
    → sendOrderEmail calls EmailJS
    → checkout displays the receipt and email result
```

| File                                                                          | Responsibility                                                                                               |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [checkout.tsx](src/routes/checkout.tsx)                                       | Delivery fields, country selection, shipping, submit state, receipt, and retry UI.                           |
| [order-schema.ts](src/lib/order-schema.ts)                                    | Zod validation, `OrderInput`, `priceOrder()`, and the `whatsappEnquiry()` URL builder.                       |
| [checkout-attempt.ts](src/lib/checkout-attempt.ts)                            | Reuses a UUID for an unchanged submission after an uncertain request; clears the attempt after confirmation. |
| [orders.functions.ts](src/lib/orders.functions.ts)                            | Validated POST server function called through `useServerFn()`.                                               |
| [orders.server.ts](src/lib/orders.server.ts)                                  | Private order storage, duplicate-ID checks, receipts, notification claims, and email status updates.         |
| [order-email.server.ts](src/lib/order-email.server.ts)                        | Builds the owner message and makes the EmailJS REST request.                                                 |
| [runtime-env.server.ts](src/lib/runtime-env.server.ts)                        | Reads EmailJS configuration from Cloudflare runtime bindings or local `process.env`.                         |
| [client.server.ts](src/integrations/supabase/client.server.ts)                | Server-only Supabase admin client; its service-role key stays private.                                       |
| [0000_create_shop_orders.sql](drizzle/migrations/0000_create_shop_orders.sql) | Creates the order table, constraints, and row-level security.                                                |
| [0001_order_email.sql](drizzle/migrations/0001_order_email.sql)               | Adds email status and attempt/sent timestamps.                                                               |

The server calculates amounts in **integer cents**: €7.50 is stored as 750. It
rejects an order ID reused with different customer details or items instead of
overwriting the existing order.

Email states are `pending`, `sending`, `sent`, and `failed`. Concurrent requests
cannot claim the same notification while its two-minute claim is active. A failed
email does not discard the order. `emailSent` means the provider accepted the send;
it does not prove that the recipient read the message.

## Project structure

```text
src/
  routes/
    __root.tsx              HTML shell, fonts, error pages, and shared providers
    index.tsx               Homepage, navbar, footer, filters, and overlays
    checkout.tsx            Delivery form and receipt
  components/
    storefront/             Shop-specific reusable components
    ui/                     Shared buttons, inputs, carousel, dialogs, and sheets
  lib/
    catalog.ts              Product type, categories, assembled catalog, euro formatter
    catalog-additions.ts    Sourced product entries and image/source references
    catalog-browsing.ts     Search, filters, sorting, and page size
    shop-details.ts         Owner email, WhatsApp, shipping policies, map links
    order-schema.ts         Validation, pricing, and WhatsApp URL builder
    checkout-attempt.ts     Submission ID persistence
    orders.functions.ts     Checkout server-function boundary
    orders.server.ts        Order storage and notification coordination
    order-email.server.ts   Email message and EmailJS request
    runtime-env.server.ts   Server email settings lookup
  integrations/supabase/    Supabase clients and database types
  assets/                  Images and image-URL metadata
  test/                    Automated tests
  router.tsx               Router and query-client setup
  routeTree.gen.ts          Generated route tree
  server.ts                Server entry and SSR error handling
  styles.css               Theme variables, global classes, and animations
drizzle/migrations/         Database migrations
public/                    Public files such as the favicon
vite.config.ts             Lovable/TanStack build and local server configuration
vitest.config.ts           Test configuration
.env.example               Empty example of backend settings
```

The `@/` import alias means `src/`. For example,
`@/components/storefront/product-card` points to
`src/components/storefront/product-card.tsx`.

### Routing and the shared layout

TanStack uses file-based routing: `index.tsx` is `/`, and `checkout.tsx` is
`/checkout`. [`router.tsx`](src/router.tsx) creates the router.
[`__root.tsx`](src/routes/__root.tsx) wraps the pages in `QueryClientProvider` and
`CartProvider`, then displays the active page through `<Outlet />`.

Keep `<Outlet />`: removing it stops the child pages from appearing. The routing
tools generate `routeTree.gen.ts`; do not edit it by hand. See
[route conventions](src/routes/README.md) when adding a page.

## Where to make common changes

| Change                                       | Edit here                                                                                                                                            |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navbar links, header search, footer layout   | [index.tsx](src/routes/index.tsx).                                                                                                                   |
| Logo                                         | The `logo` import in `index.tsx` and its asset metadata in `src/assets/`.                                                                            |
| Hero photos, text, buttons, slide order      | The `slides` array in [hero-carousel.tsx](src/components/storefront/hero-carousel.tsx).                                                              |
| Hero timing                                  | The 6500 ms interval in `HeroCarousel`; playback also checks hover/focus, pause state, page visibility, and reduced motion.                          |
| Product names, prices, categories, images    | [catalog.ts](src/lib/catalog.ts) or [catalog-additions.ts](src/lib/catalog-additions.ts), depending on the entry.                                    |
| Product-card appearance                      | [product-card.tsx](src/components/storefront/product-card.tsx).                                                                                      |
| Search behavior or page size                 | [catalog-browsing.ts](src/lib/catalog-browsing.ts).                                                                                                  |
| Colors, fonts, global helpers, animations    | [styles.css](src/styles.css); font stylesheet links are in [__root.tsx](src/routes/__root.tsx).                                                      |
| Section layout and mobile sizing             | JSX `className` values, including `sm:`, `md:`, `lg:`, and `max-sm:` classes.                                                                        |
| Contact details, shipping charges, map links | [shop-details.ts](src/lib/shop-details.ts). Also review repeated shipping text in the header, footer, and quick view.                                |
| Checkout fields                              | [checkout.tsx](src/routes/checkout.tsx) for UI and [order-schema.ts](src/lib/order-schema.ts) for validation; database changes need a migration too. |
| Email content                                | `orderEmailParams()` in [order-email.server.ts](src/lib/order-email.server.ts) and the saved EmailJS template.                                       |
| Browser title and page description           | The route's `head()` configuration in `index.tsx` or `checkout.tsx`.                                                                                 |

Images can be normal imports or `.asset.json` metadata whose `.url` points to the
image. Check that URL when changing an image; renaming metadata alone does not
replace the remote asset.

## Technologies used

| Technology                | Role                                                                       |
| ------------------------- | -------------------------------------------------------------------------- |
| React + TypeScript        | Components, state, hooks, and typed data.                                  |
| TanStack Start + Router   | Routes, server rendering, and checkout server functions.                   |
| Tailwind CSS              | Styling utilities, responsive layouts, and theme tokens.                   |
| Radix-based UI components | Accessible dialogs and drawers through `src/components/ui/`.               |
| Embla Carousel            | Swipeable hero and featured-product carousels.                             |
| Lucide React              | Icons such as search, basket, menu, and delivery.                          |
| Zod                       | Customer and order-input validation.                                       |
| Supabase / PostgreSQL     | Persistent private order storage.                                          |
| EmailJS                   | Owner notifications through the connected sender.                          |
| Vitest + Testing Library  | Logic and checkout UI tests.                                               |
| Vite + Nitro              | Development and production builds using the Lovable configuration wrapper. |

## Run locally

Use Node.js compatible with the installed dependencies; local work on this project
has used Node.js 24.

```sh
git clone https://github.com/lowlandrepair/baxha01.git
cd baxha01
npm install
npm run dev
```

Open the address printed by Vite. Browsing uses the local catalog; order submission
also requires the backend configuration below.

| Command              | Purpose                                   |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | Start the development server.             |
| `npm run build`      | Build the browser and server app.         |
| `npm run preview`    | Preview a production build.               |
| `npm test`           | Run automated tests once.                 |
| `npm run test:watch` | Rerun tests as files change.              |
| `npx tsc --noEmit`   | Check TypeScript without producing files. |
| `npm run lint`       | Check ESLint and formatting rules.        |

## Configure checkout and order emails

Orders are validated and saved on the server before EmailJS is called. The owner
recipient is fixed to **jondallku@gmail.com**. Payment is cash on delivery.

1. For a fresh database, apply [0000_create_shop_orders.sql](drizzle/migrations/0000_create_shop_orders.sql)
   and then [0001_order_email.sql](drizzle/migrations/0001_order_email.sql).
   Existing databases with these changes do not need them rerun. RLS prevents
   public access to customer records.
2. Copy the empty settings in [.env.example](.env.example) into `.env.local` for
   local development and fill them in. Set the corresponding deployed server
   secrets too. `SUPABASE_SERVICE_ROLE_KEY` must belong to the same project as
   `SUPABASE_URL`. Never prefix private secrets with `VITE_`.
3. In EmailJS, connect an email service and create an order notification template.
   Set **To Email** to the literal `jondallku@gmail.com`, **Subject** to
   `{{subject}}`, and the body to `{{message}}` (or `<pre>{{message}}</pre>` in the
   HTML editor). Keep normal escaped double-brace variables. Use the connected
   service's default sender; the customer supplies a phone number, not an email.
4. Enable requests from non-browser applications in EmailJS **Account → Security**
   and keep private-key protection enabled. Set `EMAILJS_SERVICE_ID`,
   `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`, and `EMAILJS_PRIVATE_KEY` in the
   server configuration. Restart local development after changing settings;
   publish the changes in Lovable to update the live site.
5. Place a small test order and check both `shop_orders` and the Gmail inbox/spam
   folder. The checkout receipt distinguishes a saved order from an email accepted
   by EmailJS. The retry button reuses the same order ID without inserting another
   order. Notification states are `pending`, `sending`, `sent`, and `failed`.

The template also receives `order_id`, `customer_name`, `customer_phone`, `address`,
`city`, `country`, `car`, `items`, `subtotal`, `shipping`, `total`, and `payment_method`.
All prices and totals come from the server catalog. Products without prices stay
in the basket for a separate WhatsApp quote.

The live site's secrets are separate from a local clone or remix. `.env` is
already tracked here and contains public Supabase configuration; never add private
keys or account passwords to it. Use `.env.local` locally and hosting secrets for
deployment. `VITE_` variables are browser-facing.

### Troubleshooting

| Symptom                                       | What to check                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------------ |
| Saved order, unconfirmed email                | Server logs and EmailJS history; retry from the saved receipt.                 |
| `EmailJS configuration is missing`            | Server secret names, publication of the settings, and `runtime-env.server.ts`. |
| `Invalid grant` or Gmail connection errors    | Reconnect the sender in EmailJS, save the service, and test again.             |
| EmailJS shows `OK`, but no message is visible | Template recipient and the recipient's Spam folder.                            |
| Missing values in an email                    | Template variable names must match the parameters listed above.                |

## Tests and practical limits

[`src/test/`](src/test) covers routing, catalog behavior, shop policies, validation,
pricing, submission IDs, checkout UI, order persistence, email payloads, and runtime
settings. Service calls in automated tests are mocked; a live send is a separate
verification step.

Payment is **cash on delivery**, with no online card charge. The catalog is defined
in source code, not a live stock-management system; a displayed stock label is not
a real-time supplier inventory check. Products without a price are quote requests
and remain outside the priced checkout total.

Email failures preserve the order and can be retried from the receipt. There is no
background email worker: monitor failed/pending orders in Supabase if a customer
leaves before retrying. Concurrent sends for one order are locked for two minutes.
EmailJS has no send idempotency key; a worker interruption after sending but before
recording delivery can cause a duplicate email on retry, but never a duplicate order.

EmailJS references: [REST send API](https://www.emailjs.com/docs/rest-api/send/)
and [server API access](https://github.com/emailjs-com/emailjs-nodejs#readme).

## Project origin and Git workflow

The project began in Lovable with a visual brief referencing
[Autodekor Buli](https://autodekorbuli.com/) and has been customized in this
repository. The file map above explains this implementation's structure.

GitHub pushes sync to the connected Lovable editor; publishing updates the live
website. Keep the connected branch working. Avoid force pushes or rewriting
commits already pushed, because that can disrupt Lovable's project history.

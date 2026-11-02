# autoprojoni — Car Parts & Accessories Store

An Albanian-language storefront for car parts and styling accessories in Vushtrri,
Kosovë. Customers can browse products, search and filter the catalog, manage a
basket, ask about parts on WhatsApp, and place a cash-on-delivery order.

**Live website:** [baxha01.lovable.app](https://baxha01.lovable.app)

**Project editor:** [Lovable](https://lovable.dev/projects/d5b7a0d4-95e6-4211-99b9-b3277b1a93cb)

---

## 📋 Quick Navigation

**For your professor: Jump directly to any component**

- **Homepage & Layout** → [src/routes/index.tsx](src/routes/index.tsx) (main page)
- **Hero Slider/Carousel** → [src/components/storefront/hero-carousel.tsx](src/components/storefront/hero-carousel.tsx)
- **Product Cards** → [src/components/storefront/product-card.tsx](src/components/storefront/product-card.tsx)
- **Footer & Shop Info** → [src/components/storefront/shop-info.tsx](src/components/storefront/shop-info.tsx)
- **Product Catalog Data** → [src/lib/catalog.ts](src/lib/catalog.ts)
- **Shopping Cart Logic** → [src/components/storefront/cart-provider.tsx](src/components/storefront/cart-provider.tsx)
- **Checkout Page** → [src/routes/checkout.tsx](src/routes/checkout.tsx)
- **Search & Filtering** → [src/lib/catalog-browsing.ts](src/lib/catalog-browsing.ts)
- **Generic Carousel UI** → [src/components/ui/carousel.tsx](src/components/ui/carousel.tsx)
- **WhatsApp Integration** → [src/components/storefront/whatsapp-enquiry.tsx](src/components/storefront/whatsapp-enquiry.tsx)
- **All UI Components** → [src/components/ui/](src/components/ui/) (buttons, dialogs, sheets, etc.)
- **Styles & Theme** → [src/styles.css](src/styles.css)
- **Root Layout & Providers** → [src/routes/__root.tsx](src/routes/__root.tsx)
- **Router Setup** → [src/router.tsx](src/router.tsx)
- **Server Entry** → [src/server.ts](src/server.ts)
- **Shop Details** → [src/lib/shop-details.ts](src/lib/shop-details.ts)
- **Order Schema** → [src/lib/order-schema.ts](src/lib/order-schema.ts)
- **Database Migrations** → [drizzle/migrations/](drizzle/migrations/)

---

## 🚀 Start here: where is the homepage code?

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
| **Top delivery bar**                       | Home, before `<header>`                                                | `Kosovë 2.5€` — delivery text and contact-section link.                                     |
| **Sticky header (logo, search, cart)**     | Home                                                                   | `<header` — logo, search form, basket count, and subtotal.                                  |
| **Category navigation bar**                | Home                                                                   | `Kategoritë kryesore` — `<nav>` renders buttons from `categories`.                          |
| **Mobile hamburger button**                | Home                                                                   | `Hap menunë` — calls `setMobile(true)`.                                                     |
| **🎠 Hero image slider**                   | [hero-carousel.tsx](src/components/storefront/hero-carousel.tsx)       | `HeroCarousel` and `slides` — photos, text, category buttons, arrows, dots, and pause/play. |
| **Three highlights (delivery, cars, styling)** | Home                                                                   | `Dërgesa në Kosovë` — delivery, car models, and styling highlights.                         |
| **"Eksploro kategoritë" category tiles**   | Home                                                                   | `category-title` — category images, names, and product counts.                              |
| **"Pjesët në fokus" featured carousel**     | Home                                                                   | `featured-title` — a `Carousel` containing `ProductCard` components.                        |
| **📦 Product card component**              | [product-card.tsx](src/components/storefront/product-card.tsx)         | `ProductCard` — reusable layout for featured and collection products.                       |
| **Two promotional banners**                | Home                                                                   | `Koleksionet styling` — styling and accessories banners.                                    |
| **"Pjesë & aksesorë" product grid**        | Home                                                                   | `id="produktet"` — controls, product grid, and empty-results message.                       |
| **Search, brand, category, sorting**       | Home + [catalog-browsing.ts](src/lib/catalog-browsing.ts)              | `Kërko në koleksion`, `Marka e veturës`, `Rendit produktet`, and `filterProducts`.          |
| **📄 Pagination controls**                 | Home + [catalog-browsing.ts](src/lib/catalog-browsing.ts)              | `Faqet e produkteve`, `turnPage`, and `PAGE_SIZE`.                                          |
| **Clickable car-brand names**              | Home                                                                   | `PËR MARKËN TUAJ` — sets the brand filter and scrolls to the collection.                    |
| **"Pse të bleni online" benefits**         | [shop-info.tsx](src/components/storefront/shop-info.tsx)               | `ShoppingBenefits` — delivery, quality, and support information.                            |
| **📍 Footer and contact details**          | Home                                                                   | `<footer id="kontakt"` — logo, WhatsApp, category links, delivery text, and copyright.      |
| **Google Maps iframe**                     | [shop-info.tsx](src/components/storefront/shop-info.tsx)               | `ShopMap` — Maps iframe and directions link.                                                |
| **Product quick-view popup**               | Home                                                                   | `<Dialog open={Boolean(quick)}` — selected product details and enquiry controls.            |
| **🛒 Basket drawer**                       | Home                                                                   | `<Sheet open={open}` — plus/minus/remove, subtotal, and checkout link.                      |
| **Mobile category menu**                   | Home                                                                   | `<Sheet open={mobile}` — the left-side category drawer.                                     |
| **💬 WhatsApp enquiry button**             | [whatsapp-enquiry.tsx](src/components/storefront/whatsapp-enquiry.tsx) | `WhatsAppEnquiry` — car-details field and encoded `wa.me` link.                             |

---

### 🧩 Component Hierarchy Diagram

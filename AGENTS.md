<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep storefront product data in a browser-safe catalog module and shopping interactions in focused components; this keeps imagery, filtering, and cart views consistent.
- Share the basket through a provider with hydration-safe session storage so checkout and the shop retain the same selections across navigation and refresh.
- Guest checkout uses a validated server function with catalog-derived prices, idempotent order IDs, and server-only order storage; this prevents price manipulation and public access to customer details.
- WhatsApp enquiries use normal wa.me links with encoded product and car details, requiring no messaging connector.
- Use Embla for carousels and Radix dialogs/sheets for overlays; these provide swipe gestures, focus management, and keyboard accessibility.
- Keep shop delivery policies in the browser-safe shop-details module and derive benefit details from them; this keeps customer-facing rules consistent and testable.
- Show the supplied location using a standard Google Maps iframe plus the original directions link; this requires no JavaScript map service or private API credentials.
- Keep sourced catalog additions in a browser-safe data module with local CDN pointers and source references; do not treat another shop's prices or stock as this shop's inventory.
- Paginate the collection and centralize accent-insensitive filtering; unpriced cart selections remain quote-required and are excluded from the known-price subtotal.

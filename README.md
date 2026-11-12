# MOERIS — Time, Refined

A light, editorial watch-discovery storefront with a modern 2027-inspired visual direction.

## Included
- Responsive light-first storefront for desktop and mobile
- Mixed men's, women's and unisex catalogue
- Search, category filters, sorting and EGP/USD display toggle
- Product quick-view modal with image gallery, colour finishes and product details
- Favorites saved in the visitor's browser
- Scroll reveals, marquee, hover motion and responsive navigation
- Newsletter form integration point

## Publish with GitHub Pages
1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then Save.
4. Wait for GitHub Pages to publish the site.

## Activate newsletter email collection
The site is static, so it cannot send or store email subscriptions securely by itself.
1. Create a form at [Formspree](https://formspree.io/) and configure the email notifications there.
2. Copy the form endpoint.
3. Open `js/config.js` and paste it into `newsletterEndpoint`.
4. Commit the change and test with an address you control.
Never put private email-service API keys in frontend JavaScript.

## Catalogue accuracy
The initial catalogue is a design/demo seed. Prices are illustrative, not live quotes. Image URLs are editorial placeholders and are not guaranteed to depict the exact named reference, colour or angle. Before presenting products as available for sale, replace each record in `js/products.js` with verified model references, original product photography, accurate specifications, current stock and retailer-confirmed prices. Brand names and product families are used for identification only; MOERIS is not affiliated with those brands.

## Currency
EGP and USD amounts are sample catalogue values. The switch changes display currency using the supplied sample values; it is not a live exchange-rate converter.

## Project structure
- `index.html` — storefront structure
- `css/style.css` — responsive visual system and motion
- `js/products.js` — editable product catalogue
- `js/app.js` — filters, gallery, modal, favorites and newsletter behavior
- `js/config.js` — public integration configuration

## License
All rights reserved for MOERIS project branding and original code. Product names and trademarks belong to their respective owners.
# Sunya3D

A responsive, static website for custom 3D printing, CAD design, replacement parts, industrial support, gifts and electronics.

## Run locally

Serve this directory over HTTP. For example: `python3 -m http.server 8080` and open http://localhost:8080. ES modules require HTTP; don't open index.html as a file.

## GitHub Pages

Publish the main branch, root folder, through Settings → Pages. All asset paths are relative so the site works at a repository URL such as `/sunya3d/` as well as a custom domain. No build step or server is needed.

## Business email

Change `BUSINESS_EMAIL` in `config.js`. Every contact link and the quote email recipient use that value. For consistency, update the fallback email text in `index.html` too.

## Quote inquiries

The form validates the project details and opens a review dialog. The customer can open a prepared email or copy the brief. The customer must send the email. No automated submission, attachment upload, payment collection, storage or delivery tracking is claimed or configured.

## Content

The product images are original AI-generated service concepts, labeled as illustrative on the site. They do not represent completed customer work. The interactive enclosure is a procedural 3D design concept with assembled and exploded views. The hero uses an original photorealistic illustrative printer scene, with a slow camera-motion effect and a pause control. It is not a photograph of the owner’s Bambu Lab X2D. No customer testimonials, certifications, turnaround promises or precision specifications are invented.

## Accessibility and performance

Semantic HTML, keyboard navigation, native dialogs, labeled form controls, visible focus states, responsive navigation and reduced-motion support. The 3D renderer pauses offscreen and when the tab is hidden; a concept image remains available without WebGL. Three.js is served locally. Fonts fall back to system sans-serif when unavailable.

## Dependencies

Three.js 0.180.0 (MIT) is included in assets. Its license is included as assets/THREE-LICENSE.txt. Locally hosted display fonts are Google Fonts' Space Grotesk and DM Sans under the SIL Open Font License. Their licenses are included in assets.

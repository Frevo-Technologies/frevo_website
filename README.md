# Frevo Technologies Website

Static production website for Frevo Technologies and its product portfolio.

## Technology

- Semantic HTML5
- CSS3 with responsive layouts and animations
- Vanilla JavaScript using browser APIs such as Web Animations and Intersection Observer
- Nginx container for static hosting

There is no framework, package installation, compilation or build step.

## Run locally

From the repository root:

```powershell
python -m http.server 8088
```

Open `http://localhost:8088/`.

Product routes:

- `http://localhost:8088/products/frevone/`
- `http://localhost:8088/products/frevdesk/`
- `http://localhost:8088/products/frevguard/`

Company routes:

- `http://localhost:8088/clients/`

The Frevo Signature opening runs once per browser session. Use
`http://localhost:8088/?signature=preview` to replay it while testing.

## Deployment

The repository root is the website document root. It can be deployed directly
to any static web host, or built with the included Nginx `dockerfile`.

The hosting configuration must serve directory index files so routes such as
`/products/frevone/` resolve to `products/frevone/index.html`.

Legacy direct URLs (`/frevone.html`, `/frevdesk.html`, and `/frevguard.html`)
remain as lightweight redirects to the current product routes.

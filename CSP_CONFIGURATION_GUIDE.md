## 🔐 Content Security Policy (CSP) Configuration – BOW

This document explains **what CSP we added**, **where it lives**, and **how to update it** for the Beats of Washington platform.

---

### 1. What is CSP and why we added it

**Content Security Policy (CSP)** is an HTTP security header that tells the browser **which sources are allowed** to load scripts, styles, images, fonts, iframes, etc.

Even though we already use **AWS Cognito** and **role-based API security**, CSP adds an extra layer by:

- Blocking **malicious scripts** from untrusted domains
- Reducing risk of **XSS** (cross-site scripting) and token theft
- Limiting where the frontend can **send or load data** (exfiltration protection)

Think of it as:

- Cognito = who can access the system  
- CSP = what code is allowed to run in the browser

---

### 2. Where CSP is configured

CSP is enforced via **HTTP response headers** using `helmet` in the backend:

- `bow-backend/middleware/security.js`
- `bow-backend/lambda-deploy/middleware/security.js`

Both files call `helmet({ contentSecurityPolicy: { ... } })`, so CSP is active for:

- Local backend
- Lambda-deployed backend (API Gateway → Lambda)

No `<meta>`-tag-based CSP is used; we use the **recommended header-based** configuration.

---

### 3. Current CSP directives

We use Helmet’s defaults plus our own directives:

- **`default-src 'self'`**  
  - Only allow content from our own origin unless explicitly allowed elsewhere.

- **`script-src`**  
  ```
  'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com
  ```
  - `self` – our own JS bundles
  - `'unsafe-inline'`, `'unsafe-eval'` – currently needed for React/Tailwind/dev tooling  
    (these can be tightened later)
  - `https://js.stripe.com` – Stripe payment scripts

- **`style-src`**  
  ```
  'self' 'unsafe-inline' https://fonts.googleapis.com
  ```
  - Our CSS and inline styles
  - Google Fonts stylesheets

- **`font-src`**  
  ```
  'self' https://fonts.gstatic.com
  ```
  - Our fonts and Google Fonts font files

- **`img-src`**  
  ```
  'self' data: https: blob:
  ```
  - Images from our domain
  - Any HTTPS images (S3, CDNs)
  - `data:` – base64/inline images
  - `blob:` – blob URLs

- **`connect-src`** (XHR/fetch/WebSocket destinations)  
  ```
  'self' 
  https://api.stripe.com 
  https://*.execute-api.us-west-2.amazonaws.com 
  https://bow-users.auth.us-west-2.amazoncognito.com
  ```
  - Our API
  - Stripe API
  - API Gateway/Lambda endpoints (all stages in `us-west-2`)
  - Cognito hosted UI domain

- **`frame-src`** (iframes)  
  ```
  'self' 
  https://js.stripe.com 
  https://hooks.stripe.com 
  https://www.youtube.com 
  https://youtube.com
  ```
  - Our own iframes
  - Stripe’s hosted payment iframes
  - YouTube embeds

- **`object-src 'none'`**  
  - Disables plugins/Flash/object tags entirely.

- **`upgrade-insecure-requests`**  
  - Left enabled via Helmet defaults to encourage HTTPS usage.

> Note: `'unsafe-inline'` and `'unsafe-eval'` are currently allowed for compatibility. As we harden the app, we can work toward removing these.

---

### 4. How this interacts with Cognito & API security

- **Cognito** ensures only authenticated users can call protected APIs.
- **CSP** ensures only trusted scripts/styles/images/ifames can load in the **browser** and limits where data can be sent.

Together they protect against:

- Unauthorized API access (**Cognito**)
- Malicious scripts stealing tokens/data (**CSP**)

---

### 5. How to change CSP when we add new services

If you integrate a new external service, you may need to update CSP:

- New **script CDN** → add to `scriptSrc`
- New **font provider** → add to `fontSrc` / `styleSrc`
- New **image CDN** → add to `imgSrc`
- New **API endpoint** → add to `connectSrc`
- New **iframe host** (e.g., Vimeo) → add to `frameSrc`

Update **both** files:

- `bow-backend/middleware/security.js`
- `bow-backend/lambda-deploy/middleware/security.js`

Then **redeploy the backend/Lambda** so the new headers are active.

---

### 6. How to verify CSP in the browser

1. Open the site in Chrome.
2. Open **DevTools → Network**.
3. Click any API response (e.g., `/api/...`).
4. In the **Headers** tab, look under **Response Headers** for:
   - `content-security-policy: ...`

If CSP blocks something, you’ll see warnings/errors in **DevTools → Console**, like:

- `Refused to load script from 'https://example.com' because it violates the Content Security Policy directive ...`

Those messages tell you exactly what domain and directive may need adjusting (or confirm that CSP is correctly blocking something unsafe).

---

### 7. Future hardening steps

Over time, we can further tighten CSP by:

- Removing `'unsafe-inline'` and `'unsafe-eval'` from `script-src` and `style-src`
- Using nonces or hashes for inline scripts/styles
- Restricting `img-src` to known CDNs instead of all `https:`
- Adding a CSP report endpoint for monitoring (`report-uri` / `report-to`)

For now, the current CSP is a **safe, compatible baseline** that works with:

- React/Tailwind build
- Stripe (payments)
- Cognito (auth)
- API Gateway/Lambda
- Google Fonts
- YouTube embeds

---

**Last updated:** March 2025  
**Scope:** CSP configuration for BOW backend (local + Lambda)  





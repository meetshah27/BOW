const helmet = require('helmet');

// Security middleware configuration
const securityMiddleware = (app) => {
  // Basic security headers + Content Security Policy
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        // Allow inline styles for Tailwind / React, and Google Fonts
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://*.web.squarecdn.com", "https://web.squarecdn.com"],
        // Allow images from our domain, S3/HTTPS, data URLs (for inline icons) and blobs
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        // Scripts: self, inline/eval (CRA/React dev tools), and Stripe JS
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://js.stripe.com",
          "https://*.web.squarecdn.com",
          "https://web.squarecdn.com"
        ],
        // XHR / fetch / websockets destinations
        connectSrc: [
          "'self'",
          "https://api.stripe.com",
          "https://*.execute-api.us-west-2.amazonaws.com",
          "https://bow-users.auth.us-west-2.amazoncognito.com",
          "https://*.squareupsandbox.com",
          "https://*.squareup.com",
          "https://*.web.squarecdn.com",
          "https://web.squarecdn.com"
        ],
        frameSrc: [
          "'self'",
          "https://js.stripe.com",
          "https://hooks.stripe.com",
          "https://www.youtube.com",
          "https://youtube.com",
          "https://*.web.squarecdn.com",
          "https://web.squarecdn.com",
          "https://*.squareupsandbox.com",
          "https://*.squareup.com"
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  }));

  // CORS configuration
  app.use((req, res, next) => {
    // Support additional domains via env variable
    const additionalOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
      .split(',')
      .map(origin => origin.trim())
      .filter(Boolean);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://your-production-domain.com', // Replace with your actual domain
      process.env.ALLOWED_ORIGIN,
      process.env.FRONTEND_URL,
      process.env.CDN_DOMAIN,
      ...additionalOrigins
    ].filter(Boolean);

    const rawOrigin = req.headers.origin;
    let normalizedOrigin = rawOrigin;
    let hostname = '';

    if (rawOrigin) {
      try {
        const url = new URL(rawOrigin);
        hostname = url.hostname.replace(/\.$/, ''); // handle trailing dot variants
        const protocol = url.protocol;
        const port = url.port ? `:${url.port}` : '';
        normalizedOrigin = `${protocol}//${hostname}${port}`;
      } catch (error) {
        normalizedOrigin = rawOrigin;
      }
    }

    const isAllowed =
      !normalizedOrigin ||
      allowedOrigins.includes(normalizedOrigin) ||
      // Allow CloudFront and Amplify preview domains by default
      (hostname &&
        (hostname.endsWith('.cloudfront.net') ||
          hostname.endsWith('.amplifyapp.com')));

    if (rawOrigin && isAllowed) {
      res.header('Access-Control-Allow-Origin', rawOrigin);
    }

    // CORS response should vary by Origin
    res.header('Vary', 'Origin');

    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Rate limiting (basic implementation)
  const rateLimit = require('express-rate-limit');
  
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/', limiter);

  // Additional security headers
  app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
  });
};

module.exports = securityMiddleware;

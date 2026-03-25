const { SquareClient, SquareEnvironment } = require('square');

let cachedClient = null;

function getSquareEnvironment() {
  const raw = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || '').toLowerCase().trim();
  if (raw === 'production' || raw === 'prod') return SquareEnvironment.Production;
  if (raw === 'sandbox' || raw === 'test') return SquareEnvironment.Sandbox;

  // Default safely: sandbox for non-production NODE_ENV, production otherwise
  if ((process.env.NODE_ENV || '').toLowerCase() === 'production') return SquareEnvironment.Production;
  return SquareEnvironment.Sandbox;
}

function getSquareClient() {
  if (cachedClient) return cachedClient;

  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) {
    throw new Error('Square access token not found. Set SQUARE_ACCESS_TOKEN in environment variables.');
  }

  cachedClient = new SquareClient({
    token,
    environment: getSquareEnvironment(),
  });

  return cachedClient;
}

function getSquareFrontendConfig() {
  const applicationId = process.env.SQUARE_APPLICATION_ID || null;
  const locationId = process.env.SQUARE_LOCATION_ID || null;

  return {
    applicationId,
    locationId,
    environment:
      getSquareEnvironment() === SquareEnvironment.Production ? 'production' : 'sandbox',
  };
}

module.exports = {
  getSquareClient,
  getSquareFrontendConfig,
};


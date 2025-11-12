const { CognitoJwtVerifier } = require("aws-jwt-verify");

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID || "us-west-2_Imazy2DXa",
  tokenUse: "id", // or "access" if you want to accept access tokens
  clientId: process.env.COGNITO_CLIENT_ID || "7qiar42f9ujh3p8atoel4dp055",
});

module.exports = async function verifyCognito(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) throw new Error("No token provided");
    const payload = await verifier.verify(token);
    req.cognitoUser = payload; // Attach user info to request
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
}; 
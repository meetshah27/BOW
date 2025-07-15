const { CognitoJwtVerifier } = require("aws-jwt-verify");

const verifier = CognitoJwtVerifier.create({
  userPoolId: "us-east-1_Zk7dtdrv3", // <-- Replace with your Cognito User Pool ID
  tokenUse: "id", // or "access" if you want to accept access tokens
  clientId: "1p577744bm0bko388dq4g5it16", // <-- Replace with your Cognito App Client ID
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
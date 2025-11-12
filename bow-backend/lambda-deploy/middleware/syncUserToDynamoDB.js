const User = require('../models-dynamodb/User');

module.exports = async function syncUserToDynamoDB(req, res, next) {
  try {
    const cognitoUser = req.cognitoUser;
    if (!cognitoUser) {
      return next();
    }

    const userEmail = cognitoUser.email;
    const cognitoUid = cognitoUser.sub;

    // Check if user exists in DynamoDB
    let user = null;
    try {
      user = await User.findByEmail(userEmail);
    } catch (error) {
      console.log('User not found in DynamoDB, will create new user');
    }

    if (!user) {
      // Create new user in DynamoDB
      try {
        user = await User.create({
          uid: cognitoUid,
          email: userEmail,
          displayName: cognitoUser.name || cognitoUser['cognito:username'] || userEmail,
          firstName: cognitoUser.given_name || '',
          lastName: cognitoUser.family_name || '',
          role: 'member', // Default role
          isActive: true,
          createdAt: new Date().toISOString(),
          // Add any other fields you want to sync
        });
        console.log('Created new user in DynamoDB:', userEmail);
      } catch (error) {
        console.error('Error creating user in DynamoDB:', error);
        // Continue without failing the request
      }
    } else {
      // Update existing user if needed
      try {
        const updates = {};
        if (!user.displayName && cognitoUser.name) {
          updates.displayName = cognitoUser.name;
        }
        if (!user.firstName && cognitoUser.given_name) {
          updates.firstName = cognitoUser.given_name;
        }
        if (!user.lastName && cognitoUser.family_name) {
          updates.lastName = cognitoUser.family_name;
        }
        
        if (Object.keys(updates).length > 0) {
          await User.update(cognitoUid, updates);
          console.log('Updated user in DynamoDB:', userEmail);
        }
      } catch (error) {
        console.error('Error updating user in DynamoDB:', error);
      }
    }

    // Attach the user data to the request
    req.userData = user;
    next();
  } catch (error) {
    console.error('Error in syncUserToDynamoDB:', error);
    next(); // Continue without failing the request
  }
}; 
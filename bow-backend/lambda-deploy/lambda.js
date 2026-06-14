const serverlessExpress = require('@vendia/serverless-express');
const app = require('./server'); // your Express app
exports.handler = serverlessExpress({ 
  app,
  binarySettings: {
    isBinary: ({ headers }) => {
      const contentType = headers['content-type'] || headers['Content-Type'] || '';
      return contentType.includes('multipart/form-data') || 
             contentType.includes('image/') || 
             contentType.includes('video/');
    }
  }
});

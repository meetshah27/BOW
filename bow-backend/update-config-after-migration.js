const fs = require('fs').promises;
const path = require('path');

// Configuration files to update
const configFiles = [
  {
    path: 'config/dynamodb.js',
    changes: [
      {
        from: "region: process.env.AWS_REGION || 'us-east-1'",
        to: "region: process.env.AWS_REGION || 'us-west-2'"
      }
    ]
  }
];

const updateConfigFile = async (filePath, changes) => {
  try {
    console.log(`Updating ${filePath}...`);
    
    // Read the file
    const content = await fs.readFile(filePath, 'utf8');
    let updatedContent = content;
    
    // Apply changes
    changes.forEach(change => {
      updatedContent = updatedContent.replace(change.from, change.to);
    });
    
    // Write back to file
    await fs.writeFile(filePath, updatedContent, 'utf8');
    
    console.log(`✅ Updated ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
};

const main = async () => {
  console.log('🔄 Updating configuration files for us-west-2...');
  console.log('==============================================');
  
  for (const configFile of configFiles) {
    await updateConfigFile(configFile.path, configFile.changes);
  }
  
  console.log('\n📝 Manual updates needed:');
  console.log('1. Update your .env file:');
  console.log('   AWS_REGION=us-west-2');
  console.log('');
  console.log('2. Update your frontend Amplify config in src/config/amplify.js:');
  console.log('   region: "us-west-2"');
  console.log('');
  console.log('3. Update any environment variables in your deployment platform');
  console.log('');
  console.log('4. Test your application thoroughly');
  console.log('');
  console.log('5. After confirming everything works, you can delete old tables in us-east-2');
};

if (require.main === module) {
  main();
}

module.exports = { updateConfigFile }; 
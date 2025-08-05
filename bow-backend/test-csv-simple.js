require('dotenv').config();

async function testCSVEndpoint() {
  console.log('🧪 Testing CSV Export Endpoint...\n');
  
  try {
    console.log('📤 Testing endpoint: http://localhost:3000/api/volunteers/export-csv');
    const response = await fetch('http://localhost:3000/api/volunteers/export-csv');
    
    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📊 Response OK: ${response.ok}`);
    
    if (response.ok) {
      const csvContent = await response.text();
      console.log('✅ CSV Export: SUCCESS!');
      console.log(`📄 Content Length: ${csvContent.length} characters`);
      console.log(`📄 Content Type: ${response.headers.get('content-type')}`);
      console.log(`📄 Filename: ${response.headers.get('content-disposition')}`);
      
      // Show first few lines
      const lines = csvContent.split('\n');
      console.log('\n📋 First 3 lines:');
      lines.slice(0, 3).forEach((line, index) => {
        console.log(`   ${index + 1}: ${line}`);
      });
      
    } else {
      console.log('❌ CSV Export: FAILED');
      const errorText = await response.text();
      console.log(`📄 Error Response: ${errorText}`);
    }
    
  } catch (error) {
    console.error('❌ Network Error:', error.message);
    console.log('\n💡 Possible issues:');
    console.log('   1. Backend server not running on port 3000');
    console.log('   2. Network connectivity issue');
    console.log('   3. CORS configuration problem');
  }
}

testCSVEndpoint(); 
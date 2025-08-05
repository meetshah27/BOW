require('dotenv').config();

async function testCSVExport() {
  console.log('🧪 Testing CSV Export Functionality...\n');
  
  try {
    console.log('📤 Testing CSV export endpoint...');
    const response = await fetch('http://localhost:3000/api/volunteers/export-csv');
    
    if (response.ok) {
      const csvContent = await response.text();
      console.log('✅ CSV Export Test: SUCCESS!');
      console.log(`   Content Type: ${response.headers.get('content-type')}`);
      console.log(`   Content Length: ${csvContent.length} characters`);
      console.log(`   Filename: ${response.headers.get('content-disposition')}`);
      
      // Show first few lines of CSV
      const lines = csvContent.split('\n');
      console.log('\n📋 CSV Preview (first 3 lines):');
      lines.slice(0, 3).forEach((line, index) => {
        console.log(`   Line ${index + 1}: ${line.substring(0, 100)}${line.length > 100 ? '...' : ''}`);
      });
      
      console.log('\n🎉 CSV export is working correctly!');
      console.log('   The frontend can now download volunteer applications as CSV files.');
      
    } else {
      console.error('❌ CSV Export Test: FAILED');
      console.error(`   Status: ${response.status}`);
      const errorText = await response.text();
      console.error(`   Error: ${errorText}`);
    }
    
  } catch (error) {
    console.error('❌ CSV Export Test: ERROR');
    console.error('Error:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 3000');
  }
}

testCSVExport(); 
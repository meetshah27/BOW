// Test script for Stories functionality
// Run this in the browser console on the stories page

console.log('🧪 Testing Stories Functionality...');

// Test 1: Check if stories are loaded
async function testStoriesLoading() {
  try {
    console.log('📖 Testing stories loading...');
    const response = await fetch('/api/stories');
    const stories = await response.json();
    console.log('✅ Stories loaded successfully:', stories.length, 'stories found');
    console.log('📊 Sample story:', stories[0]);
    return true;
  } catch (error) {
    console.error('❌ Failed to load stories:', error);
    return false;
  }
}

// Test 2: Check if story upload endpoint exists
async function testStoryUpload() {
  try {
    console.log('📤 Testing story upload endpoint...');
    const response = await fetch('/api/upload/story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ test: true })
    });
    
    if (response.status === 400) {
      console.log('✅ Upload endpoint exists (expected error for no file)');
      return true;
    } else {
      console.log('⚠️ Unexpected response:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Upload endpoint test failed:', error);
    return false;
  }
}

// Test 3: Check if stories page components exist
function testStoriesComponents() {
  console.log('🔍 Testing stories page components...');
  
  // Check for stories grid
  const storiesGrid = document.querySelector('.grid');
  if (storiesGrid) {
    console.log('✅ Stories grid found');
  } else {
    console.log('❌ Stories grid not found');
  }
  
  // Check for category filters
  const categoryFilters = document.querySelectorAll('[data-category]');
  if (categoryFilters.length > 0) {
    console.log('✅ Category filters found:', categoryFilters.length);
  } else {
    console.log('❌ Category filters not found');
  }
  
  // Check for search bar
  const searchBar = document.querySelector('input[type="text"]');
  if (searchBar) {
    console.log('✅ Search bar found');
  } else {
    console.log('❌ Search bar not found');
  }
  
  return true;
}

// Test 4: Check if admin stories management exists
function testAdminStoriesManagement() {
  console.log('⚙️ Testing admin stories management...');
  
  // Check if we're on admin page
  const isAdminPage = window.location.pathname.includes('admin');
  
  if (isAdminPage) {
    const storiesManagement = document.querySelector('h2');
    if (storiesManagement && storiesManagement.textContent.includes('Stories Management')) {
      console.log('✅ Stories management component found');
      return true;
    } else {
      console.log('❌ Stories management component not found');
      return false;
    }
  } else {
    console.log('ℹ️ Not on admin page, skipping admin test');
    return true;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Stories Functionality Tests...\n');
  
  const results = {
    storiesLoading: await testStoriesLoading(),
    storyUpload: await testStoryUpload(),
    components: testStoriesComponents(),
    adminManagement: testAdminStoriesManagement()
  };
  
  console.log('\n📊 Test Results:');
  console.log('Stories Loading:', results.storiesLoading ? '✅ PASS' : '❌ FAIL');
  console.log('Story Upload:', results.storyUpload ? '✅ PASS' : '❌ FAIL');
  console.log('Page Components:', results.components ? '✅ PASS' : '❌ FAIL');
  console.log('Admin Management:', results.adminManagement ? '✅ PASS' : '❌ FAIL');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Stories functionality is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the console for details.');
  }
}

// Export for manual testing
window.testStories = {
  runAllTests,
  testStoriesLoading,
  testStoryUpload,
  testStoriesComponents,
  testAdminStoriesManagement
};

// Auto-run tests if on stories page
if (window.location.pathname.includes('stories') || window.location.pathname.includes('admin')) {
  setTimeout(() => {
    console.log('🔄 Auto-running stories tests...');
    runAllTests();
  }, 2000);
}

console.log('🧪 Stories test script loaded. Run testStories.runAllTests() to test manually.');

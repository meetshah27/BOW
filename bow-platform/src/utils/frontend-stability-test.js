// Frontend Stability Test - Monitor for 30-second data loss issues

class FrontendStabilityMonitor {
  constructor() {
    this.startTime = Date.now();
    this.checks = [];
    this.isMonitoring = false;
    this.checkInterval = null;
  }

  start() {
    if (this.isMonitoring) return;
    
    console.log('🔍 Starting Frontend Stability Monitor...');
    console.log('⏰ Started at:', new Date().toISOString());
    
    this.isMonitoring = true;
    
    // Check every 5 seconds
    this.checkInterval = setInterval(() => {
      this.performCheck();
    }, 5000);
    
    // Also check every 30 seconds specifically
    setInterval(() => {
      console.log('⚠️ 30-SECOND CHECK - This is when data usually disappears!');
      this.performDetailedCheck();
    }, 30000);
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isMonitoring = false;
    console.log('🛑 Frontend Stability Monitor stopped');
  }

  performCheck() {
    const now = Date.now();
    const elapsed = Math.floor((now - this.startTime) / 1000);
    
    console.log(`\n🧪 Check at ${elapsed}s elapsed`);
    
    // Check localStorage
    try {
      const authToken = localStorage.getItem('authToken');
      const cognitoToken = localStorage.getItem('cognitoToken');
      const currentUser = localStorage.getItem('currentUser');
      
      console.log('📦 localStorage status:');
      console.log('   authToken:', authToken ? 'SET' : 'NOT SET');
      console.log('   cognitoToken:', cognitoToken ? 'SET' : 'NOT SET');
      console.log('   currentUser:', currentUser ? 'SET' : 'NOT SET');
    } catch (error) {
      console.error('❌ localStorage error:', error);
    }

    // Check sessionStorage
    try {
      const sessionKeys = Object.keys(sessionStorage);
      console.log('📦 sessionStorage keys:', sessionKeys.length);
    } catch (error) {
      console.error('❌ sessionStorage error:', error);
    }

    // Check memory usage (if available)
    if (performance.memory) {
      const memory = performance.memory;
      console.log('🧠 Memory usage:');
      console.log('   Used:', Math.round(memory.usedJSHeapSize / 1024 / 1024), 'MB');
      console.log('   Total:', Math.round(memory.totalJSHeapSize / 1024 / 1024), 'MB');
      console.log('   Limit:', Math.round(memory.jsHeapSizeLimit / 1024 / 1024), 'MB');
    }

    // Check if React DevTools are available
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.log('⚛️ React DevTools: Available');
    } else {
      console.log('⚛️ React DevTools: Not available');
    }
  }

  performDetailedCheck() {
    console.log('\n🚨 DETAILED 30-SECOND CHECK 🚨');
    
    // Check if any global variables are missing
    const globalVars = [
      'window.location',
      'window.document',
      'window.localStorage',
      'window.sessionStorage',
      'window.performance'
    ];
    
    globalVars.forEach(varName => {
      try {
        const value = eval(varName);
        if (value) {
          console.log(`✅ ${varName}: Available`);
        } else {
          console.log(`❌ ${varName}: Missing or null`);
        }
      } catch (error) {
        console.log(`❌ ${varName}: Error - ${error.message}`);
      }
    });

    // Check if fetch is working
    try {
      fetch('/health')
        .then(response => response.json())
        .then(data => {
          console.log('🌐 Health check response:', data);
        })
        .catch(error => {
          console.error('❌ Health check failed:', error);
        });
    } catch (error) {
      console.error('❌ Fetch not available:', error);
    }
  }

  // Monitor specific data
  monitorData(key, getter) {
    const initialValue = getter();
    console.log(`📊 Monitoring data: ${key} =`, initialValue);
    
    this.checks.push({
      key,
      getter,
      initialValue,
      lastCheck: Date.now()
    });
  }

  // Check monitored data
  checkMonitoredData() {
    this.checks.forEach(check => {
      const currentValue = check.getter();
      const hasChanged = currentValue !== check.initialValue;
      
      if (hasChanged) {
        console.log(`🔄 Data changed: ${check.key}`);
        console.log('   From:', check.initialValue);
        console.log('   To:', currentValue);
        console.log('   Time since last check:', Date.now() - check.lastCheck, 'ms');
        
        check.initialValue = currentValue;
        check.lastCheck = Date.now();
      }
    });
  }
}

// Create global instance
window.frontendStabilityMonitor = new FrontendStabilityMonitor();

// Auto-start monitoring in development
if (process.env.NODE_ENV === 'development') {
  window.frontendStabilityMonitor.start();
}

export default FrontendStabilityMonitor;

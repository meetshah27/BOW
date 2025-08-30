// API Configuration
const API_CONFIG = {
  // Development environment
  development: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    apiPath: '/api'
  },
  // Production environment
  production: {
    baseURL: process.env.REACT_APP_API_URL || 'https://jzggm21wjh.execute-api.us-west-2.amazonaws.com/default/backend-clean',
    apiPath: '/api'
  }
};

// Get current environment
const getEnvironment = () => {
  // Check if we're on localhost (development)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'development';
  }
  
  // Check if we're on a production domain (not localhost)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'production';
  }
  
  // Default to production for safety
  return 'production';
};

const getApiConfig = () => {
  return API_CONFIG[getEnvironment()];
};

// Get authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken') || localStorage.getItem('cognitoToken');
};

// Build headers with authentication
const buildHeaders = (customHeaders = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

const buildApiUrl = (endpoint) => {
  const config = getApiConfig();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${config.baseURL}${config.apiPath}${cleanEndpoint}`;
};

// Build URL for user endpoints (no /api prefix)
const buildUserUrl = (endpoint) => {
  const config = getApiConfig();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${config.baseURL}${cleanEndpoint}`;
};

const api = {
  // GET request
  get: async (endpoint, options = {}) => {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'GET',
      headers: buildHeaders(options.headers),
      ...options
    });
    
    // Handle 401 responses by clearing invalid tokens
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('cognitoToken');
      localStorage.removeItem('currentUser');
    }
    
    return response;
  },

  // POST request
  post: async (endpoint, data = {}, options = {}) => {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: buildHeaders(options.headers),
      body: JSON.stringify(data),
      ...options
    });
    
    // Handle 401 responses by clearing invalid tokens
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('cognitoToken');
      localStorage.removeItem('currentUser');
    }
    
    return response;
  },

  // PUT request
  put: async (endpoint, data = {}, options = {}) => {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'PUT',
      headers: buildHeaders(options.headers),
      body: JSON.stringify(data),
      ...options
    });
    
    // Handle 401 responses by clearing invalid tokens
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('cognitoToken');
      localStorage.removeItem('currentUser');
    }
    
    return response;
  },

  // DELETE request
  delete: async (endpoint, data = {}, options = {}) => {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: buildHeaders(options.headers),
      body: JSON.stringify(data),
      ...options
    });
    
    // Handle 401 responses by clearing invalid tokens
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('cognitoToken');
      localStorage.removeItem('currentUser');
    }
    
    return response;
  },

  // Upload request (for file uploads)
  upload: async (endpoint, formData, options = {}) => {
    const url = buildApiUrl(endpoint);
    const headers = buildHeaders(options.headers);
    // Remove Content-Type for file uploads to let browser set it with boundary
    delete headers['Content-Type'];
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
      ...options
    });
    
    // Handle 401 responses by clearing invalid tokens
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('cognitoToken');
      localStorage.removeItem('currentUser');
    }
    
    return response;
  },

  // User-specific functions (no /api prefix)
  user: {
    // GET request for user endpoints
    get: async (endpoint, options = {}) => {
      const url = buildUserUrl(endpoint);
      const response = await fetch(url, {
        method: 'GET',
        headers: buildHeaders(options.headers),
        ...options
      });
      
      // Handle 401 responses by clearing invalid tokens
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('cognitoToken');
        localStorage.removeItem('currentUser');
      }
      
      return response;
    },

    // POST request for user endpoints
    post: async (endpoint, data = {}, options = {}) => {
      const url = buildUserUrl(endpoint);
      const response = await fetch(url, {
        method: 'POST',
        headers: buildHeaders(options.headers),
        body: JSON.stringify(data),
        ...options
      });
      
      // Handle 401 responses by clearing invalid tokens
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('cognitoToken');
        localStorage.removeItem('currentUser');
      }
      
      return response;
    },

    // PUT request for user endpoints
    put: async (endpoint, data = {}, options = {}) => {
      const url = buildUserUrl(endpoint);
      const response = await fetch(url, {
        method: 'PUT',
        headers: buildHeaders(options.headers),
        body: JSON.stringify(data),
        ...options
      });
      
      // Handle 401 responses by clearing invalid tokens
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('cognitoToken');
        localStorage.removeItem('currentUser');
      }
      
      return response;
    }
  }
};

export default api;
export { buildApiUrl, getApiConfig, getEnvironment, getAuthToken }; 
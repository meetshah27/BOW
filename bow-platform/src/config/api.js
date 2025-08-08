// API Configuration
const API_CONFIG = {
  // Development environment
  development: {
    baseURL: 'http://localhost:3000',
    apiPath: '/api'
  },
  // Production environment
  production: {
    baseURL: 'https://z1rt2gxnei.execute-api.us-west-2.amazonaws.com/default/bow-backend-clean',
    apiPath: '/api'
  }
};

// Get current environment
const getEnvironment = () => {
  // Force development for now since Lambda is missing routes
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return 'development';
  if (process.env.NODE_ENV === 'production') return 'development'; // Temporarily use local for production too
  return 'development'; // Default to development for now
};

const getApiConfig = () => {
  return API_CONFIG[getEnvironment()];
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
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    return response;
  },

  // POST request
  post: async (endpoint, data = {}, options = {}) => {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    });
    return response;
  },

  // PUT request
  put: async (endpoint, data = {}, options = {}) => {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    });
    return response;
  },

  // DELETE request
  delete: async (endpoint, data = {}, options = {}) => {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    });
    return response;
  },

  // Upload request (for file uploads)
  upload: async (endpoint, formData, options = {}) => {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...options.headers
      },
      body: formData,
      ...options
    });
    return response;
  },

  // User-specific functions (no /api prefix)
  user: {
    // GET request for user endpoints
    get: async (endpoint, options = {}) => {
      const url = buildUserUrl(endpoint);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      return response;
    },

    // POST request for user endpoints
    post: async (endpoint, data = {}, options = {}) => {
      const url = buildUserUrl(endpoint);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(data),
        ...options
      });
      return response;
    },

    // PUT request for user endpoints
    put: async (endpoint, data = {}, options = {}) => {
      const url = buildUserUrl(endpoint);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(data),
        ...options
      });
      return response;
    }
  }
};

export default api;
export { buildApiUrl, getApiConfig, getEnvironment }; 
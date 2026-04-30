import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_CUSTOMER_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add location and vkid to payload instead of headers
    const lat = localStorage.getItem('latitude');
    const lng = localStorage.getItem('longitude');
    const vkid = localStorage.getItem('vkid');
    
    // Inject into JSON body for POST/PUT/PATCH requests
    if (['post', 'put', 'patch'].includes(config.method?.toLowerCase())) {
      config.data = config.data ? { ...config.data } : {};
      if (lat) config.data.latitude = lat;
      if (lng) config.data.longitude = lng;
      if (vkid) config.data.vkid = vkid;
    } 
    // Inject into query params for GET/DELETE requests
    else if (['get', 'delete'].includes(config.method?.toLowerCase())) {
      config.params = config.params ? { ...config.params } : {};
      if (lat) config.params.latitude = lat;
      if (lng) config.params.longitude = lng;
      if (vkid) config.params.vkid = vkid;
    }

    // You can add auth tokens here if needed in the future
    console.log(`📍 Injected Payload -> latitude: ${lat}, longitude: ${lng}, vkid: ${vkid}`);
    console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`, JSON.stringify(config.data || config.params || {}));
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    const status = error.response ? error.response.status : 'NETWORK_ERROR';
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    console.error(`❌ API Error: ${error.config?.url} [${status}]`, message);
    
    return Promise.reject({
      status,
      message,
      data: error.response?.data,
    });
  }
);

export default apiClient;

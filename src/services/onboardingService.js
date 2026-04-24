import apiClient from '../utils/apiClient';

const onboardingService = {
  /**
   * Generates OTP for mobile number.
   * @param {string} mobileNumber 
   * @param {string} emailId (Optional)
   */
  generateOtp: async (mobileNumber, emailId = "") => {
    try {
      const payload = { mobileNumber };
      if (emailId) {
        payload.emailId = emailId;
      }
      
      const response = await apiClient.post('/generate-otp', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verifies the mobile OTP.
   * @param {Object} payload { applicationNumber, externalAppRefNumber, otp, mobileNumber }
   */
  verifyOtp: async (payload) => {
    try {
      const response = await apiClient.post('/verify-otp', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Sends OTP to the provided email address.
   * @param {Object} payload { emailId, applicationNumber, externalAppRefNumber }
   */
  sendEmailOtp: async (payload) => {
    try {
      const response = await apiClient.post('/send-email', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verifies the email OTP.
   * @param {Object} payload { otp, emailId, applicationNumber, externalAppRefNumber }
   */
  verifyEmailOtp: async (payload) => {
    try {
      const response = await apiClient.post('/verify-email', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Resends mobile OTP.
   * @param {Object} payload { applicationNumber }
   */
  resendOtp: async (payload) => {
    try {
      const response = await apiClient.post('/resend-otp', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Resends email OTP.
   * @param {Object} payload { emailId, applicationNumber, externalAppRefNumber }
   */
  resendEmailOtp: async (payload) => {
    try {
      const response = await apiClient.post('/resend-email', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verifies PAN and Aadhaar.
   * @param {Object} payload { applicationNumber, externalAppRefNumber, panNo, aadharNo, bioMetricData, consents }
   */
  panAadhaarVerify: async (payload) => {
    try {
      const response = await apiClient.post('/pan-aadhar-verify', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetches the savings account variants (subscriptions).
   */
  getAccountSubscriptions: async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL.replace('/customer', '');
      const response = await apiClient.get('/common/account-sub', { baseURL });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default onboardingService;

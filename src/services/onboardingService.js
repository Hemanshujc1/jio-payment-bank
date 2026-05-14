import apiClient from "../utils/apiClient";
import axios from "axios";

const onboardingService = {
  
  /**
   * Generate OTP for Agent Verification
   * @Param {Object} payload {"vkid": "RJ2903071"}
   */
  sendAgentOtp: async (payload) => {
  const res = await apiClient.post("/agent-otp", payload, 
    {
      baseURL: import.meta.env.VITE_COMMON_API_BASE_URL,
    }
  );
  return res.data;
},

  /**
   * Verifies OTP for Agent Verification
   * @param {Object} payload {"vkid": "RJ2903071", "otp": "556165"} 
   */
 verifyAgentOtp: async (payload) => {
  const res = await apiClient.post("/verify-agent-otp", payload,
    {
      baseURL: import.meta.env.VITE_COMMON_API_BASE_URL,
    }
  );
  return res.data;
},

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

      const response = await apiClient.post("/generate-otp", payload);
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
      const response = await apiClient.post("/verify-otp", payload);
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
      const response = await apiClient.post("/send-email", payload);
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
      const response = await apiClient.post("/verify-email", payload);
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
      const response = await apiClient.post("/resend-otp", payload);
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
      const response = await apiClient.post("/resend-email", payload);
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
      const response = await apiClient.post("/pan-aadhar-verify", payload);
      //const response = await axios.post("http://192.168.200.173:8090/customer/pan-aadhar-verify", payload);
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
      const response = await apiClient.post(
        "/account-sub",
        {},
        {
          baseURL: import.meta.env.VITE_COMMON_API_BASE_URL,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
// http:192.168.200.173:8090/common/get-consents
  /**
   * Fetches dynamic consents based on language
   * @param {string} language "EN" or "oth"
   */
  getConsents: async (language) => {
    try {
      // const response = await axios.post("http://192.168.200.173:8090/common/get-consents",{language});
      const response = await apiClient.post(
        "/get-consents",
        { language },
        {
        baseURL: import.meta.env.VITE_COMMON_API_BASE_URL,
        
        }
      );
     return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetches city and state details based on pincode.
   * @param {string} pincode
   */
  getPincodeDetails: async (pincode) => {
    try {
      const response = await apiClient.post(
        "/pin-code",
        { pincode },
        {
          baseURL: import.meta.env.VITE_COMMON_API_BASE_URL,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetches the agent's wallet balance.
   * @param {string} vkid 
   */
  getWalletBalance: async (vkid) => {
    try {
      const response = await apiClient.get("/wallet-balance", {
        params: { userId: vkid },
        baseURL: import.meta.env.VITE_WALLET_API_BASE_URL,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * For Customer E-Auth Submission
   * @Param {Object} payload { applicationNumber, externalAppRefNumber, latitude, longitude, vkid, aadharNo, bioMetricData, consents[]}
   */
  customerBioAuth: async (payload) => {
    try{
      const response = await apiClient.post("/customer-auth", payload);
      //const response = await axios.post("http://192.168.200.173:8090/customer/customer-auth", payload);
      return response.data;
    } catch(error){
      throw error;
    }
  },

  /**
   * For Final Customer Application Submission
   * @Param {Object} payload whole details
   */
  submitApplication: async (payload) => {
    try {
      const response = await apiClient.post("/submit-application", payload);
      //const response = await axios.post("http://192.168.200.173:8090/customer/submit-application", payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default onboardingService;

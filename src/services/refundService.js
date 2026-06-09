import apiClient from "../utils/apiClient";

const refundService = {
  /**
   * Verifies the voucher and mobile number
   * @param {Object} payload { mobileNumber, voucherCode, latitude, longitude, vkid }
   */
  verifyVoucher: async (payload) => {
    try {
      const response = await apiClient.post("/voucher-verify", payload, {
        baseURL: import.meta.env.VITE_REFUND_API_BASE_URL,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Redeems the verified voucher
   * @param {Object} payload { externalAppRefNumber, applicationNumber, mobileNumber, voucherCode, latitude, longitude, vkid, bioMetricData, consents }
   */
  redeemVoucher: async (payload) => {
    try {
      const response = await apiClient.post("/voucher-redeem", payload, {
        baseURL: import.meta.env.VITE_REFUND_API_BASE_URL,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default refundService;

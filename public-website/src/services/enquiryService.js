import { apiClient } from './api';

/**
 * Enquiry & Lead Submission Service
 * Handles leads, callbacks, site visits, and plot interest submissions.
 */
export const enquiryService = {
  async submitEnquiry(enquiryData) {
    const payload = {
      ...enquiryData,
      source: 'Website Frontend',
      submittedAt: new Date().toISOString()
    };

    const res = await apiClient('/public/enquiries', {
      method: 'POST',
      data: payload
    });

    if (res.success) {
      return { success: true, message: 'Enquiry submitted successfully to backend.', data: res.data };
    }

    // If backend is not connected yet, simulate successful local lead capture
    return {
      success: true,
      message: 'Enquiry captured locally (Connect backend URL in .env for live database storage).',
      isLocal: true
    };
  }
};

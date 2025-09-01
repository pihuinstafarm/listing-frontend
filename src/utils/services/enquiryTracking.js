// Helper function to get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_BASE_URL || 'http://localhost:3001'

/**
 * Service for tracking user enquiries and interactions
 */
class EnquiryTrackingService {
  /**
   * Create a view enquiry entry (Task 3 - Property click tracking)
   * @param {Object} data - The enquiry data
   * @param {string} data.propertyId - Property UUID
   * @param {string} data.eventType - Event type (CONTACT_CLICK, VIEW_PROPERTY, etc.)
   * @param {Object} data.eventMetadata - Optional metadata
   */
  async createViewEnquiry(data) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'X-App-Type': 'listing',
      }

      // Add auth token if available (for logged-in users)
      const token = getAuthToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE_URL}/api/enquiry/view-enquiry`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Failed to create view enquiry:', result)
        return { success: false, error: result.error || 'Failed to track property view' }
      }

      return result
    } catch (error) {
      console.error('Error creating view enquiry:', error)
      return { success: false, error: 'Network error while tracking property view' }
    }
  }

  /**
   * Create a contact enquiry entry (Task 4 - Contact property tracking)
   * @param {Object} data - The contact enquiry data
   * @param {string} data.propertyId - Property UUID
   * @param {number} data.guestSize - Number of guests
   * @param {string} data.gatheringType - Type of gathering (Friends, Wedding, Corporate, Family)
   * @param {string} data.checkInDate - Check-in date (YYYY-MM-DD)
   * @param {string} data.checkOutDate - Check-out date (YYYY-MM-DD)
   */
  async createContactEnquiry(data) {
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('Authentication required for contact enquiry')
      }

      const response = await fetch(`${API_BASE_URL}/api/enquiry/contact-enquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Type': 'listing',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Failed to create contact enquiry:', result)
        return { success: false, error: result.error || 'Failed to track contact enquiry' }
      }

      return result
    } catch (error) {
      console.error('Error creating contact enquiry:', error)
      return { success: false, error: error.message || 'Network error while tracking contact enquiry' }
    }
  }

  /**
   * Track property click with CONTACT_CLICK event type
   * @param {string} propertyId - Property UUID
   * @param {Object} metadata - Optional metadata (source page, etc.)
   */
  async trackPropertyClick(propertyId, metadata = {}) {
    return this.createViewEnquiry({
      propertyId,
      eventType: 'CONTACT_CLICK',
      eventMetadata: {
        source: 'property_click',
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    })
  }


  async logSearchQuery(payload) {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Content-Type': 'application/json',
        'X-App-Type': 'listing',
      }

      // Add authorization header if user is logged in
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/enquiry/search-enquiry`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      })

      return await res.json()
    } catch (error) {
      console.error('Failed to log search query:', error)
      // Return success even if logging fails to not block search functionality
      return { success: true, message: 'Search query logging failed but continuing with search' }
    }
  }

  async updateSearchResults(searchQueryId, totalResults) {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/enquiry/search-enquiry/${searchQueryId}/results`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Type': 'listing',
        },
        body: JSON.stringify({ totalResults }),
      })

      return await res.json()
    } catch (error) {
      console.error('Failed to update search results:', error)
      return { success: false, message: 'Failed to update search results' }
    }
  }
}

export const enquiryTrackingService = new EnquiryTrackingService()
export default enquiryTrackingService

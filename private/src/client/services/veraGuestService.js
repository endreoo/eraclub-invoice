const API_URL = '/api';

export const veraGuestService = {
  async createOrUpdateGuest(guestData) {
    const token = localStorage.getItem('token');
    
    try {
      console.log('🔵 [veraGuestService] Attempting to create/update guest:', guestData);
      
      // Format the data according to API schema
      const formattedData = {
        booking_id: guestData.reservation_number,
        property_name: guestData.hotel,
        check_in_date: guestData.check_in.split('T')[0],
        check_out_date: guestData.check_out.split('T')[0],
        room_type: guestData.room_type,
        guest_name: guestData.name,
        email: guestData.email,
        phone: guestData.phone,
        total_amount: guestData.total_amount,
        invoice_number: guestData.invoice_number
      };
      
      // Try to update first (if we have an ID)
      if (guestData.id) {
        const updateUrl = `${API_URL}/vera/guests/${guestData.id}`;
        console.log(`🔵 [veraGuestService] PUT Request URL:`, updateUrl);
        console.log(`🔵 [veraGuestService] PUT Request Headers:`, {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token?.substring(0, 20)}...`
        });
        console.log('🔵 [veraGuestService] PUT Request Body:', formattedData);
        
        const response = await fetch(updateUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formattedData)
        });
        
        console.log(`🔵 [veraGuestService] Update response status:`, response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('✅ [veraGuestService] Guest updated successfully:', data);
          return data;
        }
      }
      
      // If no ID or update fails, create new record
      const createUrl = `${API_URL}/vera/guests`;
      console.log('🔵 [veraGuestService] POST Request URL:', createUrl);
      console.log('🔵 [veraGuestService] POST Request Headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.substring(0, 20)}...`
      });
      console.log('🔵 [veraGuestService] POST Request Body:', formattedData);
      
      const response = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });
      
      console.log(`🔵 [veraGuestService] Create response status:`, response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [veraGuestService] Failed to create guest:', errorText);
        throw new Error('Failed to create/update guest record');
      }
      
      const data = await response.json();
      console.log('✅ [veraGuestService] Guest created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ [veraGuestService] Error in createOrUpdateGuest:', error);
      throw error;
    }
  },

  async getGuestHistory() {
    const token = localStorage.getItem('token');
    
    try {
      const url = `${API_URL}/vera/guests`;
      console.log('🔵 [veraGuestService] GET Request URL:', url);
      console.log('🔵 [veraGuestService] GET Request Headers:', {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.substring(0, 20)}...`
      });
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(`🔵 [veraGuestService] History response status:`, response.status);
      const responseText = await response.text();
      console.log('🔵 [veraGuestService] Raw response:', responseText);
      
      if (!response.ok) {
        console.error('❌ [veraGuestService] Failed to fetch history:', responseText);
        throw new Error(`Failed to fetch guest history: ${response.status} ${responseText}`);
      }
      
      const data = JSON.parse(responseText);
      console.log('✅ [veraGuestService] History fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ [veraGuestService] Error in getGuestHistory:', error);
      return []; // Return empty array instead of throwing to prevent UI breaks
    }
  }
}; 
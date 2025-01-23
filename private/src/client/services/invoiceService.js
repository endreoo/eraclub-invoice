const API_URL = '/api';

// Helper function to round to nearest .50 or .00
function roundToNearestHalf(num) {
  // Convert to cents to avoid floating point issues
  const cents = Math.round(num * 100);
  // Round to nearest 50 cents
  const roundedCents = Math.round(cents / 50) * 50;
  // Convert back to dollars
  return roundedCents / 100;
}

class InvoiceService {
  async getAllInvoices() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/vera/invoices`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }
    
    return await response.json();
  }

  async getBookingDetails(hotelId, authKey, bookingId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/ezee/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        hotelId,
        authKey,
        bookingId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch booking details');
    }

    const data = await response.json();
    console.log('Raw booking data:', data);

    // Transform eZee API response into expected format
    if (!data?.Reservations?.Reservation || !Array.isArray(data.Reservations.Reservation) || data.Reservations.Reservation.length === 0) {
      throw new Error('No booking found with the provided ID');
    }

    // Process all booking transactions
    const lineItems = data.Reservations.Reservation
      .filter(booking => {
        const bookingTran = booking.BookingTran[0];
        // Check if booking is valid (not cancelled and has a rate)
        const ratePerNight = bookingTran.RentalInfo && Array.isArray(bookingTran.RentalInfo) && bookingTran.RentalInfo.length > 0 
          ? parseFloat(bookingTran.RentalInfo[0].RentPreTax) || 0 
          : parseFloat(bookingTran.RentPreTax) || 0;
        
        return ratePerNight > 0 && bookingTran.Status !== 'Cancelled';
      })
      .map(booking => {
        const bookingTran = booking.BookingTran[0];
        const startDate = new Date(bookingTran.Start);
        const endDate = new Date(bookingTran.End);
        const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        // Get rate per night from RentalInfo
        const ratePerNight = bookingTran.RentalInfo && Array.isArray(bookingTran.RentalInfo) && bookingTran.RentalInfo.length > 0
          ? parseFloat(bookingTran.RentalInfo[0].RentPreTax) || 0
          : parseFloat(bookingTran.RentPreTax) || 0;
        
        // Get main guest details
        const mainGuest = `${bookingTran.Salutation} ${bookingTran.FirstName} ${bookingTran.LastName}`;
        
        // Get sharer details
        const sharers = bookingTran.Sharer && Array.isArray(bookingTran.Sharer)
          ? bookingTran.Sharer.map(s => `${s.Salutation} ${s.FirstName} ${s.LastName}`)
          : [];
        
        // Combine all guests
        const allGuests = [mainGuest, ...sharers].join(', ');
        
        // Create description with all details
        const description = [
          `${bookingTran.RoomTypeName} (Room ${bookingTran.RoomName})`,
          allGuests,
          `Voucher: ${bookingTran.VoucherNo}`
        ].filter(Boolean).join(', ');

        // Format dates for display
        const formatDate = (date) => date.toLocaleDateString('en-GB');
        
        // Calculate total and round only the final amount
        const total = roundToNearestHalf(ratePerNight * nights * 1.15);
        
        return {
          description: description,
          checkIn: formatDate(startDate),
          checkOut: formatDate(endDate),
          nights: nights,
          ratePerNight: ratePerNight,
          vat: 15, // Fixed 15% VAT rate
          total: total
        };
      });

    if (lineItems.length === 0) {
      throw new Error('No valid bookings found for this reservation number');
    }

    // Calculate grand total by summing the already-rounded line totals
    const grandTotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    // Calculate subtotal and VAT from the grand total
    const totalSubtotal = grandTotal / 1.15;
    const totalVAT = grandTotal - totalSubtotal;

    const firstBooking = data.Reservations.Reservation[0];
    const firstBookingTran = firstBooking.BookingTran[0];

    // Format dates for invoice
    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 30);
    const formatDate = (date) => date.toLocaleDateString('en-GB');

    // Return complete invoice data matching InvoiceTemplate format
    return {
      date: formatDate(now),
      dueDate: formatDate(dueDate),
      invoiceNumber: firstBookingTran.VoucherNo,
      reservation: firstBookingTran.VoucherNo,
      items: lineItems,
      subtotal: totalSubtotal,
      vatAmount: totalVAT,
      total: grandTotal,
      property: firstBookingTran.RoomTypeName.includes('Sea View') ? 'Sunset Beach' : 'Zanzibar Village',
      customerName: firstBooking.BookedBy,
      customerEmail: firstBooking.Email || '',
      notes: `Package: ${firstBookingTran.PackageName}`
    };
  }

  async saveInvoice(invoice) {
    const token = localStorage.getItem('token');
    console.log('Saving invoice:', invoice);
    
    const response = await fetch(`${API_URL}/vera/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(invoice)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Failed to save invoice:', errorData);
      throw new Error('Failed to save invoice');
    }

    return await response.json();
  }

  async resendInvoice(invoiceId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/vera/invoices/${invoiceId}/resend`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to resend invoice');
    }

    return await response.json();
  }
}

export const invoiceService = new InvoiceService(); 
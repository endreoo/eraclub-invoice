const pool = require('../config/database');

class InvoiceService {
  async saveOrUpdateGuest(guestData) {
    const connection = await pool.getConnection();
    try {
      // Check if guest exists
      const [existingGuest] = await connection.query(
        'SELECT id FROM vera_guests WHERE booking_id = ?',
        [guestData.booking_id]
      );

      if (existingGuest.length > 0) {
        // Update existing guest
        await connection.query(
          `UPDATE vera_guests SET 
           property_name = ?, check_in_date = ?, check_out_date = ?,
           room_type = ?, room_name = ?, package_name = ?,
           adults = ?, children = ?, booked_by = ?,
           main_guest_salutation = ?, main_guest_first_name = ?,
           main_guest_last_name = ?, total_amount_before_tax = ?,
           total_amount_after_tax = ?, sharer_names = ?
           WHERE booking_id = ?`,
          [
            guestData.property_name, guestData.check_in_date, guestData.check_out_date,
            guestData.room_type, guestData.room_name, guestData.package_name,
            guestData.adults, guestData.children, guestData.booked_by,
            guestData.main_guest_salutation, guestData.main_guest_first_name,
            guestData.main_guest_last_name, guestData.total_amount_before_tax,
            guestData.total_amount_after_tax, guestData.sharer_names,
            guestData.booking_id
          ]
        );
      } else {
        // Insert new guest
        await connection.query(
          `INSERT INTO vera_guests (
            booking_id, property_name, check_in_date, check_out_date,
            room_type, room_name, package_name, adults, children,
            booked_by, main_guest_salutation, main_guest_first_name,
            main_guest_last_name, total_amount_before_tax,
            total_amount_after_tax, sharer_names
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            guestData.booking_id, guestData.property_name, guestData.check_in_date,
            guestData.check_out_date, guestData.room_type, guestData.room_name,
            guestData.package_name, guestData.adults, guestData.children,
            guestData.booked_by, guestData.main_guest_salutation,
            guestData.main_guest_first_name, guestData.main_guest_last_name,
            guestData.total_amount_before_tax, guestData.total_amount_after_tax,
            guestData.sharer_names
          ]
        );
      }
    } finally {
      connection.release();
    }
  }

  async saveOrUpdateInvoice(invoiceData) {
    const connection = await pool.getConnection();
    try {
      // Check if invoice exists
      const [existingInvoice] = await connection.query(
        'SELECT id FROM vera_invoices WHERE booking_id = ?',
        [invoiceData.booking_id]
      );

      if (existingInvoice.length > 0) {
        // Update existing invoice
        await connection.query(
          `UPDATE vera_invoices SET 
           invoice_number = ?, pdf_name = ?, property_name = ?,
           booked_by = ?, check_in_date = ?, check_out_date = ?,
           total_invoice_amount = ?, recipient_email = ?
           WHERE booking_id = ?`,
          [
            invoiceData.invoice_number, invoiceData.pdf_name,
            invoiceData.property_name, invoiceData.booked_by,
            invoiceData.check_in_date, invoiceData.check_out_date,
            invoiceData.total_invoice_amount, invoiceData.recipient_email,
            invoiceData.booking_id
          ]
        );
      } else {
        // Insert new invoice
        await connection.query(
          `INSERT INTO vera_invoices (
            invoice_number, booking_id, pdf_name, property_name,
            booked_by, check_in_date, check_out_date,
            total_invoice_amount, recipient_email
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            invoiceData.invoice_number, invoiceData.booking_id,
            invoiceData.pdf_name, invoiceData.property_name,
            invoiceData.booked_by, invoiceData.check_in_date,
            invoiceData.check_out_date, invoiceData.total_invoice_amount,
            invoiceData.recipient_email
          ]
        );
      }
    } finally {
      connection.release();
    }
  }

  async getAllInvoices() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        `SELECT i.*, g.main_guest_first_name, g.main_guest_last_name, 
         g.room_type, g.package_name, g.sharer_names
         FROM vera_invoices i
         LEFT JOIN vera_guests g ON i.booking_id = g.booking_id
         ORDER BY i.created_at DESC`
      );
      return rows;
    } finally {
      connection.release();
    }
  }
}

module.exports = new InvoiceService(); 
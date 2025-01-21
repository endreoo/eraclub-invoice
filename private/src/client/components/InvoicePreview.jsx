import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { pdf } from '@react-pdf/renderer';
import { InvoiceTemplate } from '../templates/InvoiceTemplate';

function InvoicePreview({ invoice, onClose }) {
  if (!invoice) return null;

  // Transform invoice data to match template format
  const invoiceData = {
    date: new Date(invoice.date).toLocaleDateString('en-GB'),
    dueDate: new Date(invoice.dueDate).toLocaleDateString('en-GB'),
    invoiceNumber: invoice.invoiceNumber,
    reservation: invoice.reservationNumber,
    items: invoice.items.map(item => ({
      description: item.description,
      checkIn: new Date(item.checkIn).toLocaleDateString('en-GB'),
      checkOut: new Date(item.checkOut).toLocaleDateString('en-GB'),
      nights: item.nights,
      ratePerNight: item.ratePerNight,
      vat: 15,
      total: item.total
    })),
    subtotal: invoice.subtotal,
    vatAmount: invoice.tax,
    total: invoice.total
  };

  const handleDownloadPDF = async () => {
    try {
      console.log('Starting PDF generation...');
      const blob = await pdf(<InvoiceTemplate hotel={invoice.property === 'Sunset Beach' ? 'Sunset Beach' : 'Zanzibar Village'} invoiceData={invoiceData} />).toBlob();
      console.log('PDF generated successfully');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoice.invoiceNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleSendEmail = async () => {
    try {
      console.log('Starting email send process...');
      const blob = await pdf(<InvoiceTemplate hotel={invoice.property} invoiceData={invoiceData} />).toBlob();
      console.log('PDF generated for email');
      
      // Get default emails and clean them
      const apiUrl = 'http://37.27.142.148:5171';
      const defaultEmailsResponse = await fetch(`${apiUrl}/settings/emails`, {
        headers: {
          'Accept': 'text/plain',
          'Content-Type': 'text/plain'
        },
        credentials: 'include'
      });
      
      const defaultEmailsText = await defaultEmailsResponse.text();
      const defaultEmails = defaultEmailsText
        .split('\n')
        .map(email => email.trim())
        .filter(email => email && email.includes('@'));
      
      if (defaultEmails.length === 0) {
        throw new Error('No valid email addresses found in settings');
      }
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];
        
        // Send to all recipients from settings
        for (const recipient of defaultEmails) {
          const emailData = {
            to: recipient,
            subject: `Invoice #${invoice.invoiceNumber} from ${invoice.property}`,
            text: `Please find attached your Invoice #${invoice.invoiceNumber}.`,
            attachments: [{
              filename: `invoice-${invoice.invoiceNumber}.pdf`,
              content: base64data,
              encoding: 'base64',
              contentType: 'application/pdf'
            }]
          };

          const response = await fetch('http://37.27.142.148:3000/email/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(emailData)
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }
        }

        console.log('Emails sent successfully to all recipients');
        alert('Emails sent successfully!');
      };
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Action Buttons */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center print:hidden">
        <h2 className="text-xl font-bold text-gray-800">Invoice #{invoice.invoiceNumber}</h2>
        <div className="flex gap-3">
          <button
            id="download-pdf-button"
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download PDF
          </button>
          <button
            onClick={handleSendEmail}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Send Email
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Close
          </button>
        </div>
      </div>

      {/* PDF Preview */}
      <div className="p-4" style={{ height: 'calc(100vh - 100px)' }}>
        <PDFViewer style={{ width: '100%', height: '100%' }}>
          <InvoiceTemplate 
            hotel={invoice.property === 'Sunset Beach' ? 'Sunset Beach' : 'Zanzibar Village'} 
            invoiceData={invoiceData} 
          />
        </PDFViewer>
      </div>
    </div>
  );
}

export default InvoicePreview; 
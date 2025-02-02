import React, { useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import { InvoiceTemplate } from '../templates/InvoiceTemplate';

function EmailDialog({ invoice, onClose, isOpen }) {
  const [defaultEmails, setDefaultEmails] = useState([]);
  const [customEmail, setCustomEmail] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchDefaultEmails();
    }
  }, [isOpen]);

  const fetchDefaultEmails = async () => {
    try {
      const apiUrl = 'http://37.27.142.148:3000';
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const response = await fetch(`${apiUrl}/veraclub/emails`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const emails = await response.json();
        setDefaultEmails(emails);
        setSelectedEmails(emails); // Pre-select default emails
      } else {
        setError('Failed to load email addresses');
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      setError('Failed to load email addresses');
    }
  };

  const handleAddCustomEmail = () => {
    if (customEmail && customEmail.includes('@')) {
      setSelectedEmails(prev => [...prev, customEmail]);
      setCustomEmail('');
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setSelectedEmails(prev => prev.filter(email => email !== emailToRemove));
  };

  const handleSendEmails = async () => {
    if (selectedEmails.length === 0) {
      setError('Please select at least one recipient');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const blob = await pdf(
        <InvoiceTemplate 
          hotel={invoice.property === 'Sunset Beach' ? 'Sunset Beach' : 'Zanzibar Village'}
          invoiceData={{
            date: new Date(invoice.date).toLocaleDateString('en-GB'),
            invoiceNumber: invoice.invoiceNumber,
            reservation: invoice.reservationNumber,
            customerName: invoice.customerName,
            items: invoice.items,
            subtotal: invoice.subtotal,
            vatAmount: invoice.tax,
            total: invoice.total
          }}
        />
      ).toBlob();

      // Convert blob to base64
      const base64data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const apiUrl = 'http://37.27.142.148:3000';
      // Send to all selected recipients
      for (const recipient of selectedEmails) {
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

        const response = await fetch(`${apiUrl}/email/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(emailData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to send email to ${recipient}`);
        }
      }

      alert('Emails sent successfully!');
      onClose();
    } catch (error) {
      console.error('Error sending emails:', error);
      setError(error.message || 'Failed to send emails');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Send Invoice #{invoice.invoiceNumber}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Add custom email */}
        <div className="flex gap-2 mb-4">
          <input
            type="email"
            value={customEmail}
            onChange={(e) => setCustomEmail(e.target.value)}
            placeholder="Add additional email address"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAddCustomEmail}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add
          </button>
        </div>

        {/* Selected emails */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recipients:</h3>
          <div className="space-y-2">
            {selectedEmails.map((email) => (
              <div key={email} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                <span>{email}</span>
                <button
                  onClick={() => handleRemoveEmail(email)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSendEmails}
            disabled={isLoading}
            className={`px-4 py-2 ${isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-lg transition-colors flex items-center gap-2`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              'Send Emails'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailDialog; 
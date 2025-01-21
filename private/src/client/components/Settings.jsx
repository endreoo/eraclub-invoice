import React, { useState, useEffect } from 'react';

function Settings({ isOpen, onClose }) {
  const [emails, setEmails] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const apiUrl = 'http://37.27.142.148:3000';

  useEffect(() => {
    if (isOpen) {
      loadEmails();
    }
  }, [isOpen]);

  const loadEmails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch(`${apiUrl}/veraclub/emails`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        credentials: 'include',
        mode: 'cors'
      });
      if (response.ok) {
        const emails = await response.json();
        console.log('Loaded emails:', emails);
        setEmails(emails.join('\n'));
      } else {
        const error = await response.text();
        console.error('Server error:', error);
      }
    } catch (error) {
      console.error('Failed to load emails:', error);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const emailList = emails.split('\n').map(email => email.trim()).filter(email => email);
      console.log('Saving emails:', emailList);
      
      // First, get existing emails to determine what needs to be added/removed
      const response = await fetch(`${apiUrl}/veraclub/emails`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        credentials: 'include',
        mode: 'cors'
      });
      
      if (response.ok) {
        const existingEmails = await response.json();
        
        // Remove emails that are no longer in the list
        for (const existingEmail of existingEmails) {
          if (!emailList.includes(existingEmail)) {
            await fetch(`${apiUrl}/veraclub/emails/${encodeURIComponent(existingEmail)}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Origin': window.location.origin
              },
              credentials: 'include',
              mode: 'cors'
            });
          }
        }
        
        // Add new emails
        for (const email of emailList) {
          if (!existingEmails.includes(email)) {
            await fetch(`${apiUrl}/veraclub/emails`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Origin': window.location.origin
              },
              body: JSON.stringify({ email }),
              credentials: 'include',
              mode: 'cors'
            });
          }
        }
        
        alert('Email recipients saved!');
        onClose();
      }
    } catch (error) {
      console.error('Failed to save:', error);
      alert(error.message || 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Invoice Recipients</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter email addresses (one per line):
          </label>
          <textarea
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="example@email.com"
          />
          <p className="mt-1 text-sm text-gray-500">These emails will receive all generated invoices</p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings; 
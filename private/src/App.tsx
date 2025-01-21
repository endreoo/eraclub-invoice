import React, { useState, useEffect } from 'react';
import InvoiceList from './components/InvoiceList';
import InvoiceTemplate from './components/InvoiceTemplate';
import LoginForm from './components/LoginForm';
import { Invoice } from './types';
import { hotels } from './data/hotels';
import { generateInvoice } from './services/invoiceGenerator';
import { isAuthenticated, logout } from './lib/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [selectedHotel, setSelectedHotel] = useState(hotels[0].id);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [reservationNumber, setReservationNumber] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  const handleGenerateInvoice = () => {
    setError(null);
    const invoice = generateInvoice(reservationNumber);
    
    if (!invoice) {
      setError(`No reservation found with number ${reservationNumber}`);
      return;
    }

    setInvoices((prev) => [...prev, invoice]);
    setSelectedInvoice(invoice);
    setReservationNumber('');
  };

  const filteredInvoices = invoices.filter(
    (invoice) => invoice.hotelId === selectedHotel
  );

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Veraclub Zanzibar Invoice System
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
          >
            Sign Out
          </button>
        </div>
        <div className="mb-8">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={reservationNumber}
              onChange={(e) => setReservationNumber(e.target.value)}
              placeholder="Enter Reservation Number"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleGenerateInvoice}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Generate Invoice
            </button>
          </div>
          {error && (
            <p className="mt-2 text-red-600">{error}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <InvoiceList
              invoices={filteredInvoices}
              onSelect={setSelectedInvoice}
            />
          </div>
          <div>
            {selectedInvoice && <InvoiceTemplate invoice={selectedInvoice} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
import React from 'react';
import { Invoice } from '../types';
import { hotels } from '../data/hotels';

interface InvoiceTemplateProps {
  invoice: Invoice;
}

export default function InvoiceTemplate({ invoice }: InvoiceTemplateProps) {
  const hotel = hotels.find((h) => h.id === invoice.hotelId);

  if (!hotel) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <img
            src={hotel.logo}
            alt={hotel.companyName}
            className="h-16 w-16 object-contain mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">{hotel.companyName}</h1>
          <p className="text-gray-600">{hotel.location}</p>
          <p className="text-gray-600">Property: {invoice.property}</p>
          <p className="text-gray-600">{hotel.poBox}</p>
          <p className="text-gray-600">TINN: {hotel.tinnNumber}</p>
          <p className="text-gray-600">Registration Number: {hotel.registrationNumber}</p>
          <p className="text-gray-600">{hotel.phone}</p>
          <p className="text-gray-600">Account Number: {hotel.accountNumber}</p>
          <p className="text-gray-600">Swift Code: {hotel.swiftCode}</p>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h2>
          <p className="text-gray-600">Invoice #: {invoice.invoiceNumber}</p>
          <p className="text-gray-600">Reservation #: {invoice.reservationNumber}</p>
          <p className="text-gray-600">Date: {invoice.date}</p>
          <p className="text-gray-600">Due Date: {invoice.dueDate}</p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Bill To:</h3>
        <p className="text-gray-800 font-medium">{invoice.customerName}</p>
        <p className="text-gray-600">{invoice.customerAddress}</p>
        <p className="text-gray-600">{invoice.customerEmail}</p>
      </div>

      {/* Items */}
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-3 px-4">Description</th>
            <th className="text-right py-3 px-4">Quantity</th>
            <th className="text-right py-3 px-4">Unit Price</th>
            <th className="text-right py-3 px-4">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-3 px-4">{item.description}</td>
              <td className="text-right py-3 px-4">{item.quantity}</td>
              <td className="text-right py-3 px-4">
                ${item.unitPrice.toFixed(2)}
              </td>
              <td className="text-right py-3 px-4">${item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-gray-900">${invoice.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Tax:</span>
            <span className="text-gray-900">${invoice.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Notes:</h4>
          <p className="text-gray-600">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
}
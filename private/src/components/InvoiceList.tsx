import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';
import { Invoice } from '../types';

interface InvoiceListProps {
  invoices: Invoice[];
  onSelect: (invoice: Invoice) => void;
}

export default function InvoiceList({ invoices, onSelect }: InvoiceListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {invoices.length === 0 ? (
          <div className="flex items-center justify-center p-6 text-gray-500">
            <AlertCircle className="w-5 h-5 mr-2" />
            No invoices found
          </div>
        ) : (
          invoices.map((invoice) => (
            <div
              key={invoice.id}
              onClick={() => onSelect(invoice)}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.customerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Invoice #{invoice.invoiceNumber}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-sm text-gray-900 mr-4">
                    ${invoice.total.toFixed(2)}
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'overdue'
                          ? 'bg-red-100 text-red-800'
                          : invoice.status === 'sent'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    `}
                  >
                    {invoice.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
import axios from 'axios';

class InvoiceService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}`
      }
    });
  }

  async getAllInvoices() {
    const response = await this.apiClient.get('/invoices');
    return response.data;
  }

  async getInvoiceById(id) {
    const response = await this.apiClient.get(`/invoices/${id}`);
    return response.data;
  }

  async createInvoice(invoiceData) {
    const response = await this.apiClient.post('/invoices', invoiceData);
    return response.data;
  }

  async updateInvoice(id, invoiceData) {
    const response = await this.apiClient.put(`/invoices/${id}`, invoiceData);
    return response.data;
  }
}

export default new InvoiceService(); 
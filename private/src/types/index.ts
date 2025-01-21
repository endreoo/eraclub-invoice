export interface Hotel {
  id: string;
  name: string;
  companyName: string;
  location: string;
  address: string;
  poBox: string;
  tinnNumber: string;
  registrationNumber: string;
  phone: string;
  accountNumber: string;
  swiftCode: string;
  email: string;
  logo: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  reservationNumber: string;
  date: string;
  dueDate: string;
  hotelId: string;
  customerName: string;
  customerAddress: string;
  customerEmail: string;
  property: 'Sunset Beach' | 'Zanzibar Village';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
}

export interface Reservation {
  reservationNumber: string;
  customerName: string;
  customerAddress: string;
  customerEmail: string;
  property: 'Sunset Beach' | 'Zanzibar Village';
  checkIn: string;
  checkOut: string;
  roomType: string;
  numberOfRooms: number;
  numberOfNights: number;
  ratePerNight: number;
  mealPlan: string;
  mealPlanRate: number;
}
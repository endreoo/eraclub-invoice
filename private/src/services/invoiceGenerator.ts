import { Invoice, Reservation } from '../types';
import { hotels } from '../data/hotels';

// Mock reservation data - in a real app, this would come from an API
const mockReservations: Record<string, Reservation> = {
  '618': {
    reservationNumber: '618',
    customerName: 'Hosteda Hotel Srl',
    customerAddress: 'Via Roma 123, Milan, Italy',
    customerEmail: 'booking@hostedahotel.com',
    property: 'Sunset Beach',
    checkIn: '2024-01-20',
    checkOut: '2024-01-25',
    roomType: 'Deluxe Beach Villa',
    numberOfRooms: 1,
    numberOfNights: 5,
    ratePerNight: 300,
    mealPlan: 'Full Board',
    mealPlanRate: 200,
  },
};

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}-${random}`;
}

export function calculateDueDate(date: string): string {
  const dueDate = new Date(date);
  dueDate.setDate(dueDate.getDate() + 30);
  return dueDate.toISOString().split('T')[0];
}

export function generateInvoice(reservationNumber: string): Invoice | null {
  const reservation = mockReservations[reservationNumber];
  
  if (!reservation) {
    return null;
  }

  const roomTotal = reservation.numberOfRooms * reservation.numberOfNights * reservation.ratePerNight;
  const mealPlanTotal = reservation.numberOfRooms * reservation.numberOfNights * reservation.mealPlanRate;
  const subtotal = roomTotal + mealPlanTotal;
  const tax = subtotal * 0.10; // 10% tax rate

  const today = new Date().toISOString().split('T')[0];

  return {
    id: Math.random().toString(36).substr(2, 9),
    invoiceNumber: generateInvoiceNumber(),
    reservationNumber,
    date: today,
    dueDate: calculateDueDate(today),
    hotelId: hotels[0].id,
    customerName: reservation.customerName,
    customerAddress: reservation.customerAddress,
    customerEmail: reservation.customerEmail,
    property: reservation.property,
    items: [
      {
        description: `${reservation.roomType} - ${reservation.numberOfNights} nights`,
        quantity: reservation.numberOfRooms * reservation.numberOfNights,
        unitPrice: reservation.ratePerNight,
        total: roomTotal,
      },
      {
        description: `${reservation.mealPlan} Meal Plan`,
        quantity: reservation.numberOfRooms * reservation.numberOfNights,
        unitPrice: reservation.mealPlanRate,
        total: mealPlanTotal,
      },
    ],
    subtotal,
    tax,
    total: subtotal + tax,
    status: 'draft',
    notes: 'Thank you for choosing Veraclub Zanzibar!',
  };
}
import { Page, Document, StyleSheet, View, Text } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 30,
  },
  companyDetails: {
    lineHeight: 1.5,
    width: '50%',
  },
  companyName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    color: '#111827',
  },
  hotelName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 12,
    color: '#4f46e5',
  },
  invoiceInfo: {
    width: '40%',
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoLabel: {
    color: '#6b7280',
    marginBottom: 6,
    fontSize: 9,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    fontSize: 11,
  },
  table: {
    flexDirection: 'column',
    width: '100%',
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontWeight: 'bold',
    backgroundColor: '#f8fafc',
    color: '#374151',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#374151',
  },
  description: { width: '35%' },
  checkIn: { width: '12%' },
  checkOut: { width: '12%' },
  nights: { width: '10%' },
  rate: { width: '12%', color: '#111827' },
  vat: { width: '9%' },
  total: { width: '10%', fontFamily: 'Helvetica-Bold', color: '#111827' },
  totals: {
    marginTop: 30,
    alignSelf: 'flex-end',
    backgroundColor: '#f8fafc',
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: 300,
  },
  totalRow: {
    flexDirection: 'row',
    marginTop: 8,
    color: '#374151',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
  },
  totalValue: {
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
  },
  grandTotal: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    color: '#111827',
  },
  grandTotalLabel: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
  },
  grandTotalValue: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#4f46e5',
  },
});

interface InvoiceItem {
  description: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  ratePerNight: number;
  vat: number;
  total: number;
}

interface InvoiceData {
  date: string;
  dueDate: string;
  invoiceNumber: string;
  reservation: string;
  items: InvoiceItem[];
  subtotal: number;
  vatAmount: number;
  total: number;
}

interface InvoiceProps {
  hotel: 'Sunset Beach' | 'Zanzibar Village';
  invoiceData: InvoiceData;
}

export const InvoiceTemplate = ({ hotel, invoiceData }: InvoiceProps): JSX.Element => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.topSection}>
        {/* Company Details */}
        <View style={styles.companyDetails}>
          <Text style={styles.companyName}>Veraclub Zanzibar LTD</Text>
          <Text style={styles.hotelName}>{hotel}</Text>
          <Text>Kiwengwa-Zanzibar (Tanzania)</Text>
          <Text>P.O Box 2529</Text>
          <Text>TINN: 300-101-496</Text>
          <Text>Reg No: Z0000007238</Text>
          <Text>Tel: 0779-414986</Text>
          <Text>Account: 0400392000</Text>
          <Text>Swift: PBZATZTZ</Text>
        </View>

        {/* Invoice Info */}
        <View style={styles.invoiceInfo}>
          <View>
            <Text style={styles.infoLabel}>Invoice #</Text>
            <Text style={styles.infoValue}>{invoiceData.invoiceNumber}</Text>
            <Text style={[styles.infoLabel, { marginTop: 8 }]}>Reservation</Text>
            <Text style={styles.infoValue}>{invoiceData.reservation}</Text>
            <Text style={[styles.infoLabel, { marginTop: 8 }]}>Date</Text>
            <Text style={styles.infoValue}>{invoiceData.date}</Text>
            <Text style={[styles.infoLabel, { marginTop: 8 }]}>Due Date</Text>
            <Text style={styles.infoValue}>{invoiceData.dueDate}</Text>
          </View>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.description}>Description</Text>
          <Text style={styles.checkIn}>Check-in</Text>
          <Text style={styles.checkOut}>Check-out</Text>
          <Text style={styles.nights}>Nights</Text>
          <Text style={styles.rate}>Rate/Night</Text>
          <Text style={styles.vat}>VAT</Text>
          <Text style={styles.total}>Total</Text>
        </View>

        {invoiceData.items.map((item: InvoiceItem, index: number) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.checkIn}>{item.checkIn}</Text>
            <Text style={styles.checkOut}>{item.checkOut}</Text>
            <Text style={styles.nights}>{item.nights}</Text>
            <Text style={styles.rate}>${item.ratePerNight.toFixed(2)}</Text>
            <Text style={styles.vat}>{item.vat}%</Text>
            <Text style={styles.total}>${item.total.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Totals Box (Right-aligned) */}
      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>${invoiceData.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>VAT (15%):</Text>
          <Text style={styles.totalValue}>${invoiceData.vatAmount.toFixed(2)}</Text>
        </View>
        <View style={[styles.totalRow, styles.grandTotal]}>
          <Text style={styles.grandTotalLabel}>Total:</Text>
          <Text style={styles.grandTotalValue}>${invoiceData.total.toFixed(2)}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default InvoiceTemplate; 
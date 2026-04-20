import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { 
    padding: 50, // Major page padding
    fontSize: 11, 
    fontFamily: 'Helvetica',
    color: '#1a1a1a' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderBottom: 2, 
    borderBottomColor: '#000', 
    paddingBottom: 20, 
    marginBottom: 30 
  },
  brand: { fontSize: 24, fontWeight: 'bold', letterSpacing: 1 },
  orderMeta: { textAlign: 'right' },
  
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  infoBox: { width: '45%' },
  infoLabel: { fontSize: 9, color: '#666', textTransform: 'uppercase', marginBottom: 5, fontWeight: 'bold' },
  infoText: { fontSize: 11, marginBottom: 2 },

  table: { marginTop: 10 },
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#000', 
    color: '#FFF', 
    padding: 10, 
    fontWeight: 'bold',
    borderRadius: 2
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEE', 
    padding: 10,
    alignItems: 'center'
  },
  
  colProduct: { width: '55%' },
  colQty: { width: '15%', textAlign: 'center' },
  colPrice: { width: '30%', textAlign: 'right' },

  summaryWrapper: { marginTop: 30, flexDirection: 'row', justifyContent: 'flex-end' },
  summaryBox: { 
    width: 200, 
    backgroundColor: '#F9F9F9', 
    padding: 15, 
    borderRadius: 5 
  },
  totalRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10, 
    paddingTop: 10, 
    borderTopWidth: 1, 
    borderTopColor: '#DDD' 
  },
  footer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 50, 
    right: 50, 
    textAlign: 'center', 
    borderTopWidth: 1, 
    borderTopColor: '#EEE', 
    paddingTop: 10, 
    color: '#999', 
    fontSize: 9 
  }
});

const InvoicePDF = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>TRADEXON</Text>
          <Text style={{ fontSize: 9, color: '#666' }}>Official Packing Slip</Text>
        </View>
        <View style={styles.orderMeta}>
          <Text style={{ fontWeight: 'bold' }}>Invoice: {order.orderId}</Text>
          {/* Order Date Added Here */}
          <Text style={{ marginTop: 4 }}>Date: {new Date(order.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}</Text>
        </View>
      </View>

      {/* Addresses */}
      <View style={styles.infoGrid}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Shipping To</Text>
          <Text style={[styles.infoText, { fontWeight: 'bold' }]}>{order.buyer.name}</Text>
          <Text style={styles.infoText}>{order.buyer.address.line1}</Text>
          <Text style={styles.infoText}>{order.buyer.address.city}, {order.buyer.address.postalCode}</Text>
          <Text style={styles.infoText}>Phone: {order.buyer.phone}</Text>
        </View>
        <View style={[styles.infoBox, { textAlign: 'right' }]}>
          <Text style={styles.infoLabel}>Sold By</Text>
          <Text style={[styles.infoText, { fontWeight: 'bold' }]}>{order.sellerName}</Text>
          <Text style={styles.infoText}>{order.sellerEmail}</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.colProduct}>Product Description</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colPrice}>Amount</Text>
        </View>

        {order.items.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <View style={styles.colProduct}>
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
              {item.variations && (
                <Text style={{ fontSize: 8, color: '#666', marginTop: 2 }}>
                  {Object.entries(item.variations).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                </Text>
              )}
            </View>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colPrice}>
              {order.currency} {item.priceLocal.toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      {/* Grand Total */}
      <View style={styles.summaryWrapper}>
        <View style={styles.summaryBox}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#666' }}>Subtotal</Text>
            <Text>{order.currency} {order.totalAmountLocal.toLocaleString()}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={{ fontWeight: 'bold' }}>TOTAL PAID</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
              {order.currency} {order.totalAmountLocal.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Thank you for your business. This is a computer-generated invoice.</Text>
        <Text style={{ marginTop: 2 }}>Support: support@tradexon.com</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
/**
 * Billing History Screen
 * Screen for viewing billing history and invoices
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Share
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Divider,
  Button,
  Chip,
  DataTable,
  Searchbar,
  Menu,
  IconButton,
  List
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../theme/webAppTheme';

// Mock data for billing history
const billingHistory = [
  {
    id: 'INV-001',
    date: '2023-05-01',
    amount: 49.99,
    status: 'Paid',
    paymentMethod: 'Credit Card',
    plan: 'Professional',
    invoiceUrl: 'https://example.com/invoice/INV-001.pdf'
  },
  {
    id: 'INV-002',
    date: '2023-04-01',
    amount: 49.99,
    status: 'Paid',
    paymentMethod: 'Credit Card',
    plan: 'Professional',
    invoiceUrl: 'https://example.com/invoice/INV-002.pdf'
  },
  {
    id: 'INV-003',
    date: '2023-03-01',
    amount: 49.99,
    status: 'Paid',
    paymentMethod: 'Credit Card',
    plan: 'Professional',
    invoiceUrl: 'https://example.com/invoice/INV-003.pdf'
  },
  {
    id: 'INV-004',
    date: '2023-02-01',
    amount: 29.99,
    status: 'Paid',
    paymentMethod: 'PayPal',
    plan: 'Basic',
    invoiceUrl: 'https://example.com/invoice/INV-004.pdf'
  },
  {
    id: 'INV-005',
    date: '2023-01-01',
    amount: 29.99,
    status: 'Paid',
    paymentMethod: 'PayPal',
    plan: 'Basic',
    invoiceUrl: 'https://example.com/invoice/INV-005.pdf'
  }
];

const BillingHistoryScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState(billingHistory);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'amount', 'status'
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  const onChangeSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredInvoices(billingHistory);
      return;
    }
    
    const filtered = billingHistory.filter(invoice => 
      invoice.id.toLowerCase().includes(query.toLowerCase()) ||
      invoice.date.includes(query) ||
      invoice.plan.toLowerCase().includes(query.toLowerCase()) ||
      invoice.status.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredInvoices(filtered);
  };
  
  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortBy(field);
      setSortOrder('desc');
    }
    
    // Sort the invoices
    const sorted = [...filteredInvoices].sort((a, b) => {
      let comparison = 0;
      
      if (field === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (field === 'amount') {
        comparison = a.amount - b.amount;
      } else if (field === 'status') {
        comparison = a.status.localeCompare(b.status);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredInvoices(sorted);
  };
  
  const handleInvoiceAction = (invoice) => {
    setSelectedInvoice(invoice);
    setMenuVisible(true);
  };
  
  const handleViewInvoice = (invoice) => {
    // In a real app, this would open the invoice PDF
    Linking.openURL(invoice.invoiceUrl).catch(() => {
      Alert.alert('Error', 'Could not open the invoice. Please try again later.');
    });
  };
  
  const handleDownloadInvoice = (invoice) => {
    // In a real app, this would download the invoice PDF
    Alert.alert('Download Started', 'Your invoice is being downloaded.');
  };
  
  const handleShareInvoice = async (invoice) => {
    try {
      await Share.share({
        message: `Invoice #${invoice.id} for ${invoice.plan} plan - ${invoice.date} - $${invoice.amount}`,
        url: invoice.invoiceUrl,
        title: `QuickAudit Invoice #${invoice.id}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the invoice. Please try again later.');
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return '#4caf50';
      case 'Pending':
        return '#ff9800';
      case 'Failed':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Billing Summary</Title>
          <Divider style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Current Plan</Text>
              <Text style={styles.summaryValue}>Professional</Text>
              <Chip style={styles.planChip}>$49.99/month</Chip>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Next Billing Date</Text>
              <Text style={styles.summaryValue}>June 1, 2023</Text>
              <Button 
                mode="outlined" 
                compact 
                onPress={() => navigation.navigate('SubscriptionDetails')}
                style={styles.managePlanButton}
              >
                Manage Plan
              </Button>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.paymentMethodCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Payment Method</Title>
          <Divider style={styles.divider} />
          
          <View style={styles.paymentMethodContainer}>
            <Icon name="credit-card" size={24} color={appTheme.colors.primary} style={styles.paymentIcon} />
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentMethodName}>Visa ending in 4242</Text>
              <Text style={styles.paymentMethodExpiry}>Expires 12/24</Text>
            </View>
            <Button 
              mode="text" 
              compact 
              onPress={() => navigation.navigate('PaymentMethod')}
              style={styles.changeButton}
            >
              Change
            </Button>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.historyCard}>
        <Card.Content>
          <View style={styles.historyHeader}>
            <Title style={styles.cardTitle}>Billing History</Title>
            <Searchbar
              placeholder="Search invoices"
              onChangeText={onChangeSearch}
              value={searchQuery}
              style={styles.searchBar}
            />
          </View>
          <Divider style={styles.divider} />
          
          <ScrollView horizontal>
            <DataTable style={styles.dataTable}>
              <DataTable.Header>
                <DataTable.Title 
                  sortDirection={sortBy === 'date' ? sortOrder : null}
                  onPress={() => handleSort('date')}
                  style={styles.dateColumn}
                >
                  Date
                </DataTable.Title>
                <DataTable.Title>Invoice #</DataTable.Title>
                <DataTable.Title>Plan</DataTable.Title>
                <DataTable.Title 
                  numeric 
                  sortDirection={sortBy === 'amount' ? sortOrder : null}
                  onPress={() => handleSort('amount')}
                >
                  Amount
                </DataTable.Title>
                <DataTable.Title 
                  sortDirection={sortBy === 'status' ? sortOrder : null}
                  onPress={() => handleSort('status')}
                >
                  Status
                </DataTable.Title>
                <DataTable.Title>Actions</DataTable.Title>
              </DataTable.Header>
              
              {filteredInvoices.map(invoice => (
                <DataTable.Row key={invoice.id}>
                  <DataTable.Cell style={styles.dateColumn}>{invoice.date}</DataTable.Cell>
                  <DataTable.Cell>{invoice.id}</DataTable.Cell>
                  <DataTable.Cell>{invoice.plan}</DataTable.Cell>
                  <DataTable.Cell numeric>${invoice.amount.toFixed(2)}</DataTable.Cell>
                  <DataTable.Cell>
                    <Chip 
                      style={[
                        styles.statusChip, 
                        { backgroundColor: getStatusColor(invoice.status) }
                      ]}
                      textStyle={styles.statusChipText}
                    >
                      {invoice.status}
                    </Chip>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <IconButton
                      icon="dots-vertical"
                      size={20}
                      onPress={() => handleInvoiceAction(invoice)}
                    />
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </ScrollView>
          
          {filteredInvoices.length === 0 && (
            <View style={styles.emptyContainer}>
              <Icon name="file-search-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No invoices found</Text>
            </View>
          )}
        </Card.Content>
      </Card>
      
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={{ x: 0, y: 0 }}
        style={styles.menu}
      >
        <Menu.Item
          icon="file-document-outline"
          onPress={() => {
            setMenuVisible(false);
            handleViewInvoice(selectedInvoice);
          }}
          title="View Invoice"
        />
        <Menu.Item
          icon="download"
          onPress={() => {
            setMenuVisible(false);
            handleDownloadInvoice(selectedInvoice);
          }}
          title="Download PDF"
        />
        <Menu.Item
          icon="share-variant"
          onPress={() => {
            setMenuVisible(false);
            handleShareInvoice(selectedInvoice);
          }}
          title="Share"
        />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  summaryCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  divider: {
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  planChip: {
    alignSelf: 'flex-start',
    backgroundColor: appTheme.colors.primary,
  },
  managePlanButton: {
    alignSelf: 'flex-start',
  },
  paymentMethodCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentMethodExpiry: {
    fontSize: 14,
    color: '#666',
  },
  changeButton: {
    marginLeft: 8,
  },
  historyCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchBar: {
    marginTop: 8,
    height: 40,
    width: '100%',
  },
  dataTable: {
    minWidth: '100%',
  },
  dateColumn: {
    minWidth: 100,
  },
  statusChip: {
    height: 24,
  },
  statusChipText: {
    fontSize: 10,
    color: '#fff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  menu: {
    width: 200,
  },
});

export default BillingHistoryScreen;
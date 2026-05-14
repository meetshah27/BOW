import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Truck, 
  Search,
  Filter,
  ExternalLink,
  Loader,
  X,
  Package,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import api, { buildApiUrl } from '../../config/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (response.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const searchString = `${order.customerName} ${order.customerEmail} ${order.id}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delivered': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'shipped': return <Truck className="w-4 h-4 mr-1" />;
      case 'delivered': return <Package className="w-4 h-4 mr-1" />;
      case 'pending': return <Clock className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Shop Order Management</h2>
        <p className="text-gray-600">Track and fulfill customer orders from the BOW Shop</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name, email or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="w-full md:w-48 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order Info</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm">#{order.id.substring(0, 8)}</span>
                        <span className="text-xs text-gray-500 flex items-center mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {order.customerName || 'Unknown Customer'}
                          {order.userId && order.userId !== 'guest' && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary-100 text-primary-800">
                              Registered User
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center mt-1">
                          <Mail className="w-3 h-3 mr-1" />
                          {order.customerEmail || 'No email provided'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">${order.totalAmount.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetailModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center justify-end ml-auto"
                      >
                        View Details
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No orders found</p>
                    <p className="text-sm">When customers buy from the shop, their orders will appear here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                <p className="text-xs text-gray-500">Order ID: {selectedOrder.id}</p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-8">
              {/* Order Status Action */}
              <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status) || <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-xs text-primary-700 font-bold uppercase tracking-wider">Current Status</p>
                    <p className="text-lg font-bold text-primary-900 capitalize">{selectedOrder.status}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {selectedOrder.status === 'paid' && (
                    <button
                      disabled={updating}
                      onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-primary-700 transition-all flex items-center"
                    >
                      {updating ? <Loader className="w-4 h-4 animate-spin mr-2" /> : <Truck className="w-4 h-4 mr-2" />}
                      Mark as Shipped
                    </button>
                  )}
                  {selectedOrder.status === 'shipped' && (
                    <button
                      disabled={updating}
                      onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-green-700 transition-all flex items-center"
                    >
                      {updating ? <Loader className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Info */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 flex items-center border-b pb-2">
                    <User className="w-4 h-4 mr-2 text-primary-600" />
                    Customer Information
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-900">
                      {selectedOrder.customerName || 'Unknown Customer'}
                      {selectedOrder.userId && selectedOrder.userId !== 'guest' && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                          Registered User
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Mail className="w-3 h-3 mr-2" />
                      {selectedOrder.customerEmail || 'No email provided'}
                    </p>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-gray-400 font-bold uppercase mb-2">Shipping Address</p>
                      <div className="text-sm text-gray-600 space-y-1">
                        {selectedOrder.shippingAddress ? (
                          <>
                            <p>{selectedOrder.shippingAddress.addressLine1}</p>
                            {selectedOrder.shippingAddress.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                            <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
                            <p>{selectedOrder.shippingAddress.country}</p>
                          </>
                        ) : (
                          <p className="italic text-gray-400">No shipping address provided</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 flex items-center border-b pb-2">
                    <ShoppingBag className="w-4 h-4 mr-2 text-primary-600" />
                    Order Items
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900">{item.name}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {item.size && <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border">Size: {item.size}</span>}
                            {item.color && <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border">Color: {item.color}</span>}
                            <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-primary-600">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="pt-4 border-t flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total Paid</span>
                      <span className="text-xl font-black text-primary-600">${selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button 
                onClick={async () => {
                  try {
                    const response = await api.get(`/orders/${selectedOrder.id}/receipt`);
                    if (response.ok) {
                      const html = await response.text();
                      const receiptWindow = window.open('', '_blank');
                      receiptWindow.document.write(html);
                      receiptWindow.document.close();
                    } else {
                      toast.error('Failed to load receipt');
                    }
                  } catch (error) {
                    console.error('Error loading receipt:', error);
                    toast.error('Failed to load receipt');
                  }
                }}
                className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Receipt
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-8 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;

import React from 'react';
import { Receipt, CreditCard, CheckCircle, Clock, DollarSign } from 'lucide-react';

const PaymentReceipt = ({ 
  paymentAmount, 
  paymentIntentId, 
  paymentStatus, 
  paymentDate, 
  paymentMethod = 'Card',
  isPaidEvent = false,
  showDetails = false 
}) => {
  console.log('PaymentReceipt props:', { 
    paymentAmount, 
    paymentIntentId, 
    paymentStatus, 
    paymentDate, 
    paymentMethod, 
    isPaidEvent, 
    showDetails 
  });
  if (!isPaidEvent || paymentAmount === 0) {
    return (
      <div className="flex items-center text-gray-500">
        <CheckCircle className="w-4 h-4 mr-2" />
        <span className="text-sm">Free Event</span>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <Clock className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case 'completed':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-2">
      {/* Payment Amount */}
      <div className="flex items-center">
        <DollarSign className="w-4 h-4 text-green-600 mr-2" />
        <span className="font-semibold text-gray-900">${paymentAmount}</span>
      </div>

      {/* Payment Status */}
      <div className="flex items-center">
        {getStatusIcon()}
        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {/* Payment Details (if showDetails is true) */}
      {showDetails && (
        <div className="space-y-1 text-xs text-gray-600">
          {paymentIntentId && (
            <div className="flex items-center">
              <Receipt className="w-3 h-3 mr-1" />
              <span>Receipt: {paymentIntentId.slice(-8)}</span>
            </div>
          )}
          {paymentMethod && (
            <div className="flex items-center">
              <CreditCard className="w-3 h-3 mr-1" />
              <span>{paymentMethod}</span>
            </div>
          )}
          {paymentDate && (
            <div className="text-xs text-gray-500">
              {new Date(paymentDate).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentReceipt;

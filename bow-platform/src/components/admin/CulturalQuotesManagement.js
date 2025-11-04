import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Edit3, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Quote,
  X,
  GripVertical,
  CheckCircle
} from 'lucide-react';
import api from '../../config/api';

const CulturalQuotesManagement = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [editingQuote, setEditingQuote] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuote, setNewQuote] = useState({
    text: '',
    author: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cultural-quotes/admin');
      if (response.ok) {
        const data = await response.json();
        setQuotes(data);
      } else {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText || 'Failed to load quotes' };
        }
        setMessage(errorData.error || 'Failed to load cultural quotes');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error fetching cultural quotes:', error);
      setMessage('Failed to load cultural quotes. Please check your connection.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (quote) => {
    try {
      setSaving(true);
      setMessage('');

      const response = await api.put(`/cultural-quotes/${quote.id}`, quote);
      if (response.ok) {
        setMessage('Quote saved successfully!');
        setMessageType('success');
        setEditingQuote(null);
        await fetchQuotes();
      } else {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText || 'Failed to save quote' };
        }
        
        setMessage(errorData.error || 'Failed to save quote');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error saving quote:', error);
      setMessage('Failed to save quote. Please check your connection and try again.');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    try {
      setSaving(true);
      setMessage('');

      const response = await api.post('/cultural-quotes', newQuote);
      if (response.ok) {
        setMessage('Quote added successfully!');
        setMessageType('success');
        setShowAddForm(false);
        setNewQuote({ text: '', author: '', order: 0, isActive: true });
        await fetchQuotes();
      } else {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText || 'Failed to add quote' };
        }
        setMessage(errorData.error || 'Failed to add quote');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error adding quote:', error);
      setMessage('Failed to add quote. Please check your connection and try again.');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quote?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await api.delete(`/cultural-quotes/${id}`);
      if (response.ok) {
        setMessage('Quote deleted successfully!');
        setMessageType('success');
        await fetchQuotes();
      } else {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText || 'Failed to delete quote' };
        }
        
        setMessage(errorData.error || 'Failed to delete quote');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error deleting quote:', error);
      setMessage('Failed to delete quote. Please check your connection and try again.');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (quote) => {
    const updatedQuote = { ...quote, isActive: !quote.isActive };
    await handleSave(updatedQuote);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cultural Quotes Management</h2>
          <p className="text-gray-600 mt-1">Manage the quotes displayed in the Cultural Wisdom section on the homepage</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Quote
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          messageType === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Add New Quote</h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewQuote({ text: '', author: '', order: 0, isActive: true });
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quote Text *
              </label>
              <textarea
                value={newQuote.text}
                onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="3"
                placeholder="Enter the quote text..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                value={newQuote.author}
                onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter the author name..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={newQuote.order}
                onChange={(e) => setNewQuote({ ...newQuote, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
              <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="newQuoteActive"
                checked={newQuote.isActive}
                onChange={(e) => setNewQuote({ ...newQuote, isActive: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="newQuoteActive" className="ml-2 text-sm text-gray-700">
                Active (visible on homepage)
              </label>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                disabled={saving || !newQuote.text || !newQuote.author}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Adding...' : 'Add Quote'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewQuote({ text: '', author: '', order: 0, isActive: true });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quotes List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {quotes.length === 0 ? (
          <div className="p-12 text-center">
            <Quote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No quotes found</p>
            <p className="text-gray-500 text-sm mt-2">Add your first quote to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {quotes.map((quote, index) => (
              <div
                key={quote.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !quote.isActive ? 'opacity-60' : ''
                }`}
              >
                {editingQuote?.id === quote.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quote Text *
                      </label>
                      <textarea
                        value={editingQuote.text}
                        onChange={(e) => setEditingQuote({ ...editingQuote, text: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows="3"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Author *
                      </label>
                      <input
                        type="text"
                        value={editingQuote.author}
                        onChange={(e) => setEditingQuote({ ...editingQuote, author: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={editingQuote.order}
                        onChange={(e) => setEditingQuote({ ...editingQuote, order: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`quoteActive-${quote.id}`}
                        checked={editingQuote.isActive}
                        onChange={(e) => setEditingQuote({ ...editingQuote, isActive: e.target.checked })}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label htmlFor={`quoteActive-${quote.id}`} className="ml-2 text-sm text-gray-700">
                        Active
                      </label>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSave(editingQuote)}
                        disabled={saving || !editingQuote.text || !editingQuote.author}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => setEditingQuote(null)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <GripVertical className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-500">Order: {quote.order}</span>
                        {quote.isActive ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Inactive
                          </span>
                        )}
                      </div>
                      
                      <div className="pl-8">
                        <div className="flex items-start gap-3 mb-2">
                          <Quote className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                          <p className="text-lg text-gray-800 italic">"{quote.text}"</p>
                        </div>
                        <p className="text-sm text-gray-600 ml-8">— {quote.author}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleToggleActive(quote)}
                        className={`p-2 rounded-lg transition-colors ${
                          quote.isActive
                            ? 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                            : 'text-green-600 hover:bg-green-50 hover:text-green-700'
                        }`}
                        title={quote.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {quote.isActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => setEditingQuote({ ...quote })}
                        className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(quote.id)}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CulturalQuotesManagement;


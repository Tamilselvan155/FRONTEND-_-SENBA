'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Plus, CheckCircle, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const AddressStep = ({ onAddressSelect, selectedAddress, onBack }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedAddressLocal, setSelectedAddressLocal] = useState(selectedAddress);
  const [addressForm, setAddressForm] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    isDefault: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserData(user);
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }

      // Fetch fresh user data
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUserData(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const fetchedAddresses = data.data || [];
          setAddresses(fetchedAddresses);
          
          // Auto-select default address locally if exists and no address is selected
          if (!selectedAddressLocal && fetchedAddresses.length > 0) {
            const defaultAddr = fetchedAddresses.find(addr => addr.isDefault);
            if (defaultAddr) {
              setSelectedAddressLocal(defaultAddr);
              // Don't call onAddressSelect here - let user click Continue
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddAddress = () => {
    setShowAddForm(true);
    setAddressForm({
      name: userData?.name || '',
      email: userData?.email || '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'India',
      isDefault: addresses.length === 0, // Set as default if it's the first address
    });
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/addresses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressForm),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Address added successfully');
          setShowAddForm(false);
          fetchAddresses();
          // Select the newly added address
          if (data.data) {
            onAddressSelect(data.data);
          }
        } else {
          toast.error(data.message || 'Failed to add address');
        }
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setSelectedAddressLocal(selectedAddress);
  }, [selectedAddress]);

  const handleSelectAddress = (address) => {
    setSelectedAddressLocal(address);
    onAddressSelect(address);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C2A47] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Delivery Address</h2>
        <p className="text-sm text-gray-600">Select or add a delivery address</p>
      </div>

      {!showAddForm ? (
        <>
          {addresses.length > 0 ? (
            <div className="space-y-4 mb-6">
              {addresses.map((address) => (
                <div
                  key={address._id || address.id}
                  onClick={() => handleSelectAddress(address)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedAddressLocal?._id === address._id || selectedAddressLocal?.id === address.id
                      ? 'border-[#7C2A47] bg-[#7C2A47]/5'
                      : 'border-gray-200 hover:border-[#7C2A47]/50 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-[#7C2A47]" />
                        <h3 className="font-semibold text-gray-900">{address.name}</h3>
                        {address.isDefault && (
                          <span className="text-xs px-2 py-0.5 bg-[#7C2A47] text-white rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{address.street}</p>
                      <p className="text-sm text-gray-700">
                        {address.city}, {address.state} {address.zip}
                      </p>
                      <p className="text-sm text-gray-700">{address.country}</p>
                      <p className="text-sm text-gray-600 mt-1">Phone: {address.phone}</p>
                    </div>
                    {selectedAddressLocal?._id === address._id || selectedAddressLocal?.id === address.id ? (
                      <CheckCircle className="w-6 h-6 text-[#7C2A47] flex-shrink-0" />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 mb-6 bg-gray-50 rounded-lg border border-gray-200">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No addresses found. Please add a delivery address.</p>
            </div>
          )}

          <button
            onClick={handleAddAddress}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-[#7C2A47] hover:border-[#7C2A47] hover:bg-[#7C2A47]/5 transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            Add New Address
          </button>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onBack}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Back
            </button>
            {selectedAddressLocal && (
              <button
                onClick={() => onAddressSelect(selectedAddressLocal)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-[#7C2A47] hover:bg-[#6a2340] rounded-lg transition-colors"
              >
                Continue
              </button>
            )}
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmitAddress} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={addressForm.name}
                onChange={handleAddressChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={addressForm.email}
                onChange={handleAddressChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={addressForm.phone}
                onChange={handleAddressChange}
                required
                maxLength="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="street"
                value={addressForm.street}
                onChange={handleAddressChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={addressForm.city}
                onChange={handleAddressChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={addressForm.state}
                onChange={handleAddressChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="zip"
                value={addressForm.zip}
                onChange={handleAddressChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="country"
                value={addressForm.country}
                onChange={handleAddressChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47]"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isDefault"
              checked={addressForm.isDefault}
              onChange={handleAddressChange}
              className="w-4 h-4 text-[#7C2A47] border-gray-300 rounded focus:ring-[#7C2A47]"
            />
            <label className="ml-2 text-sm text-gray-700">
              Set as default address
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-[#7C2A47] hover:bg-[#6a2340] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddressStep;


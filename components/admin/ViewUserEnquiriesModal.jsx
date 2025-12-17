'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, MessageSquare, MessageCircle, Phone } from 'lucide-react';
import { Table } from 'antd';
import { fetchUserEnquiries } from '@/lib/actions/userActions';

const ViewUserEnquiriesModal = ({ isOpen, onClose, userId, userName }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (isOpen && userId) {
      fetchEnquiriesData();
    } else {
      setEnquiries([]);
      setError(null);
    }
  }, [isOpen, userId]);

  const fetchEnquiriesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchUserEnquiries(userId);
      if (response.success && response.data) {
        setEnquiries(response.data || []);
      } else {
        setEnquiries([]);
      }
    } catch (err) {
      console.error('Error fetching user enquiries:', err);
      setError(err.message || 'Failed to fetch enquiries');
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  // Format enquiries data for table
  const tableData = useMemo(() => {
    return enquiries.map((enquiry, index) => {
      const isWhatsApp = enquiry.contactMethod === 'whatsapp';
      const contactTime = enquiry.createdAt
        ? new Date(enquiry.createdAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'N/A';

      // Get product names
      const productNames = enquiry.items && enquiry.items.length > 0
        ? enquiry.items.map(item => item.name || 'Unknown Product').join(', ')
        : 'N/A';

      return {
        key: enquiry._id || index,
        sn: index + 1,
        date: contactTime,
        contactMethod: enquiry.contactMethod,
        products: productNames,
        items: enquiry.items || [],
        userName: enquiry.userName || 'N/A',
        userMobile: enquiry.userMobile || 'N/A',
        userEmail: enquiry.userEmail || null,
        totalQuantity: enquiry.totalQuantity || 0,
        totalPrice: enquiry.totalPrice || 0,
        status: enquiry.status || 'pending',
        notes: enquiry.notes || null,
      };
    });
  }, [enquiries]);

  // Table columns
  const columns = [
    {
      title: 'S.N.',
      dataIndex: 'sn',
      key: 'sn',
      width: 60,
      align: 'center',
    },
    {
      title: 'Date & Time',
      dataIndex: 'date',
      key: 'date',
      width: 180,
    },
    {
      title: 'Contact Method',
      dataIndex: 'contactMethod',
      key: 'contactMethod',
      width: 140,
      render: (method) => {
        const isWhatsApp = method === 'whatsapp';
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 w-fit ${
              isWhatsApp
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {isWhatsApp ? (
              <>
                <MessageCircle className="w-3 h-3" />
                WhatsApp
              </>
            ) : (
              <>
                <Phone className="w-3 h-3" />
                Add Form
              </>
            )}
          </span>
        );
      },
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      width: 200,
      ellipsis: true,
      render: (text, record) => (
        <div>
          <div className="font-medium text-gray-900">{text}</div>
          {record.items && record.items.length > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              {record.items.length} item{record.items.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
    },
    {
      title: 'Mobile',
      dataIndex: 'userMobile',
      key: 'userMobile',
      width: 120,
    },
    {
      title: 'Quantity',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
      width: 80,
      align: 'center',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 120,
      align: 'right',
      render: (price) => `₹${Number(price || 0).toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${
            status === 'resolved'
              ? 'bg-green-100 text-green-800'
              : status === 'in_progress'
              ? 'bg-blue-100 text-blue-800'
              : status === 'cancelled'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {status || 'pending'}
        </span>
      ),
    },
  ];

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return tableData.slice(start, end);
  }, [tableData, currentPage, pageSize]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-50">
      <div className="bg-white bg-opacity-95 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Enquiries - {userName || 'User'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No enquiries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table
                columns={columns}
                dataSource={paginatedData}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: tableData.length,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50', '100'],
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                  onChange: (page, size) => {
                    setCurrentPage(page);
                    if (size) setPageSize(size);
                  },
                  onShowSizeChange: (current, size) => {
                    setCurrentPage(1);
                    setPageSize(size);
                  },
                }}
                scroll={{ x: 'max-content' }}
                size="middle"
                className="custom-data-table"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserEnquiriesModal;


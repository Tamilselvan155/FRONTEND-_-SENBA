'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Delete', 
  message = 'Are you sure you want to delete this item?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  type = 'danger' // 'danger' or 'warning'
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const bgColor = type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'
  const borderColor = type === 'danger' ? 'border-red-200' : 'border-yellow-200'

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop with blur to obscure table */}
      <div className="fixed inset-0 backdrop-blur-md" />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 relative">
        <div 
          className={`relative bg-white bg-opacity-95 rounded-lg shadow-xl max-w-md w-full`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-gray-700">
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${bgColor}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


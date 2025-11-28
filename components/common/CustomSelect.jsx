'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export default function CustomSelect({ 
    value, 
    onChange, 
    options, 
    placeholder = '--Select--', 
    required = false,
    className = '',
    name = ''
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const dropdownRef = useRef(null)
    const selectRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
                setHighlightedIndex(-1)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen || !options || options.length === 0) return

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault()
                    setHighlightedIndex(prev => 
                        prev < options.length - 1 ? prev + 1 : prev
                    )
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0)
                    break
                case 'Enter':
                    e.preventDefault()
                    if (highlightedIndex >= 0 && highlightedIndex < options.length) {
                        handleSelect(options[highlightedIndex].value)
                    }
                    break
                case 'Escape':
                    setIsOpen(false)
                    setHighlightedIndex(-1)
                    break
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, highlightedIndex, options])

    const handleSelect = (selectedValue) => {
        onChange({ target: { name, value: selectedValue } })
        setIsOpen(false)
        setHighlightedIndex(-1)
    }

    const selectedOption = options?.find(opt => opt.value === value)

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                ref={selectRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-colors cursor-pointer flex items-center justify-between ${className}`}
            >
                <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown 
                    size={16} 
                    className={`text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-[168px] overflow-y-auto" style={{ maxHeight: '168px' }}>
                    {options.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-500">No options available</div>
                    ) : (
                        options.map((option, index) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                                    value === option.value
                                        ? 'bg-blue-50 text-blue-700 font-medium'
                                        : highlightedIndex === index
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {option.label}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}


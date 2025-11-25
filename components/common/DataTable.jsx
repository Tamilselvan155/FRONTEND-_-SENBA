'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Table, Space, Button, Tag, Dropdown, Select, Popover, message } from 'antd';
import { 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  MoreOutlined,
  DownloadOutlined,
  FilterFilled
} from '@ant-design/icons';

// Memoized styles component to prevent forced reflows
const TableStyles = React.memo(() => (
  <style dangerouslySetInnerHTML={{__html: `
    .custom-data-table {
      margin: 0 !important;
    }
    
    .custom-data-table .ant-table {
      margin: 0 !important;
    }
    
    .custom-data-table .ant-table-thead > tr > th {
      padding: 16px 20px !important;
      background: #e5e7eb !important;
      font-weight: 600 !important;
      font-size: 13px !important;
      color: #1f2937 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
      border-bottom: 2px solid #d1d5db !important;
      line-height: 1.5 !important;
    }
    
    .custom-data-table .ant-table-thead > tr > th:first-child {
      padding-left: 24px !important;
    }
    
    .custom-data-table .ant-table-thead > tr > th:last-child {
      padding-right: 24px !important;
    }
    
    .custom-data-table .ant-table-tbody > tr > td {
      padding: 16px 20px !important;
      font-size: 14px !important;
      color: #374151 !important;
      border-bottom: 1px solid #f3f4f6 !important;
      line-height: 1.6 !important;
      vertical-align: middle !important;
    }
    
    .custom-data-table .ant-table-tbody > tr > td:first-child {
      padding-left: 24px !important;
    }
    
    .custom-data-table .ant-table-tbody > tr > td:last-child {
      padding-right: 24px !important;
    }
    
    .custom-data-table .ant-table-tbody > tr:hover > td {
      background: #f9fafb !important;
    }
    
    .custom-data-table .ant-table-tbody > tr:last-child > td {
      border-bottom: none !important;
    }
    
    .custom-data-table .ant-table-pagination {
      margin: 20px 24px !important;
      padding: 0 !important;
    }
    
    .custom-data-table .ant-table-column-sorter {
      margin-left: 8px !important;
    }
    
    .custom-data-table .ant-table-cell {
      text-align: left !important;
    }
    
    .custom-data-table .ant-table-thead > tr > th[align="center"],
    .custom-data-table .ant-table-tbody > tr > td[align="center"] {
      text-align: center !important;
    }
    
    .custom-data-table .ant-table-thead > tr > th[align="right"],
    .custom-data-table .ant-table-tbody > tr > td[align="right"] {
      text-align: right !important;
    }
    
    .custom-data-table .ant-table-cell:last-child {
      text-align: center !important;
    }
    
    .custom-data-table .ant-checkbox-wrapper {
      display: flex !important;
      align-items: center !important;
    }
    
    .custom-data-table .ant-table-cell:last-child .ant-btn,
    .custom-data-table .ant-table-cell:last-child .ant-dropdown-trigger {
      margin: 0 auto;
    }
    
    .custom-data-table .ant-table-cell:last-child {
      white-space: nowrap;
    }
  `}} />
));

/**
 * Fully customizable DataTable component using Ant Design
 * Supports: sorting, filtering, searching, pagination, actions, and custom rendering
 */
const DataTable = ({
  // Data & Columns
  
  columns = [],
  data = [],
  rowKey = 'id',
  
  // Search
  searchPlaceholder = 'Search...',
  enableSearch = true,
  searchFields = [], // Specific fields to search, empty = all
  
  // Pagination
  enablePagination = true,
  pageSize = 10,
  pageSizeOptions = ['10', '20', '50', '100'],
  showSizeChanger = true,
  serverSidePagination = false, // Enable for server-side pagination
  total = 0, // Total items for server-side pagination
  current = 1, // Current page for server-side pagination
  onPaginationChange = null, // Callback: (page, pageSize) => void
  
  // Sorting & Filtering
  enableSorting = true,
  enableFiltering = true,
  defaultSortField = null,
  defaultSortOrder = null,
  serverSide = false, // Enable for server-side search, filter, and sort
  onSearchChange = null, // Callback: (searchText) => void
  onFilterChange = null, // Callback: (filters) => void
  onSortChange = null, // Callback: (field, order) => void
  
  // Actions (backward compatibility)
  onEdit = null,
  onDelete = null,
  onView = null,
  customActions = null, // Custom action buttons (array or function that returns array of { icon, label, onClick, danger, hidden })
  showActions = true,
  
  // Additional Features
  enableRowSelection = false,
  onRowSelectionChange = null,
  enableExport = false,
  onExport = null,
  
  // Styling & Customization
  tableSize = 'middle',
  bordered = false,
  showHeader = true,
  
  // Callbacks
  onRowClick = null,
  rowClassName = null,
  
  // Ant Design Table Props (for advanced customization)
  ...restTableProps
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [columnFilters, setColumnFilters] = useState({}); // { columnKey: filterValue }
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);

  // Memoize callbacks to prevent unnecessary re-renders
  const memoizedOnSearchChange = useCallback((text) => {
    if (onSearchChange) onSearchChange(text);
  }, [onSearchChange]);

  const memoizedOnFilterChange = useCallback((filters) => {
    if (onFilterChange) onFilterChange(filters);
  }, [onFilterChange]);

  const memoizedOnSortChange = useCallback((field, order) => {
    if (onSortChange) onSortChange(field, order);
  }, [onSortChange]);

  // Handle server-side search with debounce
  useEffect(() => {
    if (!serverSide || !onSearchChange) return;
    
    const timeoutId = setTimeout(() => {
      memoizedOnSearchChange(searchText);
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [searchText, serverSide, memoizedOnSearchChange, onSearchChange]);

  // Handle server-side filter changes
  useEffect(() => {
    if (!serverSide || !onFilterChange) return;
    memoizedOnFilterChange(columnFilters);
  }, [columnFilters, serverSide, memoizedOnFilterChange, onFilterChange]);

  // Handle server-side sort changes
  useEffect(() => {
    if (!serverSide || !onSortChange) return;
    if (sortField) {
      memoizedOnSortChange(sortField, sortOrder);
    }
  }, [sortField, sortOrder, serverSide, memoizedOnSortChange, onSortChange]);

  // Memoize sort handler
  const handleSort = useCallback((colKey) => {
    if (sortField === colKey) {
      // Toggle: asc -> desc -> null
      if (sortOrder === 'ascend') {
        setSortOrder('descend');
      } else if (sortOrder === 'descend') {
        setSortField(null);
        setSortOrder(null);
      }
    } else {
      setSortField(colKey);
      setSortOrder('ascend');
    }
  }, [sortField, sortOrder]);

  // Convert custom columns format to Ant Design columns format
  const antdColumns = useMemo(() => {
    return columns.map((col) => {
      const column = {
        title: col.label,
        dataIndex: col.key,
        key: col.key,
        
        // Sorting
        sorter: enableSorting && col.sortable !== false ? (serverSide ? true : (a, b) => {
          const aVal = a[col.key];
          const bVal = b[col.key];
          
          // Handle null/undefined
          if (aVal == null && bVal == null) return 0;
          if (aVal == null) return 1;
          if (bVal == null) return -1;
          
          // Handle numbers
          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return aVal - bVal;
          }
          
          // Handle strings
          return String(aVal).localeCompare(String(bVal));
        }) : false,
        sortOrder: serverSide && sortField === col.key ? sortOrder : null,
        onHeaderCell: serverSide && enableSorting && col.sortable !== false ? () => ({
          onClick: () => handleSort(col.key),
        }) : undefined,
        
        // Custom render function (maintain backward compatibility)
        render: col.render
          ? (text, record) => col.render(text, record)
          : (text) => {
              // Default rendering
              if (text === null || text === undefined) return '-';
              if (typeof text === 'boolean') return text ? 'Yes' : 'No';
              return String(text);
            },
        
        // Filtering - Disabled in column headers (moved to top filter panel)
        filters: null,
        onFilter: null,
        
        // Column width
        width: col.width,
        
        // Column alignment
        align: col.align || 'left',
        
        // Fixed column
        fixed: col.fixed,
        
        // Ellipsis
        ellipsis: col.ellipsis || false,
        
        // Responsive breakpoints
        responsive: col.responsive,
      };
      
      return column;
    });
  }, [columns, enableSorting, enableFiltering, serverSide, sortField, sortOrder, handleSort]);

  // Add Actions column if actions are enabled
  const finalColumns = useMemo(() => {
    // Only show actions if explicitly enabled or if onEdit/onDelete are provided (backward compatibility)
    const hasActions = showActions && (onEdit || onDelete || onView || customActions);
    
    if (!hasActions) {
      return antdColumns;
    }

    const actionsColumn = {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      onCell: () => ({
        onClick: (e) => {
          // Stop propagation to prevent row click navigation
          e.stopPropagation();
        },
      }),
      render: (_, record) => {
        const iconActions = [];
        const dropdownActions = [];

        // Edit as icon button (View is handled by row click)
        if (onEdit) {
          iconActions.push({
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => onEdit(record),
          });
        }

        // Delete goes to dropdown
        if (onDelete) {
          dropdownActions.push({
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {
              onDelete(record);
            },
          });
        }

        // Handle customActions as either an array or a function
        if (customActions) {
          let actions = [];
          if (typeof customActions === 'function') {
            // If it's a function, call it with the record
            actions = customActions(record) || [];
          } else if (Array.isArray(customActions)) {
            // If it's an array, use it directly
            actions = customActions;
          }
          
          actions.forEach((action, index) => {
            // Skip actions that are hidden
            if (action.hidden && typeof action.hidden === 'function' && action.hidden()) {
              return;
            }
            
            // If action has showAsIcon property or is not dangerous, show as icon button
            if (action.showAsIcon || (!action.danger && action.icon)) {
              iconActions.push({
                key: `custom-icon-${index}`,
                label: action.label,
                icon: action.icon,
                onClick: () => action.onClick(record),
                className: action.className,
              });
            } else {
              // Otherwise, add to dropdown
              dropdownActions.push({
                key: `custom-${index}`,
                label: action.label,
                icon: action.icon,
                danger: action.danger,
                onClick: () => action.onClick(record),
              });
            }
          });
        }

        // If no actions, return null
        if (iconActions.length === 0 && dropdownActions.length === 0) {
          return null;
        }

        return (
          <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
            {/* Icon buttons for Edit and custom actions */}
            {iconActions.map(action => (
              <Button
                key={action.key}
                type="text"
                icon={action.icon}
                size="small"
                onClick={action.onClick}
                title={action.label}
                className={`flex items-center justify-center ${action.className || ''}`}
              />
            ))}
            
            {/* Dropdown for Delete and custom actions */}
            {dropdownActions.length > 0 && (
              <Dropdown
                menu={{
                  items: dropdownActions.map(item => ({
                    key: item.key,
                    label: (
                      <Space>
                        {item.icon}
                        <span>{item.label}</span>
                      </Space>
                    ),
                    danger: item.danger,
                    onClick: item.onClick,
                  })),
                }}
                trigger={['click']}
              >
                <Button icon={<MoreOutlined />} size="small" type="text">
                </Button>
              </Dropdown>
            )}
          </div>
        );
      },
    };

    return [...antdColumns, actionsColumn];
  }, [antdColumns, showActions, onEdit, onDelete, onView, customActions]);

  // Get available filter options for each filterable column - memoized
  const getFilterOptions = useCallback((columnKey) => {
    const column = columns.find(col => col.key === columnKey);
    if (column && column.filters) {
      return column.filters.map(f => ({
        label: String(f.text || f),
        value: f.value !== undefined ? f.value : f,
      }));
    }
    
    // Auto-generate filters from unique values
    const uniqueValues = [...new Set(data.map(item => item[columnKey]).filter(Boolean))];
    return uniqueValues.slice(0, 50).map(val => ({
      label: String(val),
      value: val,
    }));
  }, [columns, data]);

  // Get filterable columns - only show columns where filterable is explicitly true or filters are defined
  const filterableColumns = useMemo(() => {
    return columns.filter(col => 
      enableFiltering && 
      (col.filterable === true || (col.filters && col.filters.length > 0))
    );
  }, [columns, enableFiltering]);

  // Filter data based on search text and column filters (client-side only)
  const filteredData = useMemo(() => {
    // If server-side, return data as-is (filtering is done on server)
    if (serverSide) {
      return data;
    }
    
    let filtered = data;

    // Apply search filter
    if (searchText) {
      const fieldsToSearch = searchFields.length > 0 
        ? searchFields 
        : columns.map(col => col.key);

      filtered = filtered.filter((item) => {
        return fieldsToSearch.some((field) => {
          const value = item[field];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchText.toLowerCase());
        });
      });
    }

    // Apply column filters
    Object.entries(columnFilters).forEach(([columnKey, filterValue]) => {
      if (filterValue !== null && filterValue !== undefined && filterValue !== '') {
        filtered = filtered.filter((item) => {
          const recordValue = item[columnKey];
          if (recordValue === null || recordValue === undefined) return false;
          return String(recordValue).toLowerCase().includes(String(filterValue).toLowerCase());
        });
      }
    });

    return filtered;
  }, [searchText, columnFilters, data, columns, searchFields, serverSide]);

  // Handle row selection
  const rowSelection = enableRowSelection
    ? {
        selectedRowKeys,
        onChange: (keys) => {
          setSelectedRowKeys(keys);
          if (onRowSelectionChange) {
            onRowSelectionChange(keys, filteredData.filter(item => keys.includes(item[rowKey])));
          }
        },
        getCheckboxProps: (record) => ({
          name: record.name || record.id,
        }),
      }
    : null;

  // Handle export - memoized
  const handleExport = useCallback(() => {
    if (onExport) {
      onExport(filteredData, selectedRowKeys);
    } else {
      // Default CSV export
      try {
        const headers = columns.map(col => col.label).join(',');
        const rows = filteredData.map(item => {
          return columns.map(col => {
            // Use exportValue if provided, otherwise use render function, otherwise use direct value
            let value;
            if (col.exportValue) {
              value = typeof col.exportValue === 'function' 
                ? col.exportValue(item[col.key], item)
                : col.exportValue;
            } else if (col.render && col.key) {
              // For columns with render functions, try to get a meaningful export value
              // Check if there's a specific export field or use the key value
              value = item[col.key] || '';
            } else {
              value = item[col.key];
            }
            // Format the value for CSV
            const stringValue = value === null || value === undefined ? '' : String(value);
            return typeof stringValue === 'string' && stringValue.includes(',')
              ? `"${stringValue}"`
              : stringValue;
          }).join(',');
        }).join('\n');
        
        const csv = `${headers}\n${rows}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        message.success('Data exported successfully');
      } catch (error) {
        message.error('Failed to export data');
      }
    }
  }, [onExport, filteredData, selectedRowKeys, columns]);

  // Memoize style objects
  const tableStyle = useMemo(() => ({ margin: 0 }), []);
  const rowClickStyle = useMemo(() => ({ cursor: 'pointer' }), []);

  // Memoize row click handler
  const handleRowClick = useCallback((record, event) => {
    // Prevent row click if clicking on action buttons/dropdown
    if (event.target.closest('.ant-dropdown') || 
        event.target.closest('.ant-btn') || 
        event.target.closest('button') ||
        event.target.closest('.ant-dropdown-trigger')) {
      return;
    }
    // If onRowClick is provided, use it; otherwise use onView
    if (onRowClick) {
      onRowClick(record, event);
    } else if (onView) {
      onView(record);
    }
  }, [onRowClick, onView]);

  // Memoize pagination handlers
  const handlePaginationChange = useCallback((page, pageSize) => {
    if (onPaginationChange) {
      onPaginationChange(page, pageSize);
    }
  }, [onPaginationChange]);

  // Table props configuration - memoized
  const tableProps = useMemo(() => {
    const props = {
      columns: finalColumns,
      dataSource: filteredData,
      rowKey: rowKey,
      size: tableSize,
      bordered: bordered,
      showHeader: showHeader,
      rowSelection: rowSelection,
      pagination: enablePagination
        ? {
            pageSize: pageSize,
            current: serverSidePagination ? current : undefined,
            total: serverSidePagination ? total : undefined,
            showSizeChanger: showSizeChanger,
            pageSizeOptions: pageSizeOptions,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            onChange: serverSidePagination ? handlePaginationChange : undefined,
            onShowSizeChange: serverSidePagination ? handlePaginationChange : undefined,
          }
        : false,
      onRow: (onRowClick || onView)
        ? (record) => ({
            onClick: (event) => handleRowClick(record, event),
            style: rowClickStyle,
          })
        : null,
      rowClassName: rowClassName,
      scroll: { x: 'max-content' },
      ...restTableProps,
    };

    // Default sort configuration
    if (defaultSortField && defaultSortOrder) {
      props.defaultSortOrder = defaultSortOrder;
    }

    return props;
  }, [
    finalColumns,
    filteredData,
    rowKey,
    tableSize,
    bordered,
    showHeader,
    rowSelection,
    enablePagination,
    pageSize,
    serverSidePagination,
    current,
    total,
    showSizeChanger,
    pageSizeOptions,
    handlePaginationChange,
    onRowClick,
    onView,
    handleRowClick,
    rowClickStyle,
    rowClassName,
    defaultSortField,
    defaultSortOrder,
    restTableProps
  ]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden m-0">
      {/* Search and Action Bar */}
      {(enableSearch || enableFiltering || enableExport || enableRowSelection) && (
        <div className="p-5 border-b bg-gray-600">
          <Space style={{ width: '100%', justifyContent: 'space-between', margin: 0 }} size="middle" wrap>
            <Space size="middle" wrap>
              {enableSearch && (
                <div className="relative" style={{ width: 300 }}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchOutlined style={{ color: '#ffffff', fontSize: 14 }} />
                  </div>
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-9 pr-9 h-10 rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                    style={{
                      fontSize: '14px',
                      paddingLeft: '36px',
                      paddingRight: searchText ? '32px' : '12px'
                    }}
                  />
                  {searchText && (
                    <button
                      type="button"
                      onClick={() => setSearchText('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/80 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              
              {enableFiltering && filterableColumns.length > 0 && (
                <Popover
                  content={
                    <div style={{ width: 250, maxHeight: 400, overflowY: 'auto' }}>
                      <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        {filterableColumns.map(col => (
                          <div key={col.key} style={{ marginBottom: 12 }}>
                            <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 13, color: '#1f2937' }}>
                              {col.label}
                            </div>
                            <Select
                              placeholder={`All ${col.label}`}
                              allowClear
                              style={{ width: '100%' }}
                              value={columnFilters[col.key] || undefined}
                              onChange={(value) => {
                                setColumnFilters(prev => ({
                                  ...prev,
                                  [col.key]: value || null
                                }));
                              }}
                              options={getFilterOptions(col.key)}
                              showSearch
                              filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                              }
                              size="middle"
                            />
                          </div>
                        ))}
                        <Button
                          type="link"
                          onClick={() => setColumnFilters({})}
                          style={{ padding: 0, fontSize: 12 }}
                          disabled={Object.values(columnFilters).every(v => v === null || v === undefined || v === '')}
                        >
                          Clear all filters
                        </Button>
                      </Space>
                    </div>
                  }
                  title="Filter by Column"
                  trigger="click"
                  placement="bottomLeft"
                >
                  <Button 
                    icon={<FilterFilled />} 
                    size="large"
                    type={Object.values(columnFilters).some(v => v !== null && v !== undefined && v !== '') ? 'primary' : 'default'}
                    style={{
                      backgroundColor: Object.values(columnFilters).some(v => v !== null && v !== undefined && v !== '') ? '#6b7280' : 'rgba(255, 255, 255, 0.2)',
                      borderColor: Object.values(columnFilters).some(v => v !== null && v !== undefined && v !== '') ? '#6b7280' : 'rgba(255, 255, 255, 0.3)',
                      color: '#ffffff'
                    }}
                  >
                    Filters
                    {Object.values(columnFilters).filter(v => v !== null && v !== undefined && v !== '').length > 0 && (
                      <Tag color="#6b7280" style={{ marginLeft: 8, backgroundColor: '#ffffff', color: '#6b7280', border: 'none' }}>
                        {Object.values(columnFilters).filter(v => v !== null && v !== undefined && v !== '').length}
                      </Tag>
                    )}
                  </Button>
                </Popover>
              )}
            </Space>
            
            <Space>
              {enableExport && (
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  disabled={filteredData.length === 0}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: '#ffffff'
                  }}
                >
                  Export
                </Button>
              )}
              {enableRowSelection && selectedRowKeys.length > 0 && (
                <Tag style={{ backgroundColor: '#ffffff', color: '#6b7280', border: 'none' }}>
                  {selectedRowKeys.length} selected
                </Tag>
              )}
            </Space>
          </Space>
          
          {/* Results Count */}
          <div className="mt-3 text-sm text-white" style={{ color: '#ffffff' }}>
            Showing {filteredData.length} of {data.length} results
            {searchText && ` for "${searchText}"`}
            {Object.values(columnFilters).some(v => v !== null && v !== undefined && v !== '') && (
              <span> • Filters applied</span>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      {filteredData.length > 0 ? (
        <div className="p-0">
          <Table
            {...tableProps}
            className="custom-data-table"
            style={tableStyle}
            locale={{
              emptyText: null // Disable Ant Design's default empty state
            }}
          />
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 px-4">
          <SearchOutlined style={{ fontSize: 48, color: '#d1d5db', marginBottom: 16 }} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchText ? 'No results found' : 'No data available'}
          </h3>
          <p className="text-sm text-gray-500">
            {searchText
              ? 'Try adjusting your search terms or filters'
              : 'Get started by adding a new record'}
          </p>
        </div>
      )}

      {/* Styles - memoized to prevent forced reflows */}
      <TableStyles />
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export default React.memo(DataTable);

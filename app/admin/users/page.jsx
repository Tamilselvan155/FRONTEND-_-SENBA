'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import DataTable from "@/components/common/DataTable"
import ConfirmModal from "@/components/common/ConfirmModal"
import ViewUserModal from "@/components/common/ViewUserModal"
import { fetchUsersAsync, deleteUserAsync } from "@/lib/features/user/userSlice"
import toast from "react-hot-toast"

export default function AdminUsers() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { users, loading } = useSelector((state) => state.user)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [viewModalOpen, setViewModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

    useEffect(() => {
        dispatch(fetchUsersAsync())
    }, [dispatch])

    const columns = [
        {
            key: 'sn',
            label: 'S.N.',
            sortable: true,
            width: 80,
        },
        {
            key: 'name',
            label: 'Name',
            sortable: true,
        },
        {
            key: 'email',
            label: 'Email',
            sortable: true,
        },
        {
            key: 'role',
            label: 'Role',
            sortable: true,
            filterable: true,
            filters: [
                { text: 'Admin', value: 'admin' },
                { text: 'User', value: 'user' }
            ],
            render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                    value === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                }`}>
                    {value}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            filterable: true,
            filters: [
                { text: 'Active', value: 'active' },
                { text: 'Inactive', value: 'inactive' }
            ],
            render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                    value === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                }`}>
                    {value}
                </span>
            ),
        },
        {
            key: 'createdAt',
            label: 'Created At',
            sortable: true,
            render: (value) => {
                if (!value) return '-';
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            },
        },
    ]

    const handleEdit = (user) => {
        router.push(`/admin/users/edit/${user.id || user._id}`)
    }

    const handleView = (user) => {
        setSelectedUser(user)
        setViewModalOpen(true)
    }

    const handleDelete = (user) => {
        setSelectedUser(user)
        setDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (selectedUser) {
            try {
                await dispatch(deleteUserAsync(selectedUser.id || selectedUser._id)).unwrap()
                toast.success('User deleted successfully!')
                dispatch(fetchUsersAsync()) // Refresh the list
                setSelectedUser(null)
            } catch (err) {
                toast.error(err || 'Failed to delete user')
            }
        }
    }

    // Format data for table (serial numbers will be calculated by DataTable based on pagination)
    const formattedData = users && Array.isArray(users) ? users.map(user => ({
        ...user,
        id: user.id || user._id,
    })) : []

    // Show loading if we're loading AND there are no users yet
    const isLoading = loading && formattedData.length === 0

    return (
        <div className="space-y-6">
            {isLoading ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={formattedData}
                    rowKey="id"
                    enableSearch={true}
                    searchPlaceholder="Search users..."
                    enablePagination={true}
                    pageSize={10}
                    enableSorting={true}
                    enableFiltering={true}
                    enableExport={true}
                    onEdit={handleEdit}
                    onView={handleView}
                    onDelete={handleDelete}
                    showActions={true}
                />
            )}
            
            <ViewUserModal
                isOpen={viewModalOpen}
                onClose={() => {
                    setViewModalOpen(false)
                    setSelectedUser(null)
                }}
                user={selectedUser}
            />
            
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false)
                    setSelectedUser(null)
                }}
                onConfirm={confirmDelete}
                title="Delete User"
                message={selectedUser ? `Are you sure you want to delete user "${selectedUser.name || selectedUser.email}"? This action cannot be undone.` : 'Are you sure you want to delete this user?'}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    )
}


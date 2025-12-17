'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { ChevronDown } from "lucide-react"
import { fetchUserByIdAsync, updateUserAsync } from "@/lib/features/user/userSlice"
import toast from "react-hot-toast"

export default function EditUserPage() {
    const router = useRouter()
    const params = useParams()
    const dispatch = useDispatch()
    const { currentUser, loading } = useSelector((state) => state.user)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        status: 'active'
    })
    const [showPasswordField, setShowPasswordField] = useState(false)

    useEffect(() => {
        if (params.id) {
            dispatch(fetchUserByIdAsync(params.id))
        }
    }, [params.id, dispatch])

    useEffect(() => {
        if (currentUser) {
            const user = currentUser.data || currentUser;
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '',
                role: user.role || 'user',
                status: user.status || 'active'
            })
        }
    }, [currentUser])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const updateData = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                status: formData.status
            }
            
            // Only include password if it's provided
            if (formData.password && formData.password.trim() !== '') {
                updateData.password = formData.password
            }

            await dispatch(updateUserAsync({ 
                id: params.id, 
                data: updateData
            })).unwrap()
            toast.success('User updated successfully!')
            router.push('/admin/users')
        } catch (err) {
            toast.error(err || 'Failed to update user')
        }
    }

    if (loading && !currentUser) {
        return <div className="p-4 text-center">Loading...</div>
    }

    return (
        <div className="p-4">
            <div className="w-full">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter name"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    {/* Password Field - Optional for update */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPasswordField(!showPasswordField)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                            >
                                {showPasswordField ? 'Cancel' : 'Change Password'}
                            </button>
                        </div>
                        {showPasswordField && (
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter new password (leave blank to keep current)"
                                minLength={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        )}
                        {!showPasswordField && (
                            <p className="text-xs text-gray-500">Click "Change Password" to update password</p>
                        )}
                    </div>

                    {/* Role Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            <ChevronDown 
                                size={16} 
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                        </div>
                    </div>

                    {/* Status Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <ChevronDown 
                                size={16} 
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/users')}
                            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}


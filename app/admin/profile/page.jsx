'use client'

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, Calendar, Clock, CheckCircle, XCircle, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProfile() {
    const router = useRouter();
    const { email } = useSelector((state) => state.auth);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const hasEmail = email && email.trim() !== '';
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
            
            const authenticated = hasEmail || (token !== null && userStr !== null);
            
            if (!authenticated) {
                router.replace('/');
                return;
            }

            // Get user data from localStorage
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    
                    // Check if user is admin
                    if (user.role !== 'admin') {
                        router.replace('/');
                        return;
                    }
                    
                    setUserData(user);
                    setIsAuthenticated(true);
                } catch (e) {
                    console.error('Error parsing user data:', e);
                    router.replace('/');
                }
            } else {
                // Try to fetch from API if not in localStorage
                fetchUserData();
            }
            
            setLoading(false);
        };

        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.replace('/');
                    return;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.user) {
                        if (data.user.role !== 'admin') {
                            router.replace('/');
                            return;
                        }
                        setUserData(data.user);
                        localStorage.setItem('user', JSON.stringify(data.user));
                        setIsAuthenticated(true);
                    }
                } else {
                    router.replace('/');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.replace('/');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [email, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !userData) {
        return null;
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (e) {
            return 'N/A';
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <p className="text-gray-600 mt-1">View and manage your account information</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <User className="w-10 h-10 text-blue-600" />
                        </div>
                        <div className="text-white">
                            <h2 className="text-2xl font-bold">{userData.name || 'Admin User'}</h2>
                            <p className="text-blue-100 mt-1">{userData.email}</p>
                            <div className="flex items-center mt-2">
                                {userData.status === 'active' ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Active
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        <XCircle className="w-3 h-3 mr-1" />
                                        Inactive
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email */}
                        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                                <Mail className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-500">Email Address</p>
                                <p className="text-base text-gray-900 mt-1 break-words">{userData.email}</p>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                                <Shield className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-500">Role</p>
                                <p className="text-base text-gray-900 mt-1 capitalize">{userData.role || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Account Status */}
                        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                                {userData.status === 'active' ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-500">Account Status</p>
                                <p className="text-base text-gray-900 mt-1 capitalize">{userData.status || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Last Login */}
                        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                                <Clock className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-500">Last Login</p>
                                <p className="text-base text-gray-900 mt-1">
                                    {userData.lastLoginAt ? formatDate(userData.lastLoginAt) : 'Never'}
                                </p>
                            </div>
                        </div>

                        {/* Account Created */}
                        {userData.createdAt && (
                            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-shrink-0">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-500">Account Created</p>
                                    <p className="text-base text-gray-900 mt-1">{formatDate(userData.createdAt)}</p>
                                </div>
                            </div>
                        )}

                        {/* User ID */}
                        {userData.id && (
                            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-shrink-0">
                                    <User className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-500">User ID</p>
                                    <p className="text-base text-gray-900 mt-1 font-mono text-sm break-all">{userData.id}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                        <button
                            onClick={() => router.push('/admin/settings')}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Settings
                        </button>
                        <button
                            onClick={() => router.push('/admin')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


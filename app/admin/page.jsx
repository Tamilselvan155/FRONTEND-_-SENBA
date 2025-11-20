'use client'

export default function AdminDashboard() {
    return (
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
                Admin <span className="text-gray-500 font-normal">Dashboard</span>
            </h1>
            <p className="mt-4 text-gray-600 text-base">
                Welcome to the admin panel. Use the sidebar to navigate to different sections.
            </p>
        </div>
    )
}
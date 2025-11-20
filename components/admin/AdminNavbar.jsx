'use client'
import { Home, Bell, MessageSquare, User, Menu } from "lucide-react"

const AdminNavbar = ({ onToggleSidebar }) => {
    return (
        <div className="flex h-14 items-center justify-between px-6 bg-gray-100 border-b border-gray-200">
            <div className="flex items-center gap-3">
                <button 
                    onClick={onToggleSidebar}
                    className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                >
                    <Menu size={20} className="text-gray-700" />
                </button>
            </div>
            <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-200 rounded-md transition-colors">
                    <Home size={20} className="text-gray-700" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-md transition-colors relative">
                    <Bell size={20} className="text-gray-700" />
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">0</span>
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-md transition-colors relative">
                    <MessageSquare size={20} className="text-gray-700" />
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">0</span>
                </button>
                <span className="text-gray-700 font-medium ml-1">Admin</span>
                <button className="p-2 hover:bg-gray-200 rounded-md transition-colors">
                    <User size={20} className="text-gray-700" />
                </button>
            </div>
        </div>
    )
}

export default AdminNavbar
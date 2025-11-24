'use client'
import { useEffect, useState } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { couponDummyData } from "@/assets/assets"
import DataTable from "@/components/common/DataTable"

export default function AdminCoupons() {

    const [coupons, setCoupons] = useState([])

    const [newCoupon, setNewCoupon] = useState({
        code: '',
        description: '',
        discount: '',
        forNewUser: false,
        forMember: false,
        isPublic: false,
        expiresAt: new Date()
    })

    const fetchCoupons = async () => {
        setCoupons(couponDummyData)
    }

    const handleAddCoupon = async (e) => {
        e.preventDefault()
        // Logic to add a coupon
    }

    const handleChange = (e) => {
        setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value })
    }

    const handleDelete = async (coupon) => {
        // Logic to delete a coupon
        console.log('Deleting coupon:', coupon)
    }

    useEffect(() => {
        fetchCoupons();
    }, [])

    const columns = [
        {
            key: 'code',
            label: 'Code',
            sortable: true,
        },
        {
            key: 'description',
            label: 'Description',
            sortable: true,
        },
        {
            key: 'discount',
            label: 'Discount',
            sortable: true,
            render: (value) => `${value}%`,
        },
        {
            key: 'expiresAt',
            label: 'Expires At',
            sortable: true,
            render: (value) => format(new Date(value), 'yyyy-MM-dd'),
        },
        {
            key: 'forNewUser',
            label: 'New User',
            sortable: true,
            filterable: true,
            filters: [
                { text: 'Yes', value: true },
                { text: 'No', value: false }
            ],
            render: (value) => value ? 'Yes' : 'No',
        },
        {
            key: 'forMember',
            label: 'For Member',
            sortable: true,
            filterable: true,
            filters: [
                { text: 'Yes', value: true },
                { text: 'No', value: false }
            ],
            render: (value) => value ? 'Yes' : 'No',
        },
    ]

    return (
        <div className="text-slate-500 mb-40 space-y-6">

            {/* Add Coupon */}
            <form onSubmit={(e) => toast.promise(handleAddCoupon(e), { loading: "Adding coupon..." })} className="max-w-sm text-sm">
                <h2 className="text-2xl">Add <span className="text-slate-800 font-medium">Coupons</span></h2>
                <div className="flex gap-2 max-sm:flex-col mt-2">
                    <input type="text" placeholder="Coupon Code" className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md"
                        name="code" value={newCoupon.code} onChange={handleChange} required
                    />
                    <input type="number" placeholder="Coupon Discount (%)" min={1} max={100} className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md"
                        name="discount" value={newCoupon.discount} onChange={handleChange} required
                    />
                </div>
                <input type="text" placeholder="Coupon Description" className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md"
                    name="description" value={newCoupon.description} onChange={handleChange} required
                />

                <label>
                    <p className="mt-3">Coupon Expiry Date</p>
                    <input type="date" placeholder="Coupon Expires At" className="w-full mt-1 p-2 border border-slate-200 outline-slate-400 rounded-md"
                        name="expiresAt" value={format(newCoupon.expiresAt, 'yyyy-MM-dd')} onChange={handleChange}
                    />
                </label>

                <div className="mt-5">
                    <div className="flex gap-2 mt-3">
                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                            <input type="checkbox" className="sr-only peer"
                                name="forNewUser" checked={newCoupon.forNewUser}
                                onChange={(e) => setNewCoupon({ ...newCoupon, forNewUser: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                            <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                        </label>
                        <p>For New User</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                            <input type="checkbox" className="sr-only peer"
                                name="forMember" checked={newCoupon.forMember}
                                onChange={(e) => setNewCoupon({ ...newCoupon, forMember: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                            <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                        </label>
                        <p>For Member</p>
                    </div>
                </div>
                <button className="mt-4 p-2 px-10 rounded bg-slate-700 text-white active:scale-95 transition">Add Coupon</button>
            </form>

            {/* List Coupons */}
            <div>
                <h2 className="text-2xl mb-4">List <span className="text-slate-800 font-medium">Coupons</span></h2>
                <DataTable
                    columns={columns}
                    data={coupons}
                    rowKey="code"
                    enableSearch={true}
                    searchPlaceholder="Search coupons..."
                    enablePagination={true}
                    pageSize={10}
                    enableSorting={true}
                    enableFiltering={true}
                    enableExport={true}
                    onDelete={handleDelete}
                    showActions={true}
                />
            </div>
        </div>
    )
}

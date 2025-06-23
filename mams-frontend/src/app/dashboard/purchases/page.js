"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';
import PurchaseFormModal from '@/components/purchases/PurchaseFormModal';
import { useAuth } from '@/contexts/AuthContext';

export default function PurchasesPage() {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    // Function to fetch purchases
    const fetchPurchases = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/assets/purchases/');
            setPurchases(response.data);
        } catch (err) {
            console.error("Failed to fetch purchases:", err);
            if (err.response?.status === 401) {
                setError('Authentication required. Please login again.');
            } else {
                setError('Failed to fetch purchase records.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch data if user is authenticated
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
        fetchPurchases();
    }, [isAuthenticated]); // Re-run when authentication status changes

    // Show message if not authenticated
    if (!isAuthenticated) {
        return <div className="text-center p-4">Please login to access purchase history.</div>;
    }

    if (loading) return <div className="text-center p-4">Loading purchase history...</div>;
    if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Purchase History</h1>
                {/* We will add the "Record Purchase" button here in the next step */}
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Equipment
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Base
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Quantity
                            </th>
                             <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Purchase Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.length > 0 ? (
                            purchases.map((purchase) => (
                                <tr key={purchase.id} className="hover:bg-gray-100">
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{purchase.equipment_type.name}</p>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{purchase.base.name}</p>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{purchase.quantity}</p>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            {format(new Date(purchase.purchase_date), 'PPpp')}
                                        </p>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-10 text-gray-500">No purchase records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <PurchaseFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPurchaseCreated={() => {
                    fetchPurchases(); // Re-fetch data when a new purchase is made
                }}
            />
        </div>
    );
}
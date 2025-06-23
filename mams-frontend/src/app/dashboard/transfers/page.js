"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import TransferFormModal from '@/components/transfers/TransferFormModal';
import { useAuth } from '@/contexts/AuthContext';

export default function TransfersPage() {
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchTransfers = async () => {
        try {
            setLoading(true);
            setError(null);
            // Assuming the endpoint is /api/logistics/transfers/
            const response = await api.get('/logistics/transfers/');
            setTransfers(response.data);
        } catch (err) {
            console.error("Failed to fetch transfers:", err);
            if (err.response?.status === 401) {
                setError('Authentication required. Please login again.');
            } else {
                setError('Failed to fetch transfer records.');
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
        fetchTransfers();
    }, [isAuthenticated]); // Re-run when authentication status changes

    // Show message if not authenticated
    if (!isAuthenticated) {
        return <div className="text-center p-4">Please login to access transfer history.</div>;
    }

    if (loading) return <div className="text-center p-4">Loading transfer history...</div>;
    if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Transfer History</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Initiate Transfer
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Equipment</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Movement</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transfers.length > 0 ? (
                            transfers.map((transfer) => (
                                <tr key={transfer.id} className="hover:bg-gray-100">
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                        <p className="text-black whitespace-no-wrap">{transfer.equipment_type.name}</p>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                        <p className="text-black whitespace-no-wrap">{transfer.quantity}</p>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium text-red-600">{transfer.from_base.name}</span>
                                            <ArrowRightIcon className="h-5 w-5 text-gray-500"/>
                                            <span className="font-medium text-green-600">{transfer.to_base.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                        <p className="text-black whitespace-no-wrap">
                                            {format(new Date(transfer.transfer_date), 'PPpp')}
                                        </p>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-10 text-gray-500">No transfer records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <TransferFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTransferCreated={fetchTransfers}
            />
        </div>
    );
}
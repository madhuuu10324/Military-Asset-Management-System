"use client";
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import api from '@/lib/api';

export default function PurchaseFormModal({ isOpen, onClose, onPurchaseCreated }) {
    const [formData, setFormData] = useState({
        equipment_type_id: '',
        base_id: '',
        quantity: '',
        vendor: '',
    });
    const [bases, setBases] = useState([]);
    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [error, setError] = useState(null);

    // Fetch data for dropdowns when the modal opens
    useEffect(() => {
        if (isOpen) {
            const fetchDropdownData = async () => {
                try {
                    const [basesRes, equipmentRes] = await Promise.all([
                        api.get('/users/bases/'),
                        api.get('/assets/equipment-types/')
                    ]);
                    setBases(basesRes.data);
                    setEquipmentTypes(equipmentRes.data);
                } catch (err) {
                    setError("Failed to load form data. Please try again.");
                }
            };
            fetchDropdownData();
        }
    }, [isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await api.post('/assets/purchases/', formData);
            onPurchaseCreated(); // Notify parent to refresh the list
            onClose(); // Close the modal
        } catch (err) {
            console.error("Failed to create purchase:", err.response?.data);
            setError(err.response?.data?.error || "An error occurred.");
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                {/* ... (Modal backdrop styling) ... */}
                 <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                Record New Purchase
                            </Dialog.Title>
                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                <div>
                                    <label htmlFor="equipment_type_id" className="block text-sm font-medium text-gray-700">Equipment Type</label>
                                    <select name="equipment_type_id" value={formData.equipment_type_id} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                        <option value="">Select Equipment</option>
                                        {equipmentTypes.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="base_id" className="block text-sm font-medium text-gray-700">Receiving Base</label>
                                    <select name="base_id" value={formData.base_id} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                        <option value="">Select Base</option>
                                        {bases.map(base => <option key={base.id} value={base.id}>{base.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required min="1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div>
                                    <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">Vendor (Optional)</label>
                                    <input type="text" name="vendor" value={formData.vendor} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>

                                {error && <p className="text-sm text-red-600">{error}</p>}

                                <div className="mt-6 flex justify-end space-x-2">
                                    <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                                    <button type="submit" className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Save Purchase</button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
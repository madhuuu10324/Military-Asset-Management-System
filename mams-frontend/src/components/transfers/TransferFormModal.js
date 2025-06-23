"use client";
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import api from '@/lib/api';

export default function TransferFormModal({ isOpen, onClose, onTransferCreated }) {
    const [formData, setFormData] = useState({
        equipment_type_id: '',
        from_base_id: '',
        to_base_id: '',
        quantity: '',
    });
    const [bases, setBases] = useState([]);
    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [error, setError] = useState(null);

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
                    setError("Failed to load form data.");
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
        if (formData.from_base_id === formData.to_base_id) {
            setError("Source and destination bases cannot be the same.");
            return;
        }
        try {
            await api.post('/logistics/transfers/', formData);
            onTransferCreated();
            onClose();
        } catch (err) {
            console.error("Failed to create transfer:", err.response?.data);
            setError(err.response?.data?.error || "An error occurred during the transfer.");
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                 <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-black">
                                Initiate Asset Transfer
                            </Dialog.Title>
                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                <div>
                                    <label className="text-black">Equipment Type</label>
                                    <select name="equipment_type_id" value={formData.equipment_type_id} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black">
                                        <option value="">Select Equipment</option>
                                        {equipmentTypes.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-black">From Base (Source)</label>
                                    <select name="from_base_id" value={formData.from_base_id} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black">
                                        <option value="">Select Source Base</option>
                                        {bases.map(base => <option key={base.id} value={base.id}>{base.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-black">To Base (Destination)</label>
                                    <select name="to_base_id" value={formData.to_base_id} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black">
                                        <option value="">Select Destination Base</option>
                                        {bases.map(base => <option key={base.id} value={base.id}>{base.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-black">Quantity</label>
                                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required min="1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black" />
                                </div>
                                {error && <p className="text-sm text-red-600">{error}</p>}
                                <div className="mt-6 flex justify-end space-x-2">
                                    <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                                    <button type="submit" className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Initiate Transfer</button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
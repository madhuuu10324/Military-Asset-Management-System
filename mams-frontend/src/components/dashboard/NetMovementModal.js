import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function NetMovementModal({ isOpen, onClose, details }) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                {/* ... (Modal backdrop and panel setup from Headless UI docs) ... */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                Net Movement Details
                            </Dialog.Title>
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between p-2 bg-green-100 rounded">
                                    <span>Purchases</span>
                                    <span className="font-bold">{details.purchases.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between p-2 bg-blue-100 rounded">
                                    <span>Transfers In</span>
                                    <span className="font-bold">{details.transfers_in.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between p-2 bg-red-100 rounded">
                                    <span>Transfers Out</span>
                                    <span className="font-bold">{details.transfers_out.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none" onClick={onClose}>
                                    Close
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
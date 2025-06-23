"use client";
import Link from 'next/link';
import { HomeIcon, TruckIcon, ShoppingCartIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import RoleGuard from '@/components/auth/RoleGuard';


const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER'] },
    { name: 'Purchases', href: '/dashboard/purchases', icon: ShoppingCartIcon, roles: ['ADMIN', 'LOGISTICS_OFFICER'] },
    { name: 'Transfers', href: '/dashboard/transfers', icon: TruckIcon, roles: ['ADMIN', 'LOGISTICS_OFFICER'] },
  ];

export default function Sidebar() {
    const { logout } = useAuth();

    return (
        <aside className="w-64 bg-gray-800 text-white flex flex-col">
            <div className="p-4 border-b border-gray-700">
                <h1 className="text-xl font-bold">MAMS</h1>
            </div>
            <nav className="flex-1 p-2">
                {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                        <div className="flex items-center p-3 rounded-md hover:bg-gray-700 cursor-pointer">
                           <item.icon className="h-6 w-6 mr-3" />
                           {item.name}
                        </div>
                    </Link>
                ))}
            </nav>
            <div className="p-2 border-t border-gray-700">
                 <button onClick={logout} className="w-full flex items-center p-3 rounded-md hover:bg-gray-700">
                    <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-3" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
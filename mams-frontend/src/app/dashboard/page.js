"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import StatCard from '@/components/dashboard/StatCard';
import NetMovementModal from '@/components/dashboard/NetMovementModal';
import RoleGuard from '@/components/auth/RoleGuard';
import { useAuth } from '@/contexts/AuthContext';


export default function DashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        base: '',
        equipment_type: '',
        start_date: '',
        end_date: ''
    });
    const [bases, setBases] = useState([]);
    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (user?.role === 'BASE_COMMANDER') {
            setFilters(prevFilters => ({ ...prevFilters, base: user.base_id }));
        }
    }, [user]);

    useEffect(() => {
        // Only fetch data if user is authenticated
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        const fetchDropdownData = async () => {
            try {
                const [basesRes, equipmentRes] = await Promise.all([
                    api.get('/users/bases/'),
                    api.get('/assets/equipment-types/')
                ]);
                setBases(basesRes.data);
                setEquipmentTypes(equipmentRes.data);
            } catch (err) {
                console.error("Failed to load filter data", err);
                if (err.response?.status === 401) {
                    setError('Authentication required. Please login again.');
                } else {
                    setError('Failed to load filter data.');
                }
            }
        };
        fetchDropdownData();
    }, [isAuthenticated]);

    useEffect(() => {
        // Only fetch dashboard data if user is authenticated
        if (!isAuthenticated) {
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            // Build query params from filter state
            const params = new URLSearchParams();
            if (filters.base) params.append('base', filters.base);
            if (filters.equipment_type) params.append('equipment_type', filters.equipment_type);
            if (filters.start_date) params.append('start_date', filters.start_date);
            if (filters.end_date) params.append('end_date', filters.end_date);
            
            try {
                const response = await api.get(`/assets/dashboard/summary/?${params.toString()}`);
                setData(response.data);
            } catch (err) {
                console.error("Dashboard data fetch error:", err);
                if (err.response?.status === 401) {
                    setError('Authentication required. Please login again.');
                } else {
                    setError('Failed to fetch dashboard data.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filters, isAuthenticated]); // Re-run when filters or authentication status changes

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Show loading while checking authentication
    if (!isAuthenticated) {
        return <div className="text-center">Please login to access the dashboard.</div>;
    }

    if (loading) return <div className="text-center">Loading dashboard...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Commander's Dashboard</h1>
            
            {/* 5. Add filter UI elements */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-white rounded-lg shadow-md">
                {/* Base Filter */}
                <RoleGuard allowedRoles={['ADMIN', 'LOGISTICS_OFFICER']}>
                <div>
                    <label htmlFor="base" className="block text-sm font-medium text-gray-700">Base</label>
                    <select name="base" value={filters.base} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        <option value="">All Bases</option>
                        {bases.map(base => <option key={base.id} value={base.id}>{base.name}</option>)}
                    </select>
                </div>
                </RoleGuard>
                {/* Equipment Filter */}
                <div>
                    <label htmlFor="equipment_type" className="block text-sm font-medium text-black">Equipment</label>
                    <select name="equipment_type" value={filters.equipment_type} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black">
                        <option value="">All Equipment</option>
                        {equipmentTypes.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
                    </select>
                </div>
                {/* Date Filters */}
                <div>
                    <label htmlFor="start_date" className="block text-sm font-medium text-black">Start Date</label>
                    <input type="date" name="start_date" value={filters.start_date} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"/>
                </div>
                 <div>
                    <label htmlFor="end_date" className="block text-sm font-medium text-black">End Date</label>
                    <input type="date" name="end_date" value={filters.end_date} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"/>
                </div>
            </div>

            {loading && <div className="text-center">Loading dashboard...</div>}
            {error && <div className="text-center text-red-500">{error}</div>}
            
            {/* 6. Display data only when not loading and data exists */}
            {!loading && data && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Opening Balance" value={data.opening_balance} />
                        <StatCard title="Closing Balance" value={data.closing_balance} />
                        <StatCard title="Assigned" value={data.assigned} />
                        <StatCard title="Expended" value={data.expended} />
                        <div onClick={() => setIsModalOpen(true)} className="cursor-pointer">
                           <StatCard title="Net Movement (Click for details)" value={data.net_movement.total} />
                        </div>
                    </div>

                    <NetMovementModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)}
                        details={data.net_movement.details}
                    />
                </>
            )}
        </div>
    );
}
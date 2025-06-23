import Link from "next/link";
import { ShieldCheckIcon, CubeIcon, ArrowPathIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Military Asset Management System</h1>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/login" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Military Asset Management
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your military operations with our integrated asset tracking, 
            inventory management, and logistics coordination system.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <CubeIcon className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Asset Inventory</h3>
            <p className="text-gray-600">
              Track equipment types, quantities, and locations across all bases with real-time updates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <ArrowPathIcon className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Transfer Management</h3>
            <p className="text-gray-600">
              Manage asset transfers between bases with automated inventory updates and tracking.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <ChartBarIcon className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Analytics</h3>
            <p className="text-gray-600">
              Monitor asset movements, expenditures, and assignments with comprehensive reporting.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <ShieldCheckIcon className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Role-Based Access</h3>
            <p className="text-gray-600">
              Secure access control with different permissions for admins, commanders, and logistics officers.
            </p>
          </div>
        </div>

        {/* System Flow */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">System Flow</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Purchase Flow */}
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Purchase Assets</h4>
              <p className="text-gray-600 mb-4">
                Record new equipment purchases and automatically update inventory levels.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div>• Equipment type selection</div>
                <div>• Quantity and vendor details</div>
                <div>• Base assignment</div>
                <div>• Automatic inventory update</div>
              </div>
            </div>

            {/* Transfer Flow */}
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-xl">2</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Transfer Assets</h4>
              <p className="text-gray-600 mb-4">
                Move assets between bases with automatic inventory adjustments.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div>• Source and destination bases</div>
                <div>• Quantity validation</div>
                <div>• Transfer status tracking</div>
                <div>• Real-time inventory sync</div>
              </div>
            </div>

            {/* Assignment & Expenditure Flow */}
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-xl">3</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Assign & Expend</h4>
              <p className="text-gray-600 mb-4">
                Assign equipment to personnel and track expenditures for accountability.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div>• Personnel assignment</div>
                <div>• Expenditure tracking</div>
                <div>• Usage documentation</div>
                <div>• Inventory reduction</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Get Started
            <ArrowPathIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">
            © 2024 Military Asset Management System. Secure, reliable, and efficient.
          </p>
        </div>
      </footer>
    </div>
  );
}

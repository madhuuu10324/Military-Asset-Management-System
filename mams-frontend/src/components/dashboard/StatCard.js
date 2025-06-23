export default function StatCard({ title, value }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
    );
}
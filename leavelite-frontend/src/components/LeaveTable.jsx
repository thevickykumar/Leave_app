function StatusBadge({ s }) {
    const map = {
        Pending: 'bg-yellow-100 text-yellow-700',
        Approved: 'bg-green-100 text-green-700',
        Rejected: 'bg-red-100 text-red-700',
    };
    return <span className={`px-2 py-1 rounded-full text-xs ${map[s]}`}>{s}</span>;
}


export default function LeaveTable({ rows, actionCol }) {
    return (
        <div className="card overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                    <tr>
                        <th className="p-3 text-left">Employee</th>
                        <th className="p-3 text-left">Type</th>
                        <th className="p-3 text-left">Dates</th>
                        <th className="p-3 text-left">Days</th>
                        <th className="p-3 text-left">Status</th>
                        {actionCol && <th className="p-3" />}
                    </tr>
                </thead>
                <tbody>
                    {rows.map(r => (
                        <tr key={r.id} className="border-t">
                            <td className="p-3">{r.employee_name || 'Me'}</td>
                            <td className="p-3">{r.type}</td>
                            <td className="p-3">{r.start_date} → {r.end_date}</td>
                            <td className="p-3">{r.days}</td>
                            <td className="p-3"><StatusBadge s={r.status} /></td>
                            {actionCol && <td className="p-3">{actionCol(r)}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
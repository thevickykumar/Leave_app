export default function BalanceCards({ balances }) {
    const tone = (t) => t === 'Vacation' ? 'bg-blue-50' : t === 'Sick' ? 'bg-rose-50' : 'bg-gray-50';
    return (
        <div className="grid sm:grid-cols-3 gap-4">
            {balances.map(b => (
                <div key={b.type} className={`card p-4 ${tone(b.type)}`}>
                    <div className="text-xs text-gray-500">{b.type}</div>
                    <div className="text-2xl font-semibold mt-1">{Number(b.balance)}</div>
                    <div className="text-xs text-gray-400">days remaining</div>
                </div>
            ))}
        </div>
    );
}
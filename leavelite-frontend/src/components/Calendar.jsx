import { useEffect, useMemo, useState } from 'react';


export default function Calendar({ events, month, onMonthChange }) {
    // Internal month cursor if parent doesn't control it
    const [internalMonth, setInternalMonth] = useState(() => month || new Date().toISOString().slice(0, 7));


    // Keep internal in sync if parent controls month
    useEffect(() => { if (month) setInternalMonth(month); }, [month]);


    const viewMonth = month || internalMonth; // YYYY-MM


    function shiftMonth(delta) {
        const d = new Date(viewMonth + '-01');
        d.setMonth(d.getMonth() + delta);
        const next = d.toISOString().slice(0, 7);
        if (onMonthChange) onMonthChange(next); else setInternalMonth(next);
    }


    const ref = useMemo(() => {
        const base = new Date(viewMonth + '-01');
        const y = base.getFullYear();
        const m = base.getMonth();
        const first = new Date(y, m, 1);
        const last = new Date(y, m + 1, 0);
        const startDay = first.getDay(); // 0 Sun .. 6 Sat
        const days = last.getDate();
        return { y, m, first, last, startDay, days };
    }, [viewMonth]);

    const cells = [];
    for (let i = 0; i < ref.startDay; i++) cells.push(null);
    for (let d = 1; d <= ref.days; d++) cells.push(new Date(ref.y, ref.m, d));


    const norm = (s) => String(s).slice(0, 10); // 'YYYY-MM-DD' from date or datetime string
    function fmt(d) { return d.toISOString().slice(0, 10); }
    function overlapsDay(d, ev) {
        const a = norm(ev.start_date || ev.start || ev.startDate);
        const b = norm(ev.end_date || ev.end || ev.endDate);
        const x = fmt(d);
        return x >= a && x <= b;
    }


    return (
        <div className="card p-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Calendar — {ref.y}-{String(ref.m + 1).padStart(2, '0')}</h3>
                <div className="flex items-center gap-2">
                    <button className="btn btn-ghost" onClick={() => shiftMonth(-1)} aria-label="Previous month">‹</button>
                    <button className="btn btn-ghost" onClick={() => shiftMonth(1)} aria-label="Next month">›</button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2 mt-3 text-center text-xs text-gray-500">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 mt-2">
                {cells.map((d, i) => (
                    <div key={i} className={`min-h-[80px] rounded-xl border p-2 text-xs ${d ? 'bg-white' : 'bg-transparent border-0'}`}>
                        {d && <div className="text-gray-500">{d.getDate()}</div>}
                        {d && (
                            <div className="mt-1 space-y-1">
                                {events.filter(ev => overlapsDay(d, ev)).slice(0, 3).map(ev => (
                                    <div key={ev.id} className="truncate rounded-md px-2 py-1 bg-blue-100 text-blue-700">
                                        {ev.employee_name || 'Me'} — {ev.type}
                                    </div>
                                ))}
                                {events.filter(ev => overlapsDay(d, ev)).length > 3 && (
                                    <div className="text-[10px] text-gray-400">+ more…</div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
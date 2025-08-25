import { useState } from 'react';
import api from '../api';


export default function LeaveForm({ onCreated }) {
const [type, setType] = useState('Vacation');
const [start, setStart] = useState('');
const [end, setEnd] = useState('');
const [reason, setReason] = useState('');
const [loading, setLoading] = useState(false);


async function submit(e) {
e.preventDefault();
setLoading(true);
try {
await api.post('/leave', { type, start, end, reason });
setReason(''); setStart(''); setEnd(''); setType('Vacation');
onCreated?.();
} catch (e) { alert(e.response?.data?.error || 'Failed'); }
finally { setLoading(false); }
}


return (
<form onSubmit={submit} className="card p-4 grid sm:grid-cols-5 gap-3">
<label className="block">
<div className="text-sm text-gray-700">Type</div>
<select className="mt-1 h-10 w-full rounded-xl border px-3" value={type} onChange={e=>setType(e.target.value)}>
<option>Vacation</option>
<option>Sick</option>
<option>Unpaid</option>
</select>
</label>
<label className="block">
<div className="text-sm text-gray-700">Start</div>
<input type="date" className="mt-1 h-10 w-full rounded-xl border px-3" value={start} onChange={e=>setStart(e.target.value)} required/>
</label>
<label className="block">
<div className="text-sm text-gray-700">End</div>
<input type="date" className="mt-1 h-10 w-full rounded-xl border px-3" value={end} onChange={e=>setEnd(e.target.value)} required/>
</label>
<label className="block sm:col-span-2">
<div className="text-sm text-gray-700">Reason</div>
<input className="mt-1 h-10 w-full rounded-xl border px-3" placeholder="Optional" value={reason} onChange={e=>setReason(e.target.value)} />
</label>
<div className="sm:col-span-5 flex justify-end">
<button className="btn btn-primary" disabled={loading}>Submit Request</button>
</div>
</form>
);
}
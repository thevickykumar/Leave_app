// import { useEffect, useState } from 'react';
// import api from '../api';
// import Topbar from '../components/Topbar';
// import LeaveTable from '../components/LeaveTable';
// import Calendar from '../components/Calendar';


// export default function ManagerDashboard() {
//     const [pending, setPending] = useState([]);
//     const [events, setEvents] = useState([]);


//     async function refresh() {
//         const [p, c] = await Promise.all([
//             api.get('/leave/pending'),
//             api.get('/leave/calendar')
//         ]);
//         setPending(p.data); setEvents(c.data);
//     }
//     useEffect(() => { refresh(); }, []);


//     async function decide(id, status) {
//         const comment = status === 'Rejected' ? prompt('Reason? (optional)') : '';
//         await api.post(`/leave/${id}/decision`, { status, comment });
//         await refresh();
//     }


//     return (
//         <div className="min-h-screen bg-gray-50">
//             <Topbar />
//             <div className="p-4 grid gap-4 max-w-6xl mx-auto">
//                 <div className="grid lg:grid-cols-2 gap-4">
//                     <Calendar events={events} />
//                     <div className="space-y-2">
//                         <h3 className="text-lg font-semibold">Pending Approvals</h3>
//                         <LeaveTable rows={pending} actionCol={(r) => (
//                             <div className="flex gap-2 justify-end">
//                                 <button className="btn btn-ghost" onClick={() => decide(r.id, 'Rejected')}>Reject</button>
//                                 <button className="btn btn-primary" onClick={() => decide(r.id, 'Approved')}>Approve</button>
//                             </div>
//                         )} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
import { useEffect, useState } from 'react';
import api from '../api';
import Topbar from '../components/Topbar';
import LeaveTable from '../components/LeaveTable';
import Calendar from '../components/Calendar';


export default function ManagerDashboard() {
    const [pending, setPending] = useState([]);
    const [events, setEvents] = useState([]);
    const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));


    async function refreshPending() {
        const { data } = await api.get('/leave/pending');
        setPending(data);
    }
    async function refreshCalendar() {
        const { data } = await api.get('/leave/calendar', { params: { month } });
        setEvents(data);
    }


    useEffect(() => { refreshPending(); }, []);
    useEffect(() => { refreshCalendar(); }, [month]);


    async function decide(id, status) {
        const comment = status === 'Rejected' ? prompt('Reason? (optional)') : '';
        await api.post(`/leave/${id}/decision`, { status, comment });
        await Promise.all([refreshPending(), refreshCalendar()]);
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <Topbar />
            <div className="p-4 grid gap-4 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-4">
                    <Calendar events={events} month={month} onMonthChange={setMonth} />
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Pending Approvals</h3>
                        <LeaveTable rows={pending} actionCol={(r) => (
                            <div className="flex gap-2 justify-end">
                                <button className="btn btn-ghost" onClick={() => decide(r.id, 'Rejected')}>Reject</button>
                                <button className="btn btn-primary" onClick={() => decide(r.id, 'Approved')}>Approve</button>
                            </div>
                        )} />
                    </div>
                </div>
            </div>
        </div>
    );
}
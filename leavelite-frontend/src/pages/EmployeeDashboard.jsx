// import { useEffect, useState } from 'react';
// import api from '../api';
// import Topbar from '../components/Topbar';
// import BalanceCards from '../components/BalanceCards';
// import LeaveForm from '../components/LeaveForm';
// import LeaveTable from '../components/LeaveTable';
// import Calendar from '../components/Calendar';


// export default function EmployeeDashboard() {
//     const [balances, setBalances] = useState([]);
//     const [mine, setMine] = useState([]);
//     const [events, setEvents] = useState([]);


//     async function refresh() {
//         const [b, r, c] = await Promise.all([
//             api.get('/balances/mine'),
//             api.get('/leave/mine'),
//             api.get('/leave/calendar')
//         ]);
//         setBalances(b.data); setMine(r.data); setEvents(c.data);
//     }
//     useEffect(() => { refresh(); }, []);


//     return (
//         <div className="min-h-screen bg-gray-50">
//             <Topbar />
//             <div className="p-4 grid gap-4 max-w-6xl mx-auto">
//                 <BalanceCards balances={balances} />
//                 <LeaveForm onCreated={refresh} />
//                 <div className="grid lg:grid-cols-2 gap-4">
//                     <Calendar events={events} />
//                     <div className="space-y-2">
//                         <h3 className="text-lg font-semibold">My Requests</h3>
//                         <LeaveTable rows={mine} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

import { useEffect, useState } from 'react';
import api from '../api';
import Topbar from '../components/Topbar';
import BalanceCards from '../components/BalanceCards';
import LeaveForm from '../components/LeaveForm';
import LeaveTable from '../components/LeaveTable';
import Calendar from '../components/Calendar';


export default function EmployeeDashboard() {
    const [balances, setBalances] = useState([]);
    const [mine, setMine] = useState([]);
    const [events, setEvents] = useState([]);
    const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7)); // YYYY-MM


    async function refreshStatic() {
        const [b, r] = await Promise.all([
            api.get('/balances/mine'),
            api.get('/leave/mine'),
        ]);
        setBalances(b.data); setMine(r.data);
    }


    async function refreshCalendar() {
        const { data } = await api.get('/leave/calendar', { params: { month } });
        setEvents(data);
    }


    useEffect(() => { refreshStatic(); }, []);
    useEffect(() => { refreshCalendar(); }, [month]);


    return (
        <div className="min-h-screen bg-gray-50">
            <Topbar />
            <div className="p-4 grid gap-4 max-w-6xl mx-auto">
                <BalanceCards balances={balances} />
                <LeaveForm onCreated={() => { refreshStatic(); refreshCalendar(); }} />
                <div className="grid lg:grid-cols-2 gap-4">
                    <Calendar events={events} month={month} onMonthChange={setMonth} />
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">My Requests</h3>
                        <LeaveTable rows={mine} />
                    </div>
                </div>
            </div>
        </div>
    );
}
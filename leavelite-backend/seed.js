const { pool } = require('./db');
const bcrypt = require('bcryptjs');


async function run() {
    const pw = await bcrypt.hash('password123', 10);


    // Create a manager
    const [mgr] = await pool.query(
        'INSERT INTO users(name,email,password_hash,role) VALUES (?,?,?,"manager")',
        ['Bob Chen', 'bob@demo.com', pw]
    );


    // Two employees under Bob
    const [e1] = await pool.query(
        'INSERT INTO users(name,email,password_hash,role,manager_id) VALUES (?,?,?,?,?)',
        ['Alice Johnson', 'alice@demo.com', pw, 'employee', mgr.insertId]
    );
    const [e2] = await pool.query(
        'INSERT INTO users(name,email,password_hash,role,manager_id) VALUES (?,?,?,?,?)',
        ['Samir Patel', 'samir@demo.com', pw, 'employee', mgr.insertId]
    );


    // Seed balances
    async function seedBalances(userId, vac = 15, sick = 8) {
        await pool.query('INSERT INTO leave_balances(user_id,type,balance) VALUES (?,?,?),(?,?,?),(?,?,?)',
            [userId, 'Vacation', vac, userId, 'Sick', sick, userId, 'Unpaid', 999]);
    }
    await seedBalances(mgr.insertId, 20, 10);
    await seedBalances(e1.insertId);
    await seedBalances(e2.insertId, 12, 10);


    // Example approved request for calendar
    await pool.query(
        'INSERT INTO leave_requests(employee_id,type,start_date,end_date,days,reason,status,manager_id,manager_comment,decided_at) VALUES (?,?,?,?,?,?,?,?,?,NOW())',
        [e1.insertId, 'Vacation', '2025-08-25', '2025-08-27', 3, 'Short break', 'Approved', mgr.insertId, 'enjoy!']
    );


    console.log('Seed complete. Users:');
    console.log('- Manager: bob@demo.com / password123');
    console.log('- Employee: alice@demo.com / password123');
    console.log('- Employee: samir@demo.com / password123');
    process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
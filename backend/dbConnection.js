import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const pool = mysql.createPool({
    host:process.env.MYSQLHOST,
    user:process.env.MYSQLUSER,
    password:process.env.MYSQLPASSWORD,
    database:process.env.MYSQLDATABASE,
    port:process.env.MYSQLPORT,
    connectionLimit:10,
    queueLimit:0,
    waitForConnections:true
})


export default pool; // ✅ Export pool for reuse

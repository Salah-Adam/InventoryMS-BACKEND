import mysql from 'mysql2';
import bcrypt from 'bcrypt';

import pool from '../dbConnection.js';

// for creating a new User
export async function createUser({ user_name, phone, password, role }) {
    const [result] = await pool.query(
        'INSERT INTO users (user_name, phone, password, role) VALUES (?, ?, ?, ?)',
        [user_name, phone, password, role]
    );
    return result;
}

// for the login part
export async function findUserByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_name = ?', [username]);
    // console.log(rows)
    return rows; // Assuming username is unique
}

export async function findUserById(id) {
    // console.log("user id", id);
  const [rows] = await pool.query(
    'SELECT id, user_name, role FROM users WHERE id = ?',
    [id]
  );
  return rows;
}

// for reading all users from the DB
export async function getAllUsers() {
    const [users] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    return users;
}

// for searching users by thier user name or phone
export async function findUserByUsernameOrPhone(identifier) {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE user_name = ? OR phone like ?',
        [identifier, identifier]
    );
    return rows;
}

// update user data
export async function updateUser(id, { user_name, phone, role, password }) {
    let query = 'UPDATE users SET user_name = ?, phone = ?, role = ?';
    const params = [user_name, phone, role];

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query += ', password = ?';
        params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await pool.query(query, params);
    return result;
}


// for activating and deactiving the user
export async function toggleUserStatus(userId) {
    const [rows] = await pool.query('SELECT is_active FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) throw new Error('User not found');

    const currentStatus = rows[0].is_active;
    const newStatus = currentStatus === 1 ? 0 : 1;

    await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, userId]);

    return newStatus;
}

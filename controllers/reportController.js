// controllers/reportController.js


import {
getReport, getLoans
    } from '../models/reportDB.js';



// Get report
export async function findReport(req, res) {
try {
    const report = await getReport();
    res.json(report);
} catch (err) {
    res.status(500).json({ error: err.message });
}
}

// Get loan
export async function findLoan(req, res) {
try {
    const loan = await getLoans();
    res.json(loan);
} catch (err) {
    res.status(500).json({ error: err.message });
}
}
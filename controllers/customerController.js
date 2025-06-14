// controllers/CustomerController.js

import {
    createCustomer,
    getAllCustomers,
    findCustomerById,
    findCustomerByName,
    findCustomerByPhone,
    updateCustomer
    } from '../models/customerDB.js';
    
    // Create a new customer
    export async function addCustomer(req, res) {
    try {
        const { full_name, phone_number, created_by } = req.body;
        await createCustomer({ full_name, phone_number, created_by });
        res.json({ message: 'Customer created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    }
    
    // Get all customer
    export async function getCustomers(req, res) {
    try {
        const customers = await getAllCustomers();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    }
    
    // Update a customer
    export async function updateCustomerController(req, res) {
    try {
        const { customer_id } = req.params;
        const { full_name, phone_number} = req.body;
        await updateCustomer(customer_id, { full_name, phone_number});
        res.json({ message: 'Customer updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    }
    

    // Find a customer by name
    export async function getCustomerByName(req, res) {
    try {
        const { name } = req.params;
        const customer = await findCustomerByName(name);
        if (customer.length === 0) {
        return res.status(404).json({ message: 'customer not found' });
        }
        res.json(customer); // Return only the first match
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    }


        // Find a customer by id
    export async function getCustomerById(req, res) {
    try {
        const { customer_id } = req.params;
        const customer = await findCustomerById(customer_id);
        if (customer.length === 0) {
        return res.status(404).json({ message: 'customer not found' });
        }
        res.json(customer[0]); // Return only the first match
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    }

        // Find a customer by phone Number
    export async function getCustomerByPhone(req, res) {
    try {
        const { phone_number } = req.params;
        const customer = await findCustomerByPhone(phone_number);
        if (customer.length === 0) {
        return res.status(404).json({ message: 'customer not found' });
        }
        res.json(customer[0]); // Return only the first match
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    }

// Importing the database connection utility
const { getConnection } = require('../../db');

class orderModel {

    // Method to create a new order
    createOrder(userId, items, address, payment) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection
                await connection.beginTransaction(); // Start a transaction

                // Calculate the total cost of the order
                let total = 0;
                for (const item of items) {
                    // Fetch the price of each item from the database
                    const [rows] = await connection.execute('SELECT price FROM items WHERE id = ?', [item.product_id]);
                    if (rows.length === 0) {
                        throw new Error(`Item ID ${item.product_id} not found`); // Throw an error if the item doesn't exist
                    }
                    total += rows[0].price * item.quantity; // Add the item's cost to the total
                }

                // Insert the order into the orders table
                const [orderResult] = await connection.execute(
                    'INSERT INTO orders (user_id, total, status, street, city, postal, Payment) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [userId, total, 'pending',  address.street, address.city, address.postal, payment] // Default status is 'pending'
                );
                const orderId = orderResult.insertId; // Get the ID of the newly created order

                // Insert each item into the order_items table
                for (const item of items) {
                    const [rows] = await connection.execute('SELECT price FROM items WHERE id = ?', [item.product_id]);
                    await connection.execute(
                        'INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)',
                        [orderId, item.product_id, item.quantity, rows[0].price]
                    );
                }

                await connection.commit(); // Commit the transaction
                await connection.end(); // Close the database connection
                resolve({ orderId, total }); // Resolve the promise with the order ID and total cost
            } catch (error) {
                await connection.rollback(); // Roll back the transaction in case of an error
                await connection.end(); // Close the database connection
                console.error('Error creating order:', error); // Log the error
                reject(error); // Reject the promise with the error
            }
        });
    }

    // Method to fetch the cart data for a specific user by their user ID
    showCartbyUserID(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection
                const [rows] = await connection.execute('SELECT * FROM orders WHERE user_id = ?', [userId]); // Fetch orders for the user
                await connection.end(); // Close the database connection
                resolve(rows); // Resolve the promise with the fetched rows
            } catch (error) {
                console.error('Error fetching cart:', error); // Log the error
                reject(error); // Reject the promise with the error
            }
        });
    }

    showCartbyID(Id) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection
                // const [rows] = await connection.execute('SELECT * FROM orders WHERE id = ?', [Id]); // Fetch orders for the user
                const [rows] = await connection.execute('SELECT o.*, u.username FROM orders o JOIN users u on o.user_id = u.id WHERE o.id = ?', [Id]);
                await connection.end(); // Close the database connection
                resolve(rows); // Resolve the promise with the fetched rows
            } catch (error) {
                console.error('Error fetching cart:', error); // Log the error
                reject(error); // Reject the promise with the error
            }
        });
    }


    // Method to fetch all orders from the database
    showAllOrders() {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection
                const [rows] = await connection.execute('SELECT * FROM orders'); // Fetch all orders
                await connection.end(); // Close the database connection
                resolve(rows); // Resolve the promise with the fetched rows
            } catch (error) {
                console.error('Error fetching all orders:', error); // Log the error
                reject(error); // Reject the promise with the error
            }
        });
    }

    // Method to fetch orders along with user details
    getOrders() {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection
                const sql = `
                    SELECT o.*, u.username
                    FROM orders o
                    JOIN users u ON o.user_id = u.id
                    ORDER BY o.created_at DESC
                `; // SQL query to fetch orders with user details
                const [rows] = await connection.execute(sql); // Execute the query
                await connection.end(); // Close the database connection
                resolve(rows); // Resolve the promise with the fetched rows
            } catch (error) {
                console.error('Error fetching orders:', error); // Log the error
                reject(error); // Reject the promise with the error
            }
        });
    }

    updateOrderStatus(orderId, status) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection();
                const sql = 'UPDATE orders SET status = ? WHERE id = ?';
                const [result] = await connection.execute(sql, [status, orderId]);
                await connection.end();
                resolve(result);
            } catch (error) {
                console.error('Error updating order status:', error);
                reject(error);
            }
        });
    }
    CancelOrder(orderId) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection
                const sql = 'UPDATE orders SET status = ? WHERE id = ?'; // SQL query to update the order status
                const [result] = await connection.execute(sql, ['cancelled', orderId]); // Execute the query to cancel the order
                await connection.end(); // Close the database connection
                resolve(result); // Resolve the promise with the result
            } catch (error) {
                console.error('Error cancelling order:', error); // Log the error
                reject(error); // Reject the promise with the error
            }
        });
    }
    deleteOrder(orderId) {
        return new Promise(async (resolve, reject) => {
            let connection;
            try {
                connection = await getConnection(); // Establish a database connection
                await connection.beginTransaction(); // Start a transaction

                // Delete all items for this order
                await connection.execute('DELETE FROM order_items WHERE order_id = ?', [orderId]);
                // Delete the order itself
                const [result] = await connection.execute('DELETE FROM orders WHERE id = ?', [orderId]);

                await connection.commit(); // Commit the transaction
                await connection.end(); // Close the database connection
                resolve(result); // Resolve the promise with the result
            } catch (error) {
                if (connection) {
                    await connection.rollback();
                    await connection.end();
                }
                console.error('Error deleting order:', error);
                reject(error);
            }
        });
    }
}

// Exporting the orderModel class for use in other parts of the application
module.exports = orderModel;
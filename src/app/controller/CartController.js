// Importing the CartModel to interact with the cart data in the database
const CartModel = require('../models/orderModel');

class CartController {

    // [GET] /item/create - Display the user's cart
    async showcart(req, res, next) {
        try {
             if (!req.session.user) {
            return res.redirect('/login'); // Redirect to login if not logged in
        }

        // Prevent admins from accessing the user homepage
        if (req.session.user.isAdmin) {
            return res.redirect('/admin'); // Redirect admins to the admin dashboard
        }
            // Extract the user ID from the session
            const userId = req.session.user.id;

            // Instantiate the CartModel to interact with the cart data
            const cartModel = new CartModel();

            // Fetch the cart data for the logged-in user
            const cart = await cartModel.showCartbyUserID(userId);
            console.log(req.path);
            console.log(req.session.user.username);
            // Render the cart view with the fetched cart data
            res.render('order/cart', {
                currentPath: req.originalUrl,
                layout: 'user', // Use the user layout
                cart: cart, // Pass the cart data to the view
                username: req.session.user.username // Pass the username to the view
            });
        } catch (err) {
            // Log any errors that occur
            console.log(err);
        }
    }
    // [DELETE] /cart/delete/:id - Delete an item from the cart
    deleteItem(req, res, next) {
        try {
            // Check if the user is logged in
            if (!req.session.user) {
                return res.redirect('/login'); // Redirect to login if not logged in
            }

            // Extract the item ID from the request parameters
            const itemId = req.params.id;
            
            // Instantiate the CartModel to interact with the cart data
            const cartModel = new CartModel();

            // Delete the item from the cart using the CartModel method
            cartModel.deleteOrder(itemId)
                .then(() => {
                    // Redirect back to the cart page after deletion
                    res.redirect('/cart');
                })
                .catch(err => {
                    console.error('Error deleting item:', err);
                    res.status(500).send('Internal server error'); // Return a 500 error response
                });
        } catch (err) {
            console.error('Error in deleteItem:', err);
            res.status(500).send('Internal server error'); // Return a 500 error response
        }
    }

    
}

// Exporting an instance of the CartController class
module.exports = new CartController();
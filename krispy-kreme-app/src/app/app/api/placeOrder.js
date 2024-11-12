// Import database connection and models
import dbConnect from '../../src/lib/mongodb';
import Order from '../../src/models/Order';
import User from '../../src/models/User';
import Product from '../../src/models/Product';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method === 'POST') {
    try {
      // Connect to the database
      await dbConnect();

      // Extract order details from the request body
      const { userId, products } = req.body;

      // Verify that user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Calculate the total cost of the order
      let totalCost = 0;
      const orderItems = await Promise.all(
        products.map(async (item) => {
          const product = await Product.findById(item.productId);
          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
          }
          totalCost += product.price * item.quantity;
          return {
            product_id: product._id,
            quantity: item.quantity,
          };
        })
      );

      // Create a new order
      const newOrder = new Order({
        user_id: user._id,
        products: orderItems,
        total_cost: totalCost,
      });

      // Save the order to the database
      const savedOrder = await newOrder.save();

      // Send a success response with the saved order details
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ error: 'Failed to place order' });
    }
  } else {
    // Respond with a 405 Method Not Allowed if not a POST request
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

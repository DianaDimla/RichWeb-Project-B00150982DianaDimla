// Import database connection and Product model
import dbConnect from '../../src/lib/mongodb';
import Product from '../../src/models/Product';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method === 'GET') {
    try {
      // Connect to the database
      await dbConnect();

      // Fetch all products from the database
      const products = await Product.find({});

      // Send the products back as JSON
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else {
    // Respond with a 405 Method Not Allowed if not a GET request
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

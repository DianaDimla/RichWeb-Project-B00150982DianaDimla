import dbConnect from '../../lib/mongodb';
import User from '../../models/User';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();

    const { name, email, password_hash } = req.body;

    const user = new User({
      name,
      email,
      password_hash,
    });

    try {
      const savedUser = await user.save();
      res.status(201).json(savedUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

import express from 'express';
import Transaction from '../models/Transaction.js';

const router = express.Router();

router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .limit(50)
      .sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
});

export default router;

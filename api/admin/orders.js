export default async function handler(req, res) {
  const firebaseUrl = process.env.FIREBASE_PROJECT_ID;

  if (req.method === 'GET') {
    try {
      const response = await fetch(firebaseUrl + '/orders.json');
      if (!response.ok) {
        throw new Error('Failed to fetch orders from Firebase');
      }

      const data = await response.json();
      const result = data
        ? Object.entries(data).map(([id, order]) => ({ id, ...order }))
        : [];

      return res.status(200).json(result);
    } catch (err) {
      console.error('Fetch orders error:', err);
      return res.status(500).json({ error: 'Failed to load orders' });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Missing order ID' });
    }

    try {
      const deleteUrl = `${firebaseUrl}/orders/${id}.json`;
      const deleteRes = await fetch(deleteUrl, { method: 'DELETE' });

      if (!deleteRes.ok) {
        throw new Error('Delete failed');
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Delete order error:', err);
      return res.status(500).json({ error: 'Failed to delete order' });
    }
  }

  res.setHeader('Allow', ['GET', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}

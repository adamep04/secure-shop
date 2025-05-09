export default async function handler(req, res) {
  const baseUrl = process.env.FIREBASE_PROJECT_ID;

  switch (req.method) {
    case 'GET': {
      try {
        const response = await fetch(`${baseUrl}/products.json`);
        const data = await response.json();
        return res.status(200).json(data);
      } catch (err) {
        console.error('GET error:', err);
        return res.status(500).json({ success: false, error: 'Failed to load products' });
      }
    }

    case 'POST': {
      try {
        const { name, price, count } = req.body;
        if (!name || isNaN(price) || isNaN(count)) {
          return res.status(400).json({ success: false, error: 'Invalid data' });
        }

        const response = await fetch(`${baseUrl}/products.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, price, count })
        });

        if (!response.ok) throw new Error('Failed to create product');

        const result = await response.json();
        return res.status(201).json({ success: true, id: result.name });

      } catch (err) {
        console.error('POST error:', err);
        return res.status(500).json({ success: false, error: 'Failed to add product' });
      }
    }

    case 'PUT': {
      try {
        const { id, name, price, count } = req.body;
        if (!id || !name || isNaN(price) || isNaN(count)) {
          return res.status(400).json({ success: false, error: 'Invalid data' });
        }

        const response = await fetch(`${baseUrl}/products/${id}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, price, count })
        });

        return res.status(200).json({ success: response.ok });

      } catch (err) {
        console.error('PUT error:', err);
        return res.status(500).json({ success: false, error: 'Failed to update product' });
      }
    }

    case 'DELETE': {
      try {
        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, error: 'Missing product ID' });
        }

        const response = await fetch(`${baseUrl}/products/${id}.json`, {
          method: 'DELETE'
        });

        return res.status(200).json({ success: response.ok });

      } catch (err) {
        console.error('DELETE error:', err);
        return res.status(500).json({ success: false, error: 'Failed to delete product' });
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }
}

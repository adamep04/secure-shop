export default async function handler(req, res) {
  try {
    const { address, items } = req.body;

<<<<<<< HEAD
    const firebaseUrl = process.env.FIREBASE_PROJECT_ID+'/orders.json';

    const response = await fetch(firebaseUrl, {
=======
    if (!address || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid order data' });
    }

    const baseUrl = process.env.FIREBASE_PROJECT_ID;

    // Načtení všech produktů z Firebase
    const productsRes = await fetch(baseUrl + '/products.json');
    const products = await productsRes.json();

    if (!products) {
      return res.status(500).json({ success: false, error: 'Failed to load product list' });
    }

    // Kontrola dostupnosti
    for (const item of items) {
      const product = products[item.id];
      if (!product) {
        return res.status(400).json({ success: false, error: `Product ${item.name} not found.` });
      }
      if (product.count < item.count) {
        return res.status(400).json({ success: false, error: `Not enough stock for ${item.name}.` });
      }
    }

    // Odečet zásob (pomocí PATCH pro každý produkt)
    for (const item of items) {
      const product = products[item.id];
      const newCount = product.count - item.count;

      const updateRes = await fetch(`${baseUrl}/products/${item.id}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: newCount })
      });

      if (!updateRes.ok) {
        return res.status(500).json({ success: false, error: `Failed to update stock for ${item.name}` });
      }
    }

    // Zapsání objednávky
    const orderRes = await fetch(baseUrl + '/orders.json', {
>>>>>>> 1b82b36 (update)
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address,
        items,
        date: new Date().toISOString()
      })
    });

<<<<<<< HEAD
    if (!response.ok) {
      throw new Error('Failed to write to Firebase');
    }

    const result = await response.json();
    res.status(200).json({ success: true, id: result.name }); // result.name = ID objednávky
  } catch (err) {
    console.error('Order error:', err);
    res.status(500).json({ error: 'Failed to submit order' });
  }
}
=======
    if (!orderRes.ok) {
      throw new Error('Failed to write order to Firebase');
    }

    const result = await orderRes.json();
    res.status(200).json({ success: true, id: result.name });

  } catch (err) {
    console.error('Order error:', err);
    res.status(500).json({ success: false, error: 'Failed to submit order' });
  }
}
>>>>>>> 1b82b36 (update)

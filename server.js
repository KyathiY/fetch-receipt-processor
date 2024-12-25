const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(express.json());

// In-memory storage for receipts
const receipts = {};

// Helper function to calculate points
const calculatePoints = (receipt) => {
  let points = 0;

  points += (receipt.retailer.match(/[a-zA-Z0-9]/g) || []).length;
   
    if (parseFloat(receipt.total) % 1 === 0) {
    points += 50;
   }

 
    if (parseFloat(receipt.total) % 0.25 === 0) {
    points += 25;
   }

  points += Math.floor(receipt.items.length / 2) * 5;
  receipt.items.forEach(item => {
    const trimmedDescription = item.shortDescription.trim();
     if (trimmedDescription.length % 3 === 0) {
      points += Math.ceil(parseFloat(item.price) * 0.2);
     }
  });


  const day = new Date(receipt.purchaseDate).getDate();
   if (day % 2 !== 0) {
    points += 6;
   }

  const [hour, minute] = receipt.purchaseTime.split(":").map(Number);
   if (hour === 14 || (hour === 15 && minute === 0)) {
    points += 10;
   }

  return points;
};

// Endpoint to process receipts
app.post('/receipts/process', (req, res) => {
  const receipt = req.body;
  const id = uuidv4();
  const points = calculatePoints(receipt);

  // Store receipt with calculated points
  receipts[id] = points;

  res.status(200).json({ id });
});

// Endpoint to get points for a receipt
app.get('/receipts/:id/points', (req, res) => {
  const { id } = req.params;

  if (!receipts[id]) {
    return res.status(404).json({ error: 'Receipt not found' });
  }

  res.status(200).json({ points: receipts[id] });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
Instructions to Run:
1. Clone the repository.
2. Navigate to the project directory.
3. Run `npm install` to install dependencies.
4. Start the server with `node index.js`.
5. Use tools like Postman or curl to interact with the API.
6. Use the `/receipts/process` endpoint to process receipts.
7. Retrieve points with `/receipts/{id}/points` endpoint.
*/

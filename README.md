# Receipt Processor API

This project implements a web service that processes receipts to calculate and store points based on specific rules. The application provides two main API endpoints:

1. `/receipts/process`: Accepts a JSON receipt, calculates points, and returns a unique ID.
2. `/receipts/{id}/points`: Retrieves the points for a receipt by its ID.

## Features
- Process receipts and calculate points based on predefined rules.
- Retrieve points for processed receipts using a unique ID.
- Data is stored in-memory, making the application stateless across restarts.
- Implemented using Node.js and Express.js.

---

## API Documentation

### 1. Process Receipts
**Endpoint**: `/receipts/process`  
**Method**: POST  
**Description**: Accepts a JSON receipt and returns a unique ID for the receipt.

#### Example Request:
```json
{
  "retailer": "Target",
  "purchaseDate": "2022-01-01",
  "purchaseTime": "13:01",
  "items": [
    { "shortDescription": "Mountain Dew 12PK", "price": "6.49" },
    { "shortDescription": "Emils Cheese Pizza", "price": "12.25" },
    { "shortDescription": "Knorr Creamy Chicken", "price": "1.26" },
    { "shortDescription": "Doritos Nacho Cheese", "price": "3.35" },
    { "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ", "price": "12.00" }
  ],
  "total": "35.35"
}
```

#### Example Response:
```json
{
  "id": "389590dc-4cfe-43c5-ad8a-c07d9dabfed2"
}
```

---

### 2. Get Points
**Endpoint**: `/receipts/{id}/points`  
**Method**: GET  
**Description**: Returns the points for a receipt using its ID.

#### Example Request:
```bash
GET /receipts/389590dc-4cfe-43c5-ad8a-c07d9dabfed2
```

#### Example Response:
```json
{
  "points": 28
}
```

---

## Rules for Points Calculation
1. **Retailer Name**: One point for every alphanumeric character.
2. **Round Dollar Total**: 50 points if the total is a round dollar amount.
3. **Multiple of $0.25**: 25 points if the total is a multiple of $0.25.
4. **Pairs of Items**: 5 points for every two items.
5. **Item Description Length**: If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer. Add this as points.
6. **Odd Purchase Day**: 6 points if the purchase date’s day is odd.
7. **Afternoon Purchase Time**: 10 points if the purchase time is between 2:00 PM and 4:00 PM.

---

## Setup Instructions

### 1. Prerequisites
- Node.js installed (v14+).
- Docker installed.

### 2. Clone the Repository
```bash
git clone <repository_url>
cd receipt-processor
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Server
```bash
node index.js
```

### 5. Interact with the API
Use tools like Postman, curl, or any HTTP client to send requests.

---

## Example Testing with `curl`

### Process a Receipt
```bash
curl -X POST http://localhost:3000/receipts/process \
-H "Content-Type: application/json" \
-d '{
  "retailer": "Target",
  "purchaseDate": "2022-01-01",
  "purchaseTime": "13:01",
  "items": [
    { "shortDescription": "Mountain Dew 12PK", "price": "6.49" },
    { "shortDescription": "Emils Cheese Pizza", "price": "12.25" },
    { "shortDescription": "Knorr Creamy Chicken", "price": "1.26" },
    { "shortDescription": "Doritos Nacho Cheese", "price": "3.35" },
    { "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ", "price": "12.00" }
  ],
  "total": "35.35"
}'
```

#### Response:
```json
{
  "id": "389590dc-4cfe-43c5-ad8a-c07d9dabfed2"
}
```

### Get Points for a Receipt
```bash
curl -X GET http://localhost:3000/receipts/389590dc-4cfe-43c5-ad8a-c07d9dabfed2
```

#### Response:
```json
{
  "points": 28
}
```

---

## Docker Setup

### Build Docker Image
```bash
docker build -t receipt-processor .
```

### Run Docker Container
```bash
docker run -p 3000:3000 receipt-processor
```

---

## Additional Notes
- Ensure data adheres to the example receipt format.
- Use `/receipts/{id}/points` to verify points calculation.

---

## Author
- Kyathi Y

Feel free to reach out for any further clarifications.

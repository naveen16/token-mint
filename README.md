# SEI Labs

TypeScript HTTP API with Express.js

## Getting Started

### Installation

```bash
npm install
```

### Running the Project

```bash
# Build TypeScript to JavaScript
npm run build

# Run production build
npm start

# Run in development mode with auto-reload
npm run dev
```

## API Endpoints

### Health Check
- **GET** `/health` - Check server status

### Items API

- **GET** `/api/items` - Get all items
  - Response: `{ success: true, data: Item[], count: number }`

- **GET** `/api/items/:id` - Get a specific item by ID
  - Response: `{ success: true, data: Item }`
  - Error (404): `{ success: false, error: "Item not found" }`

- **POST** `/api/items` - Create a new item
  - Body: `{ name: string, description?: string }`
  - Response (201): `{ success: true, data: Item, message: string }`
  - Error (400): `{ success: false, error: string }`

## Example Requests

### Create an item
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Sample Item", "description": "This is a sample item"}'
```

### Get all items
```bash
curl http://localhost:3000/api/items
```

### Get item by ID
```bash
curl http://localhost:3000/api/items/1
```

## Project Structure

```
.
├── src/
│   ├── index.ts           # Main server entry point
│   └── routes/
│       └── items.ts       # Items API routes (GET, POST)
├── dist/                  # Compiled JavaScript (generated)
├── tsconfig.json          # TypeScript configuration
├── nodemon.json           # Nodemon configuration
├── package.json           # Project dependencies and scripts
└── README.md              # Project documentation
```

## Default Port

The server runs on port 3000 by default. You can change it by setting the `PORT` environment variable.

## Test results
```
>cast wallet new
Successfully created new keypair.
Address:     0xBB81C0DB2A9F4D6eb853ee308c68067Db3dB8dFf
Private key: 0x3a566aa11e8b546a185dcc7021c33c3f308d6c0f9a87b013624a71ef94cebcf5

curl -X POST http://localhost:3000/tokens/mint \
>   -H "Content-Type: application/json" \
>   -d '{"to":"0xBB81C0DB2A9F4D6eb853ee308c68067Db3dB8dFf","amount":"123"}'

{
  "success":true,
  "txHash":"0xe986e26ed708a0f0fbca339036ca070603c4ae9f1a6a34c61ccfcd887b50bde0"
} 

curl "http://localhost:3000/tokens/balance?address=0xBB81C0DB2A9F4D6eb853ee308c68067Db3dB8dFf"
{
  "success":true,
  "address":"0xBB81C0DB2A9F4D6eb853ee308c68067Db3dB8dFf",
  "balance":"123000000000000000000"
}
```

https://testnet.seiscan.io/tx/0xe986e26ed708a0f0fbca339036ca070603c4ae9f1a6a34c61ccfcd887b50bde0

Bonuses:
- How do you limit minting to only one per address?
We can store each address mint in the DB
```
minted_addresses (
  address TEXT PRIMARY KEY,
  minted_at TIMESTAMP,
  tx_hash TEXT
)
```
Next time the /tokens/mint api is called we can check if the address passed in as input has already been
minted and reject if so.


- How do you handle concurrent requests to the endpoint?

Create a unique constraint in the db on the address column and use atomic transactions
```
address TEXT PRIMARY KEY
```
If we have 2 api calls for minting with the same address then one of them will get the transaction lock first
and the other will have to wait until its released to execute. This avoid double minting.
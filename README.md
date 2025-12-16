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
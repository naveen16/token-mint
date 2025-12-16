import { Router, Request, Response } from 'express';
import {
  isAddress,
  getAddress,
  Wallet,
  JsonRpcProvider,
  Contract,
  parseUnits,
} from 'ethers';

const router = Router();

const TOKEN_CONTRACT_ADDRESS =
  '0x428F82f1ECa4AA6f6c75D77cBd2a9ceB94cde343';

const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
] as const;

const RPC_URL = 'https://evm-rpc-testnet.sei-apis.com';
const provider = new JsonRpcProvider(RPC_URL);

const privateKey = '0x8440424f90fd7fb2e240cc954f4f96f111d689933a3ab99d1b33bdd9f345d043';

const wallet = new Wallet(privateKey, provider);
const contract = new Contract(TOKEN_CONTRACT_ADDRESS, ERC20_ABI, wallet);

// GET /tokens/balance?address=0x...
router.get('/balance', async (req: Request, res: Response) => {
  try {
    const address = req.query.address as string;

    if (!address || !isAddress(address)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid address',
      });
    }

    const checksum = getAddress(address);
    const balance = await contract.balanceOf(checksum);

    return res.json({
      success: true,
      address: checksum,
      balance: balance.toString(),
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message ?? 'Failed to fetch balance',
    });
  }
});

// POST /tokens/mint
// { "to": "0x...", "amount": "123" }
router.post('/mint', async (req: Request, res: Response) => {
  try {
    const { to, amount } = req.body;

    // Validation
    if (!to || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing to or amount',
      });
    }

    if (!isAddress(to)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid address',
      });
    }

    const checksumTo = getAddress(to);
    const mintAmount = parseUnits(amount, 18);

    // Submit transaction
    const tx = await contract.mint(checksumTo, mintAmount);
    const receipt = await tx.wait();

    return res.json({
      success: true,
      txHash: receipt.hash,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message ?? 'Mint failed',
    });
  }
});

export { router as tokensRouter };

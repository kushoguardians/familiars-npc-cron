import { ethers, formatEther, getBytes, solidityPackedKeccak256 } from "ethers";
import operatorAbi from "../artifacts/operator.abi.json";
import { CHAIN_ID, OPERATOR_ADDRESS } from "../constants";
import { Abi, createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { serializeBigInt } from "utils/serialized-bigint";

const privateKey = process.env.CALLER_PK || "";
const verifierWallet = new ethers.Wallet(process.env.VERIFIER_PK as string);
const wallet = new ethers.Wallet(privateKey);
const account = privateKeyToAccount(wallet.privateKey as `0x${string}`);
const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(process.env.BASE_RPC),
});

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.BASE_RPC),
});

export async function BuyTreasureBox({ tokenId }: { tokenId: number }) {
  try {
    // Step 1: Fetch the current nonce for the NPC
    const nonce = await publicClient.readContract({
      abi: operatorAbi as Abi,
      address: OPERATOR_ADDRESS,
      functionName: "nonce",
    });

    // Step 2: Create the message hash to be signed
    const message = solidityPackedKeccak256(
      ["uint256", "uint256", "address"],
      [nonce, CHAIN_ID, wallet.address]
    );
    console.log("Message hash:", message);

    // Step 3: Sign the message
    const signature = await verifierWallet.signMessage(getBytes(message));
    console.log("Message signed:", signature);

    const tx = await walletClient.writeContract({
      abi: operatorAbi as Abi,
      address: OPERATOR_ADDRESS,
      functionName: "buyTreasureBox",
      args: [tokenId, signature],
    });

    const transaction = await publicClient.waitForTransactionReceipt({
      hash: tx,
    });

    if (transaction) {
      const stats = await publicClient.readContract({
        abi: operatorAbi as Abi,
        address: OPERATOR_ADDRESS,
        functionName: "getNPCStats",
        args: [tokenId],
      });

      let serializedStats = serializeBigInt(stats);
      serializedStats = {
        health: serializedStats["0"],
        location: serializedStats["1"],
        coins: formatEther(serializedStats["2"]),
        karmic: serializedStats["3"],
        food: serializedStats["4"],
        equipments: serializedStats["5"],
      };

      return {
        transactionId: tx,
        stats: serializedStats,
      };
    }
  } catch (error) {
    console.error("Error in goToLocation API:", error);
    return error;
  }
}

import { Abi, Address, createPublicClient, formatEther, http } from "viem";
import { baseSepolia } from "viem/chains";
import { serializeBigInt } from "../utils/serialized-bigint";
import { FAMILIARS_ADDRESS, OPERATOR_ADDRESS } from "../constants";
import OperatorAbi from "../artifacts/operator.abi.json";
import FamiliarsAbi from "../artifacts/familiars.abi.json";
import { FamiliarStats } from "agent";

interface OperatorContractType {
  address: Address;
  abi: Abi;
}

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.BASE_RPC),
});

const OperatorContract: OperatorContractType = {
  address: OPERATOR_ADDRESS,
  abi: OperatorAbi as Abi,
} as const;

const FamiliarsContract: OperatorContractType = {
  address: FAMILIARS_ADDRESS,
  abi: FamiliarsAbi as Abi,
} as const;

const getNPCName = (tokenId: number): string => {
  const names: { [key: number]: string } = {
    1: "Sundo",
    2: "Duwende",
    3: "Diwata",
    4: "Adarna",
  };
  return names[tokenId] || `Unknown NPC ${tokenId}`;
};

export async function NPCStats() {
  try {
    const tokenIds = [1, 2, 3, 4];

    const multicallPayload = tokenIds.map((tokenId) => ({
      ...OperatorContract,
      functionName: "getNPCStats",
      args: [tokenId],
    }));

    const multicallPayload3 = tokenIds.map((tokenId) => ({
      ...FamiliarsContract,
      functionName: "tokenURI",
      args: [tokenId],
    }));

    const results = await publicClient.multicall({
      contracts: multicallPayload,
    });

    const metadataResults = await publicClient.multicall({
      contracts: multicallPayload3,
    });

    const metadataObjects = await Promise.all(
      metadataResults.map(async (metadataResult) => {
        if (metadataResult.status === "success") {
          const metadataUrl = metadataResult.result as string;
          try {
            const response = await fetch(metadataUrl);
            if (!response.ok)
              throw new Error(`Failed to fetch metadata: ${metadataUrl}`);
            return await response.json();
          } catch (error) {
            console.error(`Error fetching metadata: ${metadataUrl}`, error);
            return null;
          }
        }
        return null;
      })
    );

    // Type check and serialize the results
    const validResults: FamiliarStats[] = results
      .map((result, index) => {
        if (result.status === "success") {
          let serializedStats = serializeBigInt(result.result);
          const metadata = metadataObjects[index];
          serializedStats = {
            health: serializedStats["0"],
            location: serializedStats["1"],
            coins: formatEther(serializedStats["2"]),
            karmic: serializedStats["3"],
            food: serializedStats["4"],
          };

          return {
            ...serializedStats,
            name: getNPCName(tokenIds[index]),
            tokenId: tokenIds[index],
            story: metadata.description,
          };
        }
        return null;
      })
      .filter((result) => result !== null);

    return validResults;
  } catch (error) {
    console.error("Multicall error:", error);
    return error;
  }
}

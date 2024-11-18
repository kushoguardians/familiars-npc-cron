
import { BuyFood } from "actions/buy-food";
import { BuyTreasureBox } from "actions/buy-treasurebox";
import { ExchangeKarmicEnergy } from "actions/exchange-karmic";
import { GoToLocation } from "actions/goto-location";
import { NPCStats } from "actions/npc-stats";
import { FamiliarAgent, type FamiliarStats } from "agent";
import { delay } from "utils/delay";

// Enums for better type safety and maintainability
enum Location {
  KARMIC_WELLSPRING = 0,
  KARMIC_TOWER = 1,
  HOME = 2,
  GATHERING_AREA = 3,
  MARKETPLACE = 4,
}

// Type for action handlers
type ActionHandler = (stats: FamiliarStats) => Promise<void>;

// Utility function for location-based actions
const executeAtLocation = async (
  stats: FamiliarStats,
  targetLocation: Location,
  requiredLocation: string,
  action: () => Promise<unknown>
): Promise<void> => {
  if (stats.location !== requiredLocation) {
    const gotoResponse = await GoToLocation({
      tokenId: stats.tokenId,
      locationId: targetLocation,
    });

    if (!gotoResponse) {
      throw new Error(`Failed to move to ${requiredLocation}`);
    }

    await delay(15_000); // 15 seconds delay
  }
  
  await action();
};

// Karmic energy deposit handler factory
const createKarmicDepositHandler = (amount: number): ActionHandler => {
  return async (stats: FamiliarStats) => {
    await executeAtLocation(
      stats,
      Location.KARMIC_WELLSPRING,
      "Karmic Wellspring",
      () => ExchangeKarmicEnergy({ tokenId: stats.tokenId, karmicEnergyAmt: amount })
    );
  };
};

// Action handlers mapping with improved type safety
const ACTION_HANDLERS: Record<string, ActionHandler> = {
  gotogatheringarea: async (stats) => {
    await GoToLocation({ tokenId: stats.tokenId, locationId: Location.GATHERING_AREA });
  },
  gotohome: async (stats) => {
    await GoToLocation({ tokenId: stats.tokenId, locationId: Location.HOME });
  },
  gotokarmictower: async (stats) => {
    await GoToLocation({ tokenId: stats.tokenId, locationId: Location.KARMIC_TOWER });
  },
  deposit5karmicenergy: createKarmicDepositHandler(5),
  deposit10karmicenergy: createKarmicDepositHandler(10),
  deposit20karmicenergy: createKarmicDepositHandler(20),
  buytreasurebox: async (stats) => {
    await executeAtLocation(
      stats,
      Location.MARKETPLACE,
      "Marketplace",
      () => BuyTreasureBox({ tokenId: stats.tokenId })
    );
  },
  buyfood: async (stats) => {
    await executeAtLocation(
      stats,
      Location.MARKETPLACE,
      "Marketplace",
      () => BuyFood({ tokenId: stats.tokenId, coinsAmt: 5 })
    );
  },
};

// Process a single familiar
const processFamiliar = async (stats: FamiliarStats): Promise<void> => {
  try {
    const agent = new FamiliarAgent(stats);
    const decision = await agent.makeDecision();
    
    const handler = ACTION_HANDLERS[decision];
    if (!handler) {
      throw new Error(`Unknown decision: ${decision}`);
    }

    await handler(stats);
    await delay(15_000);
    
    console.log(`Processed familiar ${stats.tokenId} ${stats.name}, with decision ${decision}`);
  } catch (error) {
    console.error(`Error processing familiar ${stats.tokenId}:`, error);
    throw error; // Re-throw to stop the sequence in case of error
  }
};

// Main function with sequential processing
export async function AutonomousCron(): Promise<void> {
  try {
    const response = await NPCStats();
    if (!Array.isArray(response)) {
      throw new Error("Expected array of FamiliarStats");
    }

    const familiars = response as FamiliarStats[];
    console.log(`Processing ${familiars.length} familiars sequentially`);

    // Process familiars sequentially
    for (const stats of familiars) {
      try {
        await processFamiliar(stats);
      } catch (error) {
        // Log the error but continue with the next familiar
        console.error(`Failed to process familiar ${stats.tokenId}:`, error);
        // Optionally add a delay before processing the next familiar
        await delay(5_000);
      }
    }
  } catch (error) {
    console.error("AutonomousCron failed:", error);
    throw error; // Re-throw to allow proper error handling by the caller
  }
}
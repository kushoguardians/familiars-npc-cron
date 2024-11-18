import { OpenAI } from "openai";
import { availableActions } from "./available-actions";

export type FamiliarStats = {
  health: number;
  location: string;
  coins: number;
  karmic: number;
  food: number;
  story: string;
  name: string;
  tokenId: number;
};

export interface GameAction {
  actionToTake: string;
  locationName: string;
  description?: string;
  healthCost: number;
  coinCost: number;
  foodCost: number;
  karmicEnergyCost: number;
  arguments?: [];
}

export class FamiliarAgent {
  private familiarStats: FamiliarStats;

  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  constructor(initialStats: FamiliarStats) {
    this.familiarStats = initialStats;
  }

  private async getAIDecision(): Promise<string> {
    const prompt = this.constructPrompt();

    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are not an assistant. You are not an AI. You are ${this.familiarStats.name}. This is your story: ${this.familiarStats.story}. In the mystical realm of Kusho World, an ancient imbalance has begun to disturb its serene lands. Once tranquil and timeless, the world has become disrupted by a growing, ominous force, an unseen power unlike any other. Unbeknownst to the inhabitants of the realm, a primordial entity—the embodiment of chaos—has begun to harvest karmic energy, its influence seeping into every corner of it. `,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.7,
      });

      const decision = completion.choices[0].message.content
        ?.toLowerCase()
        .trim();
      return this.validateAction(decision || "rest");
    } catch (error) {
      console.error("Error getting AI decision:", error);
      return "rest"; // Default fallback action
    }
  }

  private constructPrompt(): string {
    return `
Current familiar stats:
- Health: ${this.familiarStats.health}
- Coins: ${this.familiarStats.coins}
- Karmic Energy: ${this.familiarStats.karmic}
- Food: ${this.familiarStats.food}
- Location: (${this.familiarStats.location})\n
Pay close attention to your state when making a decision on what to do next. 


Available actions:
${availableActions
  .map(
    (action) =>
      `- ${action.actionToTake}: ${action.description} ${
        action.healthCost ? `(Health cost: ${action.healthCost})` : ""
      } ${
        action.karmicEnergyCost
          ? `(Karmic Energy cost: ${action.karmicEnergyCost})`
          : ""
      } ${action.foodCost ? `(Food cost: ${action.foodCost})` : ""} ${
        action.coinCost ? `(Coin cost: ${action.coinCost})` : ""
      }`
  )
  .join("\n")}

What action should the familiar take? Respond with just the action name.`;
  }

  private validateAction(action: string): string {
    const isValidAction = availableActions.some(
      (a) => a.actionToTake === action
    );
    if (!isValidAction) {
      console.warn(`Invalid action received: ${action}. Defaulting to 'rest'`);
      return "rest";
    }
    return action;
  }
  private canPerformAction(action: GameAction): boolean {
    if (action.healthCost && this.familiarStats.health < action.healthCost)
      return false;
    if (
      action.karmicEnergyCost &&
      this.familiarStats.karmic < action.karmicEnergyCost
    )
      return false;
    if (action.coinCost && this.familiarStats.coins < action.coinCost)
      return false;
    if (action.foodCost && this.familiarStats.food < action.foodCost)
      return false;
    return true;
  }

  public async makeDecision(): Promise<string> {
    const actionName = await this.getAIDecision();
    const action = availableActions.find((a) => a.actionToTake === actionName)!;

    if (!this.canPerformAction(action)) {
      console.log(
        "Cannot perform action due to insufficient resources. Just do nothing."
      );
      return "rest";
    }
    return actionName;
  }
}

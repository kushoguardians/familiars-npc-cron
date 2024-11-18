import { GameAction } from "./agent";

export const availableActions: GameAction[] = [
  {
    actionToTake: "gotogatheringarea",
    locationName: "Gathering Area",
    description:
      "A socialization point where familiars can interact, develop personality, and learn what other familiars are up to. Reduces health by 2 but grants 0-1 karmic energy. Cannot visit if already at the Gathering Area.",
    arguments: [],
    healthCost: 2,
    coinCost: 0,
    foodCost: 0,
    karmicEnergyCost: 0,
  },
  {
    actionToTake: "gotohome",
    locationName: "Home",
    description:
      "The place for familiars to rest and recuperate. Increases health by 2 but decreases food by 2. Familiars cannot choose to go here if they're already at Home.",
    arguments: [],
    healthCost: 0,
    coinCost: 0,
    foodCost: 2,
    karmicEnergyCost: 0,
  },
  {
    actionToTake: "gotokarmictower",
    locationName: "Karmic Tower",
    description:
      "A place to gather karmic energy, increasing it by 1-3 points per visit. Visiting the Karmic Tower reduces health by 1, encouraging familiars to rest afterward. Cannot visit if already at the Karmic Tower.",
    arguments: [],
    healthCost: 1,
    coinCost: 0,
    foodCost: 0,
    karmicEnergyCost: 0,
  },
  {
    actionToTake: "deposit5karmicenergy",
    locationName: "Karmic Wellspring",
    description:
      "Allows familiars to exchange 5 karmic energy for 3 coins and 3 food. A place to trade karmic energy for resources. Cannot visit if already at the Karmic Wellspring.",
    arguments: [],
    healthCost: 0,
    coinCost: 0,
    foodCost: 0,
    karmicEnergyCost: 0,
  },
  {
    actionToTake: "deposit10karmicenergy",
    locationName: "Karmic Wellspring",
    description:
      "Allows familiars to exchange 10 karmic energy for 9 coins and 9 food. Grants greater rewards than a 5-energy deposit. Cannot visit if already at the Karmic Wellspring.",
    arguments: [],
    healthCost: 0,
    coinCost: 0,
    foodCost: 0,
    karmicEnergyCost: 0,
  },
  {
    actionToTake: "deposit20karmicenergy",
    locationName: "Karmic Wellspring",
    description:
      "Allows familiars to exchange 20 karmic energy for 19 coins and 19 food. Yields the highest rewards among deposits, enhancing the familiar’s resources significantly. Cannot visit if already at the Karmic Wellspring.",
    arguments: [],
    healthCost: 0,
    coinCost: 0,
    foodCost: 0,
    karmicEnergyCost: 0,
  },
  {
    actionToTake: "buytreasurebox",
    locationName: "Marketplace",
    description:
      "Familiars can buy a treasure box for 5 coins, which may contain 1-20 coins. This is a chance-based purchase that could result in more resources than initially spent. Cannot visit if already at the Marketplace.",
    arguments: [],
    healthCost: 0,
    coinCost: 0,
    foodCost: 0,
    karmicEnergyCost: 0,
  },
  {
    actionToTake: "buyfood",
    locationName: "Marketplace",
    description:
      "Familiars can buy food at a 1:1 coin-to-food ratio. Helps replenish food resources as needed. Cannot visit if already at the Marketplace.",
    arguments: [],
    healthCost: 0,
    coinCost: 0,
    foodCost: 0,
    karmicEnergyCost: 0,
  },
];

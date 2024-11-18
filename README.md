
# Kusho World Familiar Management System
A HonoJS-based autonomous familiar management system for Kusho World

## Overview
This application provides an automated system for managing familiar agents in the Kusho World ecosystem. It runs scheduled tasks every 15 minutes to process familiar actions, resource management, and location-based activities.

## Features
- Automated familiar processing every 15 minutes
- Location-based actions (Karmic Wellspring, Karmic Tower, Home, Gathering Area, Marketplace)
- Resource management (health, coins, food, karmic energy)
- AI-powered decision making for familiars using OpenAI
- Sequential processing of multiple familiars
- Error handling and recovery mechanisms

## Setup
1. Install dependencies:
```bash
bun install
```

2. Configure environment variables:
```
OPENAI_API_KEY=your_openai_api_key
BASE_RPC=base_rpc_endpoint
VERIFIER_PK=verifier_wallet_private_key
CALLER_PK=caller_wallet_private_key
```

3. Start the server:
```bash
bun run dev
```

## Architecture

### Core Components
- **AutonomousCron**: Main cron job handler that processes familiars
- **FamiliarAgent**: Manages individual familiar decision-making
- **Action Handlers**: Processes various familiar actions (movement, purchases, energy exchanges)

### Available Actions
1. Movement Actions:
   - Go to Gathering Area
   - Go to Home
   - Go to Karmic Tower
   
2. Resource Management:
   - Deposit Karmic Energy (5/10/20 units)
   - Buy Food
   - Buy Treasure Box

### Locations
- Karmic Wellspring: Exchange karmic energy for resources
- Karmic Tower: Gather karmic energy
- Home: Rest and recuperate
- Gathering Area: Socialize and gain karmic energy
- Marketplace: Purchase items and food

## Usage

The system automatically:
- Runs every 15 minutes
- Fetches current familiar stats
- Processes each familiar sequentially
- Executes AI-driven decisions
- Handles errors and continues processing

## Error Handling
- Individual familiar processing errors are caught and logged
- System continues processing remaining familiars
- 15-second delays between actions prevent rate limiting
- 5-second recovery delays after errors

## Monitoring
Access basic system status:
```
GET /hello
```
Response: "Hello. I'm Kusho Guardians!"

## Technical Notes
- Built with HonoJS for lightweight, fast processing
- Uses OpenAI GPT-3.5-turbo for decision making
- Implements sequential processing to prevent conflicts
- Includes built-in delays for rate limiting compliance

## Best Practices
- Keep OpenAI API key secure
- Monitor system logs for errors
- Maintain sufficient resources for familiar actions
- Regular system health checks recommended

## Contributing
Contributions welcome! Please submit pull requests with improvements or bug fixes.

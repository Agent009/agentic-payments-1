# 🤖 Agentic Payments

This project implements [Story Protocol](https://docs.story.foundation/docs/ai-agents-on-story)'s whitepaper on **Agent Transaction Control Protocol for Intellectual Property** by offering an **agent-driven NFT marketplace**.

## 🎨 Agentic Marketplace Overview

### 👥 Agents
- **Consumer Agent**: Runs an NFT marketplace (must be registered on Story)
- **Provider Agent**: Can be an NFT minter or trader (may be registered on Story)

### 🔄 Transaction Flow

1. **Request Initiation**
   - Consumer sends a request to a service provider agent
   - Provider registers on Story if not already (receives ipID)

2. **Information Request**
   - Details of the requested asset are specified
   - If asset IP is registered: Include IP ID and URI
   - Otherwise: Use metadata field for details

3. **Terms Negotiation**
   - Provider generates draft terms
   - Consumer can negotiate a counteroffer
   - Provider can counter-negotiate
   - Process continues until terms are finalized

4. **License Creation**
   - Provider mints a license token on Story blockchain
   - If asset IP isn't registered, it's registered first

5. **Transaction Completion**
   - Payment is processed
   - (Optional) Provider shares secure download link for asset
   - Consumer confirms receipt and records transaction

6. **Marketplace Integration**
   - Asset displayed in marketplace
   - Sale terms and revenue distribution based on minted license

7. **Ongoing Management**
   - Periodic checks for license validity
   - Removal of listings with expired licenses

## 🚀 Getting Started
## Prerequisites

* Duplicate `.env` to `.env.local` and fill in all the environment variables.

## Setup

1. Create your SPG collection.

```bash
npm run create-spg-collection
```

2. Register your agents. This can either be done via the CLI by executing the command below and running through the options 1, 2 and 3 to create all the agents:

```bash
npm run register-agent
```

Or by calling the agent creation endpoint: `POST http://localhost:3000/api/agent`

```bash
curl -X POST http://localhost:3000/api/agent \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Agent",
    "description": "This is a test agent",
    "image": "https://example.com/image.jpg"
  }'
```

3. Create the information request.

```bash
curl -X POST http://localhost:3000/api/agent/request \
  -H "Content-Type: application/json" \
  -d '{
    "requesterId": "requester123",
    "agentId": "agent456",
    "ipType": "IMAGE",
    "proposedUsage": "Commercial use in advertising",
    "duration": "6 months"
  }'
```

4. Draft terms.

```bash
curl -X POST http://localhost:3000/api/agent/negotiate \
  -H "Content-Type: application/json" \
  -d '{
    "request_id": "request789",
    "agent_id": "agent456",
    "transferable": true,
    "royaltyPolicy": "0x1234567890123456789012345678901234567890",
    "defaultMintingFee": "100000000000000000",
    "expiration": "2024-12-31T23:59:59Z",
    "commercialUse": true,
    "commercialAttribution": true,
    "commercialRevShare": 10,
    "derivativesAllowed": true,
    "derivativesAttribution": true,
    "currency": "0x2345678901234567890123456789012345678901",
    "uri": "https://example.com/terms"
  }'
```

5. Negotiate terms.

```bash
curl -X POST http://localhost:3000/api/agent/negotiate \
  -H "Content-Type: application/json" \
  -d '{
    "terms_id": "terms123",
    "agent_id": "agent456",
    "commercialRevShare": 15,
    "derivativesAllowed": false
  }'
```

6. Finalize terms.

```bash
curl -X PUT http://localhost:3000/api/agent/negotiate \
  -H "Content-Type: application/json" \
  -d '{
    "terms_id": "terms123",
    "agent_id": "agent456",
    "status": "FINALIZED"
  }'
```

**Note:** The finalization step will automatically trigger the license minting process as per the current implementation.

## 📝 TODO

* Agentic workflows
* Infinite loop prevention
* API endpoint security and harderning
* Asset validity verification
* License expiry checks
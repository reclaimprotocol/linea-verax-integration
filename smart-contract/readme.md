# Reclaim Portal Smart Contract

EVM smart contract that enables the users to attest anonymously their claims with the help of Verax and Reclaim.

## Setup

1. Run `npm install --legacy-peer-deps`
2. create `.env` file same as `.env.example` and fill `NETWORK`, `PRIVATE_KEY`, and `ALCHEMY_API_KEY` at least.
3. To test, `npm run test`

## Contracts Addresses

### Optimism Goerli

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| Reclaim              | 0x2f0306D698685BEf7ff50745BFF7178F0d117ba8 |
| Semaphore            | 0x1B5C1e0DFfeae20716508F2B7AD5fA39ea52eb7e |
| SemaphoreVerifier    | 0x2C96f4227295cA6fA9eD80a4eC4fb11507da3367 |
| AttestationRegistry  | 0xBcfD2cf1c3ae17fDee5110fE31347839f06Dfe47 |
| ModuleRegistry       | 0x1Da4C5359531930bE37e0Dd331f729Bb86505814 |
| PortalRegistry       | 0xC29673d9a8b0Fba737E308309Fc7cb1d2f4457fC |
| SchemaRegistry       | 0x54F16e695A3e1c737a62d5D7a17CF3CB41356383 |
| ReclaimPortal        | 0x5Da495e845f9242766AD97E8D09EAcc4004aBeDc |
| UserMerkelizerModule | 0x7E1E9871b4251c0b5E9Eb6FEb64F5bfe5D228237 |

### Linea Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| Reclaim              | 0xf223E215B2c9A2E5FE1B2971d5694684b2E734C1 |
| Semaphore            | 0xd9692F91DC89f14f4211fa07aD2Bd1E9aD99D953 |
| SemaphoreVerifier    | 0xD594971cea3fb43Dd3d2De87C216ac2aCE320fc2 |
| AttestationRegistry  | 0x7A2B692c8c46715727ae8b2BFb6259a1A1113fA0 |
| ModuleRegistry       | 0x4A79C4fBe6c2F849D0fD4da8c24214491BaF41cd |
| PortalRegistry       | 0xB51FCb41fF11e0445600f63D8c38f955DcCB0B2c |
| SchemaRegistry       | 0xEbBbc3A976A81AE54938E09F297ab7313E00D6a5 |
| ReclaimPortal        | 0x798c6B325671E6bA13c03Cb8B208d708F58B0f39 |
| UserMerkelizerModule | 0xd1cdF9B236c0f56D20d90a7F8129D129e4cEb7DB |

## Commands

- `NETWORK={network} npx hardhat deploy` to deploy the Reclaim contract to a chain. `{network}` is the chain, for example, "eth-goerli" or "polygon-mainnet"
- `NETWORK={network} npx hardhat deploy-registeries` to deploy the Verax registries contract to a chain.
- `NETWORK={network} npx hardhat deploy-verax` to deploy the Reclaim Portal and UserMerkelizerModule and register them in verax registeries
- `NETWORK={network} npx hardhat add-schemas` to create schema for providers that Reclaim contract supports with calling SchemaRegistry from verax.
- `NETWORK={network} npx hardhat upgrade --address {proxy address of the Reclaim contract}` to upgrade the contract
- `npm run prettier` to lint your solidity files

## How the attestation is verified?

- In order to integrate reclaim with verax, we created ReclaimPortal contract which inherits the verax/AbstractPortal.
- This portal is the entry point for the users to add their attestations to `AttestationRegistery` using the function `attest`
- This function takes `AttestationRequest` which will include a proof of a claim.
- `attest` exposes the `AttestationPayload` and `ValidationPaylaod` from the proof (Claim info to be stored publicly, and the signatures) and try to attest with the exposed info.
- `UserMerkelizerModule` will `run()` and check the proof with the help of `Reclaim.verifyProof()`. If the user hasn't been merkelized yet then, the merkelize user action will be triggered instead of just verifying proof. _Note: merkelizing user includes verifying the proof_
- if all above has successfully passed, the attestation will be stored and new event `AttestationRegistered(attestationId)` will be emitted.

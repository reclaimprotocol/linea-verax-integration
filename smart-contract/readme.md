# Reclaim Portal Smart Contract

EVM smart contract that enables the users to attest anonymously their claims with the help of Verax and Reclaim.

## Setup

1. Run `npm install --legacy-peer-deps`
2. To test, `npm run test`

## Contracts Addresses

### Optimism Goerli

| Contract              | Address                                    |
|-----------------------|--------------------------------------------|
| Reclaim               | 0xCc08210D8f15323104A629a925E4cc59D0fa2Fe1 |
| Semaphore             | 0xACE04E6DeB9567C1B8F37D113F2Da9E690Fc128d |
| SemaphoreVerifier     | 0x93a9d327836A5279E835EF3147ac1fb54FBd726B |
| AttestationRegistry   | 0x345aD20D8C6A84EE43d9713AEE17e0F1A0183571 |
| ModuleRegistry        | 0x508071F5514992400C32F05783322E338ac79BA6 |
| PortalRegistry        | 0xE11a9f996c71Da1d856dCa0Ec82Af60c2786c2cf |
| SchemaRegistry        | 0xD594971cea3fb43Dd3d2De87C216ac2aCE320fc2 |
| ReclaimPortal         | 0x8A07917338d6b67735ED65a6106FF8C0ba488aBA |
| UserMerkelizerModule  | 0xbd5EB413D84946256117fd7bE6F67e0EBb28146f |

### Linea Testnet

| Contract              | Address                                    |
|-----------------------|--------------------------------------------|
| Reclaim               | 0xf223E215B2c9A2E5FE1B2971d5694684b2E734C1 |
| Semaphore             | 0xd9692F91DC89f14f4211fa07aD2Bd1E9aD99D953 |
| SemaphoreVerifier     | 0xD594971cea3fb43Dd3d2De87C216ac2aCE320fc2 |
| AttestationRegistry   | 0x7A2B692c8c46715727ae8b2BFb6259a1A1113fA0 |
| ModuleRegistry        | 0x4A79C4fBe6c2F849D0fD4da8c24214491BaF41cd |
| PortalRegistry        | 0xB51FCb41fF11e0445600f63D8c38f955DcCB0B2c |
| SchemaRegistry        | 0xEbBbc3A976A81AE54938E09F297ab7313E00D6a5 |
| ReclaimPortal         | 0x798c6B325671E6bA13c03Cb8B208d708F58B0f39 |
| UserMerkelizerModule  | 0xd1cdF9B236c0f56D20d90a7F8129D129e4cEb7DB |


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
- This function takes `AttestationRequest` which will include a proof of their claim.
- After that, `attest` exposes the `AttestationPayload` and `ValidationPaylaod` from the proof (Claim info to be stored publicly, and the signatures) and try to attest with the exposed info.
- `UserMerkelizerModule` will `run()` and check the proof with the help of `Reclaim.verifyProof()`. There is logic when the user hasn't been merkelized yet then, the merkelize user action will be triggered intead of just verifying proof. *Note: merkelizing user includes verifying the proof*
- if all above has successfully passed, the attestation will be stored and new event `AttestationRegistered(attestationId)` will be emitted. 




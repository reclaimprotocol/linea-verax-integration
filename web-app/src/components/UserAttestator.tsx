import { Identity } from '@semaphore-protocol/identity'
import { useAccount, useWaitForTransaction } from 'wagmi'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import RECLAIM_PORTAL from '../../contract-artifacts/ReclaimPortal.json'
import { useEffect, useState, useContext } from 'react'
import { ethers } from 'ethers'
import { Button, Spinner } from '@chakra-ui/react'
import LogsContext from '../context/LogsContext'

export default function UserAttestator ({ proofObj }: any) {
  const { address } = useAccount()
  const [identity, setIdentity] = useState<Identity>()
  const [enable, setEnable] = useState<boolean>(false)
  const { _logs, setLogs } = useContext(LogsContext)
  const [isPrepared, setIsPrepared] = useState(false)

  useEffect(() => {
    if (!identity) {
      const newIdentity = new Identity(address)
      setIdentity(newIdentity)
      console.log('Generated new identity: ', newIdentity)
    }
  }, [identity])

  const proofReq = {
    claimInfo: {
      provider: proofObj.provider,
      context: proofObj.context,
      parameters: proofObj.parameters
    },
    signedClaim: {
      signatures: proofObj.signatures,
      claim: {
        identifier: proofObj.identifier,
        owner: ethers.computeAddress(`0x${proofObj.ownerPublicKey}`),
        timestampS: proofObj.timestampS,
        epoch: proofObj.epoch
      }
    }
  }

  const attestationRequest = {
    data: {
      proof: proofReq,
      _identityCommitment: identity?.commitment.toString(),
      expirationTime: 1
    },
    schema: '0xd6e6a35ddb2b667deda0a9b84a791be2b359da1b2ab9b2bc411996b11866c23d'
  }
  console.log(attestationRequest)

  const { config } = usePrepareContractWrite({
    enabled: true,
    // @ts-expect-error events
    address: process.env.NEXT_PUBLIC_RECLAIM_PORTAL_CONTRACT_ADDRESS!,
    abi: [
      {
        inputs: [
          {
            components: [
              {
                internalType: 'bytes32',
                name: 'schema',
                type: 'bytes32'
              },
              {
                components: [
                  {
                    components: [
                      {
                        components: [
                          {
                            internalType: 'string',
                            name: 'provider',
                            type: 'string'
                          },
                          {
                            internalType: 'string',
                            name: 'parameters',
                            type: 'string'
                          },
                          {
                            internalType: 'string',
                            name: 'context',
                            type: 'string'
                          }
                        ],
                        internalType: 'struct Claims.ClaimInfo',
                        name: 'claimInfo',
                        type: 'tuple'
                      },
                      {
                        components: [
                          {
                            components: [
                              {
                                internalType: 'bytes32',
                                name: 'identifier',
                                type: 'bytes32'
                              },
                              {
                                internalType: 'address',
                                name: 'owner',
                                type: 'address'
                              },
                              {
                                internalType: 'uint32',
                                name: 'timestampS',
                                type: 'uint32'
                              },
                              {
                                internalType: 'uint32',
                                name: 'epoch',
                                type: 'uint32'
                              }
                            ],
                            internalType: 'struct Claims.CompleteClaimData',
                            name: 'claim',
                            type: 'tuple'
                          },
                          {
                            internalType: 'bytes[]',
                            name: 'signatures',
                            type: 'bytes[]'
                          }
                        ],
                        internalType: 'struct Claims.SignedClaim',
                        name: 'signedClaim',
                        type: 'tuple'
                      }
                    ],
                    internalType: 'struct Reclaim.Proof',
                    name: 'proof',
                    type: 'tuple'
                  },
                  {
                    internalType: 'uint256',
                    name: '_identityCommitment',
                    type: 'uint256'
                  },
                  {
                    internalType: 'uint64',
                    name: 'expirationTime',
                    type: 'uint64'
                  }
                ],
                internalType: 'struct ReclaimPortal.AttestationRequestData',
                name: 'data',
                type: 'tuple'
              }
            ],
            internalType: 'struct ReclaimPortal.AttestationRequest',
            name: 'attestationRequest',
            type: 'tuple'
          }
        ],
        name: 'attest',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
      }
    ],
    functionName: 'attest',
    args: [attestationRequest],
    chainId: 420,
    onSuccess (data) {
      console.log('Successful - register prepare: ', data)
      setIsPrepared(true)
    },
    onError (error) {
      setLogs('Something went wrong')
    }
  })

  const { data, write, isLoading } = useContractWrite(config)
  const waitForTransaction = useWaitForTransaction({
    hash: data?.hash,
    onSettled (data, error) {
      const response = data ? data.logs[0].topics[1] : []
      console.log('Settled', response)
      setLogs(
        'Attestation has been saved to contract.. attestationId: ' + response
      )
    }
  })

  return (
    <>
      {isPrepared ? (
        <Button
          colorScheme='primary'
          p='10'
          borderRadius='2xl'
          disabled={!isPrepared}
          onClick={() => {
            write?.()
            if (isPrepared) {
            }
          }}
        >
          Attest
        </Button>
      ) : (
        <>
          <Spinner />
        </>
      )}
      {isLoading && <Spinner />}
    </>
  )
}

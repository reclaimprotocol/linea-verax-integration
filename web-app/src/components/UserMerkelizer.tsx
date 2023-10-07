import { Identity } from '@semaphore-protocol/identity'
import { useAccount } from 'wagmi'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import RECLAIM from '../../contract-artifacts/Reclaim.json'
import { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Button, Spinner, Text } from '@chakra-ui/react'
import LogsContext from '../context/LogsContext'

export default function UserMerkelizer ({ proofObj }: any) {
  const { address } = useAccount()
  const { _logs, setLogs } = useContext(LogsContext)
  const [identity, setIdentity] = useState<Identity>()
  const [isPrepared, setIsPrepared] = useState(false)
  const [error, setError] = useState<boolean>(false)
  const [sent, setSent] = useState<boolean>(false)

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

  const { config } = usePrepareContractWrite({
    enabled: true,
    // @ts-expect-error events
    address: process.env.NEXT_PUBLIC_RECLAIM_CONTRACT_ADDRESS!,
    abi: RECLAIM.abi,
    functionName: 'merkelizeUser',
    args: [proofReq, identity?.commitment.toString()],
    chainId: 420,
    onSuccess (data) {
      console.log('Successful - register prepare: ', data)
      setIsPrepared(true)
      // setLogs('User has been merkelized successfully')
    },
    onError (error) {
      console.log('Error in verify Proof cause: ', error.cause)
      console.log('Error in verify Proof message: ', error.message)
      console.log('Error in verify Proof name: ', error.name)
      if (error.message.includes('AlreadyMerkelized')) {
        setLogs('This user is already merkelized!!!!')
      }
      setError(true)
    }
  })

  const { data, write, isLoading } = useContractWrite(config)

  return (
    <>
      <Button
        disabled={!isPrepared}
        onClick={() => {
          write?.()
          if (isPrepared) {
            setLogs('User has been merkelized successfully')
            setSent(true)
          }
        }}
        colorScheme={isPrepared ? 'primary' : 'gray'}
        p='10'
        borderRadius='2xl'
      >
        {isPrepared
          ? !sent
            ? 'Register Identity'
            : 'User has been merkelized successfully!'
          : 'This user is already merkelized'}
      </Button>
      {isLoading && <Spinner />}
    </>
  )
}

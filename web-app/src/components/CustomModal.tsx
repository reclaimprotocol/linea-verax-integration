import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Spinner,
  VStack,
  HStack,
  Text,
  Container,
  Divider
} from '@chakra-ui/react'
import { useContractRead } from 'wagmi'
import ATTESTATION_REGISTRY from '../../contract-artifacts/AttestationRegistry.json'
import { useState } from 'react'
import { ethers } from 'ethers'

type attestAtionDataType = {
  attestationData: string
  attestationId: string
  attestedDate: number
  attester: string
  expirationDate: number
  portal: string
  replacedBy: string
  revocationDate: number
  revoked: boolean
  schemaId: string
  subject: string
  version: number
}

export function CustomModal ({ attestationId }: { attestationId: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [data, setData] = useState<attestAtionDataType | null>(null)

  const { isError, isLoading, isSuccess } = useContractRead({
    address: '0x345ad20d8c6a84ee43d9713aee17e0f1a0183571',
    chainId: 420,
    functionName: 'getAttestation',
    abi: ATTESTATION_REGISTRY.abi,
    args: [attestationId],
    onSuccess (data) {
      setData(data as attestAtionDataType)
    }
  })

  return (
    <>
      <Button onClick={onOpen}>Retrieve Attestation from Verax</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Attestation Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading && <Spinner />}
            {isSuccess && (
              <>
                <VStack>
                  {Object.entries(data!).map((value, key, n) => {
                    if (value[0] == 'expirationDate') return <></>
                    if (value[0] == 'revoked') return <></>
                    if (value[0] == 'revocationDate') return <></>
                    if (value[0] == 'attestedDate') return <></>
                    if (value[0] == 'version') return <></>
                    //   if (value[0] == 'attestationData') {
                    //     console.log('f', ethers.toUtf8Bytes(value[1] as string))

                    //     const f = ethers.AbiCoder.defaultAbiCoder().decode(
                    //       ['(string)'],
                    //       ethers.toUtf8Bytes(
                    //         (value[1] as string).slice(2, value[1].length)
                    //       )
                    //     )
                    //     console.log('f', f)
                    //   }
                    return (
                      <Container>
                        <Text fontSize='small'>{value[0]}</Text>
                        <Text>{value[1]}</Text>
                        <Divider />
                      </Container>
                    )
                  })}
                </VStack>
              </>
            )}

            {isError && (
              <Text>Error happened when retrieving the attestation data</Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

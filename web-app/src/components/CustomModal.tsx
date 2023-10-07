import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button
} from '@chakra-ui/react'
import { useContractRead } from 'wagmi'
import ATTESTATION_REGISTRY from '../../contract-artifacts/AttestationRegistry.json'
import { useState } from 'react'

export function CustomModal ({ attestationId }: { attestationId: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [data, setData] = useState(null)
  const { isError, isLoading, isSuccess } = useContractRead({
    address: '0x345ad20d8c6a84ee43d9713aee17e0f1a0183571',
    chainId: 420,
    functionName: 'getAttestation',
    abi: ATTESTATION_REGISTRY.abi,
    args: [attestationId],
    onSuccess (data) {
      setData(data as any)
      console.log(data)
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
          {/* <ModalBody>{data}</ModalBody> */}

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

import {
  Box,
  Button,
  Flex,
  HStack,
  Popover,
  PopoverContent,
  PopoverTrigger as OrigPopoverTrigger,
  Spacer,
  Text,
  VStack,
  Wrap,
  WrapItem,
  useDisclosure,
} from '@chakra-ui/react';
import numeral from 'numeral';
import { PoolTokenPill } from '~/components/token/PoolTokenPill';
import PoolOwnerImage from '~/assets/images/pool-owner.png';
import Image from 'next/image';
import { HelpCircle } from 'react-feather';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { AddressZero } from '@ethersproject/constants';
import { usePool } from '~/modules/pool/lib/usePool';
import { getProjects } from '~/modules/pool/lib/getProjects';
import { PoolAboutThisProjectModal } from './PoolAboutThisProjectModal';

function PoolHeader() {
  const networkConfig = useNetworkConfig();
  const { pool } = usePool();

  // temp fix: https://github.com/chakra-ui/chakra-ui/issues/5896#issuecomment-1104085557
  const PopoverTrigger: React.FC<{ children: React.ReactNode }> = OrigPopoverTrigger;

  const hasBeetsOwner = pool.owner === networkConfig.beetsPoolOwnerAddress;
  const hasZeroOwner = pool.owner === AddressZero;
  const swapFeeType = hasZeroOwner ? 'Fixed' : 'Dynamic';
  const tooltipText1 = `Liquidity providers earn ${swapFeeType.toLowerCase()} swap fees on every trade utilizing the liquidity in this pool.`;
  const tooltipText2 = `Dynamic swap fees are controlled by the ${
    hasBeetsOwner ? 'Vertek Liquidity Committee Multisig' : 'pool owner'
  }.`;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const projects = getProjects();
  const project = projects.find(e => e.id == pool.id);
  return (
    <VStack width="full" alignItems="flex-start" mb="12">
      <Text textStyle="h3" as="h3" fontWeight="bold" mr="0" display={{ base: 'block', lg: 'none' }}>
        {pool.name}
      </Text>
      <Wrap>
        <WrapItem display={{ base: 'none', lg: 'flex' }}>
          <Text textStyle="h3" as="h3" fontWeight="bold" mr="4">
            {pool.name}
          </Text>
        </WrapItem>
        {pool.tokens.map((token, index) => (
          <WrapItem key={index} >
            <PoolTokenPill token={token} />
          </WrapItem>
        ))}
      </Wrap>
      <Flex minWidth="100%" align="center">
        <Popover trigger="hover" placement="auto">
          <PopoverTrigger>
            <HStack
              paddingX="4"
              paddingY="1"
              spacing="4"
              fontSize="md"
              rounded="full"
              color="beets.base.50"
              justifyContent="center"
              fontWeight="semibold"
            >
              {!hasZeroOwner && (
                <Flex alignItems="center">
                  {hasBeetsOwner ? (
                    <Image src={PoolOwnerImage} width="24" height="24" alt="Pool Owner Image" />
                  ) : (
                    <HelpCircle size="24" />
                  )}
                </Flex>
              )}
              <HStack spacing="1">
                <Text>{numeral(pool.dynamicData.swapFee).format('0.0[00]%')}</Text>
                <Text>{swapFeeType} Fee</Text>
              </HStack>
            </HStack>
          </PopoverTrigger>
          <PopoverContent w="250px" borderRadius="12px" padding="1" bgColor="black" >
            <Box className="verteklightpurplebox" padding="4" borderRadius="12px"
                fontSize="md" >
              {tooltipText1} {!hasZeroOwner && tooltipText2}
            </Box>
          </PopoverContent>
        </Popover>
        <Spacer />
        <Box>
          {project && <Button variant="primary" onClick={() => { onOpen(); }}>
            About this project
          </Button>}
          {project && <PoolAboutThisProjectModal isOpen={isOpen} onClose={onClose} pool={pool} name={project.name} description={project.description} />}
        </Box>
      </Flex>
    </VStack>
  );
}

export default PoolHeader;

import * as React from "react";
import { Box, Button, Flex, HStack, Image, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import NavbarWalletConnectButton from './NavbarWalletConnectButton';
import { useGetProtocolDataQuery } from '~/apollo/generated/graphql-codegen-generated';
import { NavbarLink } from '~/modules/nav/NavbarLink';
import numeral from 'numeral';
import NextImage from 'next/image';
import TokenAvatar from '~/components/token/TokenAvatar';
import { useRouter } from 'next/router';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { FadeInOutBox } from '~/components/animation/FadeInOutBox';
import { NavbarPendingRewards } from '~/modules/nav/NavbarPendingRewards';
import { BeetsBalLogo } from '~/assets/logo/BeetsBalLogo';
import { NextLink } from '~/components/link/NextLink';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { networkConfig } from '~/lib/config/network-config';
import { NetworkSelectorPopover } from '~/modules/nav/NetworkSelectorPopover';
import { BeetsLogo } from '~/assets/logo/BeetsLogo';
import { BeetsLogoNoText } from '~/assets/logo/BeetsLogoNoText'; 
import  vertek  from '~/assets/logo/vertek.png'; 
import { useState } from 'react';



interface Props {
  scrollY: MotionValue<number>;
}

export function Navbar({ scrollY }: Props) {
  const { chainId } = useNetworkConfig();
  const router = useRouter();
  const opacity = useTransform(scrollY, [0, 32], [0, 1]);
  const { isConnected } = useUserAccount();
  const networkConfig = useNetworkConfig();
  const { data, loading } = useGetProtocolDataQuery({ fetchPolicy: 'cache-first' });
  const protocolData = data?.protocolData;
  const beetsPrice = data?.beetsPrice;
  const [activeLink, setActiveLink] = useState('/pools');
  return (
    <>
      <Box
        width="full"
        position="sticky"
        top="0"
        zIndex="3"
        height="92px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        borderBottomColor="vertek.slatepurple.600"
        borderBottomWidth="1px"
        padding="24px, 40px, 0px, 40px"
      >
        <Flex px={{ base: '4', xl: '8' }} py="0" alignItems="center">
          <motion.div
            style={{ opacity, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <Box width="full" height="full" bg="vertek.slatepurple.900" shadow="xl" />
          </motion.div>
          <Flex alignItems="center" mr="6" zIndex="2" cursor="pointer" bgColor="vertek.slate.gradient">
            <NextLink href="/" chakraProps={{ _focus: { boxShadow: 'none' } }}>
              {chainId === '10' ? (
                <BeetsBalLogo width="132px" />
              ) : (
                <Box mb="2">
                  <BeetsLogo width="132px" />
                </Box>
              )}
            </NextLink>
          </Flex>

          <Box 
            flex="1" 
            zIndex="2" 
            margin="16px"  
              >
            <Flex alignItems="center" display={{ base: 'none', md: 'flex' }} >
              <NavbarLink 
                href={'/pools'}
                selected={router.asPath.startsWith('/pool')}
                text="Earn"
                mr="5"
                >
                
              </NavbarLink>
              <NavbarLink 
                href={'/swap'} 
                selected={router.asPath === '/swap'} 
                text="Swap" 
                mr="5" 
                
                />
              {/* {networkConfig.stakeUrl && (
                <NavbarLink href={networkConfig.stakeUrl} text="Stake" mr={5} />
              )} */}
              <NavbarLink
                href={'/staking'}
                selected={router.asPath === '/staking'}
                text="Stake"
                mr="5"
              />
              <NavbarLink
                href={'/voting'}
                selected={router.asPath === '/voting'}
                text="Portfolio"
                mr="5"
              />
              {networkConfig.launchUrl && (
                <NavbarLink href={networkConfig.launchUrl} text="Claim" mr={5} />
              )}

              {/*<NavbarAdditionalLinksMenu />*/}
            </Flex>
          </Box>
          <FadeInOutBox mr="5" isVisible={isConnected}>
            <HStack spacing="3"> 
              <NetworkSelectorPopover>
                <Button
                  bgColor="transparent"
                  width="50px"
                  height="40px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  _hover={{ transform: 'scale(1.1)' }}
                  px="0"
                >
                  <Image mr="8" width="24px" height="24px" src={networkConfig.eth.iconUrl} />
                </Button>
              </NetworkSelectorPopover>
              <NextImage width="28px" height="28px" src={vertek}/>
          {loading && !beetsPrice ? (
            <Skeleton height="16px" width="54px" />
          ) : (
            <Text fontWeight="semibold" color="white" fontSize={{ base: 'sm', lg: 'md' }}>
              {numeral(beetsPrice).format('$0.00[00]')}
            </Text>
          )}
               {/* <NavbarPendingRewards /> */}
              {/* <NavbarAlerts />
              <NavbarPortfolioDrawer /> */}
            </HStack>
          </FadeInOutBox>
          <NavbarWalletConnectButton />
        </Flex>
      </Box>
    </>
  );
}

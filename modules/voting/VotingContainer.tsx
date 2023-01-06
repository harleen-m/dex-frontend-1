import { GaugeList } from './components/GaugeList';
import { useVotingGauges } from '../../lib/global/gauges/useVotingGauges';
import { Box, Button, Grid, GridItem, SimpleGrid, Text } from '@chakra-ui/react';
import { GaugeActionCard } from './components/GaugeActionCard';
import { VotingPageSub } from './components/VotingPageSub';
import { GaugeActionCard1 } from './components/GaugeActionCard1';
import { useUserVeLockInfoQuery } from './lib/useUserVeLockInfoQuery';
import { useEffect, useState } from 'react';
import { VotingGaugeWithVotes } from '~/lib/services/staking/types';
import { UserTokenBalancesProvider, useUserTokenBalances } from '~/lib/user/useUserTokenBalances';
import { UserDataProvider, useUserData } from '~/lib/user/useUserData';
import { networkConfig } from '~/lib/config/network-config';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { numberFormatUSDValue } from '~/lib/util/number-formats';

export function VotingContainer() {
  const [hasLock, setHasLock] = useState<boolean>(false);
  const [hasExpiredLock, setExpiredHasLock] = useState<boolean>(false);
  const [activeVotingGauge, setActiveVotingGauge] = useState<VotingGaugeWithVotes | null>(null);
  const [userPoolBalance, setUserPoolBalance] = useState<{
    balance: string;
    usdValue: string;
  }>({
    balance: '0',
    usdValue: '0',
  });

  const {
    isLoading: loadingGauges,
    votingGauges,
    unallocatedVotes,
    votingPeriodEnd,
    votingPeriodLastHour,
    refetch: refetchVotingGauges,
  } = useVotingGauges();

  const { isConnected } = useUserAccount();
  const { userLockInfo } = useUserVeLockInfoQuery();
  const { loading: loadingBalances, bptBalanceForPool, usdBalanceForPool } = useUserData();

  useEffect(() => {
    if (!loadingBalances && isConnected) {
      setUserPoolBalance({
        balance: bptBalanceForPool(networkConfig.balancer.votingEscrow.lockablePoolId),
        usdValue: numberFormatUSDValue(
          usdBalanceForPool(networkConfig.balancer.votingEscrow.lockablePoolId),
        ),
      });
    }
  }, [loadingBalances, isConnected]);

  // set user lock info
  useEffect(() => {
    if (isConnected && userLockInfo) {
      if (userLockInfo.hasExistingLock && !userLockInfo.isExpired) {
        setHasLock(true);
      }

      if (userLockInfo.hasExistingLock && userLockInfo.isExpired) {
        setExpiredHasLock(true);
      }
    }
  }, [isConnected, userLockInfo]);

  function setActiveGaugeVote(votingGauge: VotingGaugeWithVotes) {
    setActiveVotingGauge(votingGauge);
  }

  function handleModalClose() {
    setActiveVotingGauge(null);
    refetchVotingGauges();
  }

  function handleVoteSuccess() {
    refetchVotingGauges();
  }

  return (
    <UserDataProvider>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 4 }} paddingX={4} paddingY={2} spacing={4}>
        <GridItem
          bg="vertek.slatepurple.900"
          boxShadow="0 0 10px #5BC0F8, 0 0 20px #4A4AF6"
          borderRadius="25px"
          maxW="550px"
          color="white"
        >
          <Grid paddingX="2" paddingY="2">
            <GridItem mt="2">
              <Text fontSize="1.2rem" fontWeight="bold" textAlign="center">
                My 80VRTK-20BNB
              </Text>
            </GridItem>
            <GridItem mt="3">
              <Text
                alignItems="center"
                fontSize="1.2rem"
                justifyContent="center"
                textAlign="center"
              >
                {userPoolBalance.usdValue}
              </Text>
            </GridItem>
            <GridItem mt="-1">
              <Text alignItems="center" fontSize="1rem" justifyContent="center" textAlign="center">
                {userPoolBalance.balance}
              </Text>
            </GridItem>
            <GridItem mt={{ base: '3', lg: '6' }}>
              <Box display="flex" justifyContent="center">
                <Button variant="verteklight" width="80%">
                  Button
                </Button>
              </Box>
            </GridItem>
          </Grid>
        </GridItem>

        <GaugeActionCard heading="My locked 80VRTK-20BNB" />
        <GaugeActionCard1 heading="Locked until" />
        <GaugeActionCard1 heading="My veVRTK" />
      </SimpleGrid>
      <VotingPageSub />
      <GaugeList votingGauges={votingGauges} />
    </UserDataProvider>
  );
}

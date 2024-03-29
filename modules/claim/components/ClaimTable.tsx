import { Box, Button, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { GqlBaseTokenReward } from '~/apollo/generated/graphql-codegen-generated';
import { useUserPendingRewards } from '../lib/useUserRewards';
import { useVrtkClaimAll } from '../lib/useVrtkClaimAll';
import { ClaimListItem } from './ClaimListItem';

interface Props {
  stakingRewards: GqlBaseTokenReward[];
}

export function ClaimTable({ stakingRewards }: Props) {
  const { claimAll, txState: claimTxState } = useVrtkClaimAll();
  const { refetchRewards } = useUserPendingRewards();

  useEffect(() => {
    if (claimTxState.error) {
      console.error(claimTxState.error);
    }

    if (claimTxState.isConfirmed) {
      claimTxState.reset();
      refetchRewards();
    }
  }, [claimTxState]);

  async function handleUserClaimAll() {
    if (!stakingRewards.length) return;

    const gauges = stakingRewards.map((reward) => reward.pool.staking?.gauge?.gaugeAddress || '');
    console.log(gauges);
    claimAll(gauges);
  }

  return (
    <>
      <Box
        mt="3"
        height="100%"
        paddingX={{ base: '2', lg: '0' }}
        borderRadius="16px"
        overflow="hidden"
        boxShadow={{ base: 'none', lg: '0 0px 5px #5BC0F8, 0 0px 10px #4A4AF6' }}
      >
        <Grid
          display={{ base: 'none', lg: 'grid' }}
          paddingX="6"
          paddingY="4"
          templateColumns={{
            base: 'repeat(1fr 1fr)',
            lg: '1fr 3fr 1fr 1fr 1fr',
          }}
          bg="vertek.slatepurple.900"
        >
          <GridItem>
            <Text fontWeight="bold">Pools</Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold"></Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" textAlign="left">
              Amount
            </Text>
          </GridItem>
          <GridItem justifyContent="center" display="flex">
            <Text fontWeight="bold">Value</Text>
          </GridItem>
        </Grid>

        {stakingRewards.map((reward) => {
          return <ClaimListItem key={reward.pool.address} reward={reward} />;
        })}

        <Flex
          display={{ base: 'grid', lg: 'grid' }}
          p="3"
          mt={{ base: '-1rem', lg: '0rem' }}
          borderLeftWidth={{ base: '0px', lg: '1px' }}
          borderRightWidth={{ base: '0px', lg: '1px' }}
          borderBottomWidth={{ base: '0px', lg: '1px' }}
          borderColor="#4A4AF6"
          borderBottomRadius="16px"
          bg={{ base: 'none', lg: 'vertek.slatepurple.900' }}
          justifyContent={{ base: 'center', lg: 'flex-end' }}
        >
          <Button
            display={{ base: 'none', lg: 'flex' }}
            variant="verteklight"
            padding="1em"
            borderRadius="10px"
            mt="1"
            ml="4"
            borderWidth="1px"
            alignItems="center"
            height="2em"
            disabled={!stakingRewards.length || claimTxState.isPending}
            width={{ base: '200px', lg: '125px' }}
            onClick={handleUserClaimAll}
          >
            Claim All
          </Button>
          <Button
            display={{ base: 'flex', lg: 'none' }}
            variant="verteklight"
            padding="1em"
            borderRadius="10px"
            mt="1"
            borderWidth="1px"
            alignItems="center"
            height="2em"
            width={{ base: '200px', lg: 'none' }}
            disabled={!stakingRewards.length || claimTxState.isPending}
            onClick={handleUserClaimAll}
          >
            Claim All
          </Button>
        </Flex>
      </Box>
    </>
  );
}

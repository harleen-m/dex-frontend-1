import { Box, Button, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import { memo, useEffect } from 'react';
import { GqlBaseTokenReward } from '~/apollo/generated/graphql-codegen-generated';
import { TokenAvatarSetInList } from '~/components/token/TokenAvatarSetInList';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { useProtocolRewardClaim } from '../lib/useProtocolRewardsClaim';
import { useUserPendingRewards } from '../lib/useUserRewards';
import { MobileLabelLeft, StatGridItemRight, MobileLabelRight } from './ClaimTableUtils';

const MemoizedTokenAvatarSetInList = memo(TokenAvatarSetInList);

type Props = {
  rewards: GqlBaseTokenReward[];
};

export function ProtocolRewardsList({ rewards }: Props) {
  const { claimProtocolRewards, claimTxState } = useProtocolRewardClaim();
  const { refetchAll } = useUserPendingRewards();

  useEffect(() => {
    if (claimTxState.isConfirmed) {
      claimTxState.reset();
      refetchAll();
    }
  }, [claimTxState]);

  function handleUserClaim() {
    claimProtocolRewards(rewards.map((rw) => rw.token.address));
  }

  return (
    <>
      <Box
        borderRadius="16px"
        mt="2"
        paddingX={{ base: '2', lg: '0' }}
        overflow="hidden"
        boxShadow={{ base: 'none', lg: '0 0px 5px #5BC0F8, 0 0px 10px #4A4AF6' }}
      >
        <Grid
          display={{ base: 'none', lg: 'grid' }}
          paddingX="6"
          paddingY="4"
          borderTopRadius="16px"
          templateColumns={{
            base: 'repeat(1fr 1fr)',
            lg: '1fr 3fr 1fr 1fr 1fr',
          }}
          gap="0"
          bg="vertek.slatepurple.900"
        >
          <GridItem>
            <Text fontWeight="bold">Reward</Text>
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

        {rewards.map((reward) => {
          return (
            <Box
              borderTopColor="#4A4AF6"
              boxShadow={{ base: '0 0 5px #5BC0F8, 0 0 10px #4A4AF6', lg: 'none' }}
              borderTopWidth="1px"
            >
              <Grid
                pl="4"
                pr="4"
                py="2"
                templateColumns={{
                  base: 'repeat(1fr 1fr)',
                  lg: '1fr 3fr 1fr 1fr 1fr',
                }}
                gap="0"
                alignItems="center"
                templateAreas={{
                  base: `
                  "icons icons"
                  "name name"
                  "shares value"
                  "claim claim" `,
                  lg: `"icons name shares value claim"`,
                }}
              >
                <GridItem area="icons" mb={{ base: '6', lg: '0' }}>
                  <Box display="flex" justifyContent={{ base: 'center', lg: 'flex-start' }}>
                    <MemoizedTokenAvatarSetInList
                      imageSize={28}
                      width={92}
                      tokens={reward.tokenList}
                    />
                  </Box>
                </GridItem>

                <GridItem area="name">
                  <MobileLabelLeft text="Pool" />
                  <Text textAlign="left">{reward.pool.name}</Text>
                </GridItem>

                <GridItem area="shares" textAlign="left">
                  <MobileLabelLeft text="My balance" />
                  <Text
                    fontSize={{ base: '1rem', lg: 'md' }}
                    fontWeight={{ base: 'bold', lg: 'normal' }}
                    textAlign="left"
                  >
                    {tokenFormatAmount(reward.amount)}
                  </Text>
                </GridItem>

                <StatGridItemRight area="value">
                  <MobileLabelRight text="Value" />
                  <Text
                    fontSize={{ base: '1rem', lg: 'md' }}
                    fontWeight={{ base: 'bold', lg: 'normal' }}
                  >
                    {numberFormatUSDValue(reward.valueUSD)}
                  </Text>
                </StatGridItemRight>
              </Grid>
            </Box>
          );
        })}

        <Box>
          <Flex
            display={{ base: 'none', lg: 'grid' }}
            p="3"
            borderLeftWidth="1px"
            borderRightWidth="1px"
            borderBottomWidth="1px"
            borderColor="#4A4AF6"
            borderBottomRadius="16px"
            bg={{ base: 'none', lg: 'vertek.slatepurple.900' }}
            justifyContent={{ base: 'center', lg: 'flex-end' }}
          >
            <Button
              display={{ base: 'none', lg: 'flex' }}
              variant={claimTxState.isPending ? 'vertekdark' : 'verteklight'}
              padding="1em"
              borderRadius="10px"
              mt="1"
              ml="4"
              borderWidth="1px"
              alignItems="center"
              height="2em"
              disabled={false}
              width={{ base: '200px', lg: '125px' }}
              isDisabled={!rewards.length || claimTxState.isPending}
              onClick={handleUserClaim}
            >
              Claim
            </Button>
          </Flex>
        </Box>
      </Box>
    </>
  );
}

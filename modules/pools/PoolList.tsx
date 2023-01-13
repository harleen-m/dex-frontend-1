import { Alert, AlertIcon, Box, Button, Link, Text } from '@chakra-ui/react';
import { NetworkStatus } from '@apollo/client';
import { usePoolList } from './usePoolList';
import { PoolListItem } from '~/modules/pools/components/PoolListItem';
import { PoolListTableHeader } from '~/modules/pools/components/PoolListTableHeader';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import { PoolListTop } from '~/modules/pools/components/PoolListTop';
import { useUserData } from '~/lib/user/useUserData';
import { useEffect } from 'react';
import { orderBy } from 'lodash';
import { PoolListMobileHeader } from '~/modules/pools/components/PoolListMobileHeader';
import { networkConfig } from '~/lib/config/network-config';
import { useGetTokens } from '~/lib/global/useToken';
import { GqlPoolMinimalFragment } from '~/apollo/generated/graphql-codegen-generated';
import { GaugeListTableHeader } from '../voting/components/GaugeListTableHeader';
import { GaugeListItem } from '../voting/components/GaugeListItem';
import { PoolListFooter } from './components/PoolListFooter';

function PoolList() {
  const { getToken } = useGetTokens();
  const {
    pools,
    refetch,
    loading,
    networkStatus,
    state,
    count,
    setPageSize,
    setPoolIds,
    showMyInvestments,
  } = usePoolList();
  const { userPoolIds, usdBalanceForPool, hasBptInWalletForPool } = useUserData();
  const userPoolIdsStr = userPoolIds.join();

  useEffect(() => {
    if (showMyInvestments) {
      setPoolIds(userPoolIds).catch();
    }
  }, [userPoolIdsStr, showMyInvestments]);

  const poolsToRender = showMyInvestments
    ? orderBy(pools, (pool) => usdBalanceForPool(pool.id), 'desc')
    : pools;
  const poolCount = count || 0;
  const hasUnstakedBpt =
    showMyInvestments &&
    pools.filter((pool) => pool.dynamicData.apr.hasRewardApr && hasBptInWalletForPool(pool.id))
      .length > 0;

  return (
    <Box>
      <PoolListMobileHeader />
      <PoolListTop />

      {hasUnstakedBpt && (
        <Alert status="warning" mb="4">
          <AlertIcon />
          You have unstaked BPT in your wallet. Incentivized pools offer additional rewards that
          will accumulate over time when your BPT are staked.
        </Alert>
      )}
        <Box 
          mt="3rem" 
          boxShadow={{base: "none", lg:"0 0 10px #5BC0F8, 0 0 20px #4A4AF6" }} 
          mb="8rem" 
          borderRadius="16px" 
          flexDirection="column" 
          display="flex"
          >
            <PoolListTableHeader />
            {poolsToRender.map((item, index) => (
            
              <PoolListItem
                key={index}
                pool={item}
                userBalance={`${usdBalanceForPool(item.id)}`}
                showUserBalance={showMyInvestments}
                borderBottomColor="vertek.slatepurple.600"
                borderBottomWidth={index === pools.length - 1 ? 0 : 1}
                bg="vertek.slatepurple.900"
                padding={{ base: "12px", lg:"6px"}}
                tokens={item.allTokens
                  .filter((token) => !token.isNested && !token.isPhantomBpt)
                  .map((token) => ({
                    ...token,
                    logoURI: getToken(token.address)?.logoURI || undefined,
                  }))}
                hasUnstakedBpt={item.dynamicData.apr.hasRewardApr && hasBptInWalletForPool(item.id)}
              />

              ))}
              <PoolListFooter />
            </Box>



      {/* <PaginatedTable
        borderRadius="16px"
        items={poolsToRender}
        bgColor={{base:"none", lg:"vertek.slate.900"}} 
        // bgColor here renders the space between the end of the Pool list, and the "footer"
        // base vs. lg styles is to maintain distinct boundaries between cards on mobile 
        boxShadow={{base: "none", lg:"0 0 10px #5BC0F8, 0 0 20px #4A4AF6" }} 
        currentPage={state.skip / state.first + 1}
        pageSize={state.first}
        count={poolCount}
        onPageChange={(page) => {
          refetch({ ...state, skip: state.first * (page - 1) });
        }}
        loading={loading}
        fetchingMore={networkStatus === NetworkStatus.refetch}
        onPageSizeChange={setPageSize}
        renderTableHeader={() => <PoolListTableHeader />}
        renderTableRow={(item: GqlPoolMinimalFragment, index) => {
          return (
            <PoolListItem
              key={index}
              pool={item}
              userBalance={`${usdBalanceForPool(item.id)}`}
              showUserBalance={showMyInvestments}
              borderBottomColor="vertek.slatepurple.600"
              borderBottomWidth={index === pools.length - 1 ? 0 : 1}
              bg="vertek.slatepurple.900"
              padding={{ base: "12px", lg:"6px"}}
              tokens={item.allTokens
                .filter((token) => !token.isNested && !token.isPhantomBpt)
                .map((token) => ({
                  ...token,
                  logoURI: getToken(token.address)?.logoURI || undefined,
                }))}
              hasUnstakedBpt={item.dynamicData.apr.hasRewardApr && hasBptInWalletForPool(item.id)}
            />
          );
        }}
      /> */}


      <Box mt="10">
        <Text fontSize="xl" color="white" mb="4">
          Can&apos;t find what you&apos;re looking for?
        </Text>
        <Button variant="verteklight" size="md" as={Link} href={networkConfig.createPoolUrl}>
          Compose a pool
        </Button>
      </Box>
    </Box>
  );
}

export default PoolList;

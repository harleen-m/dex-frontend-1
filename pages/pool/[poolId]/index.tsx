import { useRouter } from 'next/router';
import {
  GetPoolQuery,
  GetPoolQueryVariables,
  GqlPoolUnion,
} from '~/apollo/generated/graphql-codegen-generated';
import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetPool } from '~/apollo/generated/operations';
import { Pool } from '~/modules/pool/detail/Pool';
import { PoolProvider } from '~/modules/pool/lib/usePool';
import Head from 'next/head';
import { FallbackPlaceholder } from '~/components/fallback/FallbackPlaceholder';
import { PoolUserBptBalanceProvider } from '~/modules/pool/lib/usePoolUserBptBalance';
import { PoolUserDepositBalanceProvider } from '~/modules/pool/lib/usePoolUserDepositBalance';
import { PoolUserInvestedTokenBalanceProvider } from '~/modules/pool/lib/usePoolUserInvestedTokenBalances';
import { PoolUserPendingRewardsProvider } from '~/modules/pool/lib/usePoolUserPendingRewards';
import { PoolUserTokenBalancesInWalletProvider } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { PoolComposableUserPoolTokenBalanceProvider } from '~/modules/pool/lib/usePoolComposableUserPoolTokenBalances';

interface Props {
  pool: GqlPoolUnion;
}

const PoolPage = ({ pool }: Props) => {
  const router = useRouter();
  if (router.isFallback) {
    return <FallbackPlaceholder />;
  }

  return (
    <>
      <Head>
        <title>Vertex | {pool.name}</title>
        <meta name="title" content={`Vertex | ${pool.name}`} />
        <meta property="og:title" content={`Vertex | ${pool.name}`} />
        <meta property="twitter:title" content={`Vertex | ${pool.name}`} />
      </Head>
      <PoolProvider pool={pool}>
        <PoolUserBptBalanceProvider>
          <PoolUserDepositBalanceProvider>
            <PoolUserInvestedTokenBalanceProvider>
              <PoolUserPendingRewardsProvider>
                <PoolUserTokenBalancesInWalletProvider>
                  <PoolComposableUserPoolTokenBalanceProvider>
                    <Pool />
                  </PoolComposableUserPoolTokenBalanceProvider>
                </PoolUserTokenBalancesInWalletProvider>
              </PoolUserPendingRewardsProvider>
            </PoolUserInvestedTokenBalanceProvider>
          </PoolUserDepositBalanceProvider>
        </PoolUserBptBalanceProvider>
      </PoolProvider>
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps({ params }: { params: { poolId: string } }) {
  const client = initializeApolloClient();
  const { data } = await client.query<GetPoolQuery, GetPoolQueryVariables>({
    query: GetPool,
    variables: { id: params.poolId },
  });

  //pre-load the fbeets ratio for fidelio duetto
  /*if (params.poolId === networkConfig.fbeets.poolId) {
        await client.query({ query: GetFbeetsRatio });
    }*/

  return loadApolloState({
    client,
    props: { pool: data.pool },
  });
}

export default PoolPage;

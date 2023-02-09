import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { useUserData } from '~/lib/user/useUserData';
import { getAprValues } from '~/lib/util/apr-utils';

interface Props {
  pool: GqlPoolUnion;
}

function PoolHeaderStats({ pool }: Props) {
  const { boostForPool } = useUserData();

  const boost = boostForPool(pool.id);
  const { minApr, maxApr, boostedTotalAPR } = getAprValues(pool.dynamicData.apr, boost);

  return (
    <>
      <Flex>
        <Box bg="gray.900" shadow="lg" rounded="lg" p={3} mr={2}>
          <Text color="gray.400" mb={1}>
            Pool value
          </Text>
          <Text fontSize={'2xl'}>{numeral(pool.dynamicData.totalLiquidity).format('$0,0')}</Text>
        </Box>
        <Box bg="gray.900" shadow="lg" rounded="lg" p={3} mr={2}>
          <Text color="gray.400" mb={1}>
            Volume (24h)
          </Text>
          <Text fontSize={'2xl'}>{numeral(pool.dynamicData.volume24h).format('$0,0')}</Text>
        </Box>
        <Box bg="gray.900" shadow="lg" rounded="lg" p={3} mr={2}>
          <Text color="gray.400" mb={1}>
            Fees (24h)
          </Text>
          <Text fontSize={'2xl'}>{numeral(pool.dynamicData.fees24h).format('$0,0.[00]')}</Text>
        </Box>
        <Box bg="gray.900" shadow="lg" rounded="lg" p={3}>
          <Text color="gray.400" mb={1}>
            APR (24h)
          </Text>
          <AprTooltip
            data={pool.dynamicData.apr}
            textProps={{ fontSize: '2xl', fontWeight: 'normal' }}
            boost={boost.boost}
            minApr={minApr}
            maxApr={maxApr}
            boostedTotalAPR={boostedTotalAPR}
          />
        </Box>
      </Flex>
    </>
  );
}

export default PoolHeaderStats;

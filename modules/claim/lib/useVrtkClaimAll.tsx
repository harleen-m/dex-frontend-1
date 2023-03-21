import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';

export function useVrtkClaimAll() {
  const networkConfig = useNetworkConfig();

  const { submit, ...rest } = useSubmitTransaction({
    config: {
      addressOrName: networkConfig.balancer.balMinter,
      contractInterface: ['function mintMany(address[]) external'],
      functionName: 'mintMany',
    },
    transactionType: 'HARVEST',
  });

  function claimAll(gaugeAddresses: string[]) {
    return submit({
      args: [gaugeAddresses],
      toastText: 'Claim pending gauge rewards',
    });
  }

  return {
    claimAll,
    txState: rest,
  };
}

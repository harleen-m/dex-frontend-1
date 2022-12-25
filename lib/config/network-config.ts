import { NetworkConfig } from '~/lib/config/network-config-type';
import { bscNetworkConfig } from './bsc';
import { goerliNetworkConfig } from './goerli';

const AllNetworkConfigs: { [chainId: string]: NetworkConfig } = {
  '56': bscNetworkConfig,
  '5': goerliNetworkConfig,
};

export const networkConfig = AllNetworkConfigs[process.env.NEXT_PUBLIC_CHAIN_ID || '250'];

export const networkList = [
  {
    name: bscNetworkConfig.networkShortName,
    chainId: bscNetworkConfig.chainId,
    url: 'https://beets.fi',
    iconUrl: bscNetworkConfig.eth.iconUrl,
  },
  {
    name: goerliNetworkConfig.networkShortName,
    chainId: goerliNetworkConfig.chainId,
    url: 'https://beets.fi',
    iconUrl: goerliNetworkConfig.eth.iconUrl,
  },
];

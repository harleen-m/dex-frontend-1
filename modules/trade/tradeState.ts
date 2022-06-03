import { makeVar, useReactiveVar } from '@apollo/client';
import {
    GqlSorGetSwapsResponse,
    GqlSorSwapType,
    useGetSorSwapsLazyQuery,
} from '~/apollo/generated/graphql-codegen-generated';
import { networkConfig } from '~/lib/config/network-config';

type TradeState = {
    tokenIn: string | null;
    tokenOut: string | null;
    swapType: GqlSorSwapType;
    swapAmount: string | null;
    sorResponse: GqlSorGetSwapsResponse | null;
};

type TradeContext = {
    isPreviewVisible: boolean;
};

export const tradeStateVar = makeVar<TradeState>({
    tokenIn: networkConfig.defaultTokenIn,
    tokenOut: networkConfig.defaultTokenOut,
    swapType: 'EXACT_IN',
    swapAmount: null,
    sorResponse: null,
});

export const tradeContextVar = makeVar<TradeContext>({
    isPreviewVisible: false,
});

export function useTrade() {
    // swap related data
    const tradeState = useReactiveVar(tradeStateVar);
    // overarching trade context

    const tradeContext = useReactiveVar(tradeContextVar);
    // make sure not to cache as this data needs to be always fresh
    const [load, { loading, error, data, networkStatus }] = useGetSorSwapsLazyQuery({ fetchPolicy: 'no-cache' });

    async function loadSwaps(type: GqlSorSwapType, amount: string) {
        if (
            !tradeState.tokenIn ||
            !tradeState.tokenOut ||
            (!tradeState.swapType && !type) ||
            (!tradeState.swapAmount && !amount)
        ) {
            return null;
        }

        const { data } = await load({
            fetchPolicy: 'no-cache',
            variables: {
                tokenIn: tradeState.tokenIn,
                tokenOut: tradeState.tokenOut,
                swapAmount: amount || '0',
                swapType: type,
                swapOptions: {
                    maxPools: 8,
                },
            },
        });
        const swaps = data?.swaps || null;
        tradeStateVar({
            ...tradeState,
            swapAmount: amount || tradeState.swapAmount || '0',
            sorResponse: swaps,
        });
        return swaps;
    }

    return {
        loadSwaps,
        tradeState,
        swaps: data?.swaps || null,
        loadingSwaps: loading,
        error,
        networkStatus,
        tradeContext,
    };
}

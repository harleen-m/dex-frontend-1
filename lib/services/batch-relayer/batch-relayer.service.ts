import { VaultActionsService } from '~/lib/services/batch-relayer/extensions/vault-actions.service';
import { AaveWrappingService } from '~/lib/services/batch-relayer/extensions/aave-wrapping.service';
import { BooMirrorWorldStakingService } from '~/lib/services/batch-relayer/extensions/boo-mirror-world-staking.service';
import { TarotSupplyVaultService } from '~/lib/services/batch-relayer/extensions/tarot-supply-vault.service';
import { FBeetsBarStakingService } from '~/lib/services/batch-relayer/extensions/fbeets-bar-staking.service';
import { MasterChefStakingService } from '~/lib/services/batch-relayer/extensions/masterchef-staking.service';
import { YearnWrappingService } from '~/lib/services/batch-relayer/extensions/yearn-wrapping.service';
import { networkConfig } from '~/lib/config/network-config';
import {
  EncodeBatchSwapInput,
  EncodeExitPoolInput,
  EncodeJoinPoolInput,
  EncodeMasterChefDepositInput,
  EncodeMasterChefWithdrawInput,
  EncodeReaperUnwrapInput,
  EncodeReaperWrapInput,
  EncodeUnwrapErc4626Input,
  EncodeWrapErc4626Input,
  ExitPoolData,
} from '~/lib/services/batch-relayer/relayer-types';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { AddressZero, MaxUint256, Zero } from '@ethersproject/constants';
import { PoolJoinBatchRelayerContractCallData } from '~/lib/services/pool/pool-types';
import { GqlPoolStable, GqlPoolWeighted } from '~/apollo/generated/graphql-codegen-generated';
import { isSameAddress, Swaps, SwapType, SwapV2 } from '@balancer-labs/sdk';
import { AmountScaledString, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { poolScaleSlippage } from '~/lib/services/pool/lib/util';
import { ReaperWrappingService } from '~/lib/services/batch-relayer/extensions/reaper-wrapping.service';
import { Erc4626WrappingService } from '~/lib/services/batch-relayer/extensions/erc4626-wrapping.service';

export class BatchRelayerService {
  private readonly CHAINED_REFERENCE_PREFIX = 'ba10';

  constructor(
    public readonly batchRelayerAddress: string,
    public readonly wethAddress: string,
    private readonly vaultActionsService: VaultActionsService,
    private readonly aaveWrappingService: AaveWrappingService,
    private readonly booMirrorWorldStaking: BooMirrorWorldStakingService,
    private readonly tarotSupplyVaultService: TarotSupplyVaultService,
    private readonly fBeetsBarStakingService: FBeetsBarStakingService,
    private readonly masterChefStakingService: MasterChefStakingService,
    private readonly yearnWrappingService: YearnWrappingService,
    private readonly reaperWrappingService: ReaperWrappingService,
    private readonly erc4626WrappingService: Erc4626WrappingService,
  ) {}

  public toChainedReference(key: BigNumberish): BigNumber {
    // The full padded prefix is 66 characters long, with 64 hex characters and the 0x prefix.
    const paddedPrefix = `0x${this.CHAINED_REFERENCE_PREFIX}${'0'.repeat(
      64 - this.CHAINED_REFERENCE_PREFIX.length,
    )}`;
    return BigNumber.from(paddedPrefix).add(key);
  }

  public vaultEncodeBatchSwap(params: EncodeBatchSwapInput): string {
    return this.vaultActionsService.encodeBatchSwap(params);
  }

  public vaultEncodeExitPool(params: EncodeExitPoolInput): string {
    return this.vaultActionsService.encodeExitPool(params);
  }

  public vaultEncodeJoinPool(params: EncodeJoinPoolInput): string {
    return this.vaultActionsService.encodeJoinPool(params);
  }

  public vaultConstructExitCall(params: ExitPoolData): string {
    return this.vaultActionsService.constructExitCall(params);
  }

  public masterChefEncodeDeposit(params: EncodeMasterChefDepositInput): string {
    return this.masterChefStakingService.encodeDeposit(params);
  }

  public masterChefEncodeWithdraw(params: EncodeMasterChefWithdrawInput): string {
    return this.masterChefStakingService.encodeWithdraw(params);
  }

  public reaperEncodeWrap(params: EncodeReaperWrapInput): string {
    return this.reaperWrappingService.encodeWrap(params);
  }

  public reaperEncodeUnwrap(params: EncodeReaperUnwrapInput): string {
    return this.reaperWrappingService.encodeUnwrap(params);
  }

  public erc4626EncodeWrap(params: EncodeWrapErc4626Input): string {
    return this.erc4626WrappingService.encodeWrap(params);
  }

  public erc4626EncodeUnwrap(params: EncodeUnwrapErc4626Input): string {
    return this.erc4626WrappingService.encodeUnwrap(params);
  }

  public encodeJoinPoolAndStakeInMasterChefFarm({
    userAddress,
    pool,
    userData,
    assets,
    maxAmountsIn,
  }: {
    userAddress: string;
    pool: GqlPoolWeighted | GqlPoolStable;
    userData: string;
    assets: string[];
    maxAmountsIn: BigNumberish[];
  }): PoolJoinBatchRelayerContractCallData {
    const ethIndex = assets.findIndex((asset) => asset === AddressZero);
    const ethAmount = ethIndex !== -1 ? maxAmountsIn[ethIndex] : undefined;

    const vaultEncodedJoinPool = this.vaultEncodeJoinPool({
      poolId: pool.id,
      poolKind: 0,
      sender: userAddress,
      recipient: this.batchRelayerAddress,
      joinPoolRequest: {
        assets,
        maxAmountsIn,
        userData,
        fromInternalBalance: false,
      },
      value: ethAmount || Zero,
      outputReference: this.toChainedReference(0),
    });

    const masterChefDeposit = this.masterChefEncodeDeposit({
      sender: this.batchRelayerAddress,
      recipient: userAddress,
      token: pool.address,
      pid: parseInt(pool.staking!.id),
      amount: this.toChainedReference(0),
      outputReference: Zero,
    });

    return {
      type: 'BatchRelayer',
      calls: [vaultEncodedJoinPool, masterChefDeposit],
      ethValue: ethAmount ? ethAmount.toString() : undefined,
    };
  }

  public encodeBatchSwapWithLimits({
    tokensIn,
    tokensOut,
    deltas,
    assets,
    swaps,
    ethAmountScaled,
    slippage,
    fromInternalBalance,
    toInternalBalance,
    sender,
    recipient,
    skipOutputRefs,
  }: {
    tokensIn: string[];
    tokensOut: string[];
    swaps: SwapV2[];
    assets: string[];
    deltas: string[];
    ethAmountScaled: AmountScaledString;
    slippage: string;
    fromInternalBalance: boolean;
    toInternalBalance: boolean;
    sender: string;
    recipient: string;
    skipOutputRefs?: boolean;
  }): string {
    const limits = Swaps.getLimitsForSlippage(
      tokensIn,
      tokensOut,
      SwapType.SwapExactIn,
      deltas,
      assets,
      poolScaleSlippage(slippage),
    );

    return this.vaultEncodeBatchSwap({
      swapType: SwapType.SwapExactIn,
      swaps,
      assets,
      funds: {
        sender,
        recipient,
        fromInternalBalance,
        toInternalBalance,
      },
      limits,
      deadline: MaxUint256,
      value: ethAmountScaled,
      outputReferences: skipOutputRefs
        ? []
        : assets.map((asset, index) => ({
            index,
            key: batchRelayerService.toChainedReference(index),
          })),
    });
  }

  public replaceWethWithAddressZero(address: string) {
    return isSameAddress(address, this.wethAddress) ? AddressZero : address;
  }
}

export const batchRelayerService = new BatchRelayerService(
  networkConfig.balancer.batchRelayer,
  networkConfig.wethAddress,
  new VaultActionsService(),
  new AaveWrappingService(),
  new BooMirrorWorldStakingService(),
  new TarotSupplyVaultService(),
  new FBeetsBarStakingService(),
  new MasterChefStakingService(),
  new YearnWrappingService(),
  new ReaperWrappingService(),
  new Erc4626WrappingService(),
);

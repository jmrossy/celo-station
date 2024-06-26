import { useCallback, useEffect, useState } from 'react';
import { useToastTxSuccess } from 'src/components/notifications/TxSuccessToast';
import { useToastError } from 'src/components/notifications/useToastError';
import { WALLET_CONNECT_CONNECTOR_ID } from 'src/config/consts';
import { logger } from 'src/utils/logger';
import { capitalizeFirstLetter } from 'src/utils/strings';
import { TransactionReceipt, encodeFunctionData } from 'viem';
import {
  Config,
  useAccount,
  usePublicClient,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import type { WriteContractMutate } from 'wagmi/query';

// Special case handling for this common error to provide a more specific error message
const CHAIN_MISMATCH_ERROR = 'does not match the target chain';

export function useWriteContractWithReceipt(
  description: string,
  onSuccess?: (receipt: TransactionReceipt) => any,
  showTxSuccessToast = false,
) {
  const account = useAccount();
  const publicClient = usePublicClient();

  const {
    data: hash,
    error: writeError,
    isError: isWriteError,
    isPending,
    writeContract,
  } = useWriteContract();

  const writeContractWithTxPrep = useCallback(
    async (args: Parameters<WriteContractMutate<Config, unknown>>[0]) => {
      // Some WalletConnect-ed wallets like Celo Terminal require that the tx be fully populated
      if (account?.connector?.id === WALLET_CONNECT_CONNECTOR_ID) {
        if (!publicClient) {
          logger.error('Public client not ready for WalletConnect wallet tx');
          return;
        }

        logger.debug('Preparing transaction request for WalletConnect wallet');
        const encodedData = encodeFunctionData(args);
        const request = await publicClient.prepareTransactionRequest({
          to: args.address,
          chainId: args.chainId,
          value: args.value,
          data: encodedData,
          account: account.address,
        });
        logger.debug('Transaction request prepared, triggering write');
        writeContract({
          ...args,
          gas: request.gas,
          gasPrice: request.gasPrice,
        } as any);
      } else {
        logger.debug('Trigger transaction write');
        writeContract(args);
      }
    },
    [writeContract, publicClient, account],
  );

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: waitError,
    isError: isWaitError,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
    confirmations: 1,
    pollingInterval: 1000,
  });

  useToastError(
    writeError,
    writeError?.message?.includes(CHAIN_MISMATCH_ERROR)
      ? 'Your wallet is not connected to Celo, please switch your active chain'
      : `Error sending ${description} transaction, please check your wallet balance & settings.`,
  );
  useToastError(
    waitError,
    `Error confirming ${description} transaction, please ensure the transaction is valid.`,
  );
  useToastTxSuccess({
    isConfirmed,
    txHash: hash,
    message: `${capitalizeFirstLetter(description)} transaction is confirmed!`,
    enabled: showTxSuccessToast,
  });

  // Run onSuccess when tx is confirmed
  // Some extra state is needed to ensure this only runs once per tx
  const [hasRunOnSuccess, setHasRunOnSuccess] = useState(false);
  useEffect(() => {
    if (hash && receipt && isConfirmed && !hasRunOnSuccess && onSuccess) {
      setHasRunOnSuccess(true);
      onSuccess(receipt);
    }
  }, [hash, receipt, isConfirmed, hasRunOnSuccess, onSuccess]);
  useEffect(() => {
    if (!hash || !receipt || !isConfirmed) setHasRunOnSuccess(false);
  }, [hash, receipt, isConfirmed]);

  return {
    hash,
    isError: isWriteError || isWaitError,
    isLoading: isPending || isConfirming,
    isConfirmed,
    writeContract: writeContractWithTxPrep,
  };
}

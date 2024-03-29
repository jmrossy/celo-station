import { DelegationForm } from 'src/features/delegation/DelegationForm';
import { UpvoteForm } from 'src/features/governance/UpvoteForm';
import { VoteForm } from 'src/features/governance/VoteForm';
import { LockForm } from 'src/features/locking/LockForm';
import { StakeForm } from 'src/features/staking/StakeForm';
import { TransactionFlowProps } from 'src/features/transactions/TransactionFlow';

// The set of unique tx flows in the app
export enum TransactionFlowType {
  Lock = 'lock',
  Stake = 'stake',
  Upvote = 'upvote',
  Vote = 'vote',
  Delegate = 'delegate',
}

export const transactionFlowProps: Record<TransactionFlowType, TransactionFlowProps> = {
  [TransactionFlowType.Lock]: {
    FormComponent: LockForm,
    header: 'Lock CELO',
    requiresLockedFunds: false,
  },
  [TransactionFlowType.Stake]: {
    FormComponent: StakeForm,
    header: 'Stake CELO',
    requiresLockedFunds: true,
  },
  [TransactionFlowType.Upvote]: {
    FormComponent: UpvoteForm,
    header: 'Upvote proposal',
    requiresLockedFunds: true,
  },
  [TransactionFlowType.Vote]: {
    FormComponent: VoteForm,
    header: 'Vote for proposal',
    requiresLockedFunds: true,
  },
  [TransactionFlowType.Delegate]: {
    FormComponent: DelegationForm,
    header: 'Delegate CELO',
    requiresLockedFunds: true,
  },
};

import { useState, useCallback } from 'react';
import {
  useSwitchBranch,
  usePullWorktree,
  usePushWorktree,
  useOpenInEditor,
} from '@/hooks/mutations';
import type { WorktreeInfo } from '../types';

export function useWorktreeActions() {
  const [isActivating, setIsActivating] = useState(false);

  // Use React Query mutations
  const switchBranchMutation = useSwitchBranch();
  const pullMutation = usePullWorktree();
  const pushMutation = usePushWorktree();
  const openInEditorMutation = useOpenInEditor();

  const handleSwitchBranch = useCallback(
    async (worktree: WorktreeInfo, branchName: string) => {
      if (switchBranchMutation.isPending || branchName === worktree.branch) return;
      switchBranchMutation.mutate({
        worktreePath: worktree.path,
        branchName,
      });
    },
    [switchBranchMutation]
  );

  const handlePull = useCallback(
    async (worktree: WorktreeInfo) => {
      if (pullMutation.isPending) return;
      pullMutation.mutate(worktree.path);
    },
    [pullMutation]
  );

  const handlePush = useCallback(
    async (worktree: WorktreeInfo) => {
      if (pushMutation.isPending) return;
      pushMutation.mutate({
        worktreePath: worktree.path,
      });
    },
    [pushMutation]
  );

  const handleOpenInEditor = useCallback(
    async (worktree: WorktreeInfo, editorCommand?: string) => {
      openInEditorMutation.mutate({
        worktreePath: worktree.path,
        editorCommand,
      });
    },
    [openInEditorMutation]
  );

  return {
    isPulling: pullMutation.isPending,
    isPushing: pushMutation.isPending,
    isSwitching: switchBranchMutation.isPending,
    isActivating,
    setIsActivating,
    handleSwitchBranch,
    handlePull,
    handlePush,
    handleOpenInEditor,
  };
}

import { useState, useCallback, useRef, useEffect } from 'react';
import { ProjectContent } from '../types';

export interface ContentSnapshot {
  id: string;
  timestamp: number;
  actionLabel: string;
  content: ProjectContent;
  section?: 'home' | 'about' | 'services' | 'faq' | 'seo';
}

export interface UseContentHistoryOptions {
  projectId?: string;
  maxStackSize?: number;
  initialContent: ProjectContent | null;
  onApplyContent: (content: ProjectContent) => void;
  onShowToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function useContentHistory({
  projectId,
  maxStackSize = 50,
  initialContent,
  onApplyContent,
  onShowToast,
}: UseContentHistoryOptions) {
  const [snapshots, setSnapshots] = useState<ContentSnapshot[]>(() => {
    if (!initialContent) return [];
    return [
      {
        id: `snap-${Date.now()}-init`,
        timestamp: Date.now(),
        actionLabel: 'Initial Snapshot',
        content: JSON.parse(JSON.stringify(initialContent)),
      },
    ];
  });

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    return initialContent ? 0 : -1;
  });

  // Reinitialize history stack when the active project switches or initial content first loads
  const currentProjectIdRef = useRef(projectId);
  useEffect(() => {
    if (projectId && projectId !== currentProjectIdRef.current) {
      currentProjectIdRef.current = projectId;
      if (initialContent) {
        const freshSnap: ContentSnapshot = {
          id: `snap-${Date.now()}-init`,
          timestamp: Date.now(),
          actionLabel: 'Opened Project State',
          content: JSON.parse(JSON.stringify(initialContent)),
        };
        setSnapshots([freshSnap]);
        setCurrentIndex(0);
      } else {
        setSnapshots([]);
        setCurrentIndex(-1);
      }
    } else if (initialContent && snapshots.length === 0) {
      const initialSnap: ContentSnapshot = {
        id: `snap-${Date.now()}-init`,
        timestamp: Date.now(),
        actionLabel: 'Initial State',
        content: JSON.parse(JSON.stringify(initialContent)),
      };
      setSnapshots([initialSnap]);
      setCurrentIndex(0);
    }
  }, [projectId, initialContent, snapshots.length]);

  /**
   * Push a new snapshot onto the history stack.
   * Discards any future snapshots (redo history) after the current index.
   */
  const recordSnapshot = useCallback(
    (
      newContent: ProjectContent,
      actionLabel: string = 'Edited Content',
      section?: 'home' | 'about' | 'services' | 'faq' | 'seo'
    ) => {
      setSnapshots((prev) => {
        // Truncate future snapshots after currentIndex
        const nextPast = prev.slice(0, currentIndex + 1);

        const newSnapshot: ContentSnapshot = {
          id: `snap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: Date.now(),
          actionLabel,
          content: JSON.parse(JSON.stringify(newContent)),
          section,
        };

        const updated = [...nextPast, newSnapshot];
        // Enforce max stack size
        if (updated.length > maxStackSize) {
          updated.shift();
        }
        return updated;
      });

      setCurrentIndex((prev) => {
        const nextIdx = Math.min(prev + 1, maxStackSize - 1);
        return nextIdx;
      });

      onApplyContent(newContent);
    },
    [currentIndex, maxStackSize, onApplyContent]
  );

  /**
   * Undo to the previous snapshot
   */
  const undo = useCallback(() => {
    if (currentIndex <= 0 || snapshots.length === 0) return;

    const targetIndex = currentIndex - 1;
    const targetSnapshot = snapshots[targetIndex];
    if (targetSnapshot) {
      setCurrentIndex(targetIndex);
      onApplyContent(JSON.parse(JSON.stringify(targetSnapshot.content)));
      if (onShowToast) {
        onShowToast(`Undone: ${targetSnapshot.actionLabel}`, 'info');
      }
    }
  }, [currentIndex, snapshots, onApplyContent, onShowToast]);

  /**
   * Redo to the next snapshot
   */
  const redo = useCallback(() => {
    if (currentIndex >= snapshots.length - 1 || snapshots.length === 0) return;

    const targetIndex = currentIndex + 1;
    const targetSnapshot = snapshots[targetIndex];
    if (targetSnapshot) {
      setCurrentIndex(targetIndex);
      onApplyContent(JSON.parse(JSON.stringify(targetSnapshot.content)));
      if (onShowToast) {
        onShowToast(`Redone: ${targetSnapshot.actionLabel}`, 'info');
      }
    }
  }, [currentIndex, snapshots, onApplyContent, onShowToast]);

  /**
   * Time-travel jump to any specific snapshot in the history stack
   */
  const jumpToSnapshot = useCallback(
    (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= snapshots.length) return;
      const targetSnapshot = snapshots[targetIndex];
      if (targetSnapshot) {
        setCurrentIndex(targetIndex);
        onApplyContent(JSON.parse(JSON.stringify(targetSnapshot.content)));
        if (onShowToast) {
          onShowToast(`Jumped to: ${targetSnapshot.actionLabel}`, 'info');
        }
      }
    },
    [snapshots, onApplyContent, onShowToast]
  );

  /**
   * Reset / clear history stack with a fresh baseline
   */
  const resetHistory = useCallback(
    (freshContent: ProjectContent, label: string = 'Reset History') => {
      const freshSnap: ContentSnapshot = {
        id: `snap-${Date.now()}-reset`,
        timestamp: Date.now(),
        actionLabel: label,
        content: JSON.parse(JSON.stringify(freshContent)),
      };
      setSnapshots([freshSnap]);
      setCurrentIndex(0);
      onApplyContent(freshContent);
    },
    [onApplyContent]
  );

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < snapshots.length - 1;
  const undoCount = Math.max(0, currentIndex);
  const redoCount = Math.max(0, snapshots.length - 1 - currentIndex);

  return {
    snapshots,
    currentIndex,
    currentSnapshot: snapshots[currentIndex] || null,
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    totalSnapshots: snapshots.length,
    recordSnapshot,
    undo,
    redo,
    jumpToSnapshot,
    resetHistory,
  };
}

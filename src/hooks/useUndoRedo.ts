import { useCallback, useRef, useState } from 'react';
import { Node, Edge } from 'reactflow';

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

const MAX_HISTORY = 50;

export default function useUndoRedo() {
  const pastRef = useRef<HistoryState[]>([]);
  const futureRef = useRef<HistoryState[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const takeSnapshot = useCallback((nodes: Node[], edges: Edge[]) => {
    pastRef.current = [
      ...pastRef.current.slice(-(MAX_HISTORY - 1)),
      { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) },
    ];
    futureRef.current = [];
    setCanUndo(true);
    setCanRedo(false);
  }, []);

  const undo = useCallback((currentNodes: Node[], currentEdges: Edge[]) => {
    if (pastRef.current.length === 0) return null;
    const previous = pastRef.current.pop()!;
    futureRef.current = [
      { nodes: JSON.parse(JSON.stringify(currentNodes)), edges: JSON.parse(JSON.stringify(currentEdges)) },
      ...futureRef.current,
    ];
    setCanUndo(pastRef.current.length > 0);
    setCanRedo(true);
    return previous;
  }, []);

  const redo = useCallback((currentNodes: Node[], currentEdges: Edge[]) => {
    if (futureRef.current.length === 0) return null;
    const next = futureRef.current.shift()!;
    pastRef.current.push(
      { nodes: JSON.parse(JSON.stringify(currentNodes)), edges: JSON.parse(JSON.stringify(currentEdges)) },
    );
    setCanUndo(true);
    setCanRedo(futureRef.current.length > 0);
    return next;
  }, []);

  const clear = useCallback(() => {
    pastRef.current = [];
    futureRef.current = [];
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  return { takeSnapshot, undo, redo, canUndo, canRedo, clear };
}

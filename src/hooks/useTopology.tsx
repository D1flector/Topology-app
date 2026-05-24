import { useState, useEffect } from "react";
import {
  TopologyData,
  TopologyNode,
  TopologyConnection,
  NodeState,
  ConnectionType,
} from "@/types/topology";

const API_URL = "http://impulse.yadro.msk.ru";

const VALID_STATES: NodeState[] = ["ok", "error", "warning", "unknown"];
const VALID_CONNECTION_TYPES: ConnectionType[] = ["line", "arrow", "dashed"];

function filterNodes(nodes: unknown[]): TopologyNode[] {
  return nodes.filter((node): node is TopologyNode => {
    if (typeof node !== "object" || node === null) return false;
    const n = node as Record<string, unknown>;

    if (typeof n.id !== "string") return false;
    if (typeof n.label !== "string") return false;
    if (typeof n.type !== "string") return false;
    if (n.state !== undefined && !VALID_STATES.includes(n.state as NodeState))
      return false;

    return true;
  });
}

function filterConnections(
  connections: unknown[],
  validNodeIds: Set<string>,
): TopologyConnection[] {
  return connections.filter((conn): conn is TopologyConnection => {
    if (typeof conn !== "object" || conn === null) return false;
    const c = conn as Record<string, unknown>;

    if (typeof c.id !== "string") return false;

    if (typeof c.source !== "string") return false;
    if (typeof c.target !== "string") return false;

    if (!validNodeIds.has(c.source)) return false;
    if (!validNodeIds.has(c.target)) return false;

    if (c.source === c.target) return false;

    if (
      c.type !== undefined &&
      !VALID_CONNECTION_TYPES.includes(c.type as ConnectionType)
    )
      return false;

    return true;
  });
}

export function useTopology() {
  const [data, setData] = useState<TopologyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Ошибка сети: ${res.status}`);
        const json = await res.json();

        const filteredNodes = filterNodes(json.nodes ?? []);
        const validNodeIds = new Set(filteredNodes.map((n) => n.id));
        const filteredConnections = filterConnections(
          json.connections ?? [],
          validNodeIds,
        );

        setData({ nodes: filteredNodes, connections: filteredConnections });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

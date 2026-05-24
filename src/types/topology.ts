export type NodeState = "ok" | "error" | "warning" | "unknown";
export type ConnectionType = "line" | "arrow" | "dashed";

export interface TopologyNode {
  id: string;
  label: string;
  type: string;
  parent?: string;
  state?: NodeState;
}

export interface TopologyConnection {
  id: string;
  source: string;
  target: string;
  type?: ConnectionType;
}

export interface TopologyData {
  nodes: TopologyNode[];
  connections: TopologyConnection[];
}

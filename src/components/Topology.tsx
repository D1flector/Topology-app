"use client";

import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import { TopologyData } from "@/types/topology";

cytoscape.use(dagre);

const STORAGE_KEY = "topology-positions";

const STATE_COLORS: Record<string, string> = {
  ok: "#22c55e",
  warning: "#f59e0b",
  error: "#e31e24",
  unknown: "#6b7280",
};

interface TopologyProps {
  data: TopologyData;
}

export default function Topology({ data }: TopologyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        ...data.nodes.map((node) => ({
          data: {
            id: node.id,
            label: node.label,
            parent: node.parent,
            state: node.state ?? "unknown",
            nodeType: node.type,
          },
        })),
        ...data.connections.map((conn) => ({
          data: {
            id: conn.id,
            source: conn.source,
            target: conn.target,
            type: conn.type ?? "line",
          },
        })),
      ],
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#252d3a",
            "border-width": 2,
            "border-color": "#2e3a4a",
            color: "#ffffff",
            "text-valign": "center",
            "text-halign": "center",
            "font-size": "11px",
            "font-family": "Arial, Helvetica, sans-serif",
            label: "data(label)",
            shape: "roundrectangle",
            width: 120,
            height: 30,
          },
        },
        ...Object.entries(STATE_COLORS).map(([state, color]) => ({
          selector: `node[state="${state}"]`,
          style: { "border-color": color },
        })),
        {
          selector: "$node > node",
          style: {
            "background-color": "#1a2233",
            "border-color": "#3b5bdb",
            "border-width": 2,
            "text-valign": "top",
            "text-halign": "center",
            "font-size": "12px",
            "font-weight": "bold",
            color: "#a0b0c0",
            padding: "25px",
          },
        },
        {
          selector: "edge",
          style: {
            width: 1.5,
            "line-color": "#3b5bdb",
            "target-arrow-color": "#3b5bdb",
            "curve-style": "bezier",
            opacity: 0.7,
          },
        },
        {
          selector: 'edge[type="arrow"]',
          style: {
            "target-arrow-shape": "triangle",
            "line-style": "solid",
          },
        },
        {
          selector: 'edge[type="dashed"]',
          style: {
            "line-style": "dashed",
            "target-arrow-shape": "none",
            "line-color": "#6b7280",
            "target-arrow-color": "#6b7280",
          },
        },
      ],
    });

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const positions = JSON.parse(saved);
      cy.nodes().forEach((node) => {
        if (positions[node.id()]) {
          node.position(positions[node.id()]);
        }
      });
      cy.fit();
    } else {
      cy.layout({
        name: "dagre",
        rankDir: "LR",
        padding: 40,
        spacingFactor: 1.2,
      } as cytoscape.LayoutOptions).run();
    }

    cy.on("dragfree", "node", () => {
      const positions: Record<string, { x: number; y: number }> = {};
      cy.nodes().forEach((node) => {
        positions[node.id()] = node.position();
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    });

    return () => cy.destroy();
  }, [data]);

  return <div ref={containerRef} className="w-full h-full" />;
}

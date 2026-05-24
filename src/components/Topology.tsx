"use client";

import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import { TopologyData } from "@/types/topology";

cytoscape.use(dagre);

const STORAGE_KEY = "topology-positions";

interface TopologyProps {
  data: TopologyData;
}

const STATE_COLORS: Record<string, string> = {
  ok: "#22c55e",
  warning: "#f59e0b",
  error: "#e31e24",
  unknown: "#6b7280",
};

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
            "background-color": "#1e1e1e",
            "border-width": 2,
            "border-color": "#6b7280",
            color: "#ffffff",
            "text-valign": "center",
            "text-halign": "center",
            "font-size": "10px",
            label: "data(label)",
          },
        },
        {
          selector: 'node[state="ok"]',
          style: { "border-color": STATE_COLORS.ok },
        },
        {
          selector: 'node[state="warning"]',
          style: { "border-color": STATE_COLORS.warning },
        },
        {
          selector: 'node[state="error"]',
          style: { "border-color": STATE_COLORS.error },
        },
        {
          selector: "$node > node",
          style: {
            "background-color": "#2a2a2a",
            "border-color": "#444444",
            "text-valign": "top",
            "font-size": "11px",
            padding: "20px",
          },
        },
        {
          selector: "edge",
          style: {
            width: 1.5,
            "line-color": "#4b5563",
            "target-arrow-color": "#4b5563",
            "curve-style": "bezier",
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
          },
        },
      ],
    });

    // восстанавливаем позиции если есть
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

    // сохраняем позиции при перетаскивании
    cy.on("dragfree", "node", () => {
      const positions: Record<string, { x: number; y: number }> = {};
      cy.nodes().forEach((node) => {
        positions[node.id()] = node.position();
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    });

    return () => cy.destroy();
  }, [data]);

  return <div ref={containerRef} className="w-full h-screen" />;
}

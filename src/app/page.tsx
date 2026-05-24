"use client";

import { useTopology } from "@/hooks/useTopology";
import Topology from "@/components/Topology";
import Header from "@/components/Header";
import { useState } from "react";

export default function Home() {
  const { data, loading, error } = useTopology();
  const [resetKey, setResetKey] = useState(0);

  function handleReset() {
    localStorage.removeItem("topology-positions");
    setResetKey((k) => k + 1);
  }

  return (
    <main className="flex flex-col h-screen">
      <Header />
      {loading && (
        <div
          className="flex-1 flex items-center justify-center"
          style={{ color: "var(--muted)" }}
        >
          Загрузка топологии...
        </div>
      )}
      {error && (
        <div className="flex-1 flex items-center justify-center text-red-500">
          Ошибка: {error}
        </div>
      )}
      {data && (
        <div className="relative flex-1">
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-white rounded"
              style={{ background: "var(--accent)" }}
            >
              Сбросить позиции
            </button>
            <div
              className="p-3 rounded text-sm flex flex-col gap-2"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <span className="font-semibold text-white mb-1">Статус нод</span>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ background: "#22c55e" }}
                />
                <span style={{ color: "var(--muted)" }}>OK</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ background: "#f59e0b" }}
                />
                <span style={{ color: "var(--muted)" }}>Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ background: "#e31e24" }}
                />
                <span style={{ color: "var(--muted)" }}>Error</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ background: "#6b7280" }}
                />
                <span style={{ color: "var(--muted)" }}>Unknown</span>
              </div>
            </div>
          </div>
          <Topology key={resetKey} data={data} />
        </div>
      )}
    </main>
  );
}

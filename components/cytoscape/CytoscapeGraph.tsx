"use client"

import React, { useEffect, useRef, useState, useContext } from "react";
import { NodeSingular, LayoutOptions } from "cytoscape";
import cytoscape from "cytoscape";
import type { NodeData } from "@/types/node_types";
import cola from 'cytoscape-cola';
import { useNode } from "@/context/NodeContext";

interface CytoscapeGraphProps {
  onNodeClick: (nodeData: NodeData) => void;
}

interface ALLNodeData {
  allNodeData: NodeData[];
}

// 初期ノード登録
const initialGraphData = {
  nodes: [],
  edges: [],
};

async function getGraphData(){
  const response = await fetch("http://localhost:3000/api/getnode",{
    cache: "no-cache",
  });

  console.log("response:", response);
  const allNodeData: NodeData[] = await response.json();

  return allNodeData;
}





export default function CytoscapeGraph({ onNodeClick }: CytoscapeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [graphData, setGraphData] = useState(initialGraphData);
  const nodeContext = useNode();
  const allNodeData = getGraphData();



  console.log("CytoscapeGraph rendered");
  console.log("graphData:", graphData);
  console.log("nodeContext:", nodeContext);


  useEffect(() => {
    if (!containerRef.current || !graphData.nodes.length) return;
    cytoscape.use(cola);
    const cy = cytoscape({
      container: containerRef.current,
      elements: [...graphData.nodes, ...graphData.edges],
      layout: {
        name: "cola",
        animate: true,
        fit: false,
        animateDuration: 500,
        animateEasing: "ease-out",
        nodeRepulsion: (node: NodeSingular) => 450,
        gravity: 0.25,
        idealEdgeLength: 20,
        centerGraph: true,
      } as LayoutOptions,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "data(color)",
            label: "data(label)",
            color: "#fff",
            "text-outline-color": "#000",
            "text-outline-width": 1,
            "font-size": 14,
            width: 40,
            height: 40,
          },
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#ccc",
            "curve-style": "bezier",
          },
        },
      ],
    });

    cyRef.current = cy;
  }, [graphData]);

  useEffect(() => {
    const cy = cyRef.current;
    if (cy === null) return;

    cy.on("tap", "node", (event) => {
      const node = event.target;
      const nodeData: NodeData = {
        id: node.id(),
        label: node.data("label"),
        query: node.data("label"),
        response: node.data("response"),
        from: node.connectedEdges().length,
        color: node.data("color"),
      };

      onNodeClick(nodeData);
    });
  }, [graphData]);

  return <div ref={containerRef} className="w-full h-full" />;
}


"use client"

import React, { useEffect, useRef, useState } from "react";
import { NodeSingular, LayoutOptions } from "cytoscape";
import cytoscape from "cytoscape";
import type { NodeData } from "@/types/node_types";
import cola from 'cytoscape-cola';
import { useNode } from "@/context/NodeContext";

interface CytoscapeGraphProps {
  onNodeClick: (nodeData: NodeData) => void;
}

interface GraphData{
  nodes:{data:{id:string; label:string; color:string}}[],
  edges:{data:{id:string; source:number; target:number}}[],
}

const initialGraphData :GraphData = {
  nodes:[],
  edges:[]
};

//エラーハンドリングは後ほど書く
async function fetchNodeData(){
  try {
    const response = await fetch("http://localhost:3000/api/getnode",{
      cache: "no-cache",
    });

    console.log("response:", response);
    const allNodeData: NodeData[] = await response.json();
    return allNodeData;
  } catch(error){
    console.error("Error fetching node data",error)
    return [];
  }
}

function formatNodesForCytoscape(allNodeData: NodeData[]) {
  if(Array.isArray(allNodeData)&&allNodeData.length>0){
    return {
      nodes: allNodeData.map(node => ({
        data: {
          id: String(node.id),
          label: node.label,
          color: node.color
        },
        
      })),
      edges:[]
    };
  }
  else{
    return {
      nodes: [],
      edges: []
    };
  }
}   


export default function CytoscapeGraph({ onNodeClick }: CytoscapeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [graphData, setGraphData] = useState(initialGraphData);
  const nodeContext = useNode();
  
  useEffect(() => {
    async function fetchInitialData() {
      const allNodedata = await fetchNodeData();
      const formattedData = formatNodesForCytoscape(allNodedata);
      setGraphData(formattedData);
      
      if (nodeContext?.setAllNodes) {
        nodeContext.setAllNodes(allNodedata);
      }
    }
    
    fetchInitialData();
  }, []);


  useEffect(() => {
    if(graphData.nodes.length <= 0) return;
    if(!containerRef.current) return;
    if(cyRef.current) return;

    //インスタンスの作成
    cytoscape.use(cola);
    const cy = cytoscape({
      container: containerRef.current,
      elements: [...graphData.nodes,...graphData.edges],
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

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };

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


"use client"

import React, { Children, use, useEffect, useRef, useState } from "react";
import { NodeSingular, LayoutOptions } from "cytoscape";
import cola from 'cytoscape-cola';
import cytoscape from "cytoscape";
import type { NodeData,GraphData } from "@/types/node_types";
import { useNode } from "@/context/NodeContext";
import { useCytoscape } from "@/context/CytoscapeContext";
import { access } from "fs";

interface CytoscapeGraphProps {
  children?: React.ReactNode;
  onNodeClick?: (nodeData: NodeData) => void;
  action?: string;
}



const initialGraphData :GraphData = {
  nodes:[],
  edges:[]
};

async function fetchNodeData(){
  try {
    const response = await fetch("http://localhost:3000/api/getnode",{
      cache: "no-cache",
    });

    const allNodeData: NodeData[] = await response.json();
    console.log("allNodeData",allNodeData);
    return allNodeData;
  } catch(error){
    console.error("Error fetching node data",error)
    return [];
  }
}

function formatNodesForCytoscape(allNodeData: NodeData[]) {
  if(Array.isArray(allNodeData)&&allNodeData.length>0){
    const nodes = allNodeData.map(node => ({
      data: {
        id: String(node.id),
        label: node.label,
        color: node.color,
        query: node.query,
        response: node.response,
        from : node.from
      }
    }));
    
    
    const edges = allNodeData
      .filter(node => node.from && node.from > 0)  
      .map(node => ({
        data:{
          id: `edge-${node.from}-${node.id}`,  // エッジIDをより一意にする
          source: String(node.from),
          target: String(node.id)
        }
    }));
    return {
      nodes,
      edges
    };
  }
  else{
    return {
      nodes: [],
      edges: []
    };
  }
}
 


const CytoscapeGraph: React.FC<CytoscapeGraphProps> = ({
  children,
  onNodeClick,
  action
}
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [graphData, setGraphData] = useState(initialGraphData);
  const nodeContext = useNode();
  const cyContext = useCytoscape();
  
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
    cyContext?.setcyInstance(cy);

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
        cyContext?.setcyInstance(null);
      }
    };

  }, [graphData]);


  return (
    <div className="w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {children}
    </div>
  );
}

export default CytoscapeGraph;
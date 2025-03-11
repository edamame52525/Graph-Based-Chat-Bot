"use client"

import React, { useEffect, useRef } from "react";
import { NodeSingular,LayoutOptions } from "cytoscape";
import cytoscape from "cytoscape";
import type { NodeData } from "@/types/node_types";
import cola from 'cytoscape-cola';
import { useNode } from "../context/NodeContext";

// 初期ノード登録
const graphData = {
  nodes: [{ data: { id: "1", label: "Node 1", query: "This is node 1",response: "", color: "#ff5733" } }],
  edges: [],
}


    cytoscape.use( cola );



/*ーーーーーーーーーーーーーーーーーーーーーーーー
まだ使用するかわからないもの
var gridGuide = require('cytoscape-grid-guide');
gridGuide( cytoscape ); // register extension

ーーーーーーーーーーーーーーーーーーーーーーーーー*/

//関数型のアノテーションを返す。通常はname: stringみたいに書くが、ここでは、関数が何の引数を受け取って、何を返すかを明示的に示している。
//この場合、引数はonNodeClickという関数で、引数は一つ。NodeData型で、そして何も返さない。
interface CytoscapeGraphProps {
  onNodeClick: (nodeData: NodeData) => void
}


useEffect(() => {
  const fetchGraphData = async () => {
    try {
      const response = await fetch("http://localhost:3000/app/api/");
      if(!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
    
    }
  }
  
  fetchGraphData();
  
  


  },[]);

// 初回init用
export default function CytoscapeGraph({ onNodeClick }: CytoscapeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<cytoscape.Core | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    
    cytoscape.use( cola );

    const cy = cytoscape({
      container: containerRef.current,
      elements: [...graphData.nodes, ...graphData.edges],
      layout: {
        name: "cola",
        animate: true,
        fit: false,
        animateDuration: 500,
        animateEasing: "ease-out",
        nodeRepulsion: (node:NodeSingular) => 450, // ノード間の反発力
        gravity: 0.25, // 重力
        idealEdgeLength: 20, // エッジの長さ
        centerGraph: true, // グラフを中央に寄せる
      

      }as LayoutOptions,
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

    cyRef.current = cy     
  }, []);

  //ノードがクリックされたときの処理
  useEffect(() => {
    const { nodeContext } = useNode()
    const cy = cyRef.current
    if (cy === null) return


    cy.on("tap", "node", (event) => {
      const node = event.target
      const nodeData: NodeData = {
        id: node.id(),
        query: node.data("label"),
        response: node.data("response"),
        edges: node.connectedEdges().length,
        color: node.data("color"),
      }

      onNodeClick(nodeData)
    })

  }, [graphData])

  return <div ref={containerRef} className="w-full h-full" />
}


"use client"

import React, { useEffect, useRef } from "react";
import { NodeSingular,LayoutOptions } from "cytoscape";
import cytoscape from "cytoscape";
import type { NodeData } from "@/types/node_types";
import cola from 'cytoscape-cola';


// 初期ノード登録
const graphData = {
  nodes: [{ data: { id: "1", label: "Node 1", description: "This is node 1", color: "#ff5733" } }],
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
    const cy = cyRef.current
    if (cy === null) return


    cy.on("tap", "node", (event) => {
      const node = event.target
      const nodeData: NodeData = {
        id: node.id(),
        query: node.data("label"),
        response: node.data("description"),
        edges: node.connectedEdges().length,
        color: node.data("color"),
      }

      //ノードの位置を調整する
      // 現在の画面の中心を取得
      const pan = cy.pan();
      const zoom = cy.zoom();
      const centerX = pan.x + (cy.width() / 2) / zoom;
      const centerY = pan.y + (cy.height() / 2) / zoom;



      // let count = randomInt(100).toString();
      let id = Math.floor(Math.random()*10000)  // 新しいノードの ID
      console.log("id:",id)
      let sourceId = node.id() // クリックされたノードの ID

      // // デバッグ用出力
      // console.log("Existing nodes before add:", cy.nodes().map(n => n.data()))
      // console.log("Existing edges before add:", cy.edges().map(e => e.data()))

      // 新しいノードとエッジを追加
      const newNode = cy.add([
        {
          group: "nodes",
          data: { id: `${id}`, label: `${id}`, color: "#33ff57" },
          position: { x: centerX, y: centerY }, // 画面の中心に追加
        },
        {
          group: "edges",
          data: { id: `edge-${sourceId}-${id}`, source: id, target: sourceId },
        },
      ])

      // デバッグ用出力
      // console.log("New node added:", newNode.map(n => n.data()))
      // console.log("Existing nodes after add:", cy.nodes().map(n => n.data()))
      // console.log("Existing edges after add:", cy.edges().map(e => e.data()))

      // ノード追加後にレイアウトを適用（アニメーションなし）
      const layout = cy.layout(
        {
          name: "cola",
          animate: true,
          fit: false, 
          animeduration: 500, 
          nodeDimensionsIncludeLabels: true, 
          nodeRepulsion: (node: NodeSingular) => 450,　
          gravity: 0.25, 
          maxSimulationTime: 10000000,
          convergenceThreshold: 1e-9,
          idealEdgeLength: 20,
        } as LayoutOptions)

      layout.run()

      // 追加したノードを画面の中心に配置
      cy.center(cy.$(`#${id}`));
      // デバッグ用出力
      // console.log("Layout run completed")
      // console.log("Existing nodes after layout:", cy.nodes().map(n => n.data()))
      // console.log("Existing edges after layout:", cy.edges().map(e => e.data()))
      // console.log("clicked")
      onNodeClick(nodeData)
    })

  }, [graphData])

  return <div ref={containerRef} className="w-full h-full" />
}


import React , { useEffect, useRef } from "react";
import cytoscape from "cytoscape"
import {Core} from "cytoscape"
import type { NodeData } from "@/types/node_types";
import { useCytoscape } from "@/context/CytoscapeContext";
import { useNode } from "@/context/NodeContext";
import { EventObjectNode } from "cytoscape";


interface CytoscapeGraphProps {
  action: 'update' | 'create' | 'delete' | 'detail';
  onNodeClick: (nodeData: NodeData) => void;
}

export default function CytoscapeEventHandle({ onNodeClick, action }: CytoscapeGraphProps) {
  const nodeContext = useNode();
  const  cyInstance  = useCytoscape();
  const cy = cyInstance?.cyInstance;
  const nodeClickHandler = useRef<((event: EventObjectNode) => void) | null>(null);
  console.log("cyInstance", cyInstance);


  useEffect(() => {


    if (!cy) {
      // console.error("Cytoscape instance not available");
      return;
    }
    if (nodeClickHandler.current) {
      console.log("Removing old event listener");
      cy.off('tap', 'node', nodeClickHandler.current);
    }




    switch(action){
      case 'create':
        break;
      case 'update':
        break;
      case 'delete':
        break;
      case 'detail':
        // 新しいハンドラを作成
      const handleNodeTap = (event: EventObjectNode) => {
        const node = event.target;
        const position = node.position();
        const zoomLevel = 1;
        const viewportWidth = cy.width(); // 画面の横幅
        // const renderedPosition = cy.renderer().project(node.position()); // 画面のピクセル座標に変換
        const offsetX = viewportWidth * 0.3; // 画面の左側に寄せるためのオフセット
        // const newPan = cy.renderer().unproject({ x: offsetX, y: renderedPosition.y }); // Cytoscape座標に変換
        const nodeData: NodeData = {
          id: Number(node.id()),
          label: node.data("label"),
          query: node.data("query"),
          response: node.data("response"),
          from: node.data("from"),
          color: node.data("color"),
        };

        console.log("今からアニメーション, zoomLevel:", zoomLevel, "position:", position);
        cy.animate({
          fit:{
            eles:node,
            padding :300
          },
          zoom:zoomLevel,
          pan:{
            x:position.x - offsetX-10,
            y:position.y
          },
          duration : 500,
          easing: 'ease-in-out'
        })


        nodeContext?.setSelectedNode(nodeData);
        onNodeClick(nodeData);
      };
      
      // ハンドラを保存して登録
      nodeClickHandler.current = handleNodeTap;
      cy?.on('tap', 'node', handleNodeTap);
    }
  }, [action, cy, onNodeClick,nodeContext?.selectedNode]);

  
  return null;
};



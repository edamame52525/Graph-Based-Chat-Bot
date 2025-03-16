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
        const nodeData: NodeData = {
          id: Number(node.id()),
          label: node.data("label"),
          query: node.data("label"),
          response: node.data("response"),
          from: node.connectedEdges().length,
          color: node.data("color"),
        };
        nodeContext?.setSelectedNode(nodeData);
        onNodeClick(nodeData);
      };
      
      // ハンドラを保存して登録
      nodeClickHandler.current = handleNodeTap;
      cy?.on('tap', 'node', handleNodeTap);
    }
  }, [action, cy, onNodeClick]);

  
  return null;
};



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
      case 'detail':
        // 新しいハンドラを作成
      const handleNodeTap = (event: EventObjectNode) => {

        // ハイライトスタイルの定義
        cy.style()
        .selector('.highlight')
        .style({
          'border-color': 'yellow',
          'border-width': '2px',
        })


        const node = event.target;
        // すべてのノードのハイライトを解除
        cy.nodes().removeClass('highlight');

        // クリックされたノードをハイライト
        node.addClass('highlight');
      


        const position = node.position();
        const zoomLevel = 1;
        const viewportWidth = cy.width(); // 画面の横幅
        // const renderedPosition = cy.renderer().project(node.position()); // 画面のピクセル座標に変換
        const offsetX = viewportWidth * 0.5; // 画面の左側に寄せるためのオフセット
        // const newPan = cy.renderer().unproject({ x: offsetX, y: renderedPosition.y }); // Cytoscape座標に変換
        const nodeData: NodeData = {
          id: Number(node.id()),
          label: node.data("label"),
          query: node.data("query"),
          response: node.data("response"),
          parent: Number(node.data("parentID")),
          color: node.data("color"),
          summary: node.data("summary")
        };

        console.log("タップされたノード",nodeData)



        cy.animate({
          fit:{
            eles:node,
            padding :350
          },
          zoom:zoomLevel,
          pan:{
            x:position.x - offsetX-10,
            y:position.y
          },
          duration : 500,
          easing: 'ease-in-out'
        })

        console.log("参照中のノード",nodeData)
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



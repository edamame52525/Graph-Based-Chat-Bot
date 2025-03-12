import React, { useEffect, useRef ,useContext } from "react";
import { NodeSingular,LayoutOptions } from "cytoscape";
import cytoscape from "cytoscape";
import type { NodeData } from "@/types/node_types";
import cola from 'cytoscape-cola';
import { Button } from "../ui/button";
import { NodeProvider } from "@/context/NodeContext";


interface NodeManagerProps {
    action: 'update' | 'create' | 'delete';
    nodeData?: NodeData;
}

cytoscape.use( cola );

const NodeManager: React.FC<NodeManagerProps> = ({ action, nodeData }) => {
    const Nodecontext = useContext(NodeProvider);
    const cyRef = useRef<cytoscape.Core | null>(null)
    const cy = cyRef.current

    if (cy === null) return

    const node :NodeData = nodeData;

    const CreateNodes = () => {
        // let count = randomInt(100).toString();
      let id = Math.floor(Math.random()*10000)  // 新しいノードの ID
      console.log("id:",id)
      let sourceId = node.id() // クリックされたノードの ID

      // デバッグ用出力
      console.log("Existing nodes before add:", cy.nodes().map(n => n.data()))
      console.log("Existing edges before add:", cy.edges().map(e => e.data()))

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

    //   デバッグ用出力
      console.log("New node added:", newNode.map(n => n.data()))
      console.log("Existing nodes after add:", cy.nodes().map(n => n.data()))
      console.log("Existing edges after add:", cy.edges().map(e => e.data()))

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
        
    };

    const UpdateNodes = () => {

    };

    const DeleteNodes = () => {

    };

    const handleAction = () => {
        switch (action) {
            case 'create':
                CreateNodes();
                break;
            case 'update':
                UpdateNodes();
                break;
            case 'delete':
                DeleteNodes();
                break;
            default:
                break;

        };
    }

    return (
        <div>
          <Button onClick={() => NodeManager(action='create',nodeData)}>Create Node</Button>
        </div>
      );

}

export default NodeManager;





"use client"

import React, { Children, use, useEffect, useRef, useState } from "react";
import { NodeSingular, LayoutOptions } from "cytoscape";
import cola from 'cytoscape-cola';
import cytoscape from "cytoscape";
import type { NodeData,GraphData } from "@/types/node_types";
import gridGuide from 'cytoscape-grid-guide';
import { useNode } from "@/context/NodeContext";
import { useCytoscape } from "@/context/CytoscapeContext";

interface CytoscapeGraphProps {
  children?: React.ReactNode;
  onNodeClick?: (nodeData: NodeData) => void;
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
        parentID : String(node.parent),
        summary:node.summary
      }
    }));

    console.log("フォーマットデータ",nodes)
    
    
    const edges = allNodeData
      .filter(node => node.parent && node.parent > 0)  
      .map(node => ({
        data:{
          id: `edge-${node.parent}-${node.id}`,  // エッジIDをより一意にする
          target: String(node.parent),
          source: String(node.id)
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
    gridGuide(cytoscape)


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
      grid: {
        name: "grid",
        fit: true, // whether to fit the viewport to the graph
        padding: 30, // padding used on fit
        rows: 30, // number of rows in the grid
        columns: 30, // number of columns in the grid
        avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
        avoidOverlapPadding: 10, // extra spacing around nodes when avoidOverlap: true
        nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
        spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
        condense: false, // uses all available space on false, uses minimal space on true
        sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
        animate: false, // whether to transition the node positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        ready: undefined, // callback on layoutready
        stop: undefined, // callback on layoutstop
      },
    });

    cy?.gridGuide({
      // Configure the grid guide plugin
      gridSpacing: 50, // Example spacing
      snapToGrid: true // Example option
      // Add more options as needed
      });

    cyRef.current = cy;
    cyContext?.setcyInstance(cy);

    cy.on('tap','node',(event) => {
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
      const viewportWidth = cy.width();
      const offsetX = viewportWidth * 0.5;

      const nodeData: NodeData = {
        id: Number(node.id()),
        label: node.data("label"),
        query: node.data("query"),
        response: node.data("response"),
        parent: Number(node.data("parentID")),
        color: node.data("color"),
        summary: node.data("summary")
      };

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
      if (onNodeClick) {
        onNodeClick(nodeData);
      }
    });

    cy.on('add', 'node', (event) => {
      const node = event.target;

      const newNode: NodeData = {
        id: Number(node.id()),
        label: node.data("label"),
        query: node.data("query"),
        response: node.data("response"),
        parent: Number(node.data("parentID")),
        color: node.data("color"),
        summary: node.data("summary")
      };

      // すべてのノードのハイライトを解除
      cy.nodes().removeClass('highlight');

      // クリックされたノードをハイライト
      node.addClass('highlight');

      const layout = cy.layout(
            {
              name: "cola",
              animate: true,
              fit: false, 
              animeduration: 500, 
              nodeDimensionsIncludeLabels: true, 
              nodeRepulsion: (Node: NodeSingular) => 450,
              gravity: 0.25, 
              maxSimulationTime: 100000,
              convergenceThreshold: 1e-9,
              idealEdgeLength: 20,
            } as LayoutOptions)
    
      layout.run()


      const position = node.position();
      const zoomLevel = 1;
      const viewportWidth = cy.width();
      const offsetX = viewportWidth * 0.5;
      

      // cy.animate({
      //   fit:{
      //     eles:node,
      //     padding :350
      //   },
      //   zoom:zoomLevel,
      //   pan:{
      //     x:position.x - offsetX-10,
      //     y:position.y
      //   },
      //   duration : 500,
      //   easing: 'ease-in-out'
      // })
      
      nodeContext?.setSelectedNode(newNode);

      if (onNodeClick) {
        onNodeClick(newNode);
      }

    });
    


    return () => {
      if (cyRef.current) {
        cyRef.current.removeAllListeners();
        cyRef.current.off('tap', 'node');
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
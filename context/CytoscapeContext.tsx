import React ,{ useContext, createContext, useState, ReactNode, useMemo, useCallback, use  } from "react";
import type { Core } from "cytoscape";
import { NodeSingular,LayoutOptions } from "cytoscape";
import { useNode } from "./NodeContext";
import { NodeData } from "@/types/node_types";
import cytoscape from "cytoscape"
import cola from 'cytoscape-cola';
interface CytoscapeInstanceContextType{
    cyInstance: (Core | null);
    setcyInstance: (cy: Core | any) => void;
    createNode: (data: NodeData) => any | null;
    updateNode: (nodeId: number, response:string) => any | null;
    deleteNode: (nodeId: number) => any | null;
}


const CytoscapeInstanceContext = createContext<CytoscapeInstanceContextType | null>(null);

export function CytoscapeInstanceProvider({children}:{children:ReactNode}) {
    const context = useNode();
    const [cyInstance , setcyInstance] = useState<Core | null>(null);
    //未実装（エージェントからクエリ＋回答の二つを受け取ってから実行する関数）
    
    
    const createNode =useCallback((data: NodeData)=> {
        if(!cyInstance) return null;

        cytoscape
        cyInstance.add([
            {
                group: "nodes",
                data: {
                    id: String(data.id),
                    label: data.label,
                    color: data.color,
                    query: data.query,
                    response: data.response,
                    parentID: String(data.parent),
                    summary: data.summary
                }
            },
            {
                group: "edges",
                data: {
                    id: String("edge" + data.id),
                    source: String(data.parent),
                    target: String(data.id),
                } 
            }
        ]);

        const addedNode = cyInstance.getElementById(String(data.id));
        if (addedNode.empty()) {
            console.error("ノードが正しく追加されていません");
            return null;
        }

        
        

        const layout = cyInstance.layout(
            {
              name: "cola",
              animate: true,
              fit: false, 
              animeduration: 500, 
              nodeDimensionsIncludeLabels: true, 
              nodeRepulsion: (addedNode: NodeSingular) => 450,
              gravity: 0.25, 
              maxSimulationTime: 1000,
              convergenceThreshold: 1e-9,
              idealEdgeLength: 20,
            } as LayoutOptions)
    
          layout.run()

        context?.setSelectedNode(data)
        return 0;
    }, [cyInstance]);

    const updateNode = useCallback((nodeId: number, response: string) => {
        // Cytoscapeのノードを取得して更新
        const nodeElement = cyInstance?.getElementById(String(nodeId));
        
        if (nodeElement) {
            // responseプロパティを更新
            nodeElement.data('response', response);
            // ラベルも必要に応じて更新（例: 最初の8文字）
            const shortLabel = response.substring(0, 8) + (response.length > 8 ? '...' : '');
            nodeElement.data('label', shortLabel);
            nodeElement.data('response',response)
            
            // ノードの状態を更新（例: 色を変更）
            // nodeElement.style('background-color', '#e6f7ff');
        }
        
    }, [cyInstance, context]);

    const deleteNode = useCallback((nodeId:number) => {
        if (!cyInstance) return false;
        
        const node = cyInstance.getElementById(String(nodeId));
        if (node.length === 0) return false;
        
        cyInstance.remove(node);
        return true;
    }, [cyInstance]);

    const contextValue = useMemo(() => ({
        cyInstance,
        setcyInstance,
        createNode,
        updateNode,
        deleteNode
      }), [cyInstance, createNode, updateNode, deleteNode]);


    return (
        <CytoscapeInstanceContext.Provider value = {contextValue}>
            {children}
        </CytoscapeInstanceContext.Provider>

    );
}

export function useCytoscape(){
    const context = useContext(CytoscapeInstanceContext);
    return context;
}

export {CytoscapeInstanceContext};
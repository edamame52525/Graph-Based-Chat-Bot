import React ,{ useContext, createContext, useState, ReactNode, useMemo, useCallback, use  } from "react";
import type { Core } from "cytoscape";
import { NodeSingular,LayoutOptions } from "cytoscape";
import { useNode } from "./NodeContext";
import { NodeData } from "@/types/node_types";

interface CytoscapeInstanceContextType{
    cyInstance: (Core | null);
    setcyInstance: (cy: Core | any) => void;
    createNode: (data: NodeData) => any | null;
    updateNode: (nodeId: string | number, data: Partial<NodeData>) => any | null;
    deleteNode: (nodeId: string | number) => any | null;
}


const CytoscapeInstanceContext = createContext<CytoscapeInstanceContextType | null>(null);

export function CytoscapeInstanceProvider({children}:{children:ReactNode}) {
    const context = useNode();
    const [cyInstance , setcyInstance] = useState<Core | null>(null);
    //未実装（エージェントからクエリ＋回答の二つを受け取ってから実行する関数）
    const createNode =useCallback((data: NodeData) => {
        if(!cyInstance) return null;


        console.log("作成開始",data);
        cyInstance.add({
            group: "nodes",
            data: {
                id: String(data.id),
                label: data.label,
                color: data.color,

            }
        });

        cyInstance.add({
            group: "edges",
            data: {
                id: String("edge"+data.id),
                source: String(data.from),
                target: String(data.id),
            }
        });

        const layout = cyInstance.layout(
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

        context?.setSelectedNode(data)
        return 0;
    }, [cyInstance]);

    //未実装（構想すら浮かんでいない）
    const updateNode = useCallback((nodeId: string | number, data: Partial<NodeData>) => {
        if (!cyInstance) return false;
        
    }, [cyInstance]);

    const deleteNode = useCallback((nodeId: string | number) => {
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
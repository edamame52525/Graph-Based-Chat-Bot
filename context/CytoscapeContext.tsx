import React ,{ useContext, createContext, useState, ReactNode, useMemo, useCallback, use  } from "react";
import type { Core } from "cytoscape";
import { NodeData } from "@/types/node_types";

interface CytoscapeInstanceContextType{
    cyInstance: (Core | null);
    setcyInstance: (cy: Core | any) => void;
    createNode: (data: Partial<NodeData>, position?: { x: number; y: number }) => any | null;
    updateNode: (nodeId: string | number, data: Partial<NodeData>) => any | null;
    deleteNode: (nodeId: string | number) => any | null;
}


const CytoscapeInstanceContext = createContext<CytoscapeInstanceContextType | null>(null);

export function CytoscapeInstanceProvider({children}:{children:ReactNode}) {
    const [cyInstance , setcyInstance] = useState<Core | null>(null);
    
    //未実装（エージェントからクエリ＋回答の二つを受け取ってから実行する関数）
    const createNode =useCallback((data: Partial<NodeData>, position?: { x: number; y: number }) => {
        if(!cyInstance) return null;

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
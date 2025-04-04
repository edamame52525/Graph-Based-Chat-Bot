import React,{createContext,useState,useContext, ReactNode} from "react";
import type { NodeData } from "@/types/node_types";


interface NodeContextType {
    selectedNode: NodeData | null;
    setSelectedNode: React.Dispatch<React.SetStateAction<NodeData | null>>;
    allNodes: NodeData[];
    setAllNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
}

const NodeContext = createContext<NodeContextType | undefined>(undefined);

export function NodeProvider({children}:{children:ReactNode}) {
    const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
    const [allNodes, setAllNodes] = useState<NodeData[]>([]);
   
    return (
        <NodeContext.Provider value={{
            selectedNode,
            setSelectedNode,
            allNodes,
            setAllNodes
        }}>
            {children}
        </NodeContext.Provider>
    );
};

export function useNode() {
    const context = useContext(NodeContext);
    return context;
};

export {NodeContext};

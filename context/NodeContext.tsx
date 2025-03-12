import React,{createContext,useState,useContext, ReactNode} from "react";
import type { NodeData } from "@/types/node_types";


interface NodeContextType {
    selectedNode: NodeData | null;
    setSelectedNode: (node: NodeData | null) => void;
}

const NodeContext = createContext<NodeContextType | undefined>(undefined);

export function NodeProvider({children}:{children:ReactNode}) {
    const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
    // console.log("NodeProvider rendered");
    // console.log("selectedNode:", selectedNode);
    return (
        <NodeContext.Provider value={{ selectedNode, setSelectedNode }}>
            {children}
        </NodeContext.Provider>
    );
};

export function useNode() {
    const context = useContext(NodeContext);

    return context;
};

import React,{createContext,useState,useContext, ReactNode} from "react";
import type { NodeData } from "@/types/node_types";


interface NodeContextType {
    selectedNode: NodeData | null;
    setSelectedNode: (node: NodeData | null) => void;
}

const NodeContext = createContext<NodeContextType | undefined>(undefined);

export const NodeProvider: React.FC<{children:ReactNode}> = ({ children }) => {
    const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

    return (
        <NodeContext.Provider value={{ selectedNode, setSelectedNode }}>
            {children}
        </NodeContext.Provider>
    );
};

export const useNode = () => {
    const context = useContext(NodeContext);

    if (context === undefined) {
        throw new Error("useNode must be used within a NodeProvider");
    }

    return context;
};
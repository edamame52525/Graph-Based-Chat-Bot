import React, { useEffect, useRef ,useContext } from "react";
import { NodeSingular,LayoutOptions } from "cytoscape";
import cytoscape from "cytoscape";
import type { NodeData } from "@/types/node_types";
import cola from 'cytoscape-cola';


interface NodeManagerProps {
    action: 'update' | 'create' | 'delete';
    nodeData?: NodeData;
}


const NodeManager: React.FC<NodeManagerProps> = ({ action, nodeData }) => {



    const CreateNodes = () => {
        
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

}





import React from 'react'
import type { NodeData } from '@/types/node_types'
import { useNode } from '@/context/NodeContext'

const CreateVectorStore = (Nodes:NodeData) => {
    const currentNodes = useNode();
    const fs = require('fs');
    const path = require('@/data');
    let crrNodeId = currentNodes.selectedNode?.id;

    while(Nodes.from != undefined){




    }



  return;
}

export default CreateVectorStore

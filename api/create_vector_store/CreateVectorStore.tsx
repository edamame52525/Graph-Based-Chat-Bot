import React from 'react'
import type { NodeData } from '@/types/node_types'
import { useNode } from '@/context/NodeContext'

const CreateVectorStore = (Nodes:NodeData[]) => {
    const currentNodes = useNode();
    const fs = require('fs');
    const path = require('@/data');
    let crrNodeId = currentNodes?.selectedNode?.id;
    
    if(Nodes.length == 0)return;
    while(Nodes[i].from != -1 ){




    }



  return;
}

export default CreateVectorStore

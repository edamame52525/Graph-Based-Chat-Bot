import { useState, useEffect, useCallback } from 'react';
import { useChatBot } from '@/context/ChatBotContext';
import { useCytoscape } from '@/context/CytoscapeContext';
import supabase from '@/utils/supabase';
import { NodeData } from '@/types/node_types';

export function Agent(){
    const chatbot = useChatBot();
    const cyInstance = useCytoscape();
    const cy = cyInstance?.cyInstance;
    
    const processQuery = useCallback(async(query:string, nodeId:number) =>{
        const tempNode= {
            label: "Agent",
            query: query,
            response: "",
            color: "red",
            from_node: nodeId
        }


        

        const {data,error} = await supabase
        .from("nodes")
        .insert(tempNode)
        .select();

        if(error){
            console.error("Error inserting new node",error);
            return;
        }

        const newNode = data[0] as NodeData;

        cyInstance?.createNode(newNode)





        

    },[]);

    return { processQuery };

    
}

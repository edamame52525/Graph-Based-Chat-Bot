import React,{createContext,useContext,useCallback,useState} from "react";
import OpenAI from 'openai';
import { NodeData } from "@/types/node_types";
import { useNode } from "./NodeContext";

interface ChatBotContextType {
    createVectorStore:(Nodes:NodeData[]) => void;
}

const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

export function ChatBotProvider({children}:{children:React.ReactNode}) {
    const [chatbot, setChatbot] = useState<ChatBotContextType | null>(null);
    const currentNodes = useNode();
    const fs = require('fs');
    const path = require('@/data');
    let crrNodeId = currentNodes?.selectedNode?.id;
    
    const client = new OpenAI({apiKey:process.env['OPENAI_API_KEY']});

    const createVectorStore = useCallback((Nodes:NodeData[]) => {
        if(Nodes.length == 0)return;
        let i = 0;
        while(Nodes[i].from != -1 ){
            i++;
        }
    }, []);

    return (
        <ChatBotContext.Provider value={{
            createVectorStore
        }}>
            {children}
        </ChatBotContext.Provider>
    );
};

export function useChatBot() {
    const context = useContext(ChatBotContext);
    return context;
};
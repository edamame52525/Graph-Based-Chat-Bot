import React,{createContext,useContext,useCallback,useState} from "react";
import OpenAI from 'openai';
import { NodeData } from "@/types/node_types";
import { useNode } from "./NodeContext";

interface ChatBotContextType {
    // createVectorStore:(Nodes:NodeData[]) => void;
}

const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

export function ChatBotProvider({children}:{children:React.ReactNode}) {
    const [chatbot, setChatbot] = useState<ChatBotContextType | null>(null);
    const currentNodes = useNode();

    let crrNodeId = currentNodes?.selectedNode?.id;
    
    const client = new OpenAI({apiKey:process.env['OPENAI_API_KEY']});

    const referVectorStore = useCallback((Nodes
        :NodeData[],NodeID:number) => {
        if(Nodes.length == 0)return;
        let refIdx:number = NodeID;
        let refer:number[] = []
        while(Nodes[refIdx].from != -1 ){
            refer.push(Nodes[refIdx].from)
            refIdx = Nodes[refIdx].from
        }

        // const {data,error} = 
    }, []);

    const streamResponse = useCallback(async (query:string) => {



    },[]);
    

    return (
        <ChatBotContext.Provider value={{
            referVectorStore,
            streamResponse
        }}>
            {children}
        </ChatBotContext.Provider>
    );
};

export function useChatBot() {
    const context = useContext(ChatBotContext);
    return context;
};
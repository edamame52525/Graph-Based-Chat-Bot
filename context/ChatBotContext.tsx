import React, { createContext, useContext, useCallback, useState } from "react";
import { openai }from '@ai-sdk/openai';
import { streamText } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { NodeData, embeddingNodeData } from "@/types/node_types";
import { useNode } from "./NodeContext";
import supabase from "@/utils/supabase";
import { paraseVectorFromStr } from "@/utils/vector_help";

interface ChatBotContextType {
    referVectorStore: (Nodes: NodeData[], NodeID: number) => number[] | undefined;
    fetchNodeEmbedding: (refer: number[]) => Promise<embeddingNodeData[] | undefined>;
    generateResponse: (query: string, nodeId: number) => Promise<void>;
}

const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

export function ChatBotProvider({ children }: { children: React.ReactNode }) {
    const [chatbot, setChatbot] = useState<ChatBotContextType | null>(null);
    const currentNodes = useNode();
    const allNodes = currentNodes?.allNodes || [];
    const setAllNodes = currentNodes?.setAllNodes;

    const client = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] });

    const referVectorStore = useCallback((Nodes: NodeData[], NodeID: number) => {
        if (Nodes.length == 0) return;
        let refIdx: number = NodeID;
        let refer: number[] = []
        while (Nodes[refIdx].from != -1) {
            refer.push(Nodes[refIdx].from)
            refIdx = Nodes[refIdx].from
        }

        return refer;
    }, []);

    const fetchNodeEmbedding = useCallback(async (refer: number[]) => {
        if (refer.length == 0) return;

        //***Attention*** Fetched node embeddings is String type
        const { data, error } = await supabase
            .from("node_embeddings")
            .select("node_id,embedding")
            .eq("id", refer);
        if (error) {
            console.error("Error fetching node embeddings", error);
            return;
        }

        // Parse fetched data to embeddingNodeData type 
        const embeddingData = data.map(item => ({
            id: item.node_id,
            embedding: paraseVectorFromStr(item.embedding)
        })) as embeddingNodeData[];


        console.log("embeddingdata", embeddingData);
        return embeddingData;

    }, [])

    const generateResponse = useCallback(async (query: string, nodeId: number) => {
        const systemPrompt = `
        あなたはネットワーク型会話AIです。
        返答の最後に [METADATA]タグを含めることができます。
        例: [METADATA]{"関連キーワード": ["AI", "会話"]}[/METADATA]
        `;

        let messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            { role: "system", content: systemPrompt },
            { role: "user", content: query }
        ];

        try {
            const response = await client.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages,
                stream: true,
            });

            const stream = OpenAIStream(response, {
                onToken: (token) => {
                    // ノードのresponseをリアルタイムで更新
                    setAllNodes?.((prevNodes) => {
                        const updatedNodes = prevNodes.map((node) =>
                            node.id === nodeId ? { ...node, response: (node.response || "") + token } : node
                        );
                        return updatedNodes;
                    });
                },
                onFinal: async (completion) => {
                    // メタデータ付きの最終レスポンスをSupabaseに保存
                    const embeddingResponse = await client.embeddings.create({
                        model: 'text-embedding-ada-002',
                        input: completion,
                    });

                    const embedding = embeddingResponse.data[0].embedding;

                    const { error } = await supabase
                        .from("node_embeddings")
                        .insert([{ node_id: nodeId, embedding }]);

                    if (error) {
                        console.error("Error saving embedding to Supabase", error);
                    }
                },
            });

            return new StreamingTextResponse(stream);
        } catch (error) {
            console.error("Error generating response", error);
        }
    }, [client, setAllNodes]);

    return (
        <ChatBotContext.Provider value={{
            referVectorStore,
            fetchNodeEmbedding,
            generateResponse
        }}>
            {children}
        </ChatBotContext.Provider>
    );
};

export function useChatBot() {
    const context = useContext(ChatBotContext);
    return context;
};
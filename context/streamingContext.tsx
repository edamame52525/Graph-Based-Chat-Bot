import React, { createContext, useState, useContext, useRef, ReactNode } from "react";
import type { NodeData } from "@/types/node_types";
import { useNode } from "./NodeContext";

interface StreamingContextType {
  // ストリーミング状態
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
  
  // 現在ストリーミング中のコンテンツ
  streamingContent: string;
  updateStreamingContent: (content: string) => void;
  
  // ストリーミング対象のノード
  streamingNode: NodeData | null;
  setStreamingNode: (node: NodeData | null) => void;
  
  // ストリーミング完了時の処理
  finishStreaming: (finalNode: NodeData) => void;
}

const StreamingContext = createContext<StreamingContextType | undefined>(undefined);

export function StreamingProvider({ children }: { children: ReactNode }) {
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [streamingNode, setStreamingNode] = useState<NodeData | null>(null);
  
  // NodeContextを使用
  const nodeContext = useNode();
  
  // ストリーミングコンテンツの更新（パフォーマンス最適化）
  const updateStreamingContent = (content: string) => {
    setStreamingContent(content);
    
    // ノード情報も同時に更新
    if (streamingNode) {
      const updatedNode = {
        ...streamingNode,
        response: content
      };
      setStreamingNode(updatedNode);
      
      // NodeContextも更新（選択中ノードの場合）
      if (nodeContext?.selectedNode?.id === updatedNode.id) {
        nodeContext.setSelectedNode(updatedNode);
      }
    }
  };
  
  // ストリーミング完了時の処理
  const finishStreaming = (finalNode: NodeData) => {
    setIsStreaming(false);
    setStreamingContent("");
    setStreamingNode(null);
    
    // 全ノードリストも更新
    if (nodeContext?.allNodes) {
      nodeContext.setAllNodes(prevNodes => {
        return prevNodes.map(node => 
          node.id === finalNode.id ? finalNode : node
        );
      });
    }
  };
  
  return (
    <StreamingContext.Provider value={{
      isStreaming,
      setIsStreaming,
      streamingContent,
      updateStreamingContent,
      streamingNode,
      setStreamingNode,
      finishStreaming
    }}>
      {children}
    </StreamingContext.Provider>
  );
}

export function useStreaming() {
  const context = useContext(StreamingContext);
  if (context === undefined) {
    throw new Error("useStreaming must be used within a StreamingProvider");
  }
  return context;
}
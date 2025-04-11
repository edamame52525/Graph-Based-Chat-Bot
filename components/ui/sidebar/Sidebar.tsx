import React,{useEffect, useState} from "react"
import ReactMarkdown from 'react-markdown'
import { Link, X } from "react-feather"
import type { NodeData } from "@/types/node_types"
import { Textarea } from "../textarea/textarea"
import { Label } from "@radix-ui/react-label"
import { Button } from "@/components/ui/button/button"
import { useNode } from "@/context/NodeContext"
import { useCytoscape } from "@/context/CytoscapeContext"
import { set } from "react-hook-form"
import { useAgent } from "@/components/agent/agent"
import { useStreaming } from "@/context/streamingContext"
interface SidebarProps {
    isOpen: boolean
    onClose: () => void
    nodeData: NodeData | null
}
  
export default function Sidebar({ isOpen, onClose, nodeData }: SidebarProps) {
  const [messageText, setMessageText] = useState("");
  const [nodeResponse,setNodeResponse] = useState<string|null>()
  const { isStreaming, streamingNode, streamingContent } = useStreaming();

  const nodeContext = useNode();
  const cyInstance = useCytoscape();
  const { processQuery } = useAgent();
  // 発火時の処理
  const handleSendMessage = async () => {

    if (!messageText.trim()) return;
    console.log("Sending message:", messageText);
    let tempMessage = messageText;
    setMessageText("");
  
    await processQuery(tempMessage,nodeContext?.selectedNode?.id!)
    console.log("参照ノードのコンテンツ",nodeContext?.selectedNode);
  }

  // useEffect(() =>{
  //   if (nodeContext?.selectedNode?.id && cyInstance) {
  //     const selectedNodeId = nodeContext.selectedNode.id.toString();
  //     const element = cyInstance?.cyInstance?.getElementById(selectedNodeId);
  //     console.log("現在のレスポンス材料",element?.data)
  //     if (element && element.data) {
  //       const response = element.data("response");
  //       setNodeResponse(response || "");
  //     } else {
  //       setNodeResponse("");
  //     }
  //   }


  // },[nodeContext?.selectedNode?.response])


  // 表示するレスポンスを決定
  const displayResponse = () => {
    // ストリーミング中で、現在選択中のノードがストリーミング対象なら
    if (isStreaming && streamingNode && nodeContext?.selectedNode?.id === streamingNode.id) {
      return streamingContent;
    }
    
    // 通常表示
    return nodeContext?.selectedNode?.response || "";
  };
    



  return (
    <div
      className={`fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-10 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 h-full overflow-auto">
        <div className="flex justify-between items-center mb-6">
          {/* <h2 className="text-2xl font-bold">マイクロサービスアーキテクチャに関する情報</h2> */}
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close sidebar">
            <X className="h-6 w-6" />
          </button>
        </div>

        {nodeData ? (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full mb-4" style={{ backgroundColor: nodeData.color }} />

              <div>
                <h3 className="text-lg font-semibold">質問:</h3>
                <p>{nodeContext?.selectedNode?.query}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold ">AIの回答:</h3>
                {isStreaming && streamingNode?.id === nodeContext?.selectedNode?.id && (
                <div className="text-blue-500 text-sm mb-2">応答中...</div>
                )}
              <ReactMarkdown>{displayResponse()}</ReactMarkdown>
              </div>

              <div className="grid w-full gap-1.5">
              <Label htmlFor="message" className="mt-4 font-semibold">つづけて質問</Label>
              <Textarea 
                placeholder="入力してください" 
                id="message"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />

              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground mt-0 text-xs">
                  Ctrl + Enterで送信
                </p>
                <Button onClick={handleSendMessage}>送信</Button>               
              </div> 
            </div> 
          </div>
        ) : (
        <p>Select a node to view details</p>
      )}
      </div>
    </div>
  )
}


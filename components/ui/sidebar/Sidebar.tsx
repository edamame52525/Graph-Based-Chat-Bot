import React,{useState} from "react"
import { Link, X } from "react-feather"
import type { NodeData } from "@/types/node_types"
import { Textarea } from "../textarea/textarea"
import { Label } from "@radix-ui/react-label"
import { Button } from "@/components/ui/button/button"
import { useNode } from "@/context/NodeContext"
import { useCytoscape } from "@/context/CytoscapeContext"
import { set } from "react-hook-form"
import { Agent } from "@/components/agent/agent"
interface SidebarProps {
    isOpen: boolean
    onClose: () => void
    nodeData: NodeData | null
}

type OperationProps = 'none' | 'create' | 'update' | 'delete' | 'detail';

const ResourceContext = React.createContext("");
  
export default function Sidebar({ isOpen, onClose, nodeData }: SidebarProps) {
  const [operation, setOperation] = useState<OperationProps>('none');
  const [messageText, setMessageText] = useState("");
  const nodeContext = useNode();
  const createNode = () => setOperation('create');
  const updateNode = () => setOperation('update');
  const deleteNode = () => setOperation('delete');
  const { processQuery } = Agent();
  // 発火時の処理
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    console.log("Sending message:", messageText);
    const result = await processQuery(messageText,nodeContext?.selectedNode?.id!)
    
  }
  
  return (
    <div
      className={`fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-10 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 h-full overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">○○に関する情報</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close sidebar">
            <X className="h-6 w-6" />
          </button>
        </div>

        {nodeData ? (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full mb-4" style={{ backgroundColor: nodeData.color }} />

              <div>
                <h3 className="text-lg font-semibold">質問:</h3>
                <p>○○とはなんでしょうか</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold ">AIの回答:</h3>
                <p>○○とは△△ということです。</p>
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


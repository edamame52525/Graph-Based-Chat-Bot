import React, from "react"
import { Link, X } from "react-feather"
import type { NodeData } from "@/types/node_types"
import { Textarea } from "../ui/textarea"
import { Label } from "@radix-ui/react-label"
import { Button } from "../ui/button"
import NodeManager from "../node-controls/NodeManager"


interface SidebarProps {
    isOpen: boolean
    onClose: () => void
    nodeData: NodeData | null
}

  const ResourceContext = React.createContext("");
  
  export default function Sidebar({ isOpen, onClose, nodeData }: SidebarProps) {
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
                <Textarea placeholder="入力してください" id="message" />
                <p className="text-sm text-muted-foreground mt-0 text-xs">
                  Ctrl + Enterで送信
                </p>
                <NodeManager/>
              </div>
  
              {/* <div>
                <h3 className="text-lg font-semibold">Description</h3>
                <p>{nodeData.response}</p>
              </div> */}
  
             
  
              {/* Additional node information can be added here */}
              {/* <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Actions</h3>
                <div className="flex flex-col gap-2">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Edit Node</button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                    View Connections
                  </button>
                </div>
              </div> */}
            </div>
          ) : (
            <p>Select a node to view details</p>
          )}
        </div>
      </div>
    )
  }
  
  
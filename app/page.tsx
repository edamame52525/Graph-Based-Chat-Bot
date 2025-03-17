"use client"


import { useState } from "react"
import CytoscapeGraph from "@/components/cytoscape/CytoscapeGraph"
import Sidebar from "@/components/ui/sidebar/Sidebar"
import type { NodeData } from "@/types/node_types"
import { NodeProvider } from "@/context/NodeContext"
import { CytoscapeInstanceProvider } from "@/context/CytoscapeContext"
import CytoscapeEventHandle from "@/components/cytoscape/CytoscapeEventHandle"



export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null)

  const handleNodeClick = (nodeData: NodeData) => {
    setSelectedNode(nodeData)
    setSidebarOpen(true)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <CytoscapeInstanceProvider>
    <NodeProvider>
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="relative flex w-full h-screen">
          <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "pr-[33.333%]" : ""}`}>
            <CytoscapeGraph>
              <CytoscapeEventHandle action={'detail'} onNodeClick={handleNodeClick} />
            </CytoscapeGraph>
          </div>
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} nodeData={selectedNode} />
        </div>
        
      </main>
    </NodeProvider>
    </CytoscapeInstanceProvider>
  )
}
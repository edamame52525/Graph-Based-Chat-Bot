"use client"

import { Search, ZoomIn, ZoomOut, Maximize, RotateCcw, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Input } from "@/components/ui/input/Input"
import { useState } from "react"

interface ToolbarProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onFit: () => void
  onReset: () => void
  onSearch: (query: string) => void
}

export default function Toolbar({ onZoomIn, onZoomOut, onFit, onReset, onSearch }: ToolbarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch)
    if (!showSearch) {
      // Focus the input when search is shown
      setTimeout(() => {
        const input = document.getElementById("search-input")
        if (input) input.focus()
      }, 100)
    }
  }

  return (
    <div className="absolute top-4 left-4 flex flex-col gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-md z-10">
      <Button variant="ghost" size="icon" onClick={onZoomIn} title="Zoom In">
        <ZoomIn className="h-5 w-5" />
      </Button>

      <Button variant="ghost" size="icon" onClick={onZoomOut} title="Zoom Out">
        <ZoomOut className="h-5 w-5" />
      </Button>

      <div className="h-px bg-border my-1 mx-auto w-4/5" />

      <Button variant="ghost" size="icon" onClick={onFit} title="Fit to View">
        <Maximize className="h-5 w-5" />
      </Button>

      <Button variant="ghost" size="icon" onClick={onReset} title="Reset View">
        <RotateCcw className="h-5 w-5" />
      </Button>

      <div className="h-px bg-border my-1 mx-auto w-4/5" />

      <div className="relative">
        <Button variant="ghost" size="icon" onClick={toggleSearch} title="Search">
          <Search className="h-5 w-5" />
        </Button>

        {showSearch && (
          <div className="absolute left-full ml-2 top-0 flex items-center bg-background rounded-lg shadow-lg p-1">
            <Input
              id="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search nodes..."
              className="w-40 h-8 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button variant="ghost" size="sm" onClick={handleSearch} className="ml-1">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="h-px bg-border my-1 mx-auto w-4/5" />

      <Button variant="ghost" size="icon" title="Export">
        <Download className="h-5 w-5" />
      </Button>

      <Button variant="ghost" size="icon" title="Share">
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  )
}


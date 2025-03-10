import { ArrowLeft, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NodeControlsProps {
  onBack: () => void
  onZoomIn: () => void
  onZoomOut: () => void
}

export default function NodeControls({ onBack, onZoomIn, onZoomOut }: NodeControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-md z-10">
      <Button variant="outline" size="icon" onClick={onBack} title="Back to Overview">
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="h-full w-px bg-border mx-1" />

      <Button variant="outline" size="icon" onClick={onZoomIn} title="Zoom In">
        <ZoomIn className="h-5 w-5" />
      </Button>

      <Button variant="outline" size="icon" onClick={onZoomOut} title="Zoom Out">
        <ZoomOut className="h-5 w-5" />
      </Button>
    </div>
  )
}


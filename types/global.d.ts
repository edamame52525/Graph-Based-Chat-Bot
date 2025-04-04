import 'cytoscape';
declare module 'cytoscape' {
    interface CytoscapeOptions {
      grid?: {
        name?: string;
        fit?: boolean;
        padding?: number;
        rows?: number;
        columns?: number;
        avoidOverlap?: boolean;
        avoidOverlapPadding?: number;
        nodeDimensionsIncludeLabels?: boolean;
        spacingFactor?: number;
        condense?: boolean;
        sort?: (a: any, b: any) => number;
        animate?: boolean;
        animationDuration?: number;
        animationEasing?: string;
        boundingBox?: { x1: number; y1: number; x2: number; y2: number };
        ready?: () => void;
        stop?: () => void;
      };
    }
  }
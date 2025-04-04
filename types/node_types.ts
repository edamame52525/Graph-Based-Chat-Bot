export interface NodeData {
    id: number
    label: string
    color: string
    query: string
    response: string
    parent : number
    summary : string
}

export interface GraphData{
    nodes:{data:{id:string; label:string; color:string; query:string; parentID:string; response:string; summary:string }}[],
    edges:{data:{id:string; source:string; target:string}}[],
  }

export interface embeddingNodeData{
    id:number
    embedding: number[] | null
}
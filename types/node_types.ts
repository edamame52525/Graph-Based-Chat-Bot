export interface NodeData {
    id: number
    label: string
    color: string
    query: string
    response: string
    from : number
}

export interface GraphData{
    nodes:{data:{id:string; label:string; color:string; query:string; response:string; from:number }}[],
    edges:{data:{id:string; source:string; target:string}}[],
  }

export interface embeddingNodeData{
    id:number
    embedding: number[] | null
}
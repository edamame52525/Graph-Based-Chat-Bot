import { fromJSON } from "postcss"

export interface NodeData {
    id: number
    label: string
    query: string
    response: string
    color: string
    from : number
}

export interface GraphData{
    nodes:{data:{id:string; label:string; color:string; query:string; response:string; from:number }}[],
    edges:{data:{id:string; source:string; target:string}}[],
  }
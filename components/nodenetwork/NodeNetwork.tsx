import React from 'react'


/*
このコンポーネントでは,受け取ったテキストデータを生成AIに渡して、回答をもらうためのロジックを記述する。
nodeが一つもない時には、それ用のレイアウトを表示、nodeがある時には、それ用のレイアウトを表示するようにしたいが、いったん普通の処理を書く



*/ 



// Sample graph data
const graphData = {
    nodes: [
    { data: { id: "1", label: "Node 1", description: "This is node 1", color: "#ff5733" } },
    { data: { id: "2", label: "Node 2", description: "This is node 2", color: "#33ff57" } },
    { data: { id: "3", label: "Node 3", description: "This is node 3", color: "#3357ff" } },
    { data: { id: "4", label: "Node 4", description: "This is node 4", color: "#f3ff33" } },
    { data: { id: "5", label: "Node 5", description: "This is node 5", color: "#ff33f5" } },
    ],
    edges: [
    { data: { id: "e1", source: "1", target: "2" } },
    { data: { id: "e2", source: "1", target: "3" } },
    { data: { id: "e3", source: "2", target: "4" } },
    { data: { id: "e4", source: "3", target: "5" } },
    { data: { id: "e5", source: "4", target: "5" } },
    ],
}

const NodeNetwork:React.FC = () => {


  return (
    <div>
         
    </div>
  )
}

export default NodeNetwork

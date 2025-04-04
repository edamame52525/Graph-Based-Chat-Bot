
import { NodeData} from "@/types/node_types";
import supabase from "@/utils/supabase";

    // 親ノードまでのインデックスを取得
    const referByRoot = (NodesDict:Record<number,NodeData>, NodeID: number) => {
        let refer: number[] = []
        if (!NodesDict) return refer;
        let refIdx: number = NodeID;
        console.log('refer',refIdx)
        
        while (refIdx > 0) {
            const parent = NodesDict[refIdx].parent;
            if(parent == 0) break;
            refer.push(parent)
            refIdx = parent
        }
        console.log("親までのインデックス",refer)
        return refer;
    };


    function convertToDictionary(nodes: NodeData[]): Record<number, NodeData> {
        return nodes.reduce((dict, node) => {
            dict[node.id] = node;
            console.log('dict',dict)
            return dict;
        }, {} as Record<number, NodeData>);
    }

    // 上のインデックスを元に、DBを参照して指定のIDにある会話の履歴を取ってくる
    export default async function fetchSummary(NodeID: number,allNodes: NodeData[]): Promise<string> {
        
        console.log("親までのインデックスを返してもらう")
        const allNodeDict = convertToDictionary(allNodes)
        const refer = referByRoot(allNodeDict,NodeID)
        if (refer?.length == 0) return '';

        const { data,error } = await supabase
            .from('nodes')
            .select('summary')
            .in('id',refer);


        if(error){
            console.log("data fetch error");
            return '';
        }


        const datalist: string[] = data.map(item => item.summary || "").filter(summary => summary !== "");
        // 会話の履歴をサマリーごとに改行でjoinして返してあげる
        return datalist.reverse().join("\n");

    }



 
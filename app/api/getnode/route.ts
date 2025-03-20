import type { Database } from "@/types/database.types";
import supabase from "@/utils/supabase";
import { NodeData } from "@/types/node_types";

export async function GET() {
    try {
      console.log("GET NODES");
      const { data, error } = await supabase
        .from("nodes")
        .select("*");

        if (error) throw error;

        console.log("データ",data);
        const nodeData :NodeData[] = data.map(node =>({
            id: node.id,
            from: node.from_node || -1,
            label: node.label,
            query: node.content || '',
            response: node.response || '',
            color: node.color || '',
        }))

        console.log("ノードデータ",nodeData);

        return new Response(JSON.stringify(nodeData), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'No data found' }), { status: 404 });
    }
}
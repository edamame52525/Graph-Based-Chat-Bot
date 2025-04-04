import { useState, useEffect, useCallback, useRef } from 'react';
import { useCytoscape } from '@/context/CytoscapeContext';
import supabase from '@/utils/supabase';
import { NodeData } from '@/types/node_types';
import { useNode } from '@/context/NodeContext';
import { readStreamableValue } from 'ai/rsc';
import { runThread } from '@/lib/runThread';
import fetchSummary from '@/utils/getHistory';
import { any, number } from 'zod';
import { Container } from 'postcss';
import { generateSummary } from '@/lib/generateSummary';
import { markCurrentScopeAsDynamic } from 'next/dist/server/app-render/dynamic-rendering';


export function useAgent(){
    const cyInstance = useCytoscape();
    const NodeContext = useNode();
    const [content,setContent] = useState<string>("")
    const contentRef = useRef<string>(""); // 実際のデータを保持




    
    // 応答処理の一連
    const processQuery = useCallback(async(query:string, nodeId:number) =>{

        
        //ーーーーーーーーーーーーーーーー前処理ーーーーーーーーーーーーーーーーー
        const tempNode= {
            label: "",
            query: query,
            response: "",
            summary:"",
            color: "red",
            parent: nodeId,
        }

        // 初期ノードをsupabaseにinsert（supabase側でオートインクリメントを行い、ユニークIDをいったん取得）
        const {data,error} = await supabase
        .from("nodes")
        .insert(tempNode)
        .select();

        if(error){
            console.error("Error inserting new node",error);
            return;
        }

        // フェッチしたデータを正式な初期ノードとして扱う。
        let newNode = data[0] as NodeData;

        // 初期ノードをcytoscapeに登録してもらう
        cyInstance?.createNode(newNode)



        const updateAllNodes = (newNode: NodeData): Promise<NodeData[]> => {
            return new Promise((resolve) => {
                NodeContext?.setAllNodes((prevAllNodes: NodeData[]) => {
                    const updatedNodes = [...prevAllNodes, newNode];
                    resolve(updatedNodes); // 更新後の状態を返す
                    return updatedNodes; // 状態を更新
                });
            });
        };
        
        // 全体を参照しているallnodesにもデータを渡す
        NodeContext?.setSelectedNode(newNode);
        const updatedNodes = await updateAllNodes(newNode);

        
        
        //ーーーーーーーーーーーーーーーー 会話の作成ーーーーーーーーーーーーーーーーー
        // 親ノードまでの会話の履歴を貰う

        const history:string = await fetchSummary(newNode.id, updatedNodes || []) || '';
        if (history) {
            console.log("Summary fetched:", history);
        } else {
            console.log("No summary found");
        }
   
        // ーーーーstreaming処理ーーーーー
        const {stream} = await runThread(query,history);
        if(!stream){
            return;
        }
        for await (const delta of readStreamableValue(stream)) {
            contentRef.current += delta
            setContent(contentRef.current)
            console.log("content",contentRef.current)
            cyInstance?.updateNode(newNode.id,contentRef.current)
        }

        // ーーーーーーーーーーーーーーーー
        
        // 要約の追加
        const res = contentRef.current
        const message = await generateSummary(query,res);
        
        //newNodeの更新
        newNode.response = contentRef.current
        newNode.summary = message.text
        newNode.label = res.substring(0, 8) + (res.length > 8 ? '...' : '');
        
        await supabase
            .from('nodes')
            .update({
                response: newNode.response,
                summary: newNode.summary,
                label:newNode.label
            })
            .eq('id',newNode.id)

        // 全体を参照しているallnodesにもデータを渡す
        NodeContext?.setSelectedNode(() => newNode);

        // 全体ノードを更新
        await updateAllNodes(newNode);


        


        
        
        
        
        contentRef.current = ''
                
    },[cyInstance]);

    return { processQuery };

    
}

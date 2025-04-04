"use server";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";


export async function generateSummary(query:string,response:string) {
  
    
        const systemPrompt = `
        ユーザのクエリ＋回答を流します。内容を要約してください。使いまわすので、できるだけユーザのクエリ、回答両方の情報量を失わないようにしてください。
        要約のみ出力をお願いします

        ユーザの質問:${query}
        生成AIの回答:${response}

        ---
        `;
      
        const { text } = await generateText({
          model:openai('gpt-4o-mini'),
          prompt:systemPrompt
        });
      
        return {text}
      
      


}

"use server";

import { createStreamableValue } from "ai/rsc";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";


export async function runThread(query:string,history:string) {
  console.log("runThread hit")
  

  const stream = createStreamableValue("");
  const systemPrompt = `
  会話の履歴を渡します。
  ${history}

  それでは会話の続きの会話をお願いします。そのまま回答してください
  ${query}
  `;

  (async () =>{
    const result = streamText({
      model: openai('gpt-4o-mini'),
      prompt: systemPrompt,
    });
    for await (const delta of result.textStream) {stream.update(delta);}
    stream.done();
  })();


  return {stream: stream.value};
  
}




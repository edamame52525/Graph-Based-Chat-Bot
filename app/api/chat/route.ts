// app/api/chat/route.ts
import { streamText } from 'ai';
import { openai }from '@ai-sdk/openai';
import OpenAI from 'openai';
import { text } from 'stream/consumers';

export async function POST(req: Request) {

    const systemPrompt = `
    あなたはネットワーク型会話AIです。
    返答の最後に [METADATA]タグを含めることができます。
    例: [METADATA]{"関連キーワード": ["AI", "会話"]}[/METADATA]
    `;

    const {textStream} = streamText({
        model: openai('gpt-3.5-turbo'),
        prompt:systemPrompt
    })

    for await(const textPart of textStream){
    }

}
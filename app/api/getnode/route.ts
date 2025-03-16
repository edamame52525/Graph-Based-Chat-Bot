import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const filePath = path.join(process.cwd(),'data','nodedata','node.json');
    console.log("API hit");

    try {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        console.log(data);
        return new Response(data, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'No data found' }), { status: 404 });
    }
}
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const filePath = path.resolve('process.cwd()','..','..','data','nodedata','node.json');
    console.log(filePath);
    fs.readFile(filePath, 'utf-8', (error, data) => {
        if (error) {
            console.error(error);
            return new Response(JSON.stringify({ message: 'No data found' }), { status: 404 });
        }
        console.log(data);
        return new Response(data, { status: 200, headers: { 'Content-Type': 'application/json' } });
    });
}
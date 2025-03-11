import { error } from 'console';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {

    fs = require('fs');
    path = require('@/data/nodedata/node.json');
    fs.readFile(path,'utf-8',(error,data) => {
        if(error){
            console.log(error);
            return;
        }
        
        data.satus(200).json(JSON.parse(data));
        return data;
    });
    else{
        data.status(404).json({message: 'No data found'});
    }

}
export function paraseVectorFromStr(vectorStr:string | null):number[] | null{
    if(vectorStr === null) return null;
    const vector = vectorStr.split(",").map((v)=>Number(v));
    return vector;
}
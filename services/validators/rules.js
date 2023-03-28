const hasKey = (data,key)=>{
    if(!data) throw new Error("invalid data");
    if(typeof data[key] === "string") data[key] = data[key].trim();
    return data[key]!==null&&data[key]!==undefined&&data[key]!="";
}

const isText = (data,key)=>{
    return typeof data[key] === "string";
}

const notEmptyText = (data,key)=>{
    if(!data[key]) throw new Error("invalid data");
    return isText(data,key) && data[key].length>0;
}
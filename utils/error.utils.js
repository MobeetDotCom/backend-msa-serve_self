exports.formatErrorLog=(error)=>{
    return JSON.stringify({message:error.message,stack:error.stack});
}
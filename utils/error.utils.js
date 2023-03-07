exports.formatErrorLog=(error)=>{
    console.log(error);
    return JSON.stringify({message:error.message,stack:error.stack});
}
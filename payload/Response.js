class Response{}

Response.ok=(msg)=>{
        return{
            status:true,
            message:msg
        }
}

Response.buildResponse=(data,msg)=>{
    return{
        message: msg,
        data:data,
    }
}
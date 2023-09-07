export const notFoundHandellar = (_req,_res,next) => {
    const error = new Error('404 Not Found')
    error.status = 404
    next(error)
}



export const globalErrorHandellar = (error,_req,res,_next)=>{
    if (error.name === "CastError") {
        const message = `Resource not found. Invalid: ${error.path}`;
        res.status(400).json({message})
    }else if(error.status){
        res.status(error.status).json({
            message : error.message
        })
    }else if(error?.errors?.length > 0){
        res.status(400).json(error)
    }  
    else{
        res.status(500).json({message : error.message})
    }
};

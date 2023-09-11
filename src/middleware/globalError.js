export const notFoundHandellar = (_req,_res,next) => {
    const error = new Error('404 Not Found')
    error.status = 404
    next(error)
}



export const globalErrorHandellar = (error,_req,res,_next)=>{
    console.log('Error ---------------' , error.stack)
    if(error.status){
      return  res.status(error.status).json({
            message : error.message
        })
    }else{
      return res.status(500).json({message : error.message})
    }
};

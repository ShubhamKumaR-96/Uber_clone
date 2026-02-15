
import ErrorResponse from "../utils/errorResponse.js";


export const notFound=(req,res,next)=>{
    const messgae=`Route not found - ${req.originalUrl}`;
    next(new ErrorResponse(messgae,404))
}

export const errorHandler=(err,req,res,next)=>{
    let error={...err}
    error.messgae=err.messgae

    // log error for debugging 
    console.error('Error',err)

    // mongoose bad objectId (cast error)
    if(err.name==='CastError'){
        const messgae='Resource not found';
        error==new ErrorResponse(messgae,404)
    }

    // mongoose duplicate key
    if(err.code===11000){
        const field=Object.keys(err.keyPatter)[0]
        const messgae=`${field} alreday exits`
        error=new ErrorResponse(messgae,400)
    }

    // mongoose validation error
    if(err.name === 'ValidationError'){
        const message=Object.values(err.errors).map((val)=>val.message).join(', ')
        error=new ErrorResponse(message,400)
    }

    // send response
    res.status(error.statusCode || 500).json({
        success:false,
        message:error.message || 'Server Error',
        ...(process.env.NODE_ENV==='development' && {stack : err.stack})
    })


}
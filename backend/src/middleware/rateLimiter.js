import rateLimit from 'express-rate-limit'

export const rateLimiter=rateLimit({
    windowMs: 15*60*1000, //15 minutes
    max: 100, //limit each IP to 100 requests per windowMs
    message:"Too many requests from this IP, please try again after 15 minutes",
    standardHeaders:true, //return rate limit info in the `RateLimit-*` headers
    legacyHeaders:false, //disable the `X-RateLimit-*` headers
})

export const loginRateLimiter=rateLimit({
    windowMs: 15*60*1000, //15 minutes
    max: 5, //limit each IP to 5 login requests per windowMs
    message:"Too many login attempts from this IP, please try again after 15 minutes",
    standardHeaders:true, //return rate limit info in the `RateLimit-*` headers
    skipSuccessfulRequests:true, //only count failed login attempts
})

export const registerRateLimiter=rateLimit({
    windowMs: 60*60*1000, //1 hour
    max: 10, //limit each IP to 10 registration requests per windowMs
    message:"Too many registration attempts from this IP, please try again after an hour",
    standardHeaders:true, //return rate limit info in the `RateLimit-*` headers
})
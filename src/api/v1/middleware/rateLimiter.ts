import rateLimit from "express-rate-limit";

// A rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 3 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

export default limiter;

//update service functions
//rate limiter parameter values
import cors from "cors"
import morgan from "morgan"
import express from "express";

// Preset Middleware
const middleware = [cors() , morgan('dev') , express.json() , express.urlencoded({extended : false}) ];

export default middleware;
import cors from "cors"
import morgan from "morgan"

// Preset Middleware
const middleware = [cors() , morgan('dev') , ];

export default middleware;
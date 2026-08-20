import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
// import connectCloudinary from "./config/cloudinary.js"
import adminRouter from "./routes/adminRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import userRouter from "./routes/userRoute.js"


//app configuration
const app = express()
const port = process.env.PORT || 4000
connectDB()
// try {
//     await connectCloudinary()
//     console.log('Cloudinary configured')
// } catch (err) {
//     console.warn('Cloudinary not configured:', err.message)
// }

//middlewares(Built-in middleware)
app.use(express.json())
app.use(cors())

//API endpoints
app.use('/api/admin',adminRouter);//4000/api/admin
app.use('/api/doctor',doctorRouter);//4000/api/admin
app.use('/api/user',userRouter);//4000/api/admin


app.get('/',(req,res)=>{
    res.send('API is Working Great');
})

app.listen(port,()=>console.log("Server is started",port));
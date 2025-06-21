import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/AuthRoutes.js"
import contactsRoutes from "./routes/ContactRoutes.js"

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;
const baseURL = process.env.BASEURL;

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));

app.use("/upload/profiles", express.static("upload/profiles"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes)

const server = app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`)
});

mongoose.connect(baseURL).then(()=> console.log("DB connection successful")).catch((err)=>console.log(err.message));

// gracefull shutdown for nodemon restarts
// process.once('SIGINT', () => {
//     server.close(()=>{
//         mongoose.connection.close(false, ()=>{
//             console.log('MongoDb connection close on app restart');
//             process.kill(process.pid, 'SIGINT');
//         })
//     })
// })
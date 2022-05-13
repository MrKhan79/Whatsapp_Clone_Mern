//importing
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

//app config
const app = express();
dotenv.config();
const port = process.env.PORT || 9000;

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);
const __dirname = path.dirname(_dirname);

//pusher config
const pusher = new Pusher({
  appId: "1405449",
  key: "6e4f86b7b387cbedd065",
  secret: "319f7a74f2631717a7de",
  cluster: "ap2",
  useTLS: true
});

pusher.trigger("my-channel", "my-event", {
  message: "hello world"
});


//middleware

app.use(express.json());



//cors header to allow request frm any point
app.use(cors()); 



//Db config
// const connection_url = process.env.MONGO_URI
// mongoose.connect(connection_url,{
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
      console.log("MongoDB connected!");
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit();
    }
  };

  connectDB();


const db = mongoose.connection

//to check if something has changed in db
db.once('open',()=>{
    console.log('DB connected')

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change)=>{
        console.log("A change occured",change)
        
        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted',{
                name: messageDetails.name,
                message:messageDetails.message,
                timestamp: messageDetails.timestamp,
                recived: messageDetails.recived,
                roomId: messageDetails.roomId
            });

        }
        else{
            console.log("Error triggering Pusher")
        }
    })
})



//api routes
if(process.env.NODE_ENV === "production"){
app.use(express.static(path.join(__dirname,"frontend", "build")));
app.get("/",async (req,res) =>res.sendFile(path.resolve(__dirname,"frontend", "build", "index.html")));
}

//to read all messages from db
app.get('/messages/sync', (req,res) =>{
    Messages.find((err, data) =>{
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(200).send(data)
        }

    })
})


//to create message
app.post('/messages/new', (req,res) =>{
    const dbMessage = req.body;

    Messages.create(dbMessage, (err,data)=>{
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(201).send(data)
        }
    })
})

//server production assests
// if(process.env.NODE_ENV === "production"){
    //app.get("*",async (req,res) =>res.sendFile(path.resolve(__dirname,"frontend", "build", "index.html")))
// }



//listen
app.listen(port, ()=>console.log(`Listining on localhost ${port}`));


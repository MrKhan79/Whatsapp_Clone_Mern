import { Avatar, IconButton } from '@mui/material';
import { useEffect, useState } from 'react'
import React from 'react'
import MicNoneIcon from '@mui/icons-material/MicNone';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import "./Chat.css";
import { useParams } from 'react-router-dom';
import db from './firebase';
import { useStateValue } from './StateProvider';
import axios from './axios';


const Chat = ({messages}) => {

  const [{user}, dispatch] = useStateValue();
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState('');
  const {roomId} = useParams();
  const [roomName, setRoomName] = useState("");
  const [theRoomId, setTheRoomId] = useState("")
  const [lastSeen, setLastSeen] = useState("")
    
    useEffect(()=>{
       if(roomId){
         db.collection('rooms').doc(roomId).onSnapshot((snapshot)=>
         setRoomName(snapshot.data().name));
         setTheRoomId(roomId)
       }

         
      }, [roomId]);
    

    useEffect(() =>{
        
       const msg =  messages.filter((message)=>message.roomId===roomId);
        const x = msg.pop()
        if(x){
          var ls = x.timestamp;
          ls?setLastSeen(ls):setLastSeen("")
        }
       
        

       
        setSeed(Math.floor(Math.random() * 5000));

    }, [roomId, messages]);


    const sendMessage = async (e) =>{
          e.preventDefault();
          var today = new Date();
          var time = today.getHours() + ":" + today.getMinutes()
          await axios.post("/messages/new",{
            message: input,
            name: user.displayName,
            timestamp: time,
            received: true,
            roomId: roomId,
          });
          setInput("")
    }
  


  return (
    
    <div className="chat">
      <div className='chat_header'>
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
       <div className='chat_headerInfo'>
         <h3>{roomName}</h3>

         <p>last seen {lastSeen}</p>
       </div>
      <div className='chat_headerRight'>
        <IconButton>
        <SearchIcon />
        </IconButton>
        <IconButton>
          <AttachFileIcon />
        </IconButton>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </div>
      </div>
      <div className='chat_body'>
        {messages.map((message) => {
          if(roomId === message.roomId){
            if(user.displayName === message.name){
              return( 
                <><p className="chat_reciever chat_message ">
                 <span className='chat_name'>{message.name}</span>
                 {message.message}
                 <span className='chat_timestamp'>{message.timestamp}</span></p></>
                 )
            }
            else{
              return( 
                <><p className="chat_message ">
                 <span className='chat_name'>{message.name}</span>
                 {message.message}
                 <span className='chat_timestamp'>{message.timestamp}</span></p></>
                 )

            }
         }
            })}     
          

      </div>
      <div className='chat_footer'>
        <IconButton>
      <InsertEmoticonIcon />
      </IconButton>
      <form className='chat_input'>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder='Type a Message' type='text' />
      <button type="submit" onClick={sendMessage}>Send a message</button>
      </form>
      <IconButton>
      <MicNoneIcon />
      </IconButton>

      </div>
      
    </div>
  )
}

export default Chat

import Avatar from '@mui/material/Avatar';
import React, { useEffect, useState } from 'react'
import { Link,useParams } from 'react-router-dom';
import db from './firebase';
import "./SidebarChat.css";

const SidebarChat = ({addNewChat, id, name, messages}) => {

    const [seed, setSeed] = useState('');
    const [lastMessage, setLastMessage] = useState([])
    const {roomId} = useParams();


    
    useEffect(() =>{
       
        setSeed(Math.floor(Math.random() * 5000));

    }, [messages, id])

   

const createChat = () =>{

    const roomName = prompt("Please enter name for the chat room");

    if (roomName){
        db.collection('rooms').add({
            name: roomName,
        })
       alert(`Room named ${roomName} added succesfully!`);
    }

}

  return !addNewChat ?(
      <Link className="theLink" to={`/rooms/${id}`}>
    <div className='sidebarChat'>
         <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
         <div className='sidebarChat_info'>
            <h2>{name}</h2> 
            
            <p>{messages}</p>
         </div>
    </div>
    </Link>
  ):(
      <div onClick={createChat} className="sidebarChat">
          <h2>Add new chat</h2>

      </div>)
}

export default SidebarChat

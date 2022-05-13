import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatIcon from '@mui/icons-material/Chat';
import Avatar from '@mui/material/Avatar';
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from 'react'
import SidebarChat from './SidebarChat';
import "./Sidebar.css";
import { IconButton } from '@mui/material';
import db from './firebase';
import { useStateValue } from './StateProvider';

const Sidebar = ({messages}) => {

  const [{user}, dispatch] = useStateValue();
  const [rooms, setRooms] = useState([]);

  useEffect(()=>{
       db.collection('rooms').onSnapshot(snapshot =>(setRooms(snapshot.docs.map(doc => ({
         id: doc.id,
         data: doc.data(),
       })))))
  }, [])

  const lastMessage = (id) =>{
   const msg = Object.values(messages).filter((value)=> value.roomId === id);
   const lastMsg = msg.pop().message;
   console.log(lastMsg)

   return (lastMsg)
  }


  return (
    <div className="sidebar">
      <div className="sidebar_header">
       <Avatar src={user?.photoURL} />
        <div className='sidebar_headerRight'>
          <IconButton>
        <DonutLargeIcon className="svg_icons" />
        </IconButton>
        <IconButton>
        <ChatIcon className="svg_icons" />
        </IconButton>
        <IconButton>
        <MoreVertIcon className="svg_icons" />
        </IconButton>
      </div>
          </div>     
        <div className='sidebar_search'>
          <div className='sidebar_searchContainer'>
          <SearchIcon />
          <input className="search_input" placeholder='Search or start new chat'  type="text" />
          </div>
        </div>
        <div className='sidebar_chats'>
           <SidebarChat addNewChat />
           {rooms.map(room =>
            (<SidebarChat key={room.id} id={room.id} name={room.data.name} 
            messages={lastMessage(room.id)} />))}

           
         </div>

      
    </div>
  )
}

export default Sidebar

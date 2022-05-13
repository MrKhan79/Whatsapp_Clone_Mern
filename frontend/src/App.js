import { Fragment, useState } from 'react';
import { Route,BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from 'pusher-js';
import { useEffect } from 'react';
import axios from './axios';
import Login from './Login';
import { useStateValue } from './StateProvider';

function App() {

  const [messages, setMessages] = useState([]);
  const [{user}, dispatch] = useStateValue();

  useEffect(()=>{
          axios.get('messages/sync').then(response=>{
            setMessages(response.data)
          })
  },[]);

  useEffect(()=>{

     const pusher = new Pusher('6e4f86b7b387cbedd065', {
       cluster: 'ap2'
     });
 
     const channel = pusher.subscribe('messages');
     channel.bind('inserted', (newMessage) => {
       console.log(JSON.stringify(newMessage))
       setMessages([...messages, newMessage]);
     });
       
     return () =>{
       channel.unbind_all();
       channel.unsubscribe();
     };

  }, [messages]);

  console.log(messages);

  return (
    <div className="app">
      {!user?(<Login />):(
        <div className="app_body">     
        
        <Router>
        <Sidebar messages={messages}/>

          <Routes>
            <Route exact path='/rooms/:roomId' element={<Chat messages={messages}/>}>
            
              </Route>
              <Route exact path='/' element={<Chat messages={messages} /> }>
              
              </Route>
     
      </Routes>
      </Router>



    </div>
      )}
    </div>
  );
}

export default App;

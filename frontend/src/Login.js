import React from 'react'
import "./Login.css"
import { Button } from '@mui/material'
import { auth, provider } from './firebase'
import { useStateValue } from './StateProvider'
import { actionTypes } from './reducer'

const Login = () => {

    const [{}, dispatch] = useStateValue();

    const signIn = () =>{
           auth.signInWithPopup(provider)
           .then((result) => 
            {
                dispatch({
                    type: actionTypes.SET_USER,
                    user: result.user,
                });
            })
            .catch((error)=> alert(error.message));
    }
  return (
    <div className='login'>
      <div className='login_container'>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/768px-WhatsApp.svg.png"
        alt="" />
        <div className='login_text'>
            <h1>Sign in to Whatsapp</h1>
            </div>  

            <Button onClick={signIn}>
                Sign in with Google
            </Button>
      </div> 
    </div>
  )
}

export default Login

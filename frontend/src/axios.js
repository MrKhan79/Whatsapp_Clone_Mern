import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://whatasappclone.herokuapp.com'
});

export default instance;
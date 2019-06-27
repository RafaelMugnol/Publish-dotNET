import axios from 'axios';

const api = axios.create({
  baseURL: "http://merccxsws02:3333"
});

export default api;
import axios from 'axios';

const API = 'http://localhost:8000/api';

export const login = (email, password) =>
  axios.post(`${API}/auth/login/`, { email, password });

export const register = (form) =>
  axios.post(`${API}/auth/register/`, form);

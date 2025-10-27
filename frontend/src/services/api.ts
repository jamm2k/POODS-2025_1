//src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // endereço do backend Spring Boot
});

export default api;
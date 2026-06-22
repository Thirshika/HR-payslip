import { apiPost } from './apiClient.js';

export function login(username, password) {
  return apiPost('/api/login', { username, password });
}

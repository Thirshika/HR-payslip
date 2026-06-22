import { apiGet } from './apiClient.js';

export function fetchEmployees() {
  return apiGet('/api/employees');
}

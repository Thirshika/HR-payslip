/**
 * Data API - Sync all application data with backend
 * Replaces localStorage with server-side database storage
 */

import { apiGet, apiPost } from './apiClient';

const API_BASE = '/api/data';

/**
 * Load all data from backend database
 */
export async function loadAllData() {
  try {
    const response = await apiGet(`${API_BASE}/all`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to load data');
  } catch (error) {
    console.error('Error loading data from backend:', error);
    throw error;
  }
}

/**
 * Save all data to backend database
 */
export async function saveAllData(data) {
  try {
    const response = await apiPost(`${API_BASE}/save`, { data });
    if (response.success) {
      return true;
    }
    throw new Error(response.error || 'Failed to save data');
  } catch (error) {
    console.error('Error saving data to backend:', error);
    throw error;
  }
}

/**
 * Initialize data - load from backend or use seed data if empty
 */
export async function initializeData(seedData) {
  try {
    const data = await loadAllData();
    
    // Check if we have any employees
    if (!data.EMP || data.EMP.length === 0) {
      console.log('No data in database, using seed data');
      return seedData;
    }
    
    return data;
  } catch (error) {
    console.warn('Failed to load from backend, using seed data:', error);
    return seedData;
  }
}

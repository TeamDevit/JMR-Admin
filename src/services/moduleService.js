import { fetchData } from '../utils/api';
import toast from 'react-hot-toast';
import axios from 'axios';

// --- Module Retrieval ---
const CANDIDATE_CREATE_ENDPOINTS = (moduleType) => [
  `/create-${moduleType}`,   // preferred based on backend list
  `/${moduleType}`,          // e.g., /sentence or /sentences
  `/${moduleType}s`,         // plural fallback
  `/modules`                 // generic fallback if you later add it
];
// GET /get-vocabulary, GET /get-sentence, etc.
export const fetchAllModules = async (moduleType) => {
    // moduleType should be one of: 'vocabulary', 'sentence', 'practice', 'quiz', 'avatar-student', 'student-avatar'
    const endpoint = `/get-${moduleType}`;
    return fetchData(endpoint);
};

// GET /day-vocabulary/:dayId, GET /day-sentence/:dayId, etc.
export const fetchDayModules = async (moduleType, dayId) => {
    const endpoint = `/day-${moduleType}/${dayId}`;
    return fetchData(endpoint);
};

// GET /get-vocabulary/:id, GET /get-sentence/:id, etc.
export const fetchModuleDetails = async (moduleType, id) => {
    const endpoint = `/get-${moduleType}/${id}`;
    return fetchData(endpoint);
};

// --- Module CRUD Operations ---

// POST /create-vocabulary, POST /create-sentence, etc.

export const createModule = async (moduleType, data, opts = {}) => {
  if (!moduleType) throw new Error('moduleType is required');

  // Special-case 'sentence' because backend uses /sentences
  let endpoint;
  if (moduleType === 'sentence') {
    endpoint = '/sentences';
  } else if (moduleType === 'avatar-student') {
    endpoint = '/create-avatar-student';
  } else if (moduleType === 'student-avatar') {
    endpoint = '/create-student-avatar';
  } else {
    endpoint = `/create-${moduleType}`;
  }


  return fetchData(endpoint, { method: 'POST', data, headers: opts.headers || {} });
};

// PUT /update-vocabulary/:id, PUT /update-sentence/:id, etc.
export const updateModule = async (moduleType, id, data) => {
    const endpoint = `/update-${moduleType}/${id}`;
    return fetchData(endpoint, { method: 'PUT', data });
};


// DELETE /delete-vocabulary/:id, DELETE /delete-sentence/:id, etc.
export const deleteModule = async (moduleType, id) => {
    const endpoint = `/delete-${moduleType}/${id}`;
    return fetchData(endpoint, { method: 'DELETE' });
};


// This function will be used by the ModulesView to handle status toggling
export const toggleModuleStatus = async (moduleType, id, newStatus) => {
    const endpoint = `/update-${moduleType}/${id}`;
    // This sends the updated status field to the backend
    return fetchData(endpoint, { method: 'PUT', data: { status: newStatus } });
};


export default {
  createModule,
};
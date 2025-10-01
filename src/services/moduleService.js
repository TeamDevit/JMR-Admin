import api from '../utils/api';
import toast from 'react-hot-toast';

// This function holds all your API endpoints for modules
const ENDPOINTS = {
    'quiz': {
        create: '/modules/create-quiz', 
        createBulk: '/modules/create-quiz',
        get: (id) => `/modules/quiz/${id}`,
        update: (id) => `/modules/quiz/${id}`,
        delete: (id) => `/modules/quiz/${id}`,
    },
    // Module 2: Avatar to Student
    'avatar-to-student': {
        create: '/modules/create-avatar-student', // For single item (used in loop)
        createBulk: '/modules/create-avatar-student', // For array (if backend supported it)
    },
    // Module 3: Student to Avatar (Assumed similar CRUD endpoints)
    'student-to-avatar': {
        create: '/modules/create-student-to-avatar', 
        createBulk: '/modules/create-student-to-avatar',
    },
    // Module 4: Vocabulary
    'vocabulary': {
        create: '/modules/create-vocabulary', 
        createBulk: '/modules/create-vocabulary',
    },
    // Module 5: Practice Sentences
    'practice-sentence': {
        create: '/modules/create-practice-sentence', 
        createBulk: '/modules/create-practice-sentence',
    },
    'sentence': {
        create: '/api/v1/modules/create-sentence',
        // ... other sentence endpoints
    }
};

/**
 * Generic function to handle API actions for any module type.
 * @param {string} action - 'create', 'createBulk', 'get', 'update', 'delete'.
 * @param {string} moduleType - 'quiz', 'vocabulary', 'sentence', etc.
 * @param {Object} data - The data to send with the request.
 * @param {string} id - The ID of the module (for get, update, delete).
 */
export const handleModuleAction = async (action, moduleType, data = null, id = null) => {
    try {
        const endpoint = ENDPOINTS[moduleType][action];
        if (!endpoint) {
            throw new Error(`Endpoint for action '${action}' and module '${moduleType}' is not defined.`);
        }

        let response;
        const url = typeof endpoint === 'function' ? endpoint(id) : endpoint;

        switch (action) {
            case 'create':
            case 'createBulk':
                response = await api.post(url, data);
                break;
            case 'get':
                response = await api.get(url);
                break;
            case 'update':
                response = await api.put(url, data);
                break;
            case 'delete':
                response = await api.delete(url);
                break;
            default:
                throw new Error('Unsupported action');
        }

        toast.success(`${moduleType} ${action}d successfully!`);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || `Failed to ${action} ${moduleType}.`;
        toast.error(message);
        throw error;
    }
};

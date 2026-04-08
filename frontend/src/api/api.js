import axios from 'axios';

const API_BASE_URL = '/games';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Game APIs
export const getGames = () => api.get();
export const getGameById = (gameId) => api.get(`/${gameId}`);
export const createGame = (gameData) => api.post('/', gameData);

// Box APIs
export const getBoxesByGame = (gameId) => api.get(`/${gameId}/boxes`);
export const createBox = (gameId, boxData) => api.post(`/${gameId}/boxes`, boxData);
export const deleteBox = (boxId) => api.delete(`/boxes/${boxId}`);

// Item APIs
export const getItemsByBox = (boxId) => api.get(`/boxes/${boxId}/items`);
export const createItem = (boxId, itemData) => api.post(`/boxes/${boxId}/items`, itemData);
export const updateItem = (itemId, itemData) => api.put(`/items/${itemId}`, itemData);
export const deleteItem = (itemId) => api.delete(`/items/${itemId}`);

// Simulate APIs
export const simulate = (boxId) => api.post(`/boxes/${boxId}/simulate`);
export const simulateMultiple = (boxId, count) =>
  api.post(`/boxes/${boxId}/simulate-multiple`, null, { params: { count } });

export default api;

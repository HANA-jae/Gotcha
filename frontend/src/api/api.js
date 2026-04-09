import axios from 'axios';

// 환경 변수에서 API URL 가져오기 (기본값: 상대 경로)
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api/games';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// 응답 인터셉터 - 모든 응답 로깅 및 변환
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
      type: Array.isArray(response.data) ? 'array' : typeof response.data,
    });
    
    // data 필드가 있으면 유지, 없으면 data 필드로 감싸기
    if (!response.data || typeof response.data !== 'object') {
      console.warn('Unexpected response format:', response.data);
      return response;
    }
    
    // 응답이 배열이면 {data: 배열}로 감싸기
    if (Array.isArray(response.data)) {
      return {
        ...response,
        data: response.data,
      };
    }
    
    // 응답이 객체면 그대로 반환
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Game APIs
export const getGames = () => api.get();
export const getGameById = (gameId) => api.get(`/${gameId}`);
export const createGame = (gameData) => api.post('/', gameData);

// Box APIs
export const getBoxesByGame = (gameId) => api.get(`${gameId}/boxes`);
export const createBox = (gameId, boxData) => api.post(`${gameId}/boxes`, boxData);
export const deleteBox = (boxId) => api.delete(`boxes/${boxId}`);

// Item APIs
export const getItemsByBox = (boxId) => api.get(`boxes/${boxId}/items`);
export const createItem = (boxId, itemData) => api.post(`boxes/${boxId}/items`, itemData);
export const updateItem = (itemId, itemData) => api.put(`items/${itemId}`, itemData);
export const deleteItem = (itemId) => api.delete(`items/${itemId}`);

// Simulate APIs
export const simulate = (boxId) => api.post(`boxes/${boxId}/simulate`);
export const simulateMultiple = (boxId, count) =>
  api.post(`boxes/${boxId}/simulate-multiple`, null, { params: { count } });

export default api;

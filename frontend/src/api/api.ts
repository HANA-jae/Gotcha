import axios, { AxiosResponse } from 'axios';
import { Game, Box, Item } from '../types';

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
export const getGames = (): Promise<AxiosResponse<Game[]>> => api.get('/');
export const getGameById = (gameId: string | number): Promise<AxiosResponse<Game>> => api.get(`/${gameId}`);
export const createGame = (gameData: Partial<Game>): Promise<AxiosResponse<Game>> => api.post('/', gameData);

// Box APIs
export const getBoxesByGame = (gameId: string | number): Promise<AxiosResponse<Box[]>> => api.get(`${gameId}/boxes`);
export const createBox = (gameId: string | number, boxData: Partial<Box>): Promise<AxiosResponse<Box>> => api.post(`${gameId}/boxes`, boxData);
export const deleteBox = (boxId: string | number): Promise<AxiosResponse<void>> => api.delete(`boxes/${boxId}`);

// Item APIs
export const getItemsByBox = (boxId: string | number): Promise<AxiosResponse<Item[]>> => api.get(`boxes/${boxId}/items`);
export const createItem = (boxId: string | number, itemData: Partial<Item>): Promise<AxiosResponse<Item>> => api.post(`boxes/${boxId}/items`, itemData);
export const updateItem = (itemId: string | number, itemData: Partial<Item>): Promise<AxiosResponse<Item>> => api.put(`items/${itemId}`, itemData);
export const deleteItem = (itemId: string | number): Promise<AxiosResponse<void>> => api.delete(`items/${itemId}`);

// Simulate APIs
export const simulate = (boxId: string | number): Promise<AxiosResponse<unknown>> => api.post(`boxes/${boxId}/simulate`);
export const simulateMultiple = (boxId: string | number, count: number): Promise<AxiosResponse<unknown>> =>
  api.post(`boxes/${boxId}/simulate-multiple`, null, { params: { count } });

export default api;

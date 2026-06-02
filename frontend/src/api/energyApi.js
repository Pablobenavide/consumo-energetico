import { httpClient } from './client';
import { mockRequest } from './mockApi';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

async function request(method, path, payload) {
  if (useMocks) {
    return mockRequest(method, path, payload);
  }

  const response = await httpClient.request({
    method,
    url: path,
    data: payload,
  });

  return response.data;
}

export const energyApi = {
  register: (payload) => request('post', '/auth/register', payload),
  login: (payload) => request('post', '/auth/login', payload),
  profile: () => request('get', '/users/profile'),
  listAppliances: () => request('get', '/appliances'),
  getAppliance: (id) => request('get', `/appliances/${id}`),
  createAppliance: (payload) => request('post', '/appliances', payload),
  updateAppliance: (id, payload) => request('put', `/appliances/${id}`, payload),
  deleteAppliance: (id) => request('delete', `/appliances/${id}`),
  listConsumption: () => request('get', '/consumption'),
  consumptionSummary: () => request('get', '/consumption/summary'),
  recommendations: () => request('get', '/recommendations'),
};
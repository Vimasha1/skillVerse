import client from './client';

export const getPlans    = () => client.get('/learning-plans');
export const getPlanById = id => client.get(`/learning-plans/${id}`);
export const createPlan  = data => client.post('/learning-plans', data);
export const updatePlan  = (id, data) => client.put(`/learning-plans/${id}`, data);
export const deletePlan  = id => client.delete(`/learning-plans/${id}`);
export const sharePlan   = (id, users) =>
  client.post(`/learning-plans/${id}/share`, { users });

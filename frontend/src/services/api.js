import axios from 'axios';

// Use relative URL in dev (proxied by Vite) or env variable in production
const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Tickets API ──────────────────────────────────────

export const createTicket = async (ticketData) => {
  const response = await api.post('/api/tickets/', ticketData);
  return response.data;
};

export const getTickets = async ({ search, status, sortBy } = {}) => {
  const params = {};
  if (search) params.search = search;
  if (status) params.status = status;
  if (sortBy) params.sort_by = sortBy;

  const response = await api.get('/api/tickets/', { params });
  return response.data;
};

export const getTicket = async (ticketId) => {
  const response = await api.get(`/api/tickets/${ticketId}`);
  return response.data;
};

export const updateTicket = async (ticketId, updateData) => {
  const response = await api.put(`/api/tickets/${ticketId}`, updateData);
  return response.data;
};

export default api;

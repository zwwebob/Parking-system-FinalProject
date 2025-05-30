// app/lib/api.js
const API_BASE_URL = 'http://localhost:5001';

export const API_ENDPOINTS = {
    VEHICLES: `${API_BASE_URL}/api/vehicles`,
    CUSTOMERS: `${API_BASE_URL}/api/customers`,
    CARDS: `${API_BASE_URL}/api/cards`,
    TRAFFIC_REPORT: `${API_BASE_URL}/api/reports/traffic`,
    REVENUE_REPORT: `${API_BASE_URL}/api/reports/revenue`,
    EMPLOYEES: `${API_BASE_URL}/api/employees`,
};
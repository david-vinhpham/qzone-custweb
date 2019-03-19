import axios from 'axios';

export const getAppointmentsByUser = userId => axios.get(`/find-events-by-customer-id/${userId}`);
export const rateAppointmentByUser = body => axios.post('/services-rating', body);

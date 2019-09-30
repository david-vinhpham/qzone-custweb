import { get } from 'lodash';
import {
  serviceById,
  availabilitiesBySpecialEventIdBulk,
  events,
  temporaryServicesById,
  availabilitiesById,
  fetchProvidersByServiceId,
} from 'actionsApi/booking';
import {
  setLoading,
  setError,
} from 'actionsReducers/common.actions';
import { handleRequest } from 'utils/apiHelpers';

export const GET_SERVICE_BY_ID = 'BOOKING.GET_SERVICE_BY_ID';
export const SET_PROVIDERS_BY_SERVICE_ID = 'BOOKING.SET_PROVIDERS_BY_SERVICE_ID';
export const SET_AVAILABILITIES_BY_SPECIAL_EVENT_BULK = 'BOOKING.SET_AVAILABILITIES_BY_SPECIAL_EVENT_BULK';
export const SET_AVAILABILITIES_BY_ID = 'BOOKING.SET_AVAILABILITIES_BY_ID';
export const SET_BOOKING_DETAIL = 'BOOKING.SET_BOOKING_DETAIL';
export const SET_APPOINTMENT_CUSTOMER_EVENTS = 'BOOKING.SET_APPOINTMENT_CUSTOMER_EVENTS';
export const SET_BOOKING_STEP = 'BOOKING.SET_BOOKING_STEP';
export const RESET_BOOKING = 'BOOKING.RESET_BOOKING';
export const SET_TEMPORARY_SERVICES_BY_ID = 'BOOKING.SET_TEMPORARY_SERVICES_BY_ID';
// Decoupling
export const SET_BOOKED_EVENT_ID = 'BOOKING.SET_BOOKED_EVENT_ID';
export const SET_BOOKED_EVENT_DETAIL = 'BOOKING.SET_BOOKED_EVENT_DETAIL';
const getServiceById = payload => ({
  type: GET_SERVICE_BY_ID,
  payload,
});
const providersByServiceIdAction = payload => ({
  type: SET_PROVIDERS_BY_SERVICE_ID,
  payload,
});
const setAvailabilitiesBySpecialEventBulk = payload => ({
  type: SET_AVAILABILITIES_BY_SPECIAL_EVENT_BULK,
  payload,
});
const setAvailabilitiesById = payload => ({
  type: SET_AVAILABILITIES_BY_ID,
  payload,
});
const setAppointmentCustomerEvents = payload => ({
  type: SET_APPOINTMENT_CUSTOMER_EVENTS,
  payload,
});
const setTemporaryServicesById = payload => ({
  type: SET_TEMPORARY_SERVICES_BY_ID,
  payload,
});
export const setBookingDetail = payload => ({
  type: SET_BOOKING_DETAIL,
  payload,
});
export const setBookingStep = payload => ({
  type: SET_BOOKING_STEP,
  payload,
});
export const resetBooking = () => ({
  type: RESET_BOOKING,
});
export const setBookedEventId = payload => ({
  type: SET_BOOKED_EVENT_ID,
  payload,
});
export const getServiceByIdAction = id => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(serviceById, [id]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(getServiceById(result));
  }
  dispatch(setLoading(false));
};
export const providersByServiceIdApi = (sId, sName, catName) => async dispatch => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(fetchProvidersByServiceId, [sId]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(providersByServiceIdAction({ [catName]: { [sName]: result } }));
  }
  dispatch(setLoading(false));
};
export const setAvailabilitiesBySpecialEventBulkAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [availabilitiesBulk, allError] = await availabilitiesBySpecialEventIdBulk(data);
  if (allError) {
    dispatch(setError(get(JSON.parse(allError), 'response.data.message')));
    dispatch(setLoading(false));
  } else {
    const responseBulk = [];
    availabilitiesBulk.map(item => responseBulk.push(...item.data.objects));
    dispatch(setAvailabilitiesBySpecialEventBulk(responseBulk));
    dispatch(setLoading(false));
  }
};
export const setAvailabilitiesByIdAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [availability, error] = await handleRequest(availabilitiesById, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setAvailabilitiesById(availability));
  }
  dispatch(setLoading(false));
};
export const registerEventAction = (data, headers) => async (dispatch) => {
  dispatch(setLoading(true));
  const [registeredEvent, error] = await handleRequest(events, [data, headers]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setAppointmentCustomerEvents(registeredEvent));
    dispatch(setBookedEventId(data.availabilityId));
  }
  dispatch(setLoading(false));
};
export const setTemporaryServicesByIdAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [temporaryServiceById, error] = await handleRequest(temporaryServicesById, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setTemporaryServicesById(temporaryServiceById));
  }
  dispatch(setLoading(false));
};

// Decoupling
const bookEventAction = payload => ({
  type: SET_BOOKED_EVENT_DETAIL,
  payload,
});
const bookEventIdAction = payload => ({
  type: SET_BOOKED_EVENT_ID,
  payload,
});
export const bookEventApi = (data, headers) => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(events, [data, headers]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(bookEventAction(result));
    dispatch(bookEventIdAction(data.availabilityId));
  }
  dispatch(setLoading(false));
};

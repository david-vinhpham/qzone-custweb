import {
  GET_SERVICE_BY_ID,
  SET_PROVIDERS_BY_SERVICE_ID,
  SET_AVAILABILITIES_BY_SPECIAL_EVENT_ID,
  SET_AVAILABILITIES_BY_SPECIAL_EVENT_BULK,
  SET_APPOINTMENT_CUSTOMER_EVENTS,
  SET_BOOKING_DETAIL,
  SET_BOOKING_STEP,
  RESET_BOOKING,
  SET_TEMPORARY_SERVICES_BY_ID,
} from 'actionsReducers/booking.actions';

const initState = {
  service: null,
  providersByServiceIdList: null,
  availabilities: null,
  availabilitiesBulk: null,
  bookingStep: 0,
  appointmentEvent: null,
  bookingDetail: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case GET_SERVICE_BY_ID:
      return {
        ...state,
        service: action.payload,
      };
    case SET_PROVIDERS_BY_SERVICE_ID:
      return {
        ...state,
        providersByServiceIdList: action.payload,
      };
    case SET_AVAILABILITIES_BY_SPECIAL_EVENT_ID:
      return {
        ...state,
        availabilities: action.payload,
      };
    case SET_AVAILABILITIES_BY_SPECIAL_EVENT_BULK:
      return {
        ...state,
        availabilitiesBulk: action.payload,
      };
    case SET_BOOKING_STEP:
      return {
        ...state,
        bookingStep: action.payload,
      };
    case SET_APPOINTMENT_CUSTOMER_EVENTS:
      return {
        ...state,
        appointmentEvent: action.payload,
      };
    case SET_BOOKING_DETAIL:
      return {
        ...state,
        bookingDetail: action.payload,
      };
    // instant booking will change the flow
    // by mutating the serviceProviders list
    case SET_TEMPORARY_SERVICES_BY_ID:
      return {
        ...state,
        serviceProviders: [action.payload],
      };
    case RESET_BOOKING:
      return initState;
    default:
      return state;
  }
};

export default reducer;
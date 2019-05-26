import { PROFILE } from 'utils/constants';
import {
  UPDATE_PROFILE,
  PROFILE_PAGE,
  CANCEL_EVENT_BY_ID,
} from './profile.actions';

const initState = {
  updateProfileStatus: '',
  firebaseUserStored: null,
  profilePage: PROFILE.PAGE.WAIT_LIST,
  cancelEventByIdStatus: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case UPDATE_PROFILE:
      return {
        ...state,
        updateProfileStatus: action.payload,
      };
    case PROFILE_PAGE:
      return {
        ...state,
        profilePage: action.payload,
      };
    case CANCEL_EVENT_BY_ID:
      console.log('reducer in event cancel', action.payload);
      return {
        ...state,
        cancelEventByIdStatus: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;

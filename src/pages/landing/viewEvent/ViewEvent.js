import React, { Component } from 'react';
import { func, objectOf, any } from 'prop-types';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { IconButton, Button } from '@material-ui/core';
import Loading from 'components/Loading';
import MapDialog from 'components/Map/MapDialog';
import Error from 'components/Error';
import Success from 'components/Success';
import { navigateTo } from 'utils/common';
import Logo from 'images/quezone-logo.png';
import { Home, AssignmentInd, Clear, Cached } from '@material-ui/icons';
import { viewEventProps } from 'pages/commonProps';
import CustomModal from 'components/Modal/CustomModal';
import { EVENT_STATUS } from 'utils/constants';
import Event from './Event';
import Reschedule from './Reschedule';
import s from './ViewEvent.module.scss';

class ViewEvent extends Component {
  static propTypes = {
    dispatchSetEventById: func.isRequired,
    dispatchCancelEvent: func.isRequired,
    dispatchClearCancelStatus: func.isRequired,
    dispatchRescheduledAvailabilities: func.isRequired,
    match: objectOf(any).isRequired,
  };

  state = {
    eventById: {},
    userDetail: {},
    loginSession: {},
    isOpenMap: false,
    isCancelEventPopup: false,
    isRescheduleOpen: false,
    rescheduledAvailabilitiesByTemporaryServiceId: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { eventById, userDetail, loginSession, rescheduledAvailabilitiesByTemporaryServiceId } = props;
    const {
      eventById: cachedEventById, userDetail: cachedUserDetail, loginSession: cachedLoginSession,
      rescheduledAvailabilitiesByTemporaryServiceId: cachedRescheduledAvailabilitiesByTemporaryServiceId,
    } = state;
    const updatedState = {};
    if (
      eventById !== null &&
      JSON.stringify(eventById) !== JSON.stringify(cachedEventById)
    ) {
      updatedState.eventById = eventById;
    }
    if (userDetail !== null &&
      JSON.stringify(userDetail) !== JSON.stringify(cachedUserDetail)
    ) {
      updatedState.userDetail = userDetail;
    }
    if (
      loginSession !== null &&
      JSON.stringify(loginSession) !== JSON.stringify(cachedLoginSession)
    ) {
      updatedState.loginSession = loginSession;
    }
    if (
      rescheduledAvailabilitiesByTemporaryServiceId !== null &&
      JSON.stringify(rescheduledAvailabilitiesByTemporaryServiceId) !==
      JSON.stringify(cachedRescheduledAvailabilitiesByTemporaryServiceId)
    ) {
      updatedState.rescheduledAvailabilitiesByTemporaryServiceId = rescheduledAvailabilitiesByTemporaryServiceId;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const {
      dispatchSetEventById,
      match: { params: { id } },
    } = this.props;

    dispatchSetEventById(id);
  }

  componentDidUpdate(prevProps) {
    const { eventById } = prevProps;
    const { dispatchRescheduledAvailabilities } = this.props;
    const { eventById: cachedEventById } = this.state;
    if (
      eventById !== null &&
      JSON.stringify(eventById) !== JSON.stringify(cachedEventById)
    ) {
      const serviceId = get(cachedEventById, 'serviceId');
      const providerId = get(cachedEventById, 'providerId');
      const locationId = get(cachedEventById, 'locationId');
      const tempServiceId = get(cachedEventById, 'tempServiceId');
      dispatchRescheduledAvailabilities(tempServiceId, serviceId, providerId, locationId);
    }
  }

  handleRedirect = () => {
    const { dispatchClearCancelStatus } = this.props;
    dispatchClearCancelStatus();
    navigateTo('/')();
  };

  handleViewProfile = id => () => {
    navigateTo(`/profile/${id}`)();
  };

  handleToggleMap = () => {
    this.setState(oldState => ({
      isOpenMap: !oldState.isOpenMap,
    }));
  };

  handleCancelEvent = (id, headers) => () => {
    const { dispatchCancelEvent } = this.props;
    dispatchCancelEvent(id, headers);
    this.toggleConfirmCancelEvent();
  };

  toggleConfirmCancelEvent = () => {
    this.setState(oldState => ({
      isCancelEventPopup: !oldState.isCancelEventPopup,
    }));
  };

  toggleRescheduledSlot = () => {
    this.setState(oldState => ({
      isRescheduleOpen: !oldState.isRescheduleOpen,
    }));
  };

  render() {
    const {
      eventById, userDetail, isOpenMap, isCancelEventPopup, loginSession, rescheduledAvailabilitiesByTemporaryServiceId,
      isRescheduleOpen,
    } = this.state;
    const userId = get(userDetail, 'userSub') || get(userDetail, 'id');
    const headers = get(loginSession, 'authHeaders');
    const eventId = get(eventById, 'id');
    const sName = get(eventById, 'serviceName', '');
    const fullAddress = get(eventById, 'fullAddress');
    const bookingCode = get(eventById, 'bookingCode');
    const status = get(eventById, 'status');
    const coordinates = get(eventById, 'coordinates');
    const mapData = {
      coordinates,
      fullAddress,
    };
    const [title, titleStyle] = status === EVENT_STATUS.CANCELED
      ? [`Oops! Your reservation has been ${status}`, s.cancelledEvent]
      : ['Congratulations! Your reservation request has been confirmed!', s.confirmEvent];
    const isCancellable = !!userId && status !== EVENT_STATUS.CANCELED;
    const sId = get(eventById, 'serviceId');
    const pId = get(eventById, 'providerId');
    const locId = get(eventById, 'locationId');
    const rescheduledSlot = rescheduledAvailabilitiesByTemporaryServiceId &&
      rescheduledAvailabilitiesByTemporaryServiceId[`${sId}-${pId}-${locId}`] || [];
    const isRescheduleEnabled = isRescheduleOpen && rescheduledSlot.length > 0;
    console.log('reschduledSlot', rescheduledSlot);

    return (
      <>
        <CustomModal
          type="info"
          title="Cancel Event"
          isOpen={isCancelEventPopup}
          message="Are you sure to cancel this event?"
          isBackDropClickDisabled
          cancelCallBack={this.toggleConfirmCancelEvent}
          okCallBack={this.handleCancelEvent(eventId, headers)}
        />
        <MapDialog toggle={this.handleToggleMap} serviceName={sName} isOpen={isOpenMap} geoLocation={mapData} />
        {isRescheduleEnabled && <Reschedule slots={rescheduledSlot} onClose={this.toggleRescheduledSlot} />}
        <Loading />
        <Error resetOtherStatus={this.handleRedirect} />
        <Success userCallback={this.handleRedirect}/>
        <div className={s.container}>
          <div className={s.navBar}>
            <div className={s.logo}>
              <img src={Logo} alt="Quezone Logo" width="100%" height="100%" />
            </div>
            <div className={s.rightCta}>
              <IconButton className="simple-button white-color" onClick={this.handleRedirect}>
                <Home color="inherit" />
              </IconButton>
              {userId && (
                <IconButton className="simple-button white-color" onClick={this.handleViewProfile(userId)}>
                  <AssignmentInd color="inherit" />
                </IconButton>
              )}
            </div>
          </div>
          {eventId && (
            <div className={s.content}>
              <div className={`${s.title} ${titleStyle}`}>
                {title}
              </div>
              <div className={s.information}>
                <div className={s.bookingCode}>
                  Reservation reference code <strong>{bookingCode}</strong>
                </div>
                <Event appointment={eventById} viewMap={this.handleToggleMap}/>
                {isCancellable && (
                  <div className={s.cta}>
                    <Button variant="outlined" color="inherit" onClick={this.toggleConfirmCancelEvent}>
                      <Clear color="inherit" />
                      <span>&nbsp;Cancel</span>
                    </Button>
                    <Button variant="outlined" color="inherit" onClick={this.toggleRescheduledSlot}>
                      <Cached color="inherit" />
                      <span>&nbsp;Reschedule</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default connect(
  viewEventProps.mapStateToProps,
  viewEventProps.mapDispatchToProps,
)(ViewEvent);

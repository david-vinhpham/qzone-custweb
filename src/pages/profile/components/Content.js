import React, { Component } from 'react';
import {
  string, func, bool, objectOf,
} from 'prop-types';
import { connect } from 'react-redux';
import { find, uniqBy } from 'lodash';
import moment from 'moment';
import { Typography } from '@material-ui/core';
import {
  Event,
  Settings,
  ExitToApp,
  AddToQueue,
  Assessment,
} from '@material-ui/icons';
import { findEventByCustomerIdAction } from 'actionsReducers/common.actions';
import { cancelEventById } from 'actionsReducers/profile.actions';
import { trackingAppointmentByIdsAction } from 'actionsReducers/customer.actions';
import { setBookingStep } from 'actionsReducers/booking.actions';
import {
  setSurveys,
  setAssessmentAction,
} from 'actionsReducers/surveys.action';
import { PROFILE, BOOKING } from 'utils/constants';
import WaitList from './WaitList';
import Info from './Info';
import Survey from './Survey';
import EventList from '../appointmentDialog/Appointment';
import s from './Content.module.scss';

class Content extends Component {
  static getDerivedStateFromProps(props, state) {
    const {
      eventList, profilePage, cancelEventByIdStatus, waitLists, surveyList, customerAssessment, rescheduleStatus,
    } = props;
    const {
      eventList: cachedEventList,
      profilePage: cachedProfilePage,
      cancelEventByIdStatus: cachedCancelEventByIdStatus,
      waitLists: cachedWaitLists,
      surveyList: cachedSurveyList,
      customerAssessment: cachedCustomerAssessment,
      rescheduleStatus: cachedRescheduleStatus,
    } = state;
    const updatedState = {};
    if (
      eventList !== null &&
      JSON.stringify(eventList) !== JSON.stringify(cachedEventList)
    ) {
      const eventListIds = eventList && eventList.length && eventList.map(item => item.id);
      updatedState.eventList = eventList;
      updatedState.eventListIds = eventListIds;
    }
    if (JSON.profilePage !== cachedProfilePage) {
      updatedState.profilePage = profilePage;
    }
    if (cancelEventByIdStatus !== cachedCancelEventByIdStatus) {
      updatedState.cancelEventByIdStatus = cancelEventByIdStatus;
    }
    if (
      waitLists !== null &&
      JSON.stringify(waitLists) !== JSON.stringify(cachedWaitLists)
    ) {
      updatedState.waitLists = waitLists;
    }
    if (
      surveyList !== null &&
      JSON.stringify(surveyList) !== JSON.stringify(cachedSurveyList)
    ) {
      updatedState.surveyList = surveyList;
    }
    if (customerAssessment !== cachedCustomerAssessment) {
      updatedState.customerAssessment = customerAssessment;
    }
    if (rescheduleStatus !== cachedRescheduleStatus) {
      updatedState.rescheduleStatus = rescheduleStatus;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  SIDE_PANEL = [
    {
      name: PROFILE.PAGE.EVENT_LIST,
      icon: Event,
      text: 'My event list',
      isSelected: false,
    },
    {
      name: PROFILE.PAGE.SURVEY,
      icon: Assessment,
      text: 'My assessment list',
      isSelected: false,
    },
    {
      name: PROFILE.PAGE.WAIT_LIST,
      icon: AddToQueue,
      text: 'My waiting list',
      isSelected: false,
    },
    {
      name: PROFILE.PAGE.MY_INFO,
      icon: Settings,
      text: 'My information',
      isSelected: false,
    },
    {
      name: 'signOut',
      icon: ExitToApp,
      text: 'Sign out',
      isSelected: false,
      func: () => this.handleSignOut(),
    },
  ];

  initState = this.SIDE_PANEL.reduce((initItems, item) => ({
    ...initItems,
    [item.name]: item.isSelected,
  }), {});

  constructor(props) {
    super(props);
    this.state = {
      eventList: null,
      waitLists: null,
      surveyList: null,
      sidePanel: { ...this.initState },
    };
  }

  componentDidMount() {
    const {
      authHeaders,
      profilePage,
      setSurveys: setSurveyAction,
    } = this.props;

    setSurveyAction(authHeaders);
    this.setState({ sidePanel: { [profilePage]: true } });
  }

  componentDidUpdate(prevProps) {
    const {
      authHeaders,
      cancelEventByIdStatus,
      rescheduleStatus,
      setAssessmentAction: setAssessments,
      eventList,
      findEventByCustomerIdAction: findEventByCustomerId,
      cancelEventById: cancelEventByIdAction,
      customerId,
      customerAssessment,
      trackingAppointmentByIdsAction: trackingAppointmentByIds,
    } = prevProps;
    const {
      cancelEventByIdStatus: cachedCancelEventByIdStatus,
      eventList: cachedEventList,
      eventListIds,
      surveyList,
      rescheduleStatus: cachedRescheduleStatus,
    } = this.state;

    const trackingList = eventList && eventList.length;
    const cachedTrackingList = cachedEventList && cachedEventList.length;

    if (
      (cancelEventByIdStatus !== cachedCancelEventByIdStatus
      && cachedCancelEventByIdStatus === 200)
      || (rescheduleStatus !== cachedRescheduleStatus
      && cachedRescheduleStatus === 200)
    ) {
      findEventByCustomerId(customerId, authHeaders);
      cancelEventByIdAction(null);
    }

    if (trackingList !== cachedTrackingList && eventListIds && eventListIds.length > 0) {
      trackingAppointmentByIds(eventListIds, authHeaders);
    }
    const surveys = [];
    // eslint-disable-next-line
    eventList && eventList.length && eventList.map((event) => {
      const targetSurvey = find(surveyList, survey => survey.tempServiceId === event.tempServiceId);
      if (targetSurvey) surveys.push(targetSurvey);
      return event;
    });
    if (surveys.length !== customerAssessment.length) {
      setAssessments(surveys);
    }
  }

  handleSignOut = () => {
    const {
      onClose,
      handleLogout,
      setBookingStep: setBookingStepAction,
    } = this.props;
    onClose();
    handleLogout();
    setBookingStepAction(BOOKING.STEPS.SELECT_PROVIDER);
  };

  handleSelectSideMenu = panel => (event) => {
    const { handleSidePanel } = this.props;
    event.preventDefault();
    handleSidePanel();
    this.setState({
      sidePanel: {
        ...this.initState,
        [panel.name]: true,
      },
    }, panel.func);
  };

  renderItems = () => {
    const {
      eventList,
      waitLists,
      customerAssessment,
    } = this.state;

    const assessmentCount = customerAssessment && uniqBy(customerAssessment, 'id').length;
    return this.SIDE_PANEL.map((panel) => {
      const { sidePanel } = this.state;
      const onClick = this.handleSelectSideMenu(panel);
      const className = sidePanel[panel.name]
        ? `${s.item} ${s.selected}` : s.item;
      const props = {
        onClick,
        className,
      };
      return (
        <div {...props} key={panel.name}>
          <panel.icon className="main-color qz-icon-padding-small" />
          <div className={s.itemCount}>
            <Typography variant="subheading" color="inherit">
              {panel.text}
            </Typography>
            <Typography variant="subheading" color="inherit">
              {panel.name === PROFILE.PAGE.EVENT_LIST ? eventList && eventList.length : null}
              {panel.name === PROFILE.PAGE.WAIT_LIST ? waitLists && waitLists.length : null}
              {panel.name === PROFILE.PAGE.SURVEY ? assessmentCount : null}
            </Typography>
          </div>
        </div>
      );
    });
  };

  greetingText = () => {
    const hour = moment().hour();
    if (hour >= 12 && hour <= 17) {
      return 'Good afternoon!';
    }
    if (hour >= 18) {
      return 'Good evening!';
    }
    return 'Good morning!';
  };

  render() {
    const {
      handleAccount,
      updateProfileStatus,
      customerId,
      toggleSidePanel,
      handleSidePanel,
      authHeaders,
    } = this.props;
    const {
      sidePanel: {
        eventList,
        myInfo,
        waitList,
        surveyList,
      },
      eventList: cachedEventList,
    } = this.state;

    return (
      <div className={s.content}>
        {toggleSidePanel && (
          // eslint-disable-next-line
          <div className={s.sidebarOverlay} onClick={() => handleSidePanel(false)}>
            <div className={s.sidebar}>
              <div>
                <Typography variant="subtitle1" color="primary" className={`${s.title} text-capitalize`}>
                  {this.greetingText()}
                </Typography>
              </div>
              <div className={s.cta}>
                {this.renderItems()}
              </div>
            </div>
          </div>
        )}
        {eventList && (
          <div className={s.profilePage}>
            <Typography variant="title" color="inherit" className="underlined">Events</Typography>
            <EventList customerId={customerId} eventList={cachedEventList} />
          </div>)
        }
        {waitList && (
          <div className={s.profilePage}>
            <Typography variant="title" color="inherit" className="underlined">Enroll Queues</Typography>
            <WaitList customerId={customerId} authHeaders={authHeaders} />
          </div>)
        }
        {myInfo && (
          <div className={s.profilePage}>
            <Typography variant="title" color="inherit" className="underlined">Information</Typography>
            <Info handleAccount={handleAccount} updateProfileStatus={updateProfileStatus} />
          </div>)
        }
        {surveyList && (
          <div className={s.profilePage}>
            <Typography variant="title" color="inherit" className="underlined">Assessments</Typography>
            <Survey customerId={customerId} eventList={cachedEventList} />
          </div>)
        }
      </div>
    );
  }
}

Content.propTypes = {
  authHeaders: objectOf(string),
  customerId: string.isRequired,
  onClose: func.isRequired,
  givenName: string,
  handleAccount: func.isRequired,
  updateProfileStatus: string.isRequired,
  profilePage: string.isRequired,
  findEventByCustomerIdAction: func.isRequired,
  cancelEventById: func.isRequired,
  trackingAppointmentByIdsAction: func.isRequired,
  handleLogout: func.isRequired,
  setBookingStep: func.isRequired,
  toggleSidePanel: bool.isRequired,
  handleSidePanel: func.isRequired,
};

Content.defaultProps = {
  givenName: '',
  authHeaders: {},
};

const mapStateToProps = state => ({
  ...state.common,
  ...state.profile,
  ...state.waitLists,
  ...state.surveys,
});

export default connect(mapStateToProps, {
  findEventByCustomerIdAction,
  cancelEventById,
  trackingAppointmentByIdsAction,
  setSurveys,
  setAssessmentAction,
  setBookingStep,
})(Content);

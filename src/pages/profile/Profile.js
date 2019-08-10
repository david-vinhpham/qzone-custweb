import React, { Component } from 'react';
import {
  func,
  string,
} from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import moment from 'moment';
import { logout } from 'authentication/actions/logout';
import {
  postUpdatedProfile,
  updateProfileAction,
} from 'actionsReducers/profile.actions';
import {
  setServiceProvidersAction,
  findEventByCustomerIdAction,
} from 'actionsReducers/common.actions';
import { AUTHENTICATED_KEY } from 'utils/constants';
import { handlePushLocation } from 'utils/common';
import CustomModal from 'components/Modal/CustomModal';
import Header from './components/Header';
import Content from './components/Content';
import s from './Profile.module.scss';

class Profile extends Component {
  static getDerivedStateFromProps(props, state) {
    const {
      userDetail,
      loginSession,
      updateProfileStatus,
    } = props;
    const {
      userDetail: cachedUserDetail,
      loginSession: cachedLoginSession,
      updateProfileStatus: cachedUpdateProfileStatus,
    } = state;
    if (
      userDetail !== cachedUserDetail
      || updateProfileStatus !== cachedUpdateProfileStatus
      || loginSession !== cachedLoginSession
    ) {
      return {
        userDetail,
        loginSession,
        updateProfileStatus,
      };
    }
    return null;
  }

  state = {
    userDetail: null,
    loginSession: null,
    isPopupWarning: '',
    toggleSidePanel: false,
  };

  componentDidMount() {
    const {
      setServiceProvidersAction: setServiceProviders,
      findEventByCustomerIdAction: findEventByCustomerId,
      customerId,
    } = this.props;
    setServiceProviders();
    findEventByCustomerId(customerId);
  }

  componentDidUpdate() {
    const { loginSession, userDetail } = this.state;
    const expired = get(loginSession, 'expiration');

    if (!userDetail) {
      handlePushLocation('/')();
    }

    if (moment().isAfter(moment(expired))) {
      this.handleLogout();
    }
  }

  handleLogout = () => {
    const { logout: logoutAction } = this.props;
    const { loginSession } = this.state;
    const isAuthenticated = get(loginSession, AUTHENTICATED_KEY);
    const authProvider = get(loginSession, 'authProvider');

    handlePushLocation('/')();
    logoutAction({
      isAuthenticated,
      authProvider,
    });
  };

  handleAccount = (data) => {
    const { postUpdatedProfile: postUpdatedProfileAction } = this.props;
    postUpdatedProfileAction(data);
  };

  resetUpdateProfileStatus = () => {
    const { updateProfileAction: updateProfileStatus } = this.props;
    updateProfileStatus('');
  };

  handleSidePanel = (value = true) => {
    this.setState(oldState => ({
      toggleSidePanel: value && !oldState.toggleSidePanel,
    }));
  };

  render() {
    const {
      updateProfileStatus,
      customerId,
    } = this.props;
    const {
      userDetail,
      isPopupWarning,
      toggleSidePanel,
    } = this.state;

    const givenName = get(userDetail, 'givenName');
    const updateProfileMsgError = isPopupWarning === 'error' ? (
      <CustomModal
        isOpen
        type="error"
        title="Update Profile Error"
        message="Error occurs when updating your profile! Please try again."
        onClose={this.resetUpdateProfileStatus}
      />
    ) : null;

    const updateProfileMsgSuccess = isPopupWarning === 'success' ? (
      <CustomModal
        isOpen
        type="info"
        title="Update Profile Success"
        message="Your profile is up to date"
        onClose={this.resetUpdateProfileStatus}
      />
    ) : null;

    return (
      <>
        {updateProfileMsgError}
        {updateProfileMsgSuccess}
        <div>
          <div className={`${s.profile} column`}>
            <Header
              userName={givenName}
              onClose={handlePushLocation('/')}
              handleSidePanel={this.handleSidePanel}
            />
            <div className={`container-max auto-margin-horizontal ${s.profileContent}`}>
              <Content
                customerId={customerId}
                givenName={givenName}
                onClose={handlePushLocation('/')}
                handleAccount={this.handleAccount}
                updateProfileStatus={updateProfileStatus}
                handleLogout={this.handleLogout}
                toggleSidePanel={toggleSidePanel}
                handleSidePanel={this.handleSidePanel}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

Profile.propTypes = {
  customerId: string.isRequired,
  setServiceProvidersAction: func.isRequired,
  postUpdatedProfile: func.isRequired,
  updateProfileStatus: string,
  updateProfileAction: func.isRequired,
  findEventByCustomerIdAction: func.isRequired,
  logout: func.isRequired,
};

Profile.defaultProps = {
  updateProfileStatus: false,
};

const mapStateToProps = state => ({
  ...state.common,
  ...state.auth,
  ...state.profile,
});

export default connect(mapStateToProps, {
  postUpdatedProfile,
  updateProfileAction,
  setServiceProvidersAction,
  findEventByCustomerIdAction,
  logout,
})(Profile);

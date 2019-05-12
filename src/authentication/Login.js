import React from 'react';
import { string, bool, func } from 'prop-types';
import { connect } from 'react-redux';
import CustomModal from 'components/Modal/CustomModal';
import { Formik } from 'formik';
import { resetModalStatus } from 'actionsReducers/common.actions';
import { loginType } from 'utils/constants';
import Form from './components/Form';
import {
  login, createGoogleScript, googleLogIn,
} from './actions/login';
import { loginSchema } from './components/schemas';

class Login extends React.Component {
  state = {
    error: { open: false, errorMessage: '' },
  };

  componentDidMount() {
    const ga = window.gapi && window.gapi.auth2
      ? window.gapi.auth2.getAuthInstance() : null;
    if (!ga) {
      createGoogleScript();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { errorMessage } = nextProps;
    let error = {};
    if (errorMessage) {
      error = { open: true, errorMessage };
    } else {
      error = { open: false, errorMessage };
    }
    this.setState({ error });
  }

  onLogin = (values, name) => {
    const {
      logInAction, facebookSignInAction, googleLogInAction, isForgotPassword,
    } = this.props;
    switch (name) {
      case loginType.FB:
        facebookSignInAction();
        break;
      case loginType.GP:
        googleLogInAction();
        break;
      default:
        if (!isForgotPassword) logInAction(values);
    }
    this.onClose();
  };

  onClose = () => {
    this.props.onClose();
  };

  closeCustomModal = () => {
    const { resetModalStatusAction } = this.props;
    resetModalStatusAction();
  };

  render() {
    const { isOpen, handleAuthenticate } = this.props;
    const socialActions = {
      facebook: () => this.onLogin('', loginType.FB),
      google: () => this.onLogin('', loginType.GP),
    };
    const loginInit = {
      email: '',
      password: '',
    };
    const { error: { open, errorMessage } } = this.state;
    const errorModal = open
      ? (
        <CustomModal
          type="error"
          title="Login failed!"
          message={errorMessage}
          isOpen={!!errorMessage}
          onClose={this.closeCustomModal}
        />) : null;

    return (
      <>
        {errorModal}
        {isOpen && (
          <div className="flex item-center cover-bg-black z-index-higher">
            <Formik
              initialValues={loginInit}
              validationSchema={loginSchema}
              enableReinitialize
              onSubmit={this.onLogin}
              render={props => (
                <Form
                  {...props}
                  onClose={this.onClose}
                  socialActions={socialActions}
                  handleAuthenticate={handleAuthenticate}
                />
              )}
            />
          </div>
        )}
      </>
    );
  }
}

Login.propTypes = {
  googleLogInAction: func.isRequired,
  logInAction: func.isRequired,
  facebookSignInAction: func.isRequired,
  onClose: func.isRequired,
  isOpen: bool,
  resetModalStatusAction: func.isRequired,
  errorMessage: string,
  handleAuthenticate: func.isRequired,
  isForgotPassword: bool.isRequired,
};

Login.defaultProps = {
  errorMessage: '',
  isOpen: false,
};

const mapStateToProps = state => ({
  errorMessage: state.auth.loginErrorMessage,
  isForgotPassword: state.auth.isForgotPassword,
});

export default connect(mapStateToProps, {
  googleLogInAction: googleLogIn,
  facebookSignInAction: () => {},
  logInAction: login,
  resetModalStatusAction: resetModalStatus,
})(Login);

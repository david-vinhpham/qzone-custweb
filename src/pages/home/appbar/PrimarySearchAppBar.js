import React from 'react';
import {
  objectOf, any, func, number, arrayOf, object,
} from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import {
  AppBar, Toolbar, IconButton, InputBase,
  Badge, MenuItem, Menu, Avatar, Tooltip,
  Typography,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  HowToReg,
  NearMe, AssignmentInd, ExitToApp, Mail as MailIcon, Notifications as NotificationsIcon,
  MoreVert as MoreIcon, Fingerprint,
} from '@material-ui/icons';
import { toggleAppointment } from 'reduxModules/appointments.actions';
import { logout } from 'authentication/actions/logout';
import IconMenu from 'components/IconMenu';
import { fetchCustomerEvents } from 'reduxModules/home.actions';
import logo from '../../../images/quezone-logo.png';
import styles from './PrimarySearchAppBarStyle';

class PrimarySearchAppBar extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
  };

  componentDidMount() {
    const { loginSession, fetchCustomerEventsAction } = this.props;
    const [isAuthenticated, id] = loginSession
      ? [loginSession.isAuthenticated, loginSession.id] : [false, ''];
    if (isAuthenticated) {
      fetchCustomerEventsAction(id);
    }
    window.addEventListener('resize', this.closeAllMenu);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.closeAllMenu);
  }

  closeAllMenu = () => {
    this.handleMenuClose();
    this.handleMobileMenuClose();
  };

  handleProfileMenuOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = (event) => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  handleAuthenticateUser = (authenticateType) => {
    const { handleAuthenticate } = this.props;
    handleAuthenticate(authenticateType);
    this.handleMenuClose();
  };

  handleLogout = () => {
    const { logoutAction } = this.props;
    logoutAction();
    this.handleMenuClose();
  };

  toggleAppointmentDialog = () => {
    this.props.toggleAppointment(true);
    this.handleMenuClose();
  }

  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const {
      classes, loginSession, onSearch, userPosition, customerEventList,
    } = this.props;
    const eventCount = customerEventList && customerEventList.length;
    const searchNearByTitle = userPosition.latitude ? 'Search Services Near You' : 'Your Location Not Allowed';
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const isAuthenticated = loginSession ? loginSession.isAuthenticated : false;
    const authorization = isAuthenticated ? (
      [
        <IconMenu
          key="app-bar-profile"
          iconSuite={{
            handleMethod: this.handleMenuClose,
            component: AssignmentInd,
            classes: classes.menuIcon,
          }}
        >
          Profile
        </IconMenu>,
        <IconMenu
          key="app-bar-appointments"
          iconSuite={{
            handleMethod: this.toggleAppointmentDialog,
            component: AssignmentInd,
            classes: classes.menuIcon,
          }}
        >
          Appointments
        </IconMenu>,
        <IconMenu
          key="app-bar-log-out"
          iconSuite={{
            handleMethod: this.handleLogout,
            component: ExitToApp,
            classes: classes.menuIcon,
          }}
        >
          Sign out
        </IconMenu>,
      ]
    ) : (
      <IconMenu
        key="app-log-in"
        iconSuite={{
          handleMethod: () => this.handleAuthenticateUser('isLoginOpen'),
          component: HowToReg,
          classes: classes.menuIcon,
        }}
      >
        Login
      </IconMenu>
    );
    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        { authorization }
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        { isAuthenticated
          && (
            [
              <MenuItem key="app-bar-mail-icon-notification">
                <IconButton color="inherit">
                  <Badge badgeContent={4} color="secondary">
                    <MailIcon className={classes.menuIcon} />
                  </Badge>
                </IconButton>
                <p>Messages</p>
              </MenuItem>,
              <MenuItem key="app-bar-notification-icon">
                <IconButton color="inherit">
                  <Badge badgeContent={11} color="secondary">
                    <NotificationsIcon className={classes.menuIcon} />
                  </Badge>
                </IconButton>
                <p>Notifications</p>
              </MenuItem>,
              ...authorization,
            ]
          )
        }
      </Menu>
    );
    const customUser = isAuthenticated ? (
      <>
        <div className={classes.sectionDesktop}>
          <IconButton color="inherit">
            <Badge badgeContent={eventCount} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={0} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Typography
            aria-haspopup="true"
            onClick={this.handleProfileMenuOpen}
            color="inherit"
            variant="subheading"
            className="button-text-center hover-pointer hover-bright"
          >
            Hi! {loginSession.username}
          </Typography>
        </div>
        <div className={classes.sectionMobile}>
          <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
            <MoreIcon />
          </IconButton>
        </div>
      </>
    ) : (
      <>
        { /* eslint-disable-next-line */ }
        <div
          className={`${classes.sectionDesktop} hover-bright`}
          onClick={() => this.handleAuthenticateUser('isLoginOpen')}
        >
          <Typography
            color="inherit"
            variant="subtitle1"
          >
            Sign in
          </Typography>
          <Fingerprint />
        </div>
        <div className={classes.sectionMobile}>
          <IconButton aria-haspopup="true" onClick={() => this.handleAuthenticateUser('isLoginOpen')} color="inherit">
            <Fingerprint />
          </IconButton>
        </div>
      </>
    );
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar className={`${classes.mainLinear}`}>
            <Avatar
              className={classes.avatar}
              imgProps={{
                className: classes.img,
              }}
              alt="Quezone Logo"
              src={logo}
            />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Services, organisations …"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onChange={onSearch}
              />
            </div>
            <Tooltip title={searchNearByTitle}>
              <div>
                <IconButton
                  className={classes.menuListDesktop}
                  disabled={!userPosition.latitude}
                >
                  <NearMe />
                </IconButton>
              </div>
            </Tooltip>
            <div className={classes.grow} />
            { customUser }
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
      </div>
    );
  }
}

PrimarySearchAppBar.propTypes = {
  classes: objectOf(any).isRequired,
  handleAuthenticate: func.isRequired,
  onSearch: func.isRequired,
  toggleAppointment: func.isRequired,
  userPosition: objectOf(number).isRequired,
  logoutAction: func.isRequired,
  loginSession: objectOf(any).isRequired,
  fetchCustomerEventsAction: func.isRequired,
  customerEventList: arrayOf(object).isRequired,
};

const mapStateToProps = state => ({
  loginSession: state.auth.loginSession,
  customerEventList: state.home.customerEventList,
});

export default compose(
  connect(mapStateToProps, {
    logoutAction: logout,
    toggleAppointment,
    fetchCustomerEventsAction: fetchCustomerEvents,
  }),
  withStyles(styles),
)(PrimarySearchAppBar);

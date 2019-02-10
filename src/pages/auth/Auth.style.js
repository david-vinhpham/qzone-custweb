import {
  container,
  textCenter,
  mainColor,
  grayColor,
  dangerColor,
  infoColor,
} from 'components/material-dashboard-pro-react';
import customCheckboxRadioSwitch from 'components/material-dashboard-pro-react/customCheckboxRadioSwitch';

const authPageStyle = (theme) => {
  console.log('theme', theme);
  return ({
    ...customCheckboxRadioSwitch,
    textCenter,
    content: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    register: {
      display: 'flex',
      justifyContent: 'center',
    },
    registerCard: {
      maxWidth: theme.spacing.unit * 50,
      minWidth: theme.spacing.unit * 41,
    },
    marginLoose: {
      margin: `${theme.spacing.unit * 1.25}px auto 0px`,
      color: 'red',
    },
    container: {
      ...container,
      position: 'relative',
      zIndex: '3',
      minHeight: 'calc(100vh - 80px)',
      paddingTop: '5%',
    },
    center: {
      textAlign: 'center',
    },
    checkboxLabelControl: {
      margin: '0',
    },
    checkboxLabel: {
      marginLeft: '6px',
      color: 'rgba(0, 0, 0, 0.26)',
    },
    inputAdornment: {
      marginRight: '18px',
      position: 'relative',
    },
    inputAdornmentIconDefault: {
      color: `${grayColor} !important`,
    },
    inputAdornmentIconSuccess: {
      color: mainColor,
    },
    inputAdornmentIconError: {
      color: dangerColor,
    },
    policyAgreement: {
      margin: `${theme.spacing.unit * 1.5}px 0`,
    },
    simpleButton: {
      // color: mainColor,
      '&:hover': {
        background: 'transparent',
      },
    },
    resetPassword: {
      color: mainColor,
      fontWeight: 'bold',
      margin: `${theme.spacing.unit}px 0 ${theme.spacing.unit * 3}px`,
      textAlign: 'right',
    },
    loginPanel: {
      padding: `${theme.spacing.unit * 2}px 0 ${theme.spacing.unit * 8}px !important`,
    },
    socialButtons: {
      margin: `${theme.spacing.unit * 2}px auto`,
    },
    socialButton: {
      margin: `auto ${theme.spacing.unit}px`,
    },
    socialIcon: {
      fontSize: `${theme.spacing.unit * 3}px !important`,
    },
    errorModal: {
      position: 'relative',
      margin: 'auto',
      width: 'auto',
      padding: `${theme.spacing.unit * 2}px`,
    },
    root: {
      display: 'flex',
    },
    passwordHint: {
      color: infoColor,
      // pointerEvents: 'none',
    },
    passwordHintPopover: {
      zIndex: 1600,
    },
  });
};

export default authPageStyle;

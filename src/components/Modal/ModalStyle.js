import { mainColor } from '../material-dashboard-pro-react';

const style = (theme) => {
  console.log('theme', theme);
  return ({
    logo: {
      margin: `auto ${theme.spacing.unit * 2}px auto 0px`,
    },
    avatarRoot: {
      width: theme.spacing.unit * 7.5,
      height: theme.spacing.unit * 7.5,
    },
    modalRoot: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: theme.zIndex.tooltip,
    },
    paperRoot: {
      maxWidth: theme.spacing.unit * 56,
      minWidth: theme.spacing.unit * 45,
      display: 'flex',
      padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
    },
    message: {
      borderLeft: `4px solid ${mainColor}`,
      paddingLeft: theme.spacing.unit * 2,
    },
    okButton: {
      margin: `${theme.spacing.unit}px auto`,
    },
    // Loading
    cover: {
      position: 'fixed',
      top: 0,
      background: 'rgba(0,0,0, 0.7)',
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100000,
    },
  });
};

export default style;

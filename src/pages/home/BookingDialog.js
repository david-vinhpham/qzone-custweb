import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Slide, Dialog, AppBar, Toolbar, IconButton, Button,
  Tabs, Tab, Paper,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { serviceType } from 'types/global';
import SelectService from './bookingDialog/SelectService';
import SelectProvider from './bookingDialog/SelectProvider';
import SelectTime from './bookingDialog/SelectTime';
import BookingDetail from './bookingDialog/BookingDetail';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

/* eslint-disable react/no-unused-state */
export default class BookingDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      step: 'service',
      bookingDetail: {
        service: props.selectedService,
        provider: 'Provider 1',
      },
    };
    this.bookingSteps = ['service', 'provider', 'time', 'detail'];
    this.bookingStepsComponents = {
      service: SelectService,
      provider: SelectProvider,
      time: SelectTime,
      detail: BookingDetail,
    };
  }

  onStepChange = (event, step) => {
    this.setState({ step });
  }

  render() {
    const { initService, handleClose } = this.props;
    const { step } = this.state;
    const StepComponent = this.bookingStepsComponents[step];

    return (
      <Dialog
        fullScreen
        open={initService !== undefined}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar position="relative">
          <Toolbar>
            <IconButton color="inherit" onClick={handleClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <div className="grow" />
            <Button color="inherit" onClick={this.onSaveBooking}>
                save
            </Button>
          </Toolbar>
        </AppBar>
        <Paper square>
          <Tabs
            centered
            indicatorColor="primary"
            textColor="primary"
            value={step}
            onChange={this.onStepChange}
          >
            {this.bookingSteps.map(
              category => <Tab key={category} label={category} value={category} />,
            )}
          </Tabs>
        </Paper>
        {<StepComponent {...this.props} />}
      </Dialog>
    );
  }
}

BookingDialog.propTypes = {
  initService: serviceType,
  handleClose: PropTypes.func.isRequired,
};

BookingDialog.defaultProps = {
  initService: undefined,
};

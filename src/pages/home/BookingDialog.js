import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Slide, Dialog, AppBar, Toolbar, IconButton,
  Tabs, Tab, Paper,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { serviceType } from 'types/global';
import { setProviders } from 'modules/home/bookingDialog/selectProvider.actions';
import SelectProvider from './bookingDialog/SelectProvider';
import SelectTime from './bookingDialog/SelectTime';
import BookingDetail from './bookingDialog/BookingDetail';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

/* eslint-disable react/no-unused-state */
export class BookingDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.bookingStepsComponents = {
      provider: SelectProvider,
      time: SelectTime,
      'booking detail': BookingDetail,
    };
    this.defaultState = {
      step: 'provider',
      bookingDetail: {
        provider: undefined,
        time: undefined,
      },
      bookingSteps: [
        { value: 'provider', disabled: false },
        { value: 'time', disabled: true },
        { value: 'booking detail', disabled: true },
      ],
    };
    this.state = { ...this.defaultState };
  }

  onStepChange = (event, step) => {
    this.setState({ step });
  }

  onChangeBookingDetail = (value, key) => {
    const { bookingDetail } = this.state;

    if (key === 'provider') {
      if (bookingDetail.time) {
        this.setState(oldState => ({
          bookingDetail: { ...oldState.bookingDetail, [key]: value },
          bookingSteps: [
            { value: 'provider', disabled: false },
            { value: 'time', disabled: false },
            { value: 'booking detail', disabled: false },
          ],
        }));
      } else {
        this.setState(oldState => ({
          bookingDetail: { ...oldState.bookingDetail, [key]: value },
          bookingSteps: [
            { value: 'provider', disabled: false },
            { value: 'time', disabled: false },
            { value: 'booking detail', disabled: true },
          ],
        }));
      }
    } else {
      this.setState(oldState => ({
        bookingDetail: { ...oldState.bookingDetail, [key]: value },
        bookingSteps: [
          { value: 'provider', disabled: false },
          { value: 'time', disabled: false },
          { value: 'booking detail', disabled: false },
        ],
      }));
    }
  }

  handleClose = () => {
    this.props.setProvidersAction([]);
    this.setState(this.defaultState);
    this.props.handleClose();
  }

  render() {
    const { initService } = this.props;
    const { step, bookingDetail, bookingSteps } = this.state;
    const StepComponent = this.bookingStepsComponents[step];

    return (
      <Dialog
        fullScreen
        open={initService !== undefined}
        onClose={this.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar position="relative">
          <Toolbar>
            <div className="grow" />
            <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
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
            {bookingSteps.map(
              bookingStep => (
                <Tab
                  {...bookingStep}
                  key={bookingStep.value}
                  label={bookingStep.value}
                />
              ),
            )}
          </Tabs>
        </Paper>
        {initService && (
          <StepComponent
            initService={initService}
            onChange={this.onChangeBookingDetail}
            bookingDetail={bookingDetail}
          />
        )}
      </Dialog>
    );
  }
}

BookingDialog.propTypes = {
  initService: serviceType,
  handleClose: PropTypes.func.isRequired,
  setProvidersAction: PropTypes.func.isRequired,
};

BookingDialog.defaultProps = {
  initService: undefined,
};

export default connect(null, { setProvidersAction: setProviders })(BookingDialog);

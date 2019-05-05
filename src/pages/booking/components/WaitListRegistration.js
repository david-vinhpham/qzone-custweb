import React, { Component } from 'react';
import {
  func,
  bool,
  objectOf,
  // object,
  any,
} from 'prop-types';
import {
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withFormik } from 'formik';
// import moment from 'moment';
import { get } from 'lodash';
import DatePicker from 'components/Calendar/DatePicker';
import {
  registerWaitListAction,
} from 'actionsReducers/waitlist.actions';
import defaultImage from 'images/default-service-card.png';
import { defaultDateFormat } from 'utils/constants';
import s from './WaitListRegistration.module.scss';

class WaitListRegistration extends Component {
  static getDerivedStateFromProps(props, state) {
    const {
      service,
    } = props;
    const {
      service: cachedService,
    } = state;
    if (service !== cachedService) {
      return {
        service,
      };
    }
    return null;
  }

  state = {
    service: null,
    isRegisterWaitLists: false,
  };

  handleToggleRegister = () => {
    this.setState(oldState => ({
      isRegisterWaitLists: !oldState.isRegisterWaitLists,
    }));
  };

  handleRegisterWaitList = () => {
    const { registerWaitListAction: registerWaitList } = this.props;
    registerWaitList();
    this.handleToggleRegister();
  };

  handleChange = (event) => {
    const { setFieldValue } = this.props;
    const { name, value } = event.target;
    setFieldValue(name, value);
  };

  handleChangeDate = key => (date) => {
    this.setState({ [key]: date.format('DD/MM/YYYY') });
  };

  handleSelectDate = (date) => {
    console.log('date selected', date);
  };

  render() {
    const {
      service,
      isRegisterWaitLists,
    } = this.state;
    console.log('waitList component props: ', this.props);
    const {
      values,
      isValid,
    } = this.props;
    const serviceName = get(service, 'name');
    const serviceImg = get(service, 'image.fileUrl') || defaultImage;
    // const serviceDes = get(service, 'description');
    // const serviceDur = get(service, 'duration');
    console.log('values', values);

    return (
      <>
        {isRegisterWaitLists && (
          <div className="cover-bg-black ">
            <div className={s.waitListForm}>
              <div className={s.title}>
                <Typography variant="headline" color="inherit" className="text-bold">
                  Enrol to Waitlist
                </Typography>
              </div>
              <div className={s.serviceInfo}>
                <div className={s.serviceImage}>
                  <img src={serviceImg} alt="Service" className={s.serviceImage} />
                </div>
                <div className={s.serviceDescription}>
                  <Typography variant="title" className="main-color-04 text-bold">
                    {serviceName}
                  </Typography>
                  <Typography variant="body1" className="main-color">
                    185 Old South Head Road Junction New South Wales 2022
                  </Typography>
                </div>
                <div className={s.bookWaitList}>
                  <div className={s.availabilityDate}>
                    <Typography variant="body1" color="inherit" className="text-bold">
                      Date
                    </Typography>
                    <div className={s.dateRange}>
                      <div className={s.datePicker}>
                        <div className={s.pickerLabel}>
                          <Typography variant="caption" color="inherit" className="text-bold">
                            From:
                          </Typography>
                        </div>
                        <DatePicker
                          onChange={this.handleChangeDate('dateFrom')}
                          selectDate={this.handleSelectDate}
                          enableCalendar
                          type="date"
                          isIcon
                          iconClassName={s.dateSelection}
                          dateFormat={defaultDateFormat}
                        />
                      </div>
                      <div className={s.datePicker}>
                        <div className={s.pickerLabel}>
                          <Typography variant="caption" color="inherit" className="text-bold">
                            To:
                          </Typography>
                        </div>
                        <DatePicker
                          onChange={this.handleChangeDate('dateTo')}
                          selectDate={this.handleSelectDate}
                          enableCalendar
                          type="date"
                          isIcon
                          iconClassName={s.dateSelection}
                          dateFormat={defaultDateFormat}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={s.selectOption}>
                    <div className={s.bookingOption}>
                      <RadioGroup
                        name="enrolOption"
                        value={values.enrolOption}
                        onChange={this.handleChange}
                      >
                        <FormControlLabel
                          value="automatically"
                          control={(
                            <Radio classes={
                              {
                                root: s.bookingOption,
                                checked: s.bookingOptionChecked,
                              }
                            }
                            />)}
                          label="Allowing Quezone making your appointment automatically."
                        />
                        <FormControlLabel
                          value="manually"
                          control={(
                            <Radio classes={
                              {
                                root: s.bookingOption,
                                checked: s.bookingOptionChecked,
                              }
                            }
                            />)}
                          label="Notify me on slot availability."
                        />
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
              <div className={s.footerCta}>
                <Button variant="outlined" onClick={this.handleToggleRegister}>
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  onClick={this.handleRegisterWaitList}
                  disabled={!isValid}
                >
                  Join List
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* eslint-disable-next-line */}
        <div
          className={s.joinWaitLists}
          onClick={this.handleToggleRegister}
        >
          <Typography
            variant="subheading"
            className="white-color text-bold"
          >
            Join Queue
          </Typography>
        </div>
      </>
    );
  }
}

WaitListRegistration.propTypes = {
  registerWaitListAction: func.isRequired,
  values: objectOf(any).isRequired,
  setFieldValue: func.isRequired,
  isValid: bool.isRequired,
};

const mapStateToProps = state => ({
  ...state.common,
  ...state.booking,
  ...state.auth,
});

export default compose(
  withFormik({
    enableReinitialize: true,
    isInitialValid: true,
    mapPropsToValues: () => ({
      enrolOption: 'automatically',
    }),
  }),
  connect(mapStateToProps, {
    registerWaitListAction,
  }),
)(WaitListRegistration);

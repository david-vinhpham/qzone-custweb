import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import {
  providerType, serviceType, bookingDetailType, providerDetailsType,
} from 'types/global';
import moment from 'moment';
import RateStar from 'components/Rating/RateStar';
import DatePicker from 'components/Calendar/DatePicker';
import { getProvidersByService } from 'reduxModules/home/bookingDialog/selectProvider.actions';
import EmptyItem from 'components/EmptyItem';
import ProviderContent from './selectProvider/ProviderContent';
// import styles from './SelectProvider.module.scss';
import DateSelect from './selectProvider/DateSelect';

class SelectProvider extends React.PureComponent {
  state = {
    selectedDate: new Date(moment().year(), moment().month(), moment().date(), 0, 0, 0),
  };

  componentDidMount = () => {
    const { providers, getProvidersByServiceAction, initService } = this.props;

    if (providers.length === 0) {
      getProvidersByServiceAction(initService.id);
    }
  };

  onSelectBooking = provider => (time) => {
    this.props.onChange(provider, 'provider');
    this.props.onChange(time, 'time', this.props.handleNext);
  };

  handleSelectDate = (date) => {
    console.log('chose a date', date);
    this.setState({ selectedDate: date });
  };

  render() {
    const {
      isLoading, providers, bookingDetail, initService, providerDetails,
      onChange,
    } = this.props;
    const { selectedDate } = this.state;
    const bookingDetailWithDate = {
      ...bookingDetail,
      selectedDate,
    };

    return (
      <>
        {!isLoading && providers.length === 0 ? <EmptyItem message="No available providers" />
          : (
            <div className="selectProviderWrapper">
              <div className="selectProviderHeader">
                <div>
                  <Typography color="textSecondary" variant="title">
                    {initService.name}
                  </Typography>
                  <div className="selectedProviderReputation">
                    <RateStar rating={initService.rating} reviews={initService.viewNum} />
                  </div>
                </div>
                <DateSelect
                  bookingDetail={bookingDetail}
                  onChange={onChange}
                  providers={providers}
                  initServiceId={initService ? initService.id : -1}
                />
                <div className="selectDateOfBooking">
                  <DatePicker onChange={onChange} selectDate={this.handleSelectDate} />
                </div>
              </div>
              <div className="selectProviderList">
                {providers.map(provider => (
                  <div key={provider.id}>
                    <ProviderContent
                      initService={initService}
                      provider={provider}
                      bookingDetail={bookingDetailWithDate}
                      duration={providerDetails[provider.id] ? providerDetails[provider.id][0].durationSec : 0}
                      onTimeSelect={this.onSelectBooking(provider)}
                    />
                  </div>
                ))}
              </div>
            </div>)
        }
      </>
    );
  }
}

SelectProvider.propTypes = {
  initService: serviceType,
  providers: PropTypes.arrayOf(providerType).isRequired,
  providerDetails: PropTypes.shape({
    [PropTypes.string]: providerDetailsType,
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  getProvidersByServiceAction: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  bookingDetail: bookingDetailType.isRequired,
  handleNext: PropTypes.func.isRequired,
};

SelectProvider.defaultProps = {
  initService: undefined,
};

const mapStateToProps = state => ({
  ...state.homeModules.bookingDialogModules.selectProvider,
});

export default connect(mapStateToProps, { getProvidersByServiceAction: getProvidersByService })(SelectProvider);

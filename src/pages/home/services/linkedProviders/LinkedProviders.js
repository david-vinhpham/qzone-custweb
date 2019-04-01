import React, { Component } from 'react';
import { serviceType } from 'types/global';
import { func, arrayOf, any } from 'prop-types';
import { connect } from 'react-redux';
import { get, noop } from 'lodash';
import { Typography, IconButton } from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import uuidv1 from 'uuid/v1';
import { saveEarliestSlot } from 'reduxModules/serviceCard.actions';
import EarliestSlot from './EarliestSlot';
import s from './LinkedProviders.module.scss';

class LinkedProviders extends Component {
  state = {
    isExpandList: false,
  };

  handleHiddenBookingButton = () => {
    const { handleBookingButton } = this.props;
    const { isExpandList } = this.state;
    handleBookingButton(isExpandList);
  };

  handleExpandList = () => {
    this.setState(oldState => ({ isExpandList: !oldState.isExpandList }), this.handleHiddenBookingButton);
  };

  handleInstanceSlotBooking = provider => (slot) => {
    const {
      service, saveEarliestSlotAction, instantBooking, selectProvider,
    } = this.props;
    console.log('selectProvider', selectProvider);
    const duration = get(service, 'duration');
    const earliestSlot = {
      step: 1,
      bookingDetail: {
        provider,
        time: {
          start: slot * 1000,
          duration,
        },
      },
    };
    saveEarliestSlotAction(earliestSlot);
    instantBooking();
  };

  render() {
    const { service, instantBooking } = this.props;
    const { isExpandList } = this.state;
    const linkedProvider = get(service, 'linkedProvider');
    const expandChevron = isExpandList
      ? <ExpandLess className="icon-main icon-shake malibu-color" />
      : <ExpandMore className="icon-main icon-shake malibu-color" />;

    const renderExpandProvider = isExpandList ? (
      <div className={s.expandList}>
        {linkedProvider.map((provider) => {
          const providerName = get(provider, 'providerName');
          const providerId = get(provider, 'providerId');
          const serviceId = get(provider, 'serviceId');
          const providerRating = get(provider, 'rating');
          return (
            <EarliestSlot
              key={uuidv1()}
              providerName={providerName}
              providerId={providerId}
              providerRating={providerRating}
              serviceId={serviceId}
              onSlotBooking={this.handleInstanceSlotBooking(provider)}
              instantBooking={instantBooking}
            />);
        })}
      </div>) : null;

    return (
      <div className={s.providerList}>
        <div className={s.expanderTitle}>
          <Typography variant="body1" color="inherit">
            Discover our providers ({linkedProvider.length})
          </Typography>
          {linkedProvider.length > 0 ? (
            <IconButton className="button-sm" onClick={this.handleExpandList}>
              {expandChevron}
            </IconButton>) : (
              <IconButton className="button-sm simple-button" onClick={noop}>
                <ExpandMore className="icon-main gray-color" />
              </IconButton>)}
        </div>
        {renderExpandProvider}
      </div>
    );
  }
}

LinkedProviders.propTypes = {
  service: serviceType.isRequired,
  instantBooking: func.isRequired,
  handleBookingButton: func.isRequired,
  saveEarliestSlotAction: func.isRequired,
  selectProvider: arrayOf(any).isRequired,
};

const mapStateToProps = state => ({
  selectProvider: state.homeModules.bookingDialogModules.selectProvider,
});

export default connect(mapStateToProps, {
  saveEarliestSlotAction: saveEarliestSlot,
})(LinkedProviders);

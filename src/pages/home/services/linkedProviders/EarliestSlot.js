import React, { Component } from 'react';
import {
  string, func, objectOf, any, number,
} from 'prop-types';
import { Typography, IconButton } from '@material-ui/core';
import { ExpandMoreRounded, Search } from '@material-ui/icons';
import uuidv1 from 'uuid/v1';
import { get, noop } from 'lodash';
import moment from 'moment';
import { fetchProviderSlots } from 'reduxModules/serviceCard.actions';
import { fetchProviderDetail } from 'reduxModules/provider.actions';
import { connect } from 'react-redux';
import CustomLink from 'components/CustomLink';
import RateStar from 'components/Rating/RateStar';
import s from './LinkedProviders.module.scss';

const nowSec = moment.now();

class EarliestSlot extends Component {
  handleSelectBookTime = selectedTime => () => {
    const { onSlotBooking } = this.props;
    onSlotBooking(selectedTime);
  };

  handleFetchProviderSlots = providerId => () => {
    const {
      fetchProviderSlotsAction, serviceId, providerSlots, fetchProviderDetailAction,
    } = this.props;
    const data = {
      customerTimezone: moment.tz.guess(),
      providerId,
      serviceId,
      startSec: (moment.now() + 10000) / 1000,
      toSec: (moment.now() + 10000) / 1000,
    };
    if (!providerSlots[`${serviceId}-${providerId}`]) {
      fetchProviderSlotsAction(data);
      fetchProviderDetailAction(providerId);
    }
  };

  handleFindMoreBooking = () => {
    const { instantBooking } = this.props;
    instantBooking();
  };

  render() {
    const {
      providerName, providerSlots, providerId, providerRating, serviceId,
    } = this.props;
    const expandIconList = providerSlots[`${serviceId}-${providerId}`]
      ? null
      : <ExpandMoreRounded className="icon-main icon-shake crimson-color" />;
    const validEarliestSlots = providerSlots[`${serviceId}-${providerId}`]
      && providerSlots[`${serviceId}-${providerId}`]
        .sort((a, b) => a.startSec - b.startSec)
        .filter(validSlot => validSlot.spotsOpen > 0 && validSlot.startSec * 1000 > nowSec)
        .slice(0, 3);

    return (
      <>
        <div className={s.portfolio}>
          <div className={s.providerName}>
            <Typography variant="body2" color="inherit" noWrap>
              <CustomLink text={providerName} to={`/provider/${providerId}`} />
            </Typography>
            <IconButton className="button-sm" onClick={this.handleFetchProviderSlots(providerId)}>
              {expandIconList}
            </IconButton>
          </div>
          <div className={s.providerStar}>
            <RateStar rating={providerRating} />
          </div>
        </div>
        {providerSlots[`${serviceId}-${providerId}`] && (
          <div className={s.providerSlot}>
            <div className={s.availableSlots}>
              { /* Show max 3 earliest slots */ }
              {validEarliestSlots.length > 0 ? validEarliestSlots.map((slot) => {
                const startSec = get(slot, 'startSec');
                if (startSec * 1000 > nowSec) {
                  const [slotStyle, onclick] = moment.now() < startSec * 1000
                    ? [`hover-bright ${s.slot} ${s.validSlot}`, this.handleSelectBookTime(startSec)]
                    : [`hover-bright ${s.slot} ${s.invalidSlot}`, noop];

                  return (
                    <div key={uuidv1()} className={`${slotStyle} text-center`}>
                      <Typography variant="subheading" color="inherit" onClick={onclick}>
                        {moment(startSec * 1000).format('hh:mm A')}
                      </Typography>
                    </div>
                  );
                }
                return null;
              }) : (
                <Typography
                  variant="body2"
                  color="inherit"
                  className="text-bold danger-color"
                >
                  No slot available now!
                </Typography>)
              }
            </div>
            <div className="icon-text">
              <Search className="icon-small info-color" />
              <Typography
                variant="body2"
                color="inherit"
                onClick={this.handleFindMoreBooking}
                className="hover-pointer"
              >
                Find more
              </Typography>
            </div>
          </div>)
        }
      </>
    );
  }
}

EarliestSlot.propTypes = {
  providerName: string.isRequired,
  onSlotBooking: func.isRequired,
  providerId: string.isRequired,
  fetchProviderSlotsAction: func.isRequired,
  providerSlots: objectOf(any).isRequired,
  serviceId: string.isRequired,
  instantBooking: func.isRequired,
  providerRating: number,
  fetchProviderDetailAction: func.isRequired,
};

EarliestSlot.defaultProps = {
  providerRating: 0,
};

const mapStateToProps = state => ({
  providerSlots: state.serviceCard.providerSlots,
  searchedId: state.serviceCard.searchedId,
});

export default connect(mapStateToProps, {
  fetchProviderSlotsAction: fetchProviderSlots,
  fetchProviderDetailAction: fetchProviderDetail,
})(EarliestSlot);

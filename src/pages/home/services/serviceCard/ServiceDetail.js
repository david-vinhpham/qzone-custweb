import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Button } from '@material-ui/core';
import { format } from 'date-fns';
import { serviceType, providerType } from 'types/global';
import './ServiceDetail.scss';
import CustomLink from 'components/CustomLink';

export default function ServiceDetail({
  providers, service, selectedDate, selectedTime, onSelectTime,
}) {
  const selectedProvider = providers.find(provider => provider.id === selectedTime.providerId);

  return (
    <React.Fragment>
      <Typography variant="title">{service.name}</Typography>
      <div className="service-detail">
        <Grid container className="service-detail__item">
          <Grid item sm={6}>
            <Typography variant="caption">Date:</Typography>
          </Grid>
          <Grid item sm={6}>
            <Typography variant="subtitle2">{format(selectedDate, 'dd MMM yyyy')}</Typography>
          </Grid>
        </Grid>
        <Grid container className="service-detail__item">
          <Grid item sm={6}>
            <Typography variant="caption">Organisation:</Typography>
          </Grid>
          <Grid item sm={6}>
            <Typography variant="subtitle2">
              <CustomLink text="Organisation 1" to="/organisation/1" />
            </Typography>
          </Grid>
        </Grid>
        <Grid container className="service-detail__item">
          <Grid item sm={6}>
            <Typography variant="caption">Service provider:</Typography>
          </Grid>
          <Grid item sm={6}>
            <Typography variant="subtitle2">
              <CustomLink text={selectedProvider.name} to="#" />
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={8} className="service-detail__item">
          {selectedProvider.availableSlots.map(time => (
            <Grid item sm={3} key={time}>
              <Button
                variant={selectedTime.providerId === selectedProvider.id && selectedTime.time === time
                  ? 'contained' : 'outlined'}
                color="secondary"
                onClick={() => { onSelectTime(selectedProvider.id, time); }}
              >
                {time}
              </Button>
            </Grid>
          ))}
        </Grid>
      </div>
    </React.Fragment>
  );
}

ServiceDetail.propTypes = {
  providers: PropTypes.arrayOf(providerType).isRequired,
  service: serviceType.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  selectedTime: PropTypes.shape({
    providerId: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }).isRequired,
  onSelectTime: PropTypes.func.isRequired,
};

import React from 'react';
import {
  shape, string, number, objectOf, any, func,
} from 'prop-types';
import moment from 'moment';
import { Typography } from '@material-ui/core';
import { VerticalTimelineElement } from 'react-vertical-timeline-component';
import {
  DateRange, Schedule, AlarmOff, AlarmOn,
  AirlineSeatReclineNormal, DoneAll,
  Update, Timer, TagFaces,
} from '@material-ui/icons';
import Rating from 'material-ui-rating';

import styles from './TimelineCard.module.scss';
import CountDownDisplay from './CountDownDisplay';
import { STATUS } from './Appointment.constants';

export default function TimelineCard({
  serviceName,
  providerName,
  slot: { startSec, toSec },
  duration,
  geoLocation: {
    city, country,
    district, postCode, state,
    streetAddress,
  },
  bookingCode,
  rateAppointment,
  rating,
}) {
  const toSecCalc = (toSec || startSec + duration * 60) * 1000;
  const current = new Date();
  const currentSec = current.getTime() / 1000;
  const remainTimeSec = currentSec - (+startSec);
  const [eventStyle, iconTimeline, eventStatus, iconStatus, styleStatus] = remainTimeSec > 0
    ? [
      { background: 'rgb(61, 63, 66)', color: '#fff' },
      <AlarmOff />,
      STATUS.EXPIRED,
      <DoneAll className="icon-main" />,
      styles.eventStatusComplete,
    ] : [
      { background: 'rgb(87, 201, 249)', color: '#fff' },
      <AlarmOn />,
      STATUS.WAITING,
      <AirlineSeatReclineNormal className="icon-main" />,
      styles.eventStatusWaiting,
    ];

  const remainTimeHr = remainTimeSec < 0 ? Math.abs(remainTimeSec) / 3600 : 0;
  const remainDay = remainTimeHr > 24 ? remainTimeHr / 24 : 0;
  const remainTimeMn = (remainTimeHr % 1) * 60;
  const waitingDay = parseInt(remainDay, 0);
  const waitingHr = waitingDay ? parseInt((remainDay % 1) * 24, 0) : parseInt(remainTimeHr, 0);
  const waitingMn = parseInt(remainTimeMn, 0);

  let displayTimeout = null;
  let currentEventStyle = eventStyle;
  let currentStyleStatus = styleStatus;
  let currentIconTimeline = iconTimeline;
  let currentEventStatus = eventStatus;
  let displayIconStatus = iconStatus;
  if (waitingDay) {
    displayTimeout = `${waitingDay} day, ${waitingHr} hr, ${waitingMn} min`;
  } else if (remainTimeHr < 1 && remainTimeMn > 0) {
    displayTimeout = (
      <CountDownDisplay startTime={remainTimeMn} serviceName={serviceName} providerName={providerName} />
    );
    currentEventStyle = { background: 'rgb(255, 95, 87)', color: '#fff' };
    currentStyleStatus = styles.eventStatusCountDown;
    currentIconTimeline = <Update />;
    currentEventStatus = STATUS.COMING;
    displayIconStatus = <Timer className="icon-danger" />;
  } else {
    displayTimeout = `${waitingHr} hr, ${waitingMn} min`;
  }

  return (
    <>
      <VerticalTimelineElement
        iconStyle={currentEventStyle}
        icon={currentIconTimeline}
        className={styles.cardContainer}
      >
        <div>
          <Typography variant="h6" color="primary" noWrap align="center">
            {streetAddress}
          </Typography>
        </div>
        <div>
          <Typography variant="subtitle1" color="textSecondary" align="center">
            {district} {state} {postCode} - {city} {country}
          </Typography>
        </div>
        {currentEventStatus === STATUS.EXPIRED && (
          <div className={styles.ratingWrapper}>
            <div className={styles.ratingInner}>
              <Typography variant="subheading" classes={{ subheading: styles.ratingText }}>
                {rating === 0 ? 'Please rate for our service !' : 'Thank you for choosing our service !'}
              </Typography>
              <div className={styles.appointmentRemainedTime}>
                <TagFaces className={styles.ratingIconFace} />
                <Rating
                  value={rating}
                  readOnly={rating > 0}
                  onChange={rateAppointment}
                  classes={{ iconButton: styles.ratingIcon }}
                />
              </div>
            </div>
          </div>
        )}
        <div className={styles.appointmentCode}>
          <Typography variant="headline" color="secondary" align="center" classes={{ headline: styles.bookingCode }}>
            {bookingCode}
          </Typography>
        </div>
        <div>
          <Typography variant="h6" color="textSecondary">{serviceName}</Typography>
          <Typography variant="subheading" color="textSecondary">{providerName}</Typography>
          <div className={styles.appointmentItem}>
            <DateRange className="icon-main" />
            <Typography variant="subheading" color="primary" inline noWrap>
              {moment(startSec * 1000).format('l')}
            </Typography>
          </div>
          <div className={styles.appointmentItem}>
            <Schedule className="icon-main" />
            <Typography variant="subheading" color="primary" inline noWrap>
              {`From ${moment(startSec * 1000).format('LT')} to ${moment(toSecCalc).format('LT')}`}
            </Typography>
          </div>
        </div>
        <div className={styles.appointmentItem}>
          {displayIconStatus}
          <Typography variant="subheading" color="secondary">{currentEventStatus}</Typography>
        </div>
        <div className={`${styles.appointmentRemainedTime} ${currentStyleStatus}`}>
          <AlarmOn className="icon-white" />
          <Typography variant="subheading" color="secondary" classes={{ subheading: styles.remainedText }}>
            {displayTimeout}
          </Typography>
        </div>
      </VerticalTimelineElement>
    </>
  );
}

TimelineCard.propTypes = {
  serviceName: string.isRequired,
  providerName: string.isRequired,
  slot: shape({
    startSec: number.isRequired,
    toSec: number,
  }).isRequired,
  duration: number.isRequired,
  geoLocation: objectOf(any).isRequired,
  rateAppointment: func.isRequired,
  rating: number.isRequired,
};
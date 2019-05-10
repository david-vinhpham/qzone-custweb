import React from 'react';
import {
  func,
} from 'prop-types';
import { Typography, Button } from '@material-ui/core';
import moment from 'moment';
import uuidv1 from 'uuid/v1';
import {
  get,
  chunk,
} from 'lodash';
import {
  dateFormatDash,
  timeSlotFormat,
  longDateFormat,
} from 'utils/constants';
import s from './TimeBoxes.module.scss';

export class TimeBoxes extends React.PureComponent {
  static getDerivedStateFromProps(props, state) {
    const { provider } = props;
    const { provider: cachedProvider } = state;
    if (provider !== cachedProvider) {
      return { provider };
    }
    return null;
  }

  state = {
    provider: null,
  };

  onHourChange = ({ slotId, start, duration }) => (event) => {
    event.preventDefault();
    this.props.onSelectSlot({
      slotId,
      start: start.valueOf(),
      duration,
    });
  };

  getHourBoxes = (slots) => {
    if (!slots) return null;
    const slotTable = {};
    slots
      .filter((slot) => {
        const startSec = get(slot, 'providerStartSec');
        const isoStartSec = startSec.replace(' ', 'T');
        const spotsOpen = get(slot, 'spotsOpen');
        return spotsOpen > 0 && moment() < moment(isoStartSec);
      })
      .sort((a, b) => a.startSec - b.startSec).map((slot) => {
        const startSec = get(slot, 'providerStartSec');
        const duration = get(slot, 'durationSec');
        const spotsOpen = get(slot, 'spotsOpen');
        const slotId = get(slot, 'id');
        startSec.replace(' ', '-');
        slotTable[moment(startSec).format(dateFormatDash)] = slotTable[moment(startSec).format(dateFormatDash)]
          ? [
            ...slotTable[moment(startSec).format(dateFormatDash)],
            {
              slotId,
              time: moment(startSec),
              duration,
              spotsOpen,
              action: this.onHourChange({
                slotId,
                start: moment(startSec).unix(),
                duration,
              }),
            },
          ] : [];
        return null;
      });
    return slotTable;
  };

  renderNoneSlot = () => (
    <div className={s.noneSlot}>
      <Typography variant="subheading" color="inherit">
        All appointments has been booked! Join our queue for slot availability!
      </Typography>
    </div>
  );

  renderTimeBox = (data) => {
    const timeBox = Object.keys(data);
    return timeBox.length ? timeBox.map(
      date => (
        <div key={uuidv1()} className={s.availableDateSlots}>
          <div className={s.dateSlot}>
            <Typography variant="subheading" color="inherit" className="label">
              {moment(date.replace(/(\d+)-(\d+)-(\d+)/, '$3-$2-$1')).format(longDateFormat)}
            </Typography>
          </div>
          <>
            { data[date] && data[date].length
              ? chunk(data[date], 3).map(row => (
                <div key={uuidv1()} className={s.timeRow}>
                  {row.map((slot) => {
                    const { time, action } = slot;
                    return (
                      <Button
                        key={uuidv1()}
                        className={s.timeSlot}
                        onClick={action}
                      >
                        <Typography variant="subheading" color="inherit">
                          {time.format(timeSlotFormat)}
                        </Typography>
                      </Button>
                    );
                  })}
                </div>
              )) : this.renderNoneSlot()}
          </>
        </div>
      ),
    ) : this.renderNoneSlot();
  };

  render() {
    const { provider } = this.state;
    const availableSlots = get(provider, 'availableSlots');
    const hourBoxes = this.getHourBoxes(availableSlots);
    return hourBoxes && this.renderTimeBox(hourBoxes);
  }
}

TimeBoxes.propTypes = {
  onSelectSlot: func.isRequired,
};

export default TimeBoxes;
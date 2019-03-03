import React from 'react';
import { connect } from 'react-redux';
import mtz from 'moment-timezone';
import PropTypes from 'prop-types';
import { bookingDetailType, providerType } from 'types/global';
import EmptyItem from 'components/EmptyItem';
import HourSelectBox from './selectTime/HourSelectBox';
import styles from './SelectTime.module.scss';

export class SelectTime extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedHour: null,
    };
  }

  componentDidMount() {
    const { bookingDetail, providerDetail } = this.props;
    if (bookingDetail.provider && bookingDetail.time && providerDetail.id === bookingDetail.provider.id) {
      this.setState({
        selectedHour: mtz(bookingDetail.time.start),
      });
    }
  }

  static getDerivedStateFromProps(nextProps) {
    return nextProps.bookingDetail.provider && nextProps.providerDetail.id === nextProps.bookingDetail.provider.id
      && nextProps.bookingDetail.time
      ? {}
      : { selectedHour: null };
  }

  onHourChange = ({ start, duration }) => {
    this.props.onChange({
      start: start.valueOf(),
      duration,
    });
    this.setState({ selectedHour: start });
  }

  getHourBoxes = timeDetails => timeDetails.map(d => ({
    startHour: mtz(d.startSec * 1000),
    displayedStartHour: mtz(d.startSec * 1000),
    durationSec: d.durationSec,
  }))

  render() {
    const { timeDetails, isLoading } = this.props;
    const { selectedHour } = this.state;
    const hourBoxes = this.getHourBoxes(timeDetails);
    return (
      <div className={styles.selectTimeWrapper}>
        {!isLoading && hourBoxes.length === 0
          && <EmptyItem message="No available slot" />}
        {hourBoxes.length > 0
          && (
            <HourSelectBox
              hourBoxes={hourBoxes}
              selectedHour={selectedHour}
              onChange={this.onHourChange}
            />
          )}
      </div>
    );
  }
}

SelectTime.propTypes = {
  bookingDetail: bookingDetailType.isRequired,
  timeDetails: PropTypes.arrayOf(
    PropTypes.shape({
      startSec: PropTypes.number,
      durationSec: PropTypes.number,
      spotsOpen: PropTypes.number,
    }),
  ),
  onChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  providerDetail: providerType.isRequired,
};

SelectTime.defaultProps = {
  timeDetails: [],
  isLoading: true,
};

const mapStateToProps = (states, ownProps) => ({
  isLoading: states.homeModules.bookingDialog.isLoading,
  timeDetails: states.homeModules.bookingDialogModules.selectProvider.providerDetails[ownProps.providerDetail.id],
});

export default connect(mapStateToProps)(SelectTime);

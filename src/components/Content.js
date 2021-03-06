import React from 'react';
import Parser from 'html-react-parser';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const Content = (props) => {
  const {
    title, titleClass, subTitle, subTitleClass, content, contentClass, buttonLabel, buttonClass, paragraphClass,
  } = props;
  const pageTitle = title
    ? <Typography classes={titleClass}>{Parser(title)}</Typography>
    : '';
  const pageSubtitle = subTitle
    ? <Typography gutterBottom classes={subTitleClass}>{Parser(subTitle)}</Typography>
    : '';
  const pageContent = content
    ? <Typography gutterBottom classes={contentClass}>{Parser(content)}</Typography>
    : '';
  return (
    <Grid item xs={10} sm={6} className="auto-margin-vertical">
      <div className={paragraphClass}>
        {pageTitle}
        {pageSubtitle}
        {pageContent}
        <Button variant="contained" classes={buttonClass}>{buttonLabel}</Button>
      </div>
    </Grid>
  );
};

Content.propTypes = {
  title: PropTypes.string,
  titleClass: PropTypes.objectOf(PropTypes.string),
  subTitle: PropTypes.string,
  subTitleClass: PropTypes.objectOf(PropTypes.string),
  content: PropTypes.string,
  contentClass: PropTypes.objectOf(PropTypes.string),
  buttonClass: PropTypes.objectOf(PropTypes.string),
  buttonLabel: PropTypes.string.isRequired,
  paragraphClass: PropTypes.string,
};

Content.defaultProps = {
  title: '',
  titleClass: { root: '' },
  subTitle: '',
  subTitleClass: { root: '' },
  content: '',
  contentClass: { root: '' },
  buttonClass: { root: '' },
  paragraphClass: '',
};

export default Content;

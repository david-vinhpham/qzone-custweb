import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const serviceClass = {
  title: {
    root: 'org-page__section-service-card__title header2 we-peep text-bold',
  },
  button: {
    root: 'org-page__button bg-we-peep mako margin-top',
  },
  card: {
    action: {
      root: 'flex',
    },
    image: {
      root: 'org-page__section-service-card__card-image',
    },
    title: {
      root: 'text-bold',
    },
  },
  tile: {
    root: 'item-center',
  },
};

const ServiceCard = (props) => {
  const { cardList } = props;
  const cards = cardList.length > 1
    ? cardList.map(card => (
      <GridListTile key={card.id}>
        <Card>
          <CardActionArea classes={serviceClass.card.action}>
            <CardMedia
              classes={serviceClass.card.image}
              image={card.src}
              title={card.name}
            />
            <div>
              <CardContent>
                <Typography classes={serviceClass.card.title}>{card.title}</Typography>
                <Typography color="textSecondary">{card.content}</Typography>
              </CardContent>
            </div>
          </CardActionArea>
        </Card>
      </GridListTile>
    ))
    : null;
  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={10}>
        <Typography align="center" classes={serviceClass.title}>Pets (and their humans) love us</Typography>
        <GridList cellHeight="auto" spacing={32}>
          {cards}
        </GridList>
      </Grid>
      <Grid item>
        <Button variant="contained" classes={serviceClass.button}>Subscribe now</Button>
      </Grid>
    </Grid>
  );
};

ServiceCard.propTypes = {
  cardList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ServiceCard;

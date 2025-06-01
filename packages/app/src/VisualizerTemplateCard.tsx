import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
} from '@material-ui/core';
import useStyles from   "./Visualizer.styles"
import FilterListIcon from '@material-ui/icons/FilterList';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';


export const VisualizerTemplateCard: React.FC<TemplateCardProps> = ({ template, onChoose }) => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <Box className={classes.cardHeader}>
        <Box>
          <Typography className={classes.cardCategory} gutterBottom>
            {template.category}
          </Typography>
          <Typography variant="h6" component="h2" className={classes.cardTitle}>
            {template.title}
          </Typography>
        </Box>
        <Box>
          <IconButton size="small" className={classes.iconButton} aria-label="filter">
            <FilterListIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" className={classes.iconButton} aria-label="star">
            <StarBorderIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <CardContent className={classes.cardDescription}>
        <Typography variant="body2" component="p">
          {template.description}
        </Typography>
      </CardContent>
      <Box className={classes.cardActions}>
        <Box className={classes.userInfo}>
          <AccountCircleIcon className={classes.userAvatar} />
          <Typography variant="caption">{template.user}</Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          className={classes.chooseButton}
          onClick={() => onChoose(template)}
        >
          CHOOSE
        </Button>
      </Box>
    </Card>
  );
};
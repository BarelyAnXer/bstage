import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Box,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Divider,
} from '@material-ui/core';
import useStyles from './Visualizer.styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle'; // For success message

export const ConfigurationPage: React.FC<ConfigurationPageProps> = ({
  template,
  onBack,
  onReview,
  onSubmitConfiguration,
  isSubmitting,
  submitError,
  submitSuccessMessage,
}) => {
  const classes = useStyles();
  const steps = ['Configuration', 'Deploy Services', 'Review & Submit'];
  const [activeStep, setActiveStep] = useState(0);

  const initialFormValues =
    template.configFields?.reduce((acc, field) => {
      acc[field.id] = field.defaultValue;
      return acc;
    }, {} as Record<string, string>) || {};

  const [formValues, setFormValues] =
    useState<Record<string, string>>(initialFormValues);

  useEffect(() => {
    setFormValues(
      template.configFields?.reduce((acc, field) => {
        acc[field.id] = field.defaultValue;
        return acc;
      }, {} as Record<string, string>) || {},
    );
  }, [template]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? String(checked) : value,
    }));
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
      if (activeStep === steps.length - 2) {
        // About to go to Review step
        onReview(formValues);
      }
    }
  };

  const handleBackNav = () => {
    if (activeStep === 0) {
      onBack();
    } else {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Final Configuration to be submitted to backend:', formValues);
    onSubmitConfiguration(formValues);
  };

  const renderFieldsForStep = (stepIndex: number) => {
    return template.configFields
      ?.filter(field => field.stepGroup === stepIndex)
      .map(field => {
        if (field.type === 'checkbox') {
          return (
            <div key={field.id} className={classes.formField}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues[field.id] === 'true'}
                    onChange={handleInputChange}
                    name={field.id}
                  />
                }
                label={field.label}
              />
              {field.helperText && (
                <Typography
                  variant="caption"
                  display="block"
                  style={{
                    color: '#718096',
                    marginLeft: '32px',
                    marginTop: '-8px',
                  }}
                >
                  {field.helperText}
                </Typography>
              )}
            </div>
          );
        }
        return (
          <TextField
            key={field.id}
            name={field.id}
            label={field.label}
            value={formValues[field.id] || ''}
            variant="outlined"
            fullWidth
            className={classes.formField}
            helperText={field.helperText}
            onChange={handleInputChange}
            type={field.type === 'number' ? 'number' : 'text'}
          />
        );
      });
  };

  return (
    <Paper elevation={0} className={classes.configPageContainer}>
      <Box className={classes.configHeader}>
        <Typography variant="h5" component="h1" className={classes.configTitle}>
          {template.title}
        </Typography>
        <Typography variant="subtitle1" className={classes.configSubtitle}>
          {template.description}
        </Typography>
      </Box>

      <Stepper
        activeStep={activeStep}
        alternativeLabel
        className={classes.stepper}
      >
        {steps.map(label => (
          <Step key={label}>
            <StepLabel
              StepIconProps={{
                classes: {
                  root: classes.stepLabel,
                  active: classes.stepLabel,
                  completed: classes.stepLabel,
                },
              }}
              classes={{ label: classes.stepLabel }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && ( // Basic Configuration
        <Box className={classes.formSection}>
          <Typography
            variant="h6"
            gutterBottom
            style={{ color: '#E5E7EB', marginBottom: '16px' }}
          >
            Basic Configuration Options
          </Typography>
          {renderFieldsForStep(0)}
        </Box>
      )}

      {activeStep === 1 && ( // Advanced Options / Addons
        <Box className={classes.formSection}>
          <Typography
            variant="h6"
            gutterBottom
            style={{ color: '#E5E7EB', marginBottom: '16px' }}
          >
            Services
          </Typography>
          {renderFieldsForStep(1)}
          {!template.configFields?.some(f => f.stepGroup === 1) && (
            <Typography style={{ color: '#a0aec0' }}>
              No advanced options or add-ons available for this template.
            </Typography>
          )}
        </Box>
      )}

      {activeStep === steps.length - 1 && (
        <Box className={classes.formSection}>
          <Typography
            variant="h6"
            gutterBottom
            style={{ color: '#E5E7EB', marginBottom: '16px' }}
          >
            Review Your Configuration
          </Typography>

          <Paper
            elevation={3}
            style={{
              padding: '16px',
              backgroundColor: '#1F2937',
              borderRadius: '12px',
            }}
          >
            {template.configFields?.map(field => {
              const value = formValues[field.id];
              const showField =
                field.type === 'checkbox' ? value === 'true' : Boolean(value);

              if (!showField) return null;

              return (
                <Box key={field.id} mb={2}>
                  <Typography variant="subtitle2" style={{ color: '#9CA3AF' }}>
                    {field.label}
                  </Typography>
                  <Typography variant="body1" style={{ color: '#F3F4F6' }}>
                    {field.type === 'checkbox' ? 'Enabled' : value}
                  </Typography>
                  <Divider
                    style={{ margin: '8px 0', backgroundColor: '#374151' }}
                  />
                </Box>
              );
            })}
          </Paper>
        </Box>
      )}

      <Box className={classes.actionFeedbackContainer}>
        {submitError && (
          <Typography className={classes.errorText}>
            <ErrorIcon fontSize="small" style={{ marginRight: '8px' }} />
            Error: {submitError}
          </Typography>
        )}
        {submitSuccessMessage &&
          !submitError && ( // Only show success if no error
            <Typography className={classes.successText}>
              <CheckCircleIcon
                fontSize="small"
                style={{ marginRight: '8px' }}
              />
              {submitSuccessMessage}
            </Typography>
          )}
        <Box flexGrow={1} /> {/* Pushes buttons to the right */}
        <Box className={classes.configActions}>
          <Button
            variant="contained"
            className={classes.backButton}
            onClick={handleBackNav}
            startIcon={<ArrowBackIcon />}
            disabled={isSubmitting}
          >
            {activeStep === 0 ? 'Back to Templates' : 'Back'}
          </Button>

          {activeStep < steps.length - 1 && (
            <Button
              variant="contained"
              className={classes.nextButton}
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Next
            </Button>
          )}

          {activeStep === steps.length - 1 && (
            <Button
              variant="contained"
              className={classes.createButton} // Keep existing style name
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Apply'
              )}
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};
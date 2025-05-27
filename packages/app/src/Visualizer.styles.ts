// MyComponent.styles.ts
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    pageTitle: {
      marginBottom: theme.spacing(3),
      fontWeight: 'bold',
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#374151',
      color: '#F3F4F6',
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.divider}`,
    },
    cardHeader: {
      backgroundColor: '#10B981',
      padding: theme.spacing(1.5, 2),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardHeaderText: {
      color: '#ffffff',
    },
    cardCategory: {
      color: '#D1D5DB',
      fontSize: '0.75rem',
      marginBottom: theme.spacing(0.5),
      textTransform: 'uppercase',
    },
    cardTitle: {
      fontWeight: 'bold',
      fontSize: '1.125rem',
      color: '#ffffff',
    },
    cardDescription: {
      flexGrow: 1,
      color: '#E5E7EB',
      fontSize: '0.875rem',
      padding: theme.spacing(2),
      paddingTop: theme.spacing(1.5),
    },
    cardActions: {
      padding: theme.spacing(1.5, 2),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: `1px solid ${theme.palette.grey[700]}`,
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      color: '#9CA3AF',
    },
    userAvatar: {
      marginRight: theme.spacing(1),
      width: theme.spacing(3),
      height: theme.spacing(3),
      color: '#9CA3AF',
    },
    chooseButton: {
      backgroundColor: '#4B5563',
      color: '#ffffff',
      fontWeight: 'bold',
      '&:hover': {
        backgroundColor: '#374151',
      },
    },
    iconButton: {
      color: '#E5E7EB',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
    configPageContainer: {
      padding: theme.spacing(3),
      backgroundColor: '#2d3748',
      color: '#e2e8f0',
      borderRadius: theme.shape.borderRadius,
    },
    configHeader: {
      marginBottom: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      borderBottom: `1px solid ${theme.palette.grey[700]}`,
    },
    configTitle: {
      fontWeight: 'bold',
      color: '#ffffff',
    },
    configSubtitle: {
      color: '#a0aec0',
      fontSize: '0.9rem',
    },
    stepper: {
      backgroundColor: 'transparent',
      padding: theme.spacing(3, 0),
    },
    stepLabel: {
      '& .MuiStepLabel-label': {
        color: '#cbd5e0',
        '&$active': {
          color: '#63b3ed',
          fontWeight: 'bold',
        },
        '&$completed': {
          color: '#48bb78',
        },
      },
      '& .MuiStepIcon-root': {
        color: '#4a5568',
        '&$active': {
          color: '#63b3ed',
        },
        '&$completed': {
          color: '#48bb78',
        },
      },
      active: {},
      completed: {},
    },
    formSection: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(2),
      backgroundColor: '#374151',
      borderRadius: theme.shape.borderRadius,
    },
    formField: {
      marginBottom: theme.spacing(2.5),
      '& .MuiInputLabel-root, & .MuiFormControlLabel-label': {
        color: '#a0aec0',
      },
      '& .MuiInputBase-input': {
        color: '#e2e8f0',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#4a5568',
        },
        '&:hover fieldset': {
          borderColor: '#63b3ed',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#63b3ed',
        },
      },
      '& .MuiCheckbox-root': {
        color: '#63b3ed',
      },
      '& .MuiFormHelperText-root': {
        color: '#718096',
      },
    },
    configActions: {
      marginTop: theme.spacing(4),
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: theme.spacing(2),
    },
    backButton: {
      backgroundColor: '#4A5568',
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: '#2D3748',
      },
    },
    nextButton: {
      backgroundColor: '#3B82F6',
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: '#2563EB',
      },
    },
    createButton: {
      backgroundColor: '#10B981',
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: '#059669',
      },
      '&.Mui-disabled': {
        backgroundColor: '#047857',
        color: '#a0aec0',
      },
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      flexDirection: 'column',
      color: '#e2e8f0',
    },
    errorText: {
      color: theme.palette.error.light,
      display: 'flex',
      alignItems: 'center',
      marginRight: theme.spacing(2),
      fontSize: '0.875rem',
    },
    successText: {
      color: theme.palette.success.light,
      display: 'flex',
      alignItems: 'center',
      marginRight: theme.spacing(2),
      fontSize: '0.875rem',
    },
    actionFeedbackContainer: {
      display: 'flex',
      alignItems: 'center',
      marginTop: theme.spacing(2),
      width: '100%',
    },
  })
);

export default useStyles;

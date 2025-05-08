import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Checkbox,
  FormControlLabel,
  CircularProgress, // For loading indicator
  // FormHelperText,
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Content, Header, Page, Progress } from '@backstage/core-components'; // Added Progress
import FilterListIcon from '@material-ui/icons/FilterList';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ErrorIcon from '@material-ui/icons/Error'; // For error display

// Define custom styles (remains largely the same)
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
    stepLabel: { // Combined Material-UI v4 approach for StepLabel styling
      '& .MuiStepLabel-label': {
        color: '#cbd5e0',
        '&$active': { // Use $active for referring to active state class
          color: '#63b3ed',
          fontWeight: 'bold',
        },
        '&$completed': { // Use $completed for referring to completed state class
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
      active: {}, // Required for $active selector to work
      completed: {}, // Required for $completed selector to work
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
    },
    loadingContainer: { // Style for loading/error messages
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      flexDirection: 'column',
      color: '#e2e8f0',
    },
    errorText: {
      color: theme.palette.error.main,
      marginLeft: theme.spacing(1),
    }
  }),
);

// --- Data Interfaces ---
interface ConfigField {
  id: string;
  label: string;
  defaultValue: string;
  helperText: string;
  type?: 'text' | 'select' | 'checkbox';
  options?: string[];
  stepGroup: number; // 0 for basic config, 1 for advanced options
}

interface TemplateData {
  id: string;
  category: string;
  title: string;
  description: string;
  user: string;
  configFields?: Array<ConfigField>;
}

// --- Data Interfaces for fetched data (ADD THESE) ---
interface AppEntity {
  title?: string;
  description?: string;
  summary?: string;
  logo?: string;
  sourceUrl: string;
}

interface LivenessResponse {
  status: string;
  timestamp: string;
  discoveredUrlCount: number;
  processedEntities: AppEntity[];
}


// TemplateCardProps and TemplateCard component (NO CHANGES)
interface TemplateCardProps {
  template: TemplateData;
  onChoose: (template: TemplateData) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onChoose }) => {
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


// --- Configuration Page Component (NO CHANGES NEEDED HERE FOR THIS TASK) ---
interface ConfigurationPageProps {
  template: TemplateData;
  onBack: () => void;
  onReview: (configValues: Record<string, string>) => void;
  onCreate: (configValues: Record<string, string>) => void;
}

const ConfigurationPage: React.FC<ConfigurationPageProps> = ({ template, onBack, onReview, onCreate }) => {
  const classes = useStyles();
  const steps = ['Configuration', 'Advanced Options', 'Review'];
  const [activeStep, setActiveStep] = useState(0);

  const initialFormValues = template.configFields?.reduce((acc, field) => {
    acc[field.id] = field.defaultValue;
    return acc;
  }, {} as Record<string, string>) || {};

  const [formValues, setFormValues] = useState<Record<string, string>>(initialFormValues);

  // Reset formValues when template changes (e.g., if data loading modifies the selectedTemplate structure before this page is shown)
  useEffect(() => {
    setFormValues(
      template.configFields?.reduce((acc, field) => {
        acc[field.id] = field.defaultValue;
        return acc;
      }, {} as Record<string, string>) || {}
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
        onReview(formValues);
      }
    }
  };

  const handleBackNav = () => { // Renamed to avoid conflict with onBack prop
    if (activeStep === 0) {
      onBack();
    } else {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
    }
  };

  const handleCreateSubmit = () => {
    console.log("Final Configuration to be created:", formValues);
    onCreate(formValues);
  }

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
              {field.helperText && <Typography variant="caption" display="block" style={{ color: '#718096', marginLeft: '32px', marginTop: '-8px' }}>{field.helperText}</Typography>}
            </div>
          );
        }
        return (
          <TextField
            key={field.id}
            name={field.id}
            label={field.label}
            value={formValues[field.id] || ''} // Controlled component
            variant="outlined"
            fullWidth
            className={classes.formField}
            helperText={field.helperText}
            onChange={handleInputChange}
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

      <Stepper activeStep={activeStep} alternativeLabel className={classes.stepper}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              StepIconProps={{ classes: { root: classes.stepLabel,  active: classes.stepLabel, completed: classes.stepLabel } }}
              classes={{ label: classes.stepLabel }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box className={classes.formSection}>
          <Typography variant="h6" gutterBottom style={{ color: '#E5E7EB', marginBottom: '16px' }}>
            Basic Configuration Options
          </Typography>
          {renderFieldsForStep(0)}
        </Box>
      )}

      {activeStep === 1 && (
        <Box className={classes.formSection}>
          <Typography variant="h6" gutterBottom style={{ color: '#E5E7EB', marginBottom: '16px' }}>
            Advanced Options
          </Typography>
          {renderFieldsForStep(1)}
          {(!template.configFields?.some(f => f.stepGroup === 1)) &&
            <Typography style={{ color: '#a0aec0' }}>No advanced options available for this template.</Typography>
          }
        </Box>
      )}

      {activeStep === steps.length - 1 && (
        <Box className={classes.formSection}>
          <Typography variant="h6" gutterBottom style={{ color: '#E5E7EB', marginBottom: '16px' }}>
            Review Your Configuration
          </Typography>
          {template.configFields?.map(field => (
            <Box key={field.id} mb={2}>
              <Typography variant="subtitle2" style={{ color: '#9CA3AF' }}>{field.label}:</Typography>
              <Typography variant="body1" style={{ color: '#F3F4F6' }}>
                {field.type === 'checkbox'
                  ? (formValues[field.id] === 'true' ? 'Yes' : 'No')
                  : (formValues[field.id] || field.defaultValue)}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Box className={classes.configActions}>
        <Button
          variant="contained"
          className={classes.backButton}
          onClick={handleBackNav} // Use renamed handler
          startIcon={<ArrowBackIcon />}
        >
          {activeStep === 0 ? 'Back to Templates' : 'Back'}
        </Button>

        {activeStep < steps.length - 1 && (
          <Button
            variant="contained"
            className={classes.nextButton}
            onClick={handleNext}
          >
            Next
          </Button>
        )}

        {activeStep === steps.length - 1 && (
          <Button
            variant="contained"
            className={classes.createButton}
            onClick={handleCreateSubmit}
          >
            Create
          </Button>
        )}
      </Box>
    </Paper>
  );
};


// --- Initial Templates Data (will be moved to state) ---
const initialTemplatesArray: TemplateData[] = [
  {
    id: 'azure-cluster',
    category: 'clusterdeployment',
    title: 'Azure Cluster Deployment',
    description: 'Generates a ClusterDeployment resource for Azure',
    user: 'user:guest',
    configFields: [
      { id: 'clusterNameSuffix', label: 'Cluster Name Suffix', defaultValue: 'dev', helperText: 'Suffix for the cluster name (e.g., dev, prod)', type: 'text', stepGroup: 0 },
      { id: 'controlPlaneFlavor', label: 'Control Plane Machine Flavor', defaultValue: 'Standard_DS2_v2', helperText: 'Azure VM size for control plane nodes', type: 'text', stepGroup: 0 },
      { id: 'workerNodeFlavor', label: 'Worker Node Machine Flavor', defaultValue: 'Standard_D2_v2', helperText: 'Azure VM size for worker nodes', type: 'text', stepGroup: 0 },
    ],
  },
  {
    id: 'openstack-cluster',
    category: 'clusterdeployment',
    title: 'OpenStack Cluster Deployment',
    description: 'Generates a ClusterDeployment resource for OpenStack',
    user: 'user:guest',
    configFields: [
      { id: 'clusterName', label: 'Cluster Name', defaultValue: 'my-openstack-cluster', helperText: 'Name of the OpenStack cluster', type: 'text', stepGroup: 0 },
      { id: 'nodeCount', label: 'Node Count', defaultValue: '3', helperText: 'Number of worker nodes', type: 'text', stepGroup: 0 },
      {
        id: 'floatingIpEnabled',
        label: 'Enable Floating IP for API',
        defaultValue: 'true',
        helperText: 'Assign a floating IP to the Kubernetes API server.',
        type: 'checkbox',
        stepGroup: 1,
      },
    ],
  },
];


// --- Main Visualizer Component ---
type View = 'templateList' | 'configure';

export const Visualizer = () => {
  const classes = useStyles();
  const [currentView, setCurrentView] = useState<View>('templateList');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);
  const [/*configurationValues*/, setConfigurationValues] = useState<Record<string, string> | null>(null);

  // --- STATE FOR TEMPLATES, LOADING, AND ERRORS ---
  const [templates, setTemplates] = useState<TemplateData[]>(initialTemplatesArray);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true to indicate initial load
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddonsAndUpdateTemplates = async () => {
      setIsLoading(true); // Set loading true at the start of fetch
      setError(null); // Clear any previous errors

      try {
        const response = await fetch('http://localhost:7007/health/liveness');
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        const data: LivenessResponse = await response.json();
        console.log("Liveness check response:", data);

        let addonConfigFields: ConfigField[] = [];

        if (data.processedEntities && data.processedEntities.length > 0) {
          addonConfigFields = data.processedEntities.map((app, index) => ({
            id: app.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `addon-${app.sourceUrl.split('/').pop() || index}`,
            label: app.title || 'Unnamed Addon',
            defaultValue: 'false',
            helperText: app.summary || app.description || 'No details available.',
            type: 'checkbox',
            stepGroup: 1,
          }));
        } else {
          console.log('No addon entities received from API or the list is empty.');
        }

        setTemplates(currentTemplates =>
          currentTemplates.map(template => {
            if (template.id === 'azure-cluster') {
              const step0Fields = template.configFields?.filter(
                field => field.stepGroup === 0
              ) || [];
              return {
                ...template,
                configFields: [...step0Fields, ...addonConfigFields],
              };
            }
            return template;
          })
        );

      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred while fetching addons.';
        console.error("Error fetching or processing addon data:", message);
        setError(message);
      } finally {
        setIsLoading(false); // Set loading false when fetch completes or fails
      }
    };

    fetchAddonsAndUpdateTemplates();
  }, []); // Empty dependency array: runs once after component mounts


  const handleChooseTemplate = (template: TemplateData) => {
    // Ensure we are using the latest version of the template from the state
    const currentTemplateData = templates.find(t => t.id === template.id) || template;
    setSelectedTemplate(currentTemplateData);
    setCurrentView('configure');
  };

  const handleBackToTemplates = () => {
    setSelectedTemplate(null);
    setCurrentView('templateList');
    setConfigurationValues(null);
  };

  const handleFinalReview = (configVals: Record<string, string>) => {
    console.log("Configuration ready for review:", configVals);
    setConfigurationValues(configVals);
  };

  const handleCreateAction = (configVals: Record<string, string>) => {
    console.log("CREATE button clicked. Final Configuration to be submitted:", configVals);
    setConfigurationValues(configVals);
    alert(`Resource creation initiated with: ${JSON.stringify(configVals, null, 2)}`);
  };

  // --- UI RENDERING WITH LOADING/ERROR STATES ---
  if (isLoading) {
    return (
      <Page themeId="tool">
        <Header title="Loading Templates..." />
        <Content>
          <Box className={classes.loadingContainer}>
            <Progress /> {/* Backstage Progress component */}
            <Typography style={{ marginTop: '16px' }}>Fetching latest configurations...</Typography>
          </Box>
        </Content>
      </Page>
    );
  }

  if (error) {
    return (
      <Page themeId="tool">
        <Header title="Error" subtitle="Failed to load template configurations" />
        <Content>
          <Box className={classes.loadingContainer}>
            <ErrorIcon style={{ fontSize: 48, color: 'red' }} />
            <Typography variant="h6" style={{ marginTop: '16px', color: 'red' }}>
              Oops! Something went wrong.
            </Typography>
            <Typography style={{ color: '#ffcccb' }}>{error}</Typography>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: '20px' }}
              onClick={() => { // Basic retry, re-triggers useEffect if component re-mounts or key changes
                setIsLoading(true);
                setError(null);
                // For a true retry, you might need to extract the fetch logic
                // into a function that can be called again, or change a dependency in useEffect.
                // This simplistic retry relies on potentially re-triggering the initial fetch.
                // A better way is to have a dedicated refetch function.
                // For now, we'll just reset state to allow manual refresh or re-navigation.
                window.location.reload(); // Simplest form of "retry" for this example
              }}
            >
              Try Again
            </Button>
          </Box>
        </Content>
      </Page>
    );
  }

  return (
    <Page themeId="tool">
      <Header
        title={currentView === 'templateList' ? "My Awesome Templates" : selectedTemplate?.title || "Configure Template"}
        subtitle={currentView === 'templateList' ? "Browse and choose your deployment templates" : selectedTemplate?.description || "Set your options"}
      />
      <Content>
        {currentView === 'templateList' && (
          <>
            <Typography variant="h4" component="h1" className={classes.pageTitle}>
              Templates
            </Typography>
            <Grid container spacing={3} className={classes.root}>
              {templates.map((template) => ( // Use 'templates' from state
                <Grid item xs={12} sm={6} md={4} key={template.id}>
                  <TemplateCard
                    template={template}
                    onChoose={handleChooseTemplate}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {currentView === 'configure' && selectedTemplate && (
          <ConfigurationPage
            template={selectedTemplate}
            onBack={handleBackToTemplates}
            onReview={handleFinalReview}
            onCreate={handleCreateAction}
          />
        )}
      </Content>
    </Page>
  );
};

export default Visualizer;
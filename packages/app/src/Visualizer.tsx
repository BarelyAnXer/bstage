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
  CircularProgress,
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Content, Header, Page, Progress } from '@backstage/core-components';
import FilterListIcon from '@material-ui/icons/FilterList';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle'; // For success message

// Import js-yaml (still needed if backend sends YAML back for display, but not for generation here)

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
      backgroundColor: '#374151', // Darker card background
      color: '#F3F4F6', // Light gray text
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.divider}`,
    },
    cardHeader: {
      backgroundColor: '#10B981', // Emerald green header
      padding: theme.spacing(1.5, 2),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardHeaderText: {
      color: '#ffffff', // White text on header
    },
    cardCategory: {
      color: '#D1D5DB', // Lighter gray for category
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
      color: '#E5E7EB', // Slightly lighter gray for description
      fontSize: '0.875rem',
      padding: theme.spacing(2),
      paddingTop: theme.spacing(1.5),
    },
    cardActions: {
      padding: theme.spacing(1.5, 2),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: `1px solid ${theme.palette.grey[700]}`, // Darker border
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      color: '#9CA3AF', // Medium gray for user info
    },
    userAvatar: {
      marginRight: theme.spacing(1),
      width: theme.spacing(3),
      height: theme.spacing(3),
      color: '#9CA3AF',
    },
    chooseButton: {
      backgroundColor: '#4B5563', // Dark gray button
      color: '#ffffff',
      fontWeight: 'bold',
      '&:hover': {
        backgroundColor: '#374151', // Even darker on hover
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
      backgroundColor: '#2d3748', // Dark blue-gray for config page
      color: '#e2e8f0', // Off-white text
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
      color: '#a0aec0', // Lighter blue-gray for subtitle
      fontSize: '0.9rem',
    },
    stepper: {
      backgroundColor: 'transparent', // Stepper background matches page
      padding: theme.spacing(3, 0),
    },
    stepLabel: { // Combined Material-UI v4 approach for StepLabel styling
      '& .MuiStepLabel-label': {
        color: '#cbd5e0', // Light blue-gray for step label
        '&$active': { // Use $active for referring to active state class
          color: '#63b3ed', // Light blue for active step
          fontWeight: 'bold',
        },
        '&$completed': { // Use $completed for referring to completed state class
          color: '#48bb78', // Green for completed step
        },
      },
      '& .MuiStepIcon-root': {
        color: '#4a5568', // Darker icon color
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
      backgroundColor: '#374151', // Dark gray for form sections
      borderRadius: theme.shape.borderRadius,
    },
    formField: {
      marginBottom: theme.spacing(2.5),
      '& .MuiInputLabel-root, & .MuiFormControlLabel-label': {
        color: '#a0aec0', // Lighter blue-gray for labels
      },
      '& .MuiInputBase-input': {
        color: '#e2e8f0', // Off-white for input text
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#4a5568', // Darker border for input fields
        },
        '&:hover fieldset': {
          borderColor: '#63b3ed', // Light blue on hover
        },
        '&.Mui-focused fieldset': {
          borderColor: '#63b3ed', // Light blue when focused
        },
      },
      '& .MuiCheckbox-root': {
        color: '#63b3ed', // Light blue for checkbox
      },
      '& .MuiFormHelperText-root': {
        color: '#718096', // Medium blue-gray for helper text
      },
    },
    configActions: {
      marginTop: theme.spacing(4),
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center', // Align items for spinner and button
      gap: theme.spacing(2),
    },
    backButton: {
      backgroundColor: '#4A5568', // Medium Gray
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: '#2D3748', // Darker Gray-Blue
      },
    },
    nextButton: {
      backgroundColor: '#3B82F6', // Blue
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: '#2563EB', // Darker Blue
      },
    },
    createButton: { // Renamed to submitButton for clarity
      backgroundColor: '#10B981', // Emerald Green
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: '#059669', // Darker Emerald Green
      },
      '&.Mui-disabled': { // Style for disabled button
        backgroundColor: '#047857',
        color: '#a0aec0',
      }
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
      color: theme.palette.error.light, // Lighter red for dark theme
      display: 'flex',
      alignItems: 'center',
      marginRight: theme.spacing(2), // Space before buttons
      fontSize: '0.875rem',
    },
    successText: {
      color: theme.palette.success.light, // Lighter green for dark theme
      display: 'flex',
      alignItems: 'center',
      marginRight: theme.spacing(2),
      fontSize: '0.875rem',
    },
    actionFeedbackContainer: {
      display: 'flex',
      alignItems: 'center',
      marginTop: theme.spacing(2),
      width: '100%', // Ensure it takes full width to position content properly
    }
  }),
);

// --- Data Interfaces ---
interface ConfigField {
  id: string;
  label: string;
  defaultValue: string;
  helperText: string;
  type?: 'text' | 'select' | 'checkbox' | 'number'; // Added 'number'
  options?: string[];
  stepGroup: number; // 0 for basic config, 1 for advanced options/addons
}

interface TemplateData {
  id: string;
  category: string;
  title: string;
  description: string;
  user: string;
  configFields?: Array<ConfigField>;
  yamlKind?: string;
  yamlApiVersion?: string;
}

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


// --- TemplateCardProps and TemplateCard component (NO CHANGES) ---
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

// --- Configuration Page Component ---
interface ConfigurationPageProps {
  template: TemplateData;
  onBack: () => void;
  onReview: (configValues: Record<string, string>) => void;
  onSubmitConfiguration: (configValues: Record<string, string>) => void; // Renamed from onCreate
  isSubmitting: boolean; // New prop
  submitError: string | null; // New prop
  submitSuccessMessage: string | null; // New prop
}

const ConfigurationPage: React.FC<ConfigurationPageProps> = ({
  template,
  onBack,
  onReview,
  onSubmitConfiguration,
  isSubmitting,
  submitError,
  submitSuccessMessage,
}) => {
  const classes = useStyles();
  const steps = ['Configuration', 'Advanced Options', 'Review & Submit'];
  const [activeStep, setActiveStep] = useState(0);

  const initialFormValues = template.configFields?.reduce((acc, field) => {
    acc[field.id] = field.defaultValue;
    return acc;
  }, {} as Record<string, string>) || {};

  const [formValues, setFormValues] = useState<Record<string, string>>(initialFormValues);

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
      if (activeStep === steps.length - 2) { // About to go to Review step
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
    console.log("Final Configuration to be submitted to backend:", formValues);
    onSubmitConfiguration(formValues);
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

      <Stepper activeStep={activeStep} alternativeLabel className={classes.stepper}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              StepIconProps={{ classes: { root: classes.stepLabel, active: classes.stepLabel, completed: classes.stepLabel } }}
              classes={{ label: classes.stepLabel }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && ( // Basic Configuration
        <Box className={classes.formSection}>
          <Typography variant="h6" gutterBottom style={{ color: '#E5E7EB', marginBottom: '16px' }}>
            Basic Configuration Options
          </Typography>
          {renderFieldsForStep(0)}
        </Box>
      )}

      {activeStep === 1 && ( // Advanced Options / Addons
        <Box className={classes.formSection}>
          <Typography variant="h6" gutterBottom style={{ color: '#E5E7EB', marginBottom: '16px' }}>
            Advanced Options & Add-ons
          </Typography>
          {renderFieldsForStep(1)}
          {(!template.configFields?.some(f => f.stepGroup === 1)) &&
            <Typography style={{ color: '#a0aec0' }}>No advanced options or add-ons available for this template.</Typography>
          }
        </Box>
      )}

      {activeStep === steps.length - 1 && ( // Review Step
        <Box className={classes.formSection}>
          <Typography variant="h6" gutterBottom style={{ color: '#E5E7EB', marginBottom: '16px' }}>
            Review Your Configuration
          </Typography>
          {template.configFields?.map(field => (
            <Box key={field.id} mb={2}>
              <Typography variant="subtitle2" style={{ color: '#9CA3AF' }}>{field.label}:</Typography>
              <Typography variant="body1" style={{ color: '#F3F4F6' }}>
                {field.type === 'checkbox'
                  ? (formValues[field.id] === 'true' ? 'Enabled' : 'Disabled')
                  : (formValues[field.id] || field.defaultValue)}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Box className={classes.actionFeedbackContainer}>
        {submitError && (
          <Typography className={classes.errorText}>
            <ErrorIcon fontSize="small" style={{ marginRight: '8px' }} />
            Error: {submitError}
          </Typography>
        )}
        {submitSuccessMessage && !submitError && ( // Only show success if no error
           <Typography className={classes.successText}>
            <CheckCircleIcon fontSize="small" style={{ marginRight: '8px' }} />
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
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit to Create'}
            </Button>
            )}
        </Box>
      </Box>
    </Paper>
  );
};


// --- Initial Templates Data (Update with yamlKind and yamlApiVersion) ---
const initialTemplatesArray: TemplateData[] = [
  {
    id: 'azure-cluster',
    category: 'clusterdeployment',
    title: 'Azure Cluster Deployment',
    description: 'Deploys a Cluster resource for Azure using backend processing.',
    user: 'user:guest',
    yamlKind: 'ClusterDeployment',
    yamlApiVersion: 'hive.openshift.io/v1',
    configFields: [
      { id: 'clusterNameSuffix', label: 'Cluster Name Suffix', defaultValue: 'dev', helperText: 'Suffix for the cluster name (e.g., dev, prod)', type: 'text', stepGroup: 0 },
      { id: 'baseDomain', label: 'Base Domain', defaultValue: 'example.com', helperText: 'The base domain for the cluster.', type: 'text', stepGroup: 0 },
      { id: 'controlPlaneFlavor', label: 'Control Plane Machine Flavor', defaultValue: 'Standard_DS2_v2', helperText: 'Azure VM size for control plane nodes', type: 'text', stepGroup: 0 },
      { id: 'workerNodeFlavor', label: 'Worker Node Machine Flavor', defaultValue: 'Standard_D2_v2', helperText: 'Azure VM size for worker nodes', type: 'text', stepGroup: 0 },
    ],
  },
  {
    id: 'openstack-cluster',
    category: 'clusterdeployment',
    title: 'OpenStack Cluster Deployment',
    description: 'Deploys a Cluster resource for OpenStack using backend processing.',
    user: 'user:guest',
    yamlKind: 'ClusterDeployment',
    yamlApiVersion: 'hive.openshift.io/v1alpha1', // Example, adjust as needed
    configFields: [
      { id: 'clusterName', label: 'Cluster Name', defaultValue: 'my-openstack-cluster', helperText: 'Name of the OpenStack cluster', type: 'text', stepGroup: 0 },
      { id: 'nodeCount', label: 'Node Count', defaultValue: '3', helperText: 'Number of worker nodes', type: 'number', stepGroup: 0 },
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
  // --- NEW AWS K0RDENT CLUSTER TEMPLATE ---
  {
    id: 'aws-k0rdent-cluster',
    category: 'clusterdeployment',
    title: 'AWS k0rdent Cluster Deployment',
    description: 'Deploys a k0rdent.mirantis.com/v1alpha1 ClusterDeployment for AWS.',
    user: 'user:guest',
    yamlKind: 'ClusterDeployment',
    yamlApiVersion: 'k0rdent.mirantis.com/v1alpha1',
    configFields: [
      // Metadata fields
      { id: 'metadataName', label: 'ClusterDeployment Name', defaultValue: 'my-aws-clusterdeployment1', helperText: 'Name of the ClusterDeployment resource (metadata.name)', type: 'text', stepGroup: 0 },
      { id: 'metadataNamespace', label: 'Namespace', defaultValue: 'kcm-system', helperText: 'Namespace for the ClusterDeployment (metadata.namespace)', type: 'text', stepGroup: 0 },
      // Spec fields
      { id: 'specTemplate', label: 'Specification Template Name', defaultValue: 'aws-standalone-cp-0-2-0', helperText: 'Name of the template to use (spec.template)', type: 'text', stepGroup: 0 },
      { id: 'specCredential', label: 'Credential Name', defaultValue: 'aws-cluster-identity-cred', helperText: 'Credential to use for the cluster (spec.credential)', type: 'text', stepGroup: 0 },
      // Spec.config fields
      { id: 'specConfigRegion', label: 'AWS Region', defaultValue: 'us-east-2', helperText: 'AWS region for the cluster deployment (spec.config.region)', type: 'text', stepGroup: 0 },
      { id: 'specConfigControlPlaneInstanceType', label: 'Control Plane Instance Type', defaultValue: 't3.small', helperText: 'EC2 instance type for control plane nodes (spec.config.controlPlane.instanceType)', type: 'text', stepGroup: 0 },
      { id: 'specConfigWorkerInstanceType', label: 'Worker Node Instance Type', defaultValue: 't3.small', helperText: 'EC2 instance type for worker nodes (spec.config.worker.instanceType)', type: 'text', stepGroup: 0 },
      // Note: spec.config.clusterLabels is an empty object in the example YAML.
      // If it needs to be configurable, you could add a field like:
      // { id: 'specConfigClusterLabels', label: 'Cluster Labels (JSON string)', defaultValue: '{}', helperText: 'e.g., {"key": "value"}', type: 'text', stepGroup: 1 },
      // The backend would then need to parse this JSON string. For now, assuming it's defaulted to {} by the backend if not provided.
    ],
  },
];


// --- Main Visualizer Component ---
type View = 'templateList' | 'configure';

const BACKEND_API_ENDPOINT = 'http://localhost:7007/health/create-resource';

export const Visualizer = () => {
  const classes = useStyles();
  const [currentView, setCurrentView] = useState<View>('templateList');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);
  const [/*configurationValues*/, setConfigurationValues] = useState<Record<string, string> | null>(null); // Kept for review step logic

  const [templates, setTemplates] = useState<TemplateData[]>(initialTemplatesArray);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // New state for submission handling
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<string | null>(null);


  useEffect(() => {
    const fetchAddonsAndUpdateTemplates = async () => {
      setIsLoading(true);
      setError(null);
      setSubmitError(null); // Clear previous submission errors on reload
      setSubmitSuccessMessage(null); // Clear previous success messages

      try {
        // const response = await fetch('/api/proxy/my-plugin/health/liveness');
        const response = await fetch('http://localhost:7007/health/liveness');
        if (!response.ok) {
          throw new Error(`API request failed for addons: ${response.status} ${response.statusText}`);
        }
        const data: LivenessResponse = await response.json();
        console.log("Liveness check response (addons):", data);

        let addonConfigFields: ConfigField[] = [];

        if (data.processedEntities && data.processedEntities.length > 0) {
          addonConfigFields = data.processedEntities.map((app, index) => ({
            id: app.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `addon-${app.sourceUrl.split('/').pop()?.split('.')[0] || index}`,
            label: `${app.title || 'Unnamed Addon'} (Add-on)`,
            defaultValue: 'false',
            helperText: app.summary || app.description || `Enable or disable the ${app.title || 'addon'}.`,
            type: 'checkbox',
            stepGroup: 1, // Addons are typically in the "Advanced Options" step
          }));
        } else {
          console.log('No addon entities received from API or the list is empty.');
        }

        // Merge addons into existing templates - this logic might need adjustment
        // depending on how addons should be associated with specific templates.
        // For now, it adds fetched addons to the 'azure-cluster' template as an example.
        setTemplates(currentTemplates =>
          currentTemplates.map(template => {
            // Example: Only add these addons to specific templates like 'azure-cluster' or all templates
            if (template.id === 'azure-cluster' || template.id === 'aws-k0rdent-cluster') { // Decide which templates get these addons
              const baseConfigFields = template.configFields?.filter(
                field => !addonConfigFields.some(addon => addon.id === field.id) // Avoid duplicates
              ) || [];
              return {
                ...template,
                configFields: [...baseConfigFields, ...addonConfigFields],
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
        setIsLoading(false);
      }
    };

    fetchAddonsAndUpdateTemplates();
  }, []);


  const handleChooseTemplate = (template: TemplateData) => {
    const currentTemplateData = templates.find(t => t.id === template.id) || template;
    setSelectedTemplate(currentTemplateData);
    setCurrentView('configure');
    setConfigurationValues(null); // Clear old config values
    setSubmitError(null); // Clear previous submission errors
    setSubmitSuccessMessage(null); // Clear previous success messages
  };

  const handleBackToTemplates = () => {
    setSelectedTemplate(null);
    setCurrentView('templateList');
    setConfigurationValues(null);
    setSubmitError(null);
    setSubmitSuccessMessage(null);
  };

  const handleFinalReview = (configVals: Record<string, string>) => {
    console.log("Configuration ready for review:", configVals);
    setConfigurationValues(configVals);
    setSubmitError(null); // Clear errors when moving to review step
    setSubmitSuccessMessage(null);
  };

  // --- MODIFIED FUNCTION TO SEND DATA TO BACKEND ---
  const handleSubmitConfigurationAction = async (configVals: Record<string, string>) => {
    console.log("SUBMIT button clicked. Configuration to be sent to backend:", configVals);
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccessMessage(null);
    setConfigurationValues(configVals); // Store current config values

    if (!selectedTemplate) {
      setSubmitError('Error: No template selected. Cannot submit configuration.');
      console.error('No selectedTemplate for submission.');
      setIsSubmitting(false);
      return;
    }

    const processedConfig: Record<string, any> = {};
    const addons: Record<string, boolean> = {};

    selectedTemplate.configFields?.forEach(field => {
      const value = configVals[field.id];
      if (value === undefined) return; // Should not happen if formValues are initialized correctly

      let processedValue: any = value;
      if (field.type === 'checkbox') {
        processedValue = value === 'true';
      } else if (field.type === 'number') {
        const num = parseFloat(value);
        processedValue = isNaN(num) ? value : num; // Keep as string if not a valid number, or let backend validate
      }

      // Check if the field ID suggests it's an addon (e.g., fetched from liveness and marked as stepGroup 1)
      // This assumes addon fields are specifically identifiable or all stepGroup 1 checkboxes are addons.
      const isPotentiallyAddon = field.id.startsWith('addon-') || (field.label && field.label.includes('(Add-on)'));

      if (field.stepGroup === 1 && field.type === 'checkbox' && isPotentiallyAddon) {
        if (processedValue === true) { // Only include enabled addons
           // Clean up addon ID for the key if necessary, or use the raw field.id
           // This part depends on how the backend expects addon keys.
           // Using a simple approach for now:
           const addonKey = field.id.replace(/^addon-/i, '').replace(/\s+/g, '-').toLowerCase();
          addons[addonKey] = true;
        }
      } else {
        processedConfig[field.id] = processedValue;
      }
    });

    const payload = {
      templateId: selectedTemplate.id,
      templateApiVersion: selectedTemplate.yamlApiVersion || 'v1', // Default if not specified
      templateKind: selectedTemplate.yamlKind || 'CustomResource', // Default if not specified
      configuration: processedConfig, // This will contain keys like 'metadataName', 'specConfigRegion' etc.
      addons: addons,
    };

    console.log("Payload to send to backend:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(BACKEND_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json(); // Try to parse JSON regardless of status for more info

      if (!response.ok) {
        // Use message from backend if available, otherwise default error
        const errorMsg = responseData?.message || responseData?.error || `Request failed with status ${response.status}`;
        throw new Error(errorMsg);
      }

      console.log('Backend submission successful:', responseData);
      setSubmitSuccessMessage(responseData.message || 'Configuration submitted successfully!');
      // Example: if (responseData.yaml) { setGeneratedYamlForDisplay(responseData.yaml); }

    } catch (e) {
      const message = e instanceof Error ? e.message : 'An unknown error occurred during submission.';
      console.error('Error submitting configuration to backend:', message);
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };


  // --- UI RENDERING WITH LOADING/ERROR STATES ---
  if (isLoading) {
    return (
      <Page themeId="tool">
        <Header title="Loading Templates..." />
        <Content>
          <Box className={classes.loadingContainer}>
            <Progress />
            <Typography style={{ marginTop: '16px' }}>Fetching latest configurations...</Typography>
          </Box>
        </Content>
      </Page>
    );
  }

  if (error && !isLoading) { // Ensure error is shown only if not in initial loading
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
              onClick={() => {
                // A simple way to retry is to reload the page, triggering the useEffect again.
                window.location.reload();
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
        title={currentView === 'templateList' ? "K0rdent Tempaltes" : selectedTemplate?.title || "Configure Template"}
        subtitle={currentView === 'templateList' ? "Browse and choose your templates" : selectedTemplate?.description || "Set your options"}
      />
      <Content>
        {currentView === 'templateList' && (
          <>
            <Typography variant="h4" component="h1" className={classes.pageTitle}>
              Templates
            </Typography>
            <Grid container spacing={3} className={classes.root}>
              {templates.map((template) => (
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
            onSubmitConfiguration={handleSubmitConfigurationAction} // Updated prop name
            isSubmitting={isSubmitting}
            submitError={submitError}
            submitSuccessMessage={submitSuccessMessage}
          />
        )}
      </Content>
    </Page>
  );
};

export default Visualizer;
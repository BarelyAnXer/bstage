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
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Content, Header, Page } from '@backstage/core-components';
import FilterListIcon from '@material-ui/icons/FilterList';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import * as yaml from 'js-yaml';

const readLocation = async () => {
  const target = "https://github.com/k0rdent/catalog/blob/main/apps"

  try {
    const urls = await discoverYamlFiles(target);
    // this.logger.info(`Found ${urls.length} YAML files to process`);
    console.log(urls)
    for (const url of urls) {
      // this.logger.info(`Processing file: ${url}`);

      // Process the actual YAML instead of using a hardcoded entity
      const entity = await fetchAndProcessYaml(url);
      console.log(entity)

      // Only emit if we got a valid entity back (not null)
      // if (entity) {
      //   this.logger.info(`Emitting entity: ${entity.metadata.name}`);
      //   // emit(processingResult.entity(location, entity));
      // } else {
      //   this.logger.info(`Skipping entity from ${url} (returned null)`);
      // }
    }
    return true;
  } catch (errro: any) {
    // console.log(`Failed to read location ${location.target}, ${error}`)
    return false;
  }
  // throw error;
}

const fetchAndProcessYaml = async (url: string) => {
  const githubToken = "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"
  const headers: Record<string, string> = {};
  if (githubToken) {
    headers.Authorization = `token ${githubToken}`;
  }
  // this.logger.debug(`Fetching YAML from ${url}`);
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  let data;
  try {
    data = yaml.load(text);
    if (!data || typeof data !== 'object') {
      // this.logger.warn(`Skipping ${url}: YAML content is invalid`);
      return null;
    }
  } catch (error) {
    // this.logger.warn(`Skipping ${url}: YAML parsing failed - ${error}`);
    return null;
  }

  // Type assertion to handle the type check
  const typedData = data as { type?: string };
  if (typedData.type === 'infra') {
    // this.logger.info(`Skipping ${url}: YAML is of type 'infra'`);
    return null;
  }

  if (!data || typeof data !== 'object') {
    throw new Error(`Invalid YAML content in ${url}`);
  }

  // const entity = this.ensureEntityCompatibility(data, url);
  const entity = data
  return entity;
}




// Reads github url and returns all the YAML URLS 
const discoverYamlFiles = async (target: string) => {
  const githubToken = "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"
  const urlParts = parseGitHubUrl(target);

  console.log(urlParts)
  if (!urlParts) {
    throw new Error(`Invalid GitHub URL: ${target}`);
  }

  const { owner, repo, path } = urlParts;
  let { branch } = urlParts;

  branch = "main"
  // Construct GitHub API URL
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;


  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (githubToken) {
      headers.Authorization = `token ${githubToken}`;
    }

    // this.logger.debug(`Fetching GitHub tree from ${apiUrl}`);
    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API request failed: ${response.status} ${error}`);
    }

    const data = await response.json();

    // Filter for YAML files
    const yamlFiles = data.tree
      .filter((item: { path: string; type: string }) => {
        const itemPath = item.path;
        if (!itemPath.startsWith(path)) {
          return false;
        }

        return itemPath.endsWith("data.yaml");
      })
      .map((item: { path: string }) =>
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${item.path}`
      );

    // this.logger.info(`Found ${yamlFiles.length} YAML files in ${target}`);
    return yamlFiles;

  } catch (error) {
    // this.logger.error(`Failed to discover YAML files: ${error}`);
    throw error;
  }
}

// Parse github URLS from the main URL
const parseGitHubUrl = (url: string): { owner: string; repo: string; branch: string; path: string } | null => {
  // Handle both blob and tree URLs
  const blobPattern = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/(?:blob|tree)\/([^\/]+)(?:\/(.*))?$/;
  const match = url.match(blobPattern);

  if (!match) {
    return null;
  }

  const [, owner, repo, branch, path = ''] = match;
  return { owner, repo, branch, path };
}

// Define custom styles
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
      backgroundColor: '#374151', // Slightly lighter dark background for the card (Tailwind gray-700)
      color: '#F3F4F6', // Tailwind gray-100 for text
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.divider}`, // Subtle border
    },
    cardHeader: {
      backgroundColor: '#10B981', // Emerald-500 (a vibrant green)
      padding: theme.spacing(1.5, 2), // Adjusted padding
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardHeaderText: {
      color: '#ffffff',
    },
    cardCategory: {
      color: '#D1D5DB', // Tailwind gray-300
      fontSize: '0.75rem', // Smaller category text
      marginBottom: theme.spacing(0.5),
      textTransform: 'uppercase',
    },
    cardTitle: {
      fontWeight: 'bold',
      fontSize: '1.125rem', // Slightly larger title
      color: '#ffffff',
    },
    cardDescription: {
      flexGrow: 1,
      color: '#E5E7EB', // Tailwind gray-200
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
      color: '#9CA3AF', // Tailwind gray-400
    },
    userAvatar: {
      marginRight: theme.spacing(1),
      width: theme.spacing(3),
      height: theme.spacing(3),
      color: '#9CA3AF', // Tailwind gray-400
    },
    chooseButton: {
      backgroundColor: '#4B5563', // Tailwind gray-600
      color: '#ffffff',
      fontWeight: 'bold',
      '&:hover': {
        backgroundColor: '#374151', // Tailwind gray-700
      },
    },
    iconButton: {
      color: '#E5E7EB', // Tailwind gray-200
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
    // Styles for Configuration Page
    configPageContainer: {
      padding: theme.spacing(3),
      backgroundColor: '#2d3748', // Darker background for the page content area
      color: '#e2e8f0', // Lighter text color
      borderRadius: theme.shape.borderRadius,
    },
    configHeader: {
      marginBottom: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      borderBottom: `1px solid ${theme.palette.grey[700]}`,
    },
    configTitle: {
      fontWeight: 'bold',
      color: '#ffffff', // White title
    },
    configSubtitle: {
      color: '#a0aec0', // Lighter subtitle
      fontSize: '0.9rem',
    },
    stepper: {
      backgroundColor: 'transparent', // Make stepper background transparent
      padding: theme.spacing(3, 0),
    },
    stepLabel: {
      '& .MuiStepLabel-label': {
        color: '#cbd5e0', // Lighter label color
        '&$active': {
          color: '#63b3ed', // Active step color (e.g., blue)
          fontWeight: 'bold',
        },
        '&$completed': {
          color: '#48bb78', // Completed step color (e.g., green)
        },
      },
      '& .MuiStepIcon-root': {
        color: '#4a5568', // Default icon color
        '&$active': {
          color: '#63b3ed', // Active icon color
        },
        '&$completed': {
          color: '#48bb78', // Completed icon color
        },
      },
      active: {}, // Needed for MuiStepLabel-label active state
      completed: {}, // Needed for MuiStepLabel-label completed state
    },
    formSection: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(2),
      backgroundColor: '#374151', // Card-like background for form sections
      borderRadius: theme.shape.borderRadius,
    },
    formField: {
      marginBottom: theme.spacing(2.5),
      '& .MuiInputLabel-root': {
        color: '#a0aec0', // Label color
      },
      '& .MuiInputBase-input': {
        color: '#e2e8f0', // Input text color
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#4a5568', // Border color
        },
        '&:hover fieldset': {
          borderColor: '#63b3ed', // Border color on hover
        },
        '&.Mui-focused fieldset': {
          borderColor: '#63b3ed', // Border color when focused
        },
      },
      '& .MuiFormHelperText-root': {
        color: '#718096', // Helper text color
      },
    },
    configActions: {
      marginTop: theme.spacing(4),
      display: 'flex',
      justifyContent: 'flex-end', // Align buttons to the right
      gap: theme.spacing(2), // Spacing between buttons
    },
    backButton: {
      backgroundColor: '#4A5568', // Tailwind gray-600
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: '#2D3748', // Tailwind gray-800
      },
    },
    reviewButton: {
      backgroundColor: '#3B82F6', // Tailwind blue-500
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: '#2563EB', // Tailwind blue-600
      },
    },
  }),
);

// --- Data Interfaces ---
interface TemplateData {
  id: string; // Unique ID for the template
  category: string;
  title: string;
  description: string;
  user: string;
  // Fields specific to configuration, matching the image
  configFields?: Array<{
    id: string;
    label: string;
    defaultValue: string;
    helperText: string;
    type?: string; // e.g., 'text', 'select'
    options?: string[]; // for select type
  }>;
}

interface TemplateCardProps {
  template: TemplateData;
  onChoose: (template: TemplateData) => void;
}

// --- Template Card Component ---
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
  onReview: (configValues: Record<string, string>) => void; // Callback for when review is clicked
}

const ConfigurationPage: React.FC<ConfigurationPageProps> = ({ template, onBack, onReview }) => {
  const classes = useStyles();
  const steps = ['Configuration and Options', 'Review']; // Stepper steps
  const [activeStep, setActiveStep] = useState(0); // Current active step

  // Initialize form values from template's default values
  const initialFormValues = template.configFields?.reduce((acc, field) => {
    acc[field.id] = field.defaultValue;
    return acc;
  }, {} as Record<string, string>) || {};

  const [formValues, setFormValues] = useState<Record<string, string>>(initialFormValues);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleReview = () => {
    // Here you would typically validate the formValues
    console.log("Configuration Values:", formValues);
    onReview(formValues); // Pass the values to the parent or next step
    setActiveStep(1); // Move to review step (or handle actual review logic)
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
            <StepLabel StepIconProps={{ classes: { root: classes.stepLabel, active: classes.stepLabel, completed: classes.stepLabel } }} classes={{ label: classes.stepLabel, active: classes.stepLabel, completed: classes.stepLabel }}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box className={classes.formSection}>
          <Typography variant="h6" gutterBottom style={{ color: '#E5E7EB', marginBottom: '16px' }}>
            Azure Cluster Configuration and Options
          </Typography>
          {template.configFields?.map(field => (
            <TextField
              key={field.id}
              name={field.id}
              label={field.label}
              defaultValue={field.defaultValue} // Use defaultValue for uncontrolled, or value for controlled
              variant="outlined"
              fullWidth
              className={classes.formField}
              helperText={field.helperText}
              onChange={handleInputChange}
            // Add select logic if field.type === 'select'
            />
          ))}
        </Box>
      )}

      {activeStep === 1 && (
        <Box className={classes.formSection}>
          <Typography variant="h6" gutterBottom style={{ color: '#E5E7EB', marginBottom: '16px' }}>
            Review Your Configuration
          </Typography>
          {template.configFields?.map(field => (
            <Box key={field.id} mb={2}>
              <Typography variant="subtitle2" style={{ color: '#9CA3AF' }}>{field.label}:</Typography>
              <Typography variant="body1" style={{ color: '#F3F4F6' }}>{formValues[field.id] || field.defaultValue}</Typography>
            </Box>
          ))}
          {/* Add more review details as needed */}
        </Box>
      )}


      <Box className={classes.configActions}>
        <Button
          variant="contained"
          className={classes.backButton}
          onClick={activeStep === 0 ? onBack : () => setActiveStep(0)} // Go back to template list or previous step
          startIcon={<ArrowBackIcon />}
        >
          {activeStep === 0 ? 'Back to Templates' : 'Back to Edit'}
        </Button>
        {activeStep === 0 && (
          <Button
            variant="contained"
            className={classes.reviewButton}
            onClick={handleReview}
          >
            Review
          </Button>
        )}
        {activeStep === 1 && (
          <Button
            variant="contained"
            color="primary" // Or your theme's primary color for "Create" or "Deploy"
          // onClick={handleCreate} // Implement create/deploy logic
          >
            Create
          </Button>
        )}
      </Box>
    </Paper>
  );
};


// --- Main Visualizer Component ---
type View = 'templateList' | 'configure';

export const Visualizer = () => {
  const classes = useStyles();
  const [currentView, setCurrentView] = useState<View>('templateList');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);
  const [configurationValues, setConfigurationValues] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('http://localhost:7007/health/liveness');
        
        // Check if the response is OK
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Parse the response as JSON
        const data = await response.json();
        console.log(data, "hello");
      } catch (error) {
        console.error("Error fetching readiness:", error);
      }
    };
    
    checkHealth();
  }, []);


  const templates: TemplateData[] = [
    {
      id: 'azure-cluster',
      category: 'clusterdeployment',
      title: 'Azure Cluster Deployment',
      description: 'Generates a ClusterDeployment resource for Azure',
      user: 'user:guest',
      configFields: [
        { id: 'clusterNameSuffix', label: 'Cluster Name Suffix', defaultValue: 'dev', helperText: 'Suffix for the cluster name (e.g., dev, prod)' },
        { id: 'controlPlaneFlavor', label: 'Control Plane Machine Flavor', defaultValue: 'Standard_DS2_v2', helperText: 'Azure VM size for control plane nodes (e.g., Standard_DS2_v2)' },
        { id: 'workerNodeFlavor', label: 'Worker Node Machine Flavor', defaultValue: 'Standard_D2_v2', helperText: 'Azure VM size for worker nodes (e.g., Standard_D2_v2)' },
      ],
    },
    {
      id: 'openstack-cluster',
      category: 'clusterdeployment',
      title: 'OpenStack Cluster Deployment',
      description: 'Generates a ClusterDeployment resource for OpenStack',
      user: 'user:guest',
      configFields: [ // Example fields for OpenStack
        { id: 'clusterName', label: 'Cluster Name', defaultValue: 'my-openstack-cluster', helperText: 'Name of the OpenStack cluster' },
        { id: 'nodeCount', label: 'Node Count', defaultValue: '3', helperText: 'Number of worker nodes' },
      ],
    },
  ];

  const handleChooseTemplate = (template: TemplateData) => {
    setSelectedTemplate(template);
    setCurrentView('configure');
  };

  const handleBackToTemplates = () => {
    setSelectedTemplate(null);
    setCurrentView('templateList');
    setConfigurationValues(null); // Clear config values when going back
  };

  const handleReviewConfig = (configVals: Record<string, string>) => {
    console.log("Final Configuration to be submitted:", configVals);
    setConfigurationValues(configVals);
    // Potentially navigate to a final summary or trigger an action
    // For now, the ConfigurationPage handles its own "Review" step display
  };


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
            onReview={handleReviewConfig}
          />
        )}
      </Content>
    </Page>
  );
};

export default Visualizer;

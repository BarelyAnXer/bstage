import { useEffect, useState } from 'react';
import { Grid, Typography, Button, Box } from '@material-ui/core';
import useStyles from './Visualizer.styles';
import { Content, Header, Page, Progress } from '@backstage/core-components';
import ErrorIcon from '@material-ui/icons/Error';
import { initialTemplatesArray } from './VisualizerData';
import { VisualizerTemplateCard } from './VisualizerTemplateCard';
import { ConfigurationPage } from './ConfigurationPage';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

// --- Main Visualizer Component ---
type View = 'templateList' | 'configure';

export const Visualizer = () => {
  const classes = useStyles();
  const [currentView, setCurrentView] = useState<View>('templateList');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(
    null,
  );
  const [, /*configurationValues*/ setConfigurationValues] = useState<Record<
    string,
    string
  > | null>(null); // Kept for review step logic

  const [templates, setTemplates] = useState<TemplateData[]>(
    initialTemplatesArray,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // New state for submission handling
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<
    string | null
  >(null);

  const configApi = useApi(configApiRef);
  const backendUrl = configApi.getString('backend.baseUrl');

  const BACKEND_API_ENDPOINT = `${backendUrl}/health/create-resource`;

  useEffect(() => {
    const fetchAddonsAndUpdateTemplates = async () => {
      setIsLoading(true);
      setError(null);
      setSubmitError(null); // Clear previous submission errors on reload
      setSubmitSuccessMessage(null); // Clear previous success messages

      const response = await fetch(`${backendUrl}/health/pods`);
      console.log(response.json(), 'here');

      try {
        const response = await fetch(`${backendUrl}/health/liveness`);
        if (!response.ok) {
          throw new Error(
            `API request failed for addons: ${response.status} ${response.statusText}`,
          );
        }
        const data: LivenessResponse = await response.json();
        console.log('Liveness check response (addons):', data);

        let addonConfigFields: ConfigField[] = [];

        if (data.processedEntities && data.processedEntities.length > 0) {
          addonConfigFields = data.processedEntities.map((app, index) => ({
            id:
              app.title
                ?.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '') ||
              `addon-${app.sourceUrl.split('/').pop()?.split('.')[0] || index}`,
            label: `${app.title || 'Unnamed Addon'}`,
            defaultValue: 'false',
            helperText:
              app.summary ||
              app.description ||
              `Enable or disable the ${app.title || 'addon'}.`,
            type: 'checkbox',
            stepGroup: 1, // Addons are typically in the "Advanced Options" step
          }));
        } else {
          console.log(
            'No addon entities received from API or the list is empty.',
          );
        }

        // Merge addons into existing templates - this logic might need adjustment
        // depending on how addons should be associated with specific templates.
        // For now, it adds fetched addons to the 'azure-cluster' template as an example.
        setTemplates(currentTemplates =>
          currentTemplates.map(template => {
            // Example: Only add these addons to specific templates like 'azure-cluster' or all templates
            if (
              template.id === 'azure-cluster' ||
              template.id === 'aws-k0rdent-cluster'
            ) {
              // Decide which templates get these addons
              const baseConfigFields =
                template.configFields?.filter(
                  field =>
                    !addonConfigFields.some(addon => addon.id === field.id), // Avoid duplicates
                ) || [];
              return {
                ...template,
                configFields: [...baseConfigFields, ...addonConfigFields],
              };
            }
            return template;
          }),
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'An unknown error occurred while fetching addons.';
        console.error('Error fetching or processing addon data:', message);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddonsAndUpdateTemplates();
  }, []);

  const handleChooseTemplate = (template: TemplateData) => {
    const currentTemplateData =
      templates.find(t => t.id === template.id) || template;
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
    console.log('Configuration ready for review:', configVals);
    setConfigurationValues(configVals);
    setSubmitError(null); // Clear errors when moving to review step
    setSubmitSuccessMessage(null);
  };

  // --- MODIFIED FUNCTION TO SEND DATA TO BACKEND ---
  const handleSubmitConfigurationAction = async (
    configVals: Record<string, string>,
  ) => {
    console.log(
      'SUBMIT button clicked. Configuration to be sent to backend:',
      configVals,
    );
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccessMessage(null);
    setConfigurationValues(configVals); // Store current config values

    if (!selectedTemplate) {
      setSubmitError(
        'Error: No template selected. Cannot submit configuration.',
      );
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
      const isPotentiallyAddon =
        field.id.startsWith('addon-') ||
        (field.label && field.label.includes('(Add-on)'));

      if (
        field.stepGroup === 1 &&
        field.type === 'checkbox' &&
        isPotentiallyAddon
      ) {
        if (processedValue === true) {
          // Only include enabled addons
          // Clean up addon ID for the key if necessary, or use the raw field.id
          // This part depends on how the backend expects addon keys.
          // Using a simple approach for now:
          const addonKey = field.id
            .replace(/^addon-/i, '')
            .replace(/\s+/g, '-')
            .toLowerCase();
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

    console.log(
      'Payload to send to backend:',
      JSON.stringify(payload, null, 2),
    );

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
        const errorMsg =
          responseData?.message ||
          responseData?.error ||
          `Request failed with status ${response.status}`;
        throw new Error(errorMsg);
      }

      console.log('Backend submission successful:', responseData);
      setSubmitSuccessMessage(
        responseData.message || 'Configuration submitted successfully!',
      );
      // Example: if (responseData.yaml) { setGeneratedYamlForDisplay(responseData.yaml); }
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : 'An unknown error occurred during submission.';
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
            <Typography style={{ marginTop: '16px' }}>
              Fetching latest configurations...
            </Typography>
          </Box>
        </Content>
      </Page>
    );
  }

  if (error && !isLoading) {
    // Ensure error is shown only if not in initial loading
    return (
      <Page themeId="tool">
        <Header
          title="Error"
          subtitle="Failed to load template configurations"
        />
        <Content>
          <Box className={classes.loadingContainer}>
            <ErrorIcon style={{ fontSize: 48, color: 'red' }} />
            <Typography
              variant="h6"
              style={{ marginTop: '16px', color: 'red' }}
            >
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
        title={
          currentView === 'templateList'
            ? 'K0rdent Templates'
            : selectedTemplate?.title || 'Configure Template'
        }
        subtitle={
          currentView === 'templateList'
            ? 'Browse and choose your templates'
            : selectedTemplate?.description || 'Set your options'
        }
      />
      <Content>
        {currentView === 'templateList' && (
          <>
            <Typography
              variant="h4"
              component="h1"
              className={classes.pageTitle}
            >
              Templates
            </Typography>

            <Grid container spacing={3} className={classes.root}>
              {templates.map(template => (
                <Grid item xs={12} sm={6} md={4} key={template.id}>
                  <VisualizerTemplateCard
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

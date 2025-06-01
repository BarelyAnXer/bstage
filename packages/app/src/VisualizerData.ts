export const initialTemplatesArray: TemplateData[] = [
  {
    id: 'azure-cluster',
    category: 'clusterdeployment',
    title: 'Azure Cluster Deployment',
    description:
      'Deploys a Cluster resource for Azure using backend processing.',
    user: 'user:guest',
    yamlKind: 'ClusterDeployment',
    yamlApiVersion: 'hive.openshift.io/v1',
    configFields: [
      {
        id: 'clusterNameSuffix',
        label: 'Cluster Name Suffix',
        defaultValue: 'dev',
        helperText: 'Suffix for the cluster name (e.g., dev, prod)',
        type: 'text',
        stepGroup: 0,
      },
      {
        id: 'baseDomain',
        label: 'Base Domain',
        defaultValue: 'example.com',
        helperText: 'The base domain for the cluster.',
        type: 'text',
        stepGroup: 0,
      },
      {
        id: 'controlPlaneFlavor',
        label: 'Control Plane Machine Flavor',
        defaultValue: 'Standard_DS2_v2',
        helperText: 'Azure VM size for control plane nodes',
        type: 'text',
        stepGroup: 0,
      },
      {
        id: 'workerNodeFlavor',
        label: 'Worker Node Machine Flavor',
        defaultValue: 'Standard_D2_v2',
        helperText: 'Azure VM size for worker nodes',
        type: 'text',
        stepGroup: 0,
      },
    ],
  },
  {
    id: 'openstack-cluster',
    category: 'clusterdeployment',
    title: 'OpenStack Cluster Deployment',
    description:
      'Deploys a Cluster resource for OpenStack using backend processing.',
    user: 'user:guest',
    yamlKind: 'ClusterDeployment',
    yamlApiVersion: 'hive.openshift.io/v1alpha1', // Example, adjust as needed
    configFields: [
      {
        id: 'clusterName',
        label: 'Cluster Name',
        defaultValue: 'my-openstack-cluster',
        helperText: 'Name of the OpenStack cluster',
        type: 'text',
        stepGroup: 0,
      },
      {
        id: 'nodeCount',
        label: 'Node Count',
        defaultValue: '3',
        helperText: 'Number of worker nodes',
        type: 'number',
        stepGroup: 0,
      },
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
    description:
      'Deploys a k0rdent.mirantis.com/v1alpha1 ClusterDeployment for AWS.',
    user: 'user:guest',
    yamlKind: 'ClusterDeployment',
    yamlApiVersion: 'k0rdent.mirantis.com/v1alpha1',
    configFields: [
      // Metadata fields
      {
        id: 'metadataName',
        label: 'ClusterDeployment Name',
        defaultValue: 'my-aws-clusterdeployment1',
        helperText: 'Name of the ClusterDeployment resource (metadata.name)',
        type: 'text',
        stepGroup: 0,
      },
      // Spec fields
      {
        id: 'specTemplate',
        label: 'Specification Template Name',
        defaultValue: 'aws-standalone-cp-0-2-0',
        helperText: 'Name of the template to use (spec.template)',
        type: 'text',
        stepGroup: 0,
      },
      {
        id: 'specCredential',
        label: 'Credential Name',
        defaultValue: 'aws-cluster-identity-cred',
        helperText: 'Credential to use for the cluster (spec.credential)',
        type: 'text',
        stepGroup: 0,
      },
      // Spec.config fields
      {
        id: 'specConfigRegion',
        label: 'AWS Region',
        defaultValue: 'us-east-2',
        helperText:
          'AWS region for the cluster deployment (spec.config.region)',
        type: 'text',
        stepGroup: 0,
      },
      {
        id: 'specConfigControlPlaneInstanceType',
        label: 'Control Plane Instance Type',
        defaultValue: 't3.small',
        helperText:
          'EC2 instance type for control plane nodes (spec.config.controlPlane.instanceType)',
        type: 'text',
        stepGroup: 0,
      },
      {
        id: 'specConfigWorkerInstanceType',
        label: 'Worker Node Instance Type',
        defaultValue: 't3.small',
        helperText:
          'EC2 instance type for worker nodes (spec.config.worker.instanceType)',
        type: 'text',
        stepGroup: 0,
      },
      // Note: spec.config.clusterLabels is an empty object in the example YAML.
      // If it needs to be configurable, you could add a field like:
      // { id: 'specConfigClusterLabels', label: 'Cluster Labels (JSON string)', defaultValue: '{}', helperText: 'e.g., {"key": "value"}', type: 'text', stepGroup: 1 },
      // The backend would then need to parse this JSON string. For now, assuming it's defaulted to {} by the backend if not provided.
    ],
  },
];

export const staticRegions: Region[] = [
  { code: 'us-east-1', name: 'US East (N. Virginia)' },
  { code: 'us-east-2', name: 'US East (Ohio)' },
  { code: 'us-west-1', name: 'US West (N. California)' },
  { code: 'us-west-2', name: 'US West (Oregon)' },
  { code: 'af-south-1', name: 'Africa (Cape Town)' },
  { code: 'ap-east-1', name: 'Asia Pacific (Hong Kong)' },
  { code: 'ap-south-1', name: 'Asia Pacific (Mumbai)' },
  { code: 'ap-northeast-3', name: 'Asia Pacific (Osaka)' },
  { code: 'ap-northeast-2', name: 'Asia Pacific (Seoul)' },
  { code: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' },
  { code: 'ap-southeast-2', name: 'Asia Pacific (Sydney)' },
  { code: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)' },
  { code: 'ca-central-1', name: 'Canada (Central)' },
  { code: 'eu-central-1', name: 'Europe (Frankfurt)' },
  { code: 'eu-west-1', name: 'Europe (Ireland)' },
  { code: 'eu-west-2', name: 'Europe (London)' },
  { code: 'eu-south-1', name: 'Europe (Milan)' },
  { code: 'eu-west-3', name: 'Europe (Paris)' },
  { code: 'eu-north-1', name: 'Europe (Stockholm)' },
  { code: 'me-south-1', name: 'Middle East (Bahrain)' },
  { code: 'sa-east-1', name: 'South America (São Paulo)' },
];

export const instanceTypes: VisualizerInstanceType[] = [
  { type: 't2.micro', description: 'General Purpose - Micro Instance' },
  {
    type: 't3.micro',
    description: 'General Purpose - Micro Instance (Burstable)',
  },
  { type: 't3a.micro', description: 'General Purpose -  AMD Micro Instance' },
  { type: 'm5.large', description: 'General Purpose - Large Instance' },
  { type: 'c5.large', description: 'Compute Optimized - Large Instance' },
  { type: 'r5.large', description: 'Memory Optimized - Large Instance' },
  {
    type: 'c6g.medium',
    description: 'Compute Optimized - ARM Medium Instance',
  },
  { type: 'm6i.large', description: 'General Purpose - Intel Large Instance' },
  { type: 'r6g.large', description: 'Memory Optimized - ARM Large Instance' },
  { type: 'g4dn.xlarge', description: 'Accelerated Computing - GPU Instance' },
];

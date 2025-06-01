export const initialTemplatesArray: TemplateData[] = [
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
    ]
  },
];
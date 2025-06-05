import * as k8s from '@kubernetes/client-node';

// TODO update this code to work if installed in cluster
const kc = new k8s.KubeConfig();
kc.loadFromDefault(); // Uses ~/.kube/config by default
// const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const customObjectsApi = kc.makeApiClient(k8s.CustomObjectsApi);

export async function listPods(): Promise<string[]> {
  const namespace = 'kcm-system';
  const group = 'hmc.mirantis.com';
  const version = 'v1alpha1'; 
  const plural = 'clustertemplates';
  try {
    const res = await customObjectsApi.listNamespacedCustomObject({
      group,
      version,
      namespace,
      plural,
    });

    console.log(res.body);

    // Cast to any since CRD structure varies
    const items = (res.body as any).items || [];
    return items.map((item: any) => ({
      name: item.metadata?.name ?? 'Unnamed Resource',
      namespace: item.metadata?.namespace,
      kind: item.kind,
      // Add any other fields you need from the CRD
      spec: item.spec,
      status: item.status,
    }));
  } catch (err) {
    console.error('Error fetching custom resources:', err);
    throw err;
  }
}

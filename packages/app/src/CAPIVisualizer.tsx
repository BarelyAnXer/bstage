import { useApi } from '@backstage/core-plugin-api';
import { configApiRef } from '@backstage/core-plugin-api';

export const CAPIVisualizer = () => {
  const configApi = useApi(configApiRef);
  const apiUrl = configApi.getOptionalString('capi.baseUrl');

  return (
    <div>
      <p>API URL: {apiUrl}</p>
      <iframe
        src={apiUrl}
        width="100%"
        height="820"
        style={{ border: '1px solid black' }}
        title="CAPI Visualizer"
      />
    </div>
  );
};

export default CAPIVisualizer;

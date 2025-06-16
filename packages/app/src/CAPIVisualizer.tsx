export const CAPIVisualizer = () => {
  // Use backend proxy for CAPI Visualizer
  // This works in both development and production:
  // - Development: proxies to http://localhost:8081
  // - Production: proxies to http://capi-visualizer.default.svc.cluster.local:8081
  const capiVisualizerUrl = '/api/proxy/capi-visualizer/';

  return (
    <div>
      <iframe
        src={capiVisualizerUrl}
        width="100%"
        height="820"
        style={{ border: "1px solid black" }}
        title="CAPI Visualizer"
      />
    </div>
  );
};

export default CAPIVisualizer;
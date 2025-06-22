// Example: plugins/your-plugin-name/src/config.d.ts

export interface Config {
  // This block for opencost is likely already correct
  opencost?: {
    /**
     * @visibility frontend
     */
    baseUrl: string;
  };

  capi?: {
    /**
     * The base URL for the CAPI visualizer.
     * @visibility frontend
     */
    baseUrl: string;
  };
}
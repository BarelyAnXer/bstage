interface ConfigField {
  id: string;
  label: string;
  defaultValue: string;
  helperText: string;
  type?: 'text' | 'select' | 'checkbox' | 'number' | 'dropdown';
  options?: ConfigFieldOption[];
  stepGroup: number;
}

interface ConfigFieldOption {
  value: string;
  label: string;
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

interface ConfigurationPageProps {
  template: TemplateData;
  onBack: () => void;
  onReview: (configValues: Record<string, string>) => void;
  onSubmitConfiguration: (configValues: Record<string, string>) => void; // Renamed from onCreate
  isSubmitting: boolean; // New prop
  submitError: string | null; // New prop
  submitSuccessMessage: string | null; // New prop
}

interface Region {
  code: string;
  name: string;
}

interface VisualizerInstanceType {
  type: string;
  description: string;
}

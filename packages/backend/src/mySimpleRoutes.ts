import { coreServices, createBackendPlugin } from '@backstage/backend-plugin-api';
import { Router } from 'express';
import * as yaml from 'js-yaml';

export const healthPlugin = createBackendPlugin({
  pluginId: 'health',
  register(env) {
    env.registerInit({
      deps: { rootHttpRouter: coreServices.rootHttpRouter },
      async init({ rootHttpRouter }) {
        const router = Router();
         
        router.get('/liveness', async (request, response) => {

          const target = "https://github.com/k0rdent/catalog/blob/main/apps"

          try {
            const urls = await discoverYamlFiles(target); 
            const processedEntities: AppEntity[] = [];

            for (const url of urls) {
              // pluginLogger.info(`Processing file: ${url}`);
              console.log(`Processing file: ${url}`);
              try {
                const entity = await fetchAndProcessYaml(url); // Uses the modified function
                if (entity) {
                  processedEntities.push(entity);
                  console.log(`Successfully processed and added entity from ${url}`);
                }
              } catch (processingError: any) {
                // pluginLogger.error(`Failed to process YAML from ${url}: ${processingError.message}`);
                console.error(`Failed to process YAML from ${url}: ${processingError.message}`);
                // Continue processing other files
              }
            }


            response.json({
              status: 'OK',
              timestamp: new Date().toISOString(),
              discoveredUrlCount: urls.length,
              processedEntities: processedEntities, // Array of app entities
            });
          } catch (errro: any) {
            // console.log(`Failed to read location ${location.target}, ${error}`)
            // return false;
          } 
        });
        
        rootHttpRouter.use('/health', router);
      },
    });
  },
});

interface AppEntity {
  title?: string;
  description?: string;
  summary?: string;
  logo?: string;
  sourceUrl: string;
}

const fetchAndProcessYaml = async (url: string): Promise<AppEntity | null> => {
  const githubToken = "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"; // WARNING: Hardcoded token
  const headers: Record<string, string> = {
    // It's good practice to request raw content directly for YAML files from GitHub
    'Accept': 'application/vnd.github.v3.raw',
  };
  if (githubToken) {
    headers.Authorization = `token ${githubToken}`;
  }

  console.log(`Workspaceing YAML from ${url}`);
  const response = await fetch(url, { headers });

  if (!response.ok) {
    console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    // Throwing an error here will stop the processing for this specific URL,
    // and it can be caught in the calling loop.
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  let data: any; // Using 'any' as yaml.load can return various types

  try {
    data = yaml.load(text); // yaml.load from js-yaml
  } catch (error: any) {
    console.warn(`Skipping ${url}: YAML parsing failed - ${error.message}`);
    return null; // Skip if YAML is malformed
  }

  if (!data || typeof data !== 'object' || data === null || Array.isArray(data)) {
    console.warn(`Skipping ${url}: YAML content is invalid, not an object, or is an array.`);
    return null; // Skip if not a valid object structure
  }

  // Check the 'type' field
  const type = data.type as string | undefined;

  if (type === 'infra') {
    console.info(`Skipping ${url}: YAML is of type 'infra'.`);
    return null; // Skip 'infra' type entities
  }

  // If type is not 'infra' or type field is missing, treat as an "app"
  // and extract specified fields.
  const appEntity: AppEntity = {
    title: typeof data.title === 'string' ? data.title : undefined,
    description: typeof data.description === 'string' ? data.description : undefined,
    summary: typeof data.summary === 'string' ? data.summary : undefined,
    logo: typeof data.logo === 'string' ? data.logo : undefined,
    sourceUrl: url,
  };

  console.log(`Processed app entity from ${url}:`, appEntity);
  return appEntity;
};


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
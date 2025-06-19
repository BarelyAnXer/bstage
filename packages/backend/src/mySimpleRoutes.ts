import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { Router } from 'express';
import * as yaml from 'js-yaml';
import express from 'express';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { listPods } from './KubernetesService';

interface CreateResourcePayload {
  templateId: string;
  templateApiVersion: string;
  templateKind: string;
  configuration: Record<string, any>;
  addons: Record<string, boolean>;
}

interface AppEntity {
  title?: string;
  description?: string;
  summary?: string;
  logo?: string;
  sourceUrl: string;
  install_code?: string;
  serviceTemplateName: string | undefined;
}

let serviceInstallMap: { [key: string]: string | undefined } = {};
let serviceData: {
  [key: string]: {
    template?: string;
    name?: string;
    namespace?: string;
  };
} = {};

const execAsync = promisify(exec);
dotenv.config();
const github_token = process.env.GITHUB_TOKEN;
console.log(process.env.APP_BASE_URL)


async function runCommand(
  command: string,
): Promise<{ stdout: string; stderr: string }> {
  console.log(`Executing: ${command}`);
  try {
    const { stdout, stderr } = await execAsync(command);
    console.log(`stdout: ${stdout}`);
    if (stderr) console.warn(`stderr: ${stderr}`);
    return { stdout, stderr };
  } catch (error: any) {
    console.error(`Command failed: ${error.message}`);
    throw error;
  }
}


// @ts-ignore
// TODO use this uncomment
async function applyYamlFile(filePath: string): Promise<void> {
  const kubeconfigPath = `${process.env.HOME}/.kube/config`;

  const command = `kubectl apply -f ${filePath} --kubeconfig=${kubeconfigPath}`;

  try {
    const { stdout, stderr } = await runCommand(command);

    if (stderr) {
      console.error(`kubectl apply stderr: ${stderr}`);
      throw new Error(`kubectl apply failed: ${stderr}`);
    }

    console.log(`kubectl apply stdout: ${stdout}`);
  } catch (error) {
    console.error(`Error applying YAML file ${filePath}:`, error);
    throw error;
  }
}

export const healthPlugin = createBackendPlugin({
  pluginId: 'health',
  register(env) {
    env.registerInit({
      deps: {
        rootHttpRouter: coreServices.rootHttpRouter,
        logger: coreServices.logger,
      },
      async init({ rootHttpRouter, logger }) {
        const router = Router();

        router.use(express.json());

        // for reading the catalog or chart data in k0rdnet catalog/apps
        router.get('/liveness', async (_request, response) => {
          console.log('doomed');

          const target = 'https://github.com/k0rdent/catalog/blob/main/apps';

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
                  console.log(
                    `Successfully processed and added entity from ${url}`,
                  );
                }
              } catch (processingError: any) {
                // pluginLogger.error(`Failed to process YAML from ${url}: ${processingError.message}`);
                console.error(
                  `Failed to process YAML from ${url}: ${processingError.message}`,
                );
                // Continue processing other files
              }
            }

            console.log('christian', serviceInstallMap);

            response.json({
              status: 'OK',
              timestamp: new Date().toISOString(),
              discoveredUrlCount: urls.length,
              processedEntities: processedEntities, // Array of app entities
            });
          } catch (error: any) {
            // console.log(`Failed to read location ${location.target}, ${error}`)
            // return false;
          }
        });

        // @ts-ignore
        router.post('/create-resource', async (request, response) => {
          logger.info('Received request to /create-resource');
          const payload = request.body as CreateResourcePayload;
          logger.info('Payload received:', payload as any);

          // Basic Validation
          if (!payload || typeof payload !== 'object') {
            logger.warn('Invalid payload: not an object or empty.');
            return response
              .status(400)
              .json({ message: 'Invalid payload: must be a JSON object.' });
          }

          const {
            templateId,
            templateApiVersion,
            templateKind,
            configuration,
            addons,
          } = payload;
          if (
            !templateId ||
            !templateApiVersion ||
            !templateKind ||
            !configuration
          ) {
            logger.warn('Missing required fields in payload.', {
              templateIdExists: !!templateId,
              apiVersionExists: !!templateApiVersion,
              kindExists: !!templateKind,
              configExists: !!configuration,
            });
            return response.status(400).json({
              message:
                'Missing required fields: templateId, templateApiVersion, templateKind, configuration are required.',
            });
          }

          try {
            const generatedResource: any = {
              apiVersion: templateApiVersion,
              kind: templateKind,
              metadata: {
                name: configuration.metadataName,
                namespace: 'kcm-system',
                // labels: {
                //   'app.kubernetes.io/managed-by': 'visualizer-tool',
                //   'template-id': templateId,
                // },
              },
              spec: {
                template: configuration.specTemplate,
                credential: configuration.specCredential,
                config: {
                  clusterLabels: {}, // Assuming this is always empty for this template
                  region: configuration.specConfigRegion,
                  controlPlane: {
                    instanceType:
                      configuration.specConfigControlPlaneInstanceType,
                  },
                  worker: {
                    instanceType: configuration.specConfigWorkerInstanceType,
                  },
                  // Add other config fields if needed based on the template
                },
                serviceSpec: {
                  services: Object.keys(addons)
                    .filter(addonKey => addons[addonKey] === true)
                    .map(addonKey => {
                      const service = serviceData[addonKey];
                      if (service && service.name) {
                        return {
                          template: service.name,
                          name: addonKey,
                          namespace: service.namespace || 'kcm-system',
                        };
                      }
                      return null;
                    })
                    .filter(service => service !== null),
                  priority: 100,
                },
              },
            };

            const yamlString = yaml.dump(generatedResource, { indent: 2 });

            const { exec } = require('child_process');

            const helmInstallCommands: { command: string; name: string }[] = [];

            if (addons && typeof addons === 'object') {
              for (const addonKey in addons) {
                if (addons[addonKey] === true) {
                  const installCommand =
                    serviceInstallMap[addonKey.toLocaleLowerCase()];
                  if (installCommand) {
                    helmInstallCommands.push({
                      command: installCommand,
                      name: addonKey,
                    });
                    logger.info(
                      `Added Helm install command for addon: ${addonKey}`,
                    );
                  } else {
                    logger.warn(
                      `No install command found in serviceInstallMap for enabled addon: ${addonKey}`,
                    );
                  }
                }
              }
            }

            console.log(serviceInstallMap, 'zxc');
            console.log(helmInstallCommands, 'asd');
            console.log(serviceData, 'kikiam');

            const installedCharts: string[] = [];
            const installationErrors: {
              name: string;
              error: string;
              stdout?: string;
              stderr?: string;
            }[] = [];

            for (const { command, name } of helmInstallCommands) {
              logger.info(`Executing Helm command: ${command} (for ${name})`);
              try {
                await new Promise<void>((resolve, reject) => {
                  exec(
                    command,
                    (error: Error | null, stdout: string, stderr: string) => {
                      if (error) {
                        logger.error(
                          `Error installing Helm chart '${name}': ${error.message}`,
                          {
                            stdout,
                            stderr,
                            command,
                          },
                        );
                        installationErrors.push({
                          name,
                          error: error.message,
                          stdout,
                          stderr,
                        });
                        reject(error); // Reject the promise for this specific command
                        return;
                      }

                      logger.info(
                        `Helm chart '${name}' installed successfully`,
                        {
                          output: stdout,
                        },
                      );

                      if (stderr) {
                        logger.warn(
                          `Helm installation for '${name}' produced warnings`,
                          {
                            stderr,
                          },
                        );
                      }
                      installedCharts.push(name);
                      resolve();
                    },
                  );
                });
              } catch (execError) {
                // This catch block will catch the rejection from the promise if a command fails.
                // We've already logged the specific error, so we can break or decide how to proceed.
                // For this implementation, we'll stop further installations if one fails.
                logger.error(
                  `Halting further installations due to error with chart '${name}'.`,
                );
                break;
              }
            }

            if (installationErrors.length > 0) {
              // If there were any errors, report them
              const failedChartNames = installationErrors
                .map(e => e.name)
                .join(', ');
              logger.error(
                `One or more Helm chart installations failed: ${failedChartNames}`,
              );
              return response.status(500).json({
                message: `Failed to install some Helm charts: ${failedChartNames}.`,
                templateId: templateId,
                kind: templateKind,
                generatedYaml: yamlString, // Still provide YAML if generated
                helmInstalled: false,
                installedCharts,
                installationErrors,
              });
            }

            // Generate unique filename
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `${configuration.metadataName}-${timestamp}.yaml`;
            const outputDir = '/tmp';
            const filePath = path.join(outputDir, fileName);

            // Write YAML to file
            await fs.promises.writeFile(filePath, yamlString, 'utf8');
            console.log(`YAML file written to: ${filePath}`);

            // Apply the YAML file using kubectl
            const kubeconfigPath = process.env.HOME + '/.kube/config';

            // First check if cluster templates are accessible
            await runCommand(
              `kubectl get clustertemplate.k0rdent.mirantis.com -A --kubeconfig=${kubeconfigPath}`,
            );

            // Apply the generated YAML file
            // const command = `kubectl apply -f ${filePath} --kubeconfig=${kubeconfigPath}`;
            // const { stdout, stderr } = await runCommand(command);

            // if (stderr && !stderr.includes('Warning')) {
            //   console.error(`kubectl stderr: ${stderr}`);
            //   throw new Error(`kubectl apply failed with stderr: ${stderr}`);
            // }

            // console.log(`Successfully applied YAML file: ${filePath}`);
            // console.log(`kubectl stdout: ${stdout}`);

            logger.info(
              `Successfully generated YAML and installed Helm chart for template: ${templateId}`,
            );

            // Respond to the frontend
            response.status(201).json({
              message: `Resource configuration for '${templateKind}' received and all charts deployed successfully.`,
              templateId: templateId,
              kind: templateKind,
              generatedYaml: yamlString,
              helmInstalled: true,
              installedCharts,
            });
          } catch (error: any) {
            logger.error(
              `Error processing /create-resource payload: ${error.message}`,
              {
                // payload,
                stack: error.stack,
              },
            );
            response.status(500).json({
              message: 'An error occurred while processing your request.',
              error: error.message,
            });
          }
        });

        router.get('/pods', async (_req, res) => {
          try {
            const pods = await listPods();
            res.status(200).json({ pods });
          } catch (error) {
            res.status(500).json({ error: 'Failed to list pods' });
          }
        });
        rootHttpRouter.use('/health', router);
      },
    });
  },
});

const fetchAndProcessYaml = async (url: string): Promise<AppEntity | null> => {
  const githubToken = github_token;
  const headers: Record<string, string> = {
    // It's good practice to request raw content directly for YAML files from GitHub
    Accept: 'application/vnd.github.v3.raw',
  };
  // if (githubToken) {
  //   headers.Authorization = `token ${githubToken}`;
  // }
  console.log(`Workspaceing YAML from ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    console.error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
    );
    // Throwing an error here will stop the processing for this specific URL,
    // and it can be caught in the calling loop.
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
    );
  }
  const text = await response.text();
  let data: any; // Using 'any' as yaml.load can return various types
  try {
    data = yaml.load(text); // yaml.load from js-yaml
  } catch (error: any) {
    console.warn(`Skipping ${url}: YAML parsing failed - ${error.message}`);
    return null; // Skip if YAML is malformed
  }
  if (
    !data ||
    typeof data !== 'object' ||
    data === null ||
    Array.isArray(data)
  ) {
    console.warn(
      `Skipping ${url}: YAML content is invalid, not an object, or is an array.`,
    );
    return null; // Skip if not a valid object structure
  }
  // Check the 'type' field
  const type = data.type as string | undefined;
  if (type === 'infra') {
    console.info(`Skipping ${url}: YAML is of type 'infra'.`);
    return null; // Skip 'infra' type entities
  }
  if ((data.title as string) == 'Pure') {
    console.info(`skipping ${url}: YAML is of type 'infra'.`);
    return null;
  }

  const extractHelmInstallCommands = (
    installCode: string | undefined,
  ): string | undefined => {
    if (typeof installCode !== 'string') {
      return undefined;
    }

    // Remove code block markers if present
    let cleanedCode = installCode
      .replace(/^~~~bash\n/, '')
      .replace(/\n~~~$/, '');

    // Remove trailing backslashes used for line continuation
    cleanedCode = cleanedCode.replace(/\s*\\\s*$/gm, ' ');

    // Split into lines and filter for helm install commands
    const helmCommandLines = cleanedCode
      .split('\n')
      .filter(line => line.trim().startsWith('helm install'));

    // Join commands together with proper spacing
    let helmCommands = helmCommandLines.join('\n');

    helmCommands = helmCommands?.replace('install', ' upgrade --install ');

    helmCommands = helmCommands
      .split('\n')
      .map(line => `${line} -n kcm-system`)
      .join('\n');

    return helmCommands.trim() === '' ? undefined : helmCommands;
  };

  const extractServiceTemplateName = (
    verifyCode: string | undefined,
  ): string | undefined => {
    if (typeof verifyCode !== 'string') {
      return undefined;
    }

    // Remove code block markers if present
    const cleanedCode = verifyCode
      .replace(/^~~~bash\n/, '')
      .replace(/\n~~~$/, '');

    // Look for lines with service template names (after comments)
    const templateNameRegex = /^#.*\s+(\S+-\d+-\d+-\d+)\s+true/m;
    const match = cleanedCode.match(templateNameRegex);

    if (match && match[1]) {
      return match[1];
    }

    return undefined;
  };

  // If type is not 'infra' or type field is missing, treat as an "app"
  // and extract specified fields.
  if (
    typeof data.title === 'string' &&
    typeof serviceInstallMap !== 'undefined'
  ) {
    serviceInstallMap[(data.title as string).toLowerCase()] =
      extractHelmInstallCommands(data.install_code);
  }

  serviceData[(data.title as string).toLocaleLowerCase()] = {
    // template: data.template,
    name: extractServiceTemplateName(data.verify_code),
    namespace: 'kcm-system',
  };

  const appEntity: AppEntity = {
    title: typeof data.title === 'string' ? data.title : undefined,
    description:
      typeof data.description === 'string' ? data.description : undefined,
    summary: typeof data.summary === 'string' ? data.summary : undefined,
    logo: typeof data.logo === 'string' ? data.logo : undefined,
    sourceUrl: url,
    install_code: extractHelmInstallCommands(data.install_code),
    serviceTemplateName: extractServiceTemplateName(data.verify_code), // Extract and add the service template name
  };

  // console.log(`Processed app entity from ${url}:`, appEntity);
  console.log(`Processed app entity from ${url}:`);
  return appEntity;
};

// Reads github url and returns all the YAML URLS
const discoverYamlFiles = async (target: string) => {
  const githubToken = github_token;
  const urlParts = parseGitHubUrl(target);

  console.log(urlParts);
  if (!urlParts) {
    throw new Error(`Invalid GitHub URL: ${target}`);
  }

  const { owner, repo, path } = urlParts;
  let { branch } = urlParts;

  branch = 'main';
  // Construct GitHub API URL
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
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

        return itemPath.endsWith('data.yaml');
      })
      .map(
        (item: { path: string }) =>
          `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${item.path}`,
      );

    // this.logger.info(`Found ${yamlFiles.length} YAML files in ${target}`);
    return yamlFiles;
  } catch (error) {
    // this.logger.error(`Failed to discover YAML files: ${error}`);
    throw error;
  }
};

const parseGitHubUrl = (
  url: string,
): { owner: string; repo: string; branch: string; path: string } | null => {
  // Handle both blob and tree URLs
  const blobPattern =
    /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/(?:blob|tree)\/([^\/]+)(?:\/(.*))?$/;
  const match = url.match(blobPattern);

  if (!match) {
    return null;
  }

  const [, owner, repo, branch, path = ''] = match;
  return { owner, repo, branch, path };
};

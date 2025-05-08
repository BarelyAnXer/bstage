import { coreServices, createBackendPlugin } from '@backstage/backend-plugin-api';
import { Router } from 'express';

export const healthPlugin = createBackendPlugin({
  pluginId: 'health',
  register(env) {
    env.registerInit({
      deps: { rootHttpRouter: coreServices.rootHttpRouter },
      async init({ rootHttpRouter }) {
        const router = Router();
         
        router.get('/liveness', (request, response) => {
          response.json({
            status: 'OK',
            message: 'Server is ready',
            timestamp: new Date().toISOString()
          });
        });
        
        rootHttpRouter.use('/health', router);
      },
    });
  },
});
import {
  reportError,
  reportInfo,
  sequelize,
  runPendingMigrations
} from 'node-server-engine';
import { createServer } from 'app';
import { initPubSub } from 'pubsub';
import * as models from 'db/models';

// Handle unhandled promise rejections to prevent crashes from database issues
process.on('unhandledRejection', (reason) => {
  reportError('Unhandled Promise Rejection (process will continue)');
  reportError(reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  reportError('Uncaught Exception');
  reportError(error);
});

// Start the HTTP server first to pass Cloud Run health checks
createServer()
  .init()
  .then(async () => {
    reportInfo('HTTP server started successfully');
   
    const shouldInitDb = process.env.RUN_DB_MIGRATION?.toLowerCase() === 'true';
    
    if (shouldInitDb) {
      reportInfo('Database initialization enabled');
      try {
        await sequelize.init();
        const modelArray = Object.values(models).filter(m => typeof m === 'function');
        reportInfo(`Loading ${modelArray.length} models`);
        await sequelize.addModels(modelArray);
        reportInfo('Database migration started');
        await runPendingMigrations();
        reportInfo('Database initialized and migrations completed');
      } catch (dbError) {
        reportError('Database initialization failed');
        if (dbError instanceof Error) {
          reportError(`Error name: ${dbError.name}`);
          reportError(`Error message: ${dbError.message}`);
          reportError(`Error stack: ${dbError.stack}`);
        } else {
          reportError(JSON.stringify(dbError));
        }
        // Exit if database is required but failed
        process.exit(1);
      }
    } else {
      reportInfo('Database initialization skipped (RUN_DB_MIGRATION not set to true)');
    }

    // Initialize Pub/Sub after server is running
    try {
      await initPubSub();
    } catch (pubsubError) {
      reportError('Failed to initialize Pub/Sub (service will continue)');
      reportError(pubsubError);
    }
  })
  .catch((error) => {  
    reportError('Failed to start HTTP server');
    if (error instanceof Error) {
      reportError(`Error name: ${error.name}`);
      reportError(`Error message: ${error.message}`);
      reportError(`Error stack: ${error.stack}`);
    } else {
      reportError(JSON.stringify(error));
    }
    process.exit(1);
  });
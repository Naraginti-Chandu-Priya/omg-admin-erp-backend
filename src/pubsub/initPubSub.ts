import { PubSub, reportInfo, reportError } from 'node-server-engine';
import { handleSampleMessage } from './handlers';

let retryTimer: NodeJS.Timeout | null = null;

function schedulePubSubRetry(attemptNumber: number): void {
  // Exponential backoff: 30s, 60s, 120s, 240s, capped at 300s
  const delayMs = Math.min(30000 * Math.pow(2, attemptNumber - 1), 300000);
  reportInfo(`Scheduling Pub/Sub retry attempt ${attemptNumber + 1} in ${delayMs / 1000}s`);
  retryTimer = setTimeout(() => initPubSub(attemptNumber + 1), delayMs);
}

/**
 * Initialize Pub/Sub publishers and subscribers
 * 
 * This function sets up all Pub/Sub topics (publishers) and subscriptions (subscribers)
 * needed by the service. It should be called after the HTTP server is initialized.
 */
export async function initPubSub(attemptNumber = 0): Promise<void> {
  // Check if Pub/Sub is enabled via environment variable
  if (process.env.ENABLE_PUBSUB?.toLowerCase() !== 'true') {
    reportInfo('Pub/Sub disabled (ENABLE_PUBSUB not set to true)');
    return;
  }

  // Check required environment variables
  if (!process.env.PUBSUB_TOPIC || !process.env.PUBSUB_SUBSCRIPTION) {
    reportInfo('Pub/Sub configuration missing - skipping initialization');
    reportInfo('Required: PUBSUB_TOPIC and PUBSUB_SUBSCRIPTION');
    return;
  }

  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }

  reportInfo(`Initializing Pub/Sub (attempt ${attemptNumber + 1})...`);

  try {
    // Register publishers (topics to publish to)
    if (process.env.PUBSUB_TOPIC) {
      PubSub.addPublisher(process.env.PUBSUB_TOPIC);
      reportInfo(`Registered publisher: ${process.env.PUBSUB_TOPIC}`);
    }

    // Register subscribers (subscriptions to listen to)
    if (process.env.PUBSUB_SUBSCRIPTION) {
      PubSub.addSubscriber(
        process.env.PUBSUB_SUBSCRIPTION,
        handleSampleMessage
      );
      reportInfo(`Registered subscriber: ${process.env.PUBSUB_SUBSCRIPTION}`);
    }

    // Initialize all Pub/Sub connections
    await PubSub.init();

    reportInfo('Pub/Sub initialized successfully');
  } catch (error) {
    reportError({
      namespace: 'node-server-template:pubsub:init',
      message: `Failed to initialize Pub/Sub (attempt ${attemptNumber + 1})`,
      error: {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    });

    // Schedule background retry - service continues with HTTP fallback
    schedulePubSubRetry(attemptNumber);
  }
}

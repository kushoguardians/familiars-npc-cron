import { Cron } from "croner";
import { Hono } from "hono";
import { AutonomousCron } from "jobs/autonomous-cron";

async function createApp(): Promise<Hono> {
  const app = new Hono();

  app.get("/hello", (c) => c.text("Hello. I'm Kusho Guardians!"));

  try {
    // Initialize cron job
    initCronJob();
  } catch (error) {
    console.error("Failed to initialize app:", error);
  }

  return app;
}

function initCronJob() {
  new Cron("*/15 * * * *", async () => {
    try {
      await runCronJobsSequentially();
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });
}

async function runCronJobsSequentially() {
  try {
    await AutonomousCron();
  } catch (error) {
    console.error("Error on Autonomous:", error);
    throw error; // Stop further execution if this step fails
  }
}

async function startServer() {
  try {
    const app = await createApp();
    // Start your server here, e.g.:
    // app.listen(3000);
    console.info("Server started successfully");
    return app;
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

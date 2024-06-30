import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.cron(
  "clear old queues from table",
  "0 0 * * 1",
  internal.queues.removeOldQueues
);

export default crons;

import { Id } from "./_generated/dataModel";

export type QueueState = {
  id: Id<"queues">;
  code: string;
  hosting: boolean;
  videoLinks: string[];
};

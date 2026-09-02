import ask1Data from "./ask.json";
import response1Data from "./response.json";
import { PIPELINE_STEPS_ASK_1 } from "./pipeline-steps";
import { RUN_METADATA_ASK_1 } from "./run-metadata";

export const ASK_1_SCENARIO = {
  id: "ask-1",
  title: "Ask 1: Summarize Emails (Read-Only)",
  description: "User requests morning summary of important unread Gmail messages.",
  ask: ask1Data,
  response: response1Data,
  metadata: RUN_METADATA_ASK_1,
  steps: PIPELINE_STEPS_ASK_1,
} as const;

export {
  ask1Data,
  response1Data,
  PIPELINE_STEPS_ASK_1,
  RUN_METADATA_ASK_1,
};

import ask2Data from "./ask.json";
import draft2Data from "./email-draft.json";
import response2Data from "./response.json";
import { PIPELINE_STEPS_ASK_2 } from "./pipeline-steps";
import { RUN_METADATA_ASK_2 } from "./run-metadata";

export const ASK_2_SCENARIO = {
  id: "ask-2",
  title: "Ask 2: Auto-Reply to Client on Gmail (Acting as Me)",
  description: "Incoming message from John Doe triggers an authorized autonomous reply in Nelson's voice proposing a Thursday meeting.",
  ask: ask2Data,
  draft: draft2Data,
  response: response2Data,
  metadata: RUN_METADATA_ASK_2,
  steps: PIPELINE_STEPS_ASK_2,
} as const;

export {
  ask2Data,
  draft2Data,
  response2Data,
  PIPELINE_STEPS_ASK_2,
  RUN_METADATA_ASK_2,
};

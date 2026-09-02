import { ASK_1_SCENARIO, ask1Data, response1Data, PIPELINE_STEPS_ASK_1, RUN_METADATA_ASK_1 } from "./ask-1-summarize-emails";
import { ASK_2_SCENARIO, ask2Data, draft2Data, response2Data, PIPELINE_STEPS_ASK_2, RUN_METADATA_ASK_2 } from "./ask-2-autoreply-acting-as-me";

export const AUTODO_SCENARIOS = [
  ASK_1_SCENARIO,
  ASK_2_SCENARIO,
] as const;

export type ScenarioId = "ask-1" | "ask-2";

export function getScenario(id: ScenarioId) {
  if (id === "ask-2") {
    return ASK_2_SCENARIO;
  }
  return ASK_1_SCENARIO;
}

export {
  ASK_1_SCENARIO,
  ASK_2_SCENARIO,
  ask1Data,
  response1Data,
  PIPELINE_STEPS_ASK_1,
  RUN_METADATA_ASK_1,
  ask2Data,
  draft2Data,
  response2Data,
  PIPELINE_STEPS_ASK_2,
  RUN_METADATA_ASK_2,
};

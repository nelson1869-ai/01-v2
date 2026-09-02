import ragRetrievalFixture from "./retrieval.json";

export { ragRetrievalFixture };

export const RAG_SIMULATION = {
  provenance: "SIMULATED" as const,
  retrievalRequired: ragRetrievalFixture.retrievalRequired,
  reason: ragRetrievalFixture.reason,
  strategy: ragRetrievalFixture.strategy,
  request: ragRetrievalFixture.request,
  results: ragRetrievalFixture.results,
  output: ragRetrievalFixture.output,
} as const;

import type { McpServer } from "../contracts";
import mcpRegistryFixture from "./registry.json";
import mcpCallFixture from "./call.json";

export { mcpRegistryFixture, mcpCallFixture };

export const MCP_SERVERS: readonly McpServer[] =
  mcpRegistryFixture.servers as readonly McpServer[];

export const MCP_CALL_SIMULATION = mcpCallFixture;

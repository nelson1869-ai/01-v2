"use client";

import type { ScenarioId } from "../../scenarios";

export interface SyncMessage {
  type: "START_RUN" | "STEP_UPDATE" | "FINISH_RUN" | "CLEAR_CACHE";
  scenarioId?: ScenarioId;
  simulatedMaxStep?: number;
  isPlayingReplay?: boolean;
  customInboundPayload?: Record<string, unknown>;
  timestamp: number;
}

const CHANNEL_NAME = "autodo_run_channel";
const STORAGE_KEY = "autodo_run_state";

let channel: BroadcastChannel | null = null;
const localSubscribers = new Set<(msg: SyncMessage) => void>();

function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  if (!channel && "BroadcastChannel" in window) {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
    } catch {
      channel = null;
    }
  }
  return channel;
}

export function broadcastRunState(msg: Omit<SyncMessage, "timestamp">) {
  if (typeof window === "undefined") return;
  const fullMsg: SyncMessage = { ...msg, timestamp: Date.now() };

  // BroadcastChannel and the storage event notify other browsing contexts,
  // not the same tab that sent the update.
  for (const subscriber of localSubscribers) {
    try {
      subscriber(fullMsg);
    } catch (error) {
      console.error("Same-tab run synchronization failed:", error);
    }
  }

  try {
    const ch = getChannel();
    if (ch) {
      ch.postMessage(fullMsg);
    }
  } catch {
    // ignore
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fullMsg));
  } catch {
    // ignore
  }
}

export function subscribeToRunSync(
  callback: (msg: SyncMessage) => void,
): () => void {
  if (typeof window === "undefined") return () => {};

  const handleChannelMsg = (e: MessageEvent<SyncMessage>) => {
    if (e.data && e.data.type) {
      callback(e.data);
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed: SyncMessage = JSON.parse(e.newValue);
        callback(parsed);
      } catch {
        // ignore
      }
    }
  };

  const ch = getChannel();
  localSubscribers.add(callback);
  if (ch) {
    ch.addEventListener("message", handleChannelMsg);
  }
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    localSubscribers.delete(callback);
    if (ch) {
      ch.removeEventListener("message", handleChannelMsg);
    }
    window.removeEventListener("storage", handleStorageEvent);
  };
}

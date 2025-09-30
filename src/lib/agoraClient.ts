// lib/agoraClient.ts
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";

let client: IAgoraRTCClient | null = null;

export function getAgoraClient(): IAgoraRTCClient | null {
    // Only create client in browser environment
    if (typeof window === 'undefined') {
        return null;
    }

    if (!client) {
        client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    }
    return client;
}

export function destroyAgoraClient(): void {
    if (client) {
        client.leave();
        client = null;
    }
}
// hooks/useAgora.ts
import { useEffect, useState, useRef } from "react";
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IAgoraRTCRemoteUser, IRemoteVideoTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";
import { getAgoraClient } from "@/lib/agoraClient";

interface JoinOptions {
    appId: string;
    channel: string;
    token: string;
    uid: string | number;
    role: "publisher" | "subscriber";
}

interface UseAgoraReturn {
    localAudioTrack: IMicrophoneAudioTrack | null;
    localVideoTrack: ICameraVideoTrack | null;
    remoteUsers: IAgoraRTCRemoteUser[];
    isConnected: boolean;
    isAudioEnabled: boolean;
    isVideoEnabled: boolean;
    isScreenSharing: boolean;
    joinSession: (options: JoinOptions) => Promise<void>;
    leaveSession: () => Promise<void>;
    toggleAudio: () => Promise<void>;
    toggleVideo: () => Promise<void>;
    toggleScreenShare: () => Promise<void>;
}

export function useAgora(): UseAgoraReturn {
    const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
    const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
    const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    const clientRef = useRef<IAgoraRTCClient | null>(null);
    const screenTrackRef = useRef<ICameraVideoTrack | null>(null);

    useEffect(() => {
        // Initialize client only in browser
        const agoraClient = getAgoraClient();
        clientRef.current = agoraClient;

        return () => {
            // Cleanup on unmount
            if (clientRef.current) {
                clientRef.current.leave();
            }
            localAudioTrack?.close();
            localVideoTrack?.close();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const joinSession = async (options: JoinOptions): Promise<void> => {
        if (!clientRef.current) {
            throw new Error("Agora client not initialized");
        }

        try {

            let joinUid: string | number = options.uid;
            if (typeof joinUid === 'string' && !isNaN(Number(joinUid))) {
                joinUid = Number(joinUid);
            }

            console.log("Joining Agora channel with:", {
                appId: options.appId,
                channel: options.channel,
                uid: joinUid,
                role: options.role
            });

            // Join the channel
            await clientRef.current.join(options.appId, options.channel, options.token, options.uid);
            setIsConnected(true);

            if (options.role === "publisher") {
                // Create local tracks
                const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
                const camTrack = await AgoraRTC.createCameraVideoTrack();

                setLocalAudioTrack(micTrack);
                setLocalVideoTrack(camTrack);

                // Publish them
                await clientRef.current.publish([micTrack, camTrack]);
            }

            // Setup event listeners
            clientRef.current.on("user-published", async (remoteUser, mediaType) => {
                await clientRef.current!.subscribe(remoteUser, mediaType);

                if (mediaType === "video") {
                    const remoteVideoTrack: IRemoteVideoTrack | undefined = remoteUser.videoTrack;
                    // Use setTimeout to ensure DOM is ready
                    setTimeout(() => {
                        remoteVideoTrack?.play(`remote-video-${remoteUser.uid}`);
                    }, 100);
                }
                if (mediaType === "audio") {
                    const remoteAudioTrack: IRemoteAudioTrack | undefined = remoteUser.audioTrack;
                    remoteAudioTrack?.play();
                }
                setRemoteUsers(Array.from(clientRef.current!.remoteUsers));
            });

            clientRef.current.on("user-unpublished", () => {
                setRemoteUsers(Array.from(clientRef.current!.remoteUsers));
            });

            clientRef.current.on("user-joined", () => {
                setRemoteUsers(Array.from(clientRef.current!.remoteUsers));
            });

            clientRef.current.on("user-left", () => {
                setRemoteUsers(Array.from(clientRef.current!.remoteUsers));
            });

        } catch (error) {
            console.error("Error joining session:", error);
            throw error;
        }
    };

    const leaveSession = async (): Promise<void> => {
        try {
            if (localAudioTrack) {
                localAudioTrack.close();
                setLocalAudioTrack(null);
            }
            if (localVideoTrack) {
                localVideoTrack.close();
                setLocalVideoTrack(null);
            }

            if (clientRef.current) {
                await clientRef.current.leave();
                setIsConnected(false);
                setRemoteUsers([]);
            }
        } catch (error) {
            console.error("Error leaving session:", error);
            throw error;
        }
    };

    const toggleAudio = async () => {
        if (localAudioTrack) {
            await localAudioTrack.setEnabled(!isAudioEnabled);
            setIsAudioEnabled(!isAudioEnabled);
        }
    };

    const toggleVideo = async () => {
        if (localVideoTrack) {
            await localVideoTrack.setEnabled(!isVideoEnabled);
            setIsVideoEnabled(!isVideoEnabled);
        }
    };

    const toggleScreenShare = async () => {
        if (!clientRef.current) return;

        try {
            if (!isScreenSharing) {
                // Start screen sharing
                const screenTrack = await AgoraRTC.createScreenVideoTrack({});
                screenTrackRef.current = screenTrack as ICameraVideoTrack;

                // Unpublish camera track
                if (localVideoTrack) {
                    await clientRef.current.unpublish([localVideoTrack]);
                }

                // Publish screen track
                await clientRef.current.publish([screenTrack as ICameraVideoTrack]);
                setIsScreenSharing(true);

                // Listen for screen share stop
                (screenTrack as ICameraVideoTrack).on('track-ended', () => {
                    toggleScreenShare();
                });
            } else {
                // Stop screen sharing
                if (screenTrackRef.current) {
                    await clientRef.current.unpublish([screenTrackRef.current]);
                    screenTrackRef.current.close();
                    screenTrackRef.current = null;
                }

                // Republish camera track
                if (localVideoTrack) {
                    await clientRef.current.publish([localVideoTrack]);
                }
                setIsScreenSharing(false);
            }
        } catch (error) {
            console.error('Error toggling screen share:', error);
        }
    };

    return {
        localAudioTrack,
        localVideoTrack,
        remoteUsers,
        isConnected,
        isAudioEnabled,
        isVideoEnabled,
        isScreenSharing,
        joinSession,
        leaveSession,
        toggleAudio,
        toggleVideo,
        toggleScreenShare
    };
}
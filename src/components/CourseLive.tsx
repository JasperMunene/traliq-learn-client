// components/CourseLive.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { useAgora } from "@/hooks/useAgora";
import { 
    Video, 
    VideoOff, 
    Users, 
    AlertCircle, 
    Send, 
    Mic, 
    MicOff, 
    Monitor, 
    MonitorOff,
    MessageSquare,
    Hand,
    UserCircle,
    Clock
} from "lucide-react";
import { fetchWithAuth } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';

interface SessionData {
    appId: string;
    channel: string;
    token: string;
    uid: string | number;
    role: "publisher" | "subscriber";
    courseId: string;
}

interface Message {
    user: string;
    text: string;
    time: string;
    isSystemMessage?: boolean;
}

interface Participant {
    uid: string | number;
    hasVideo: boolean;
    hasAudio: boolean;
    isHandRaised?: boolean;
    isTutor?: boolean;
    name?: string;
}

interface SessionStatus {
    is_tutor: boolean;
    tutor_uid?: string | number;
    status?: string;
}

interface UserData {
    first_name: string;
    last_name: string;
    email: string;
    id?: string;
}

export default function CourseLive({ courseId }: { courseId: string }) {
    const [sessionData, setSessionData] = useState<SessionData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatMessage, setChatMessage] = useState("");
    const [user, setUser] = useState<UserData | null>(null);
    const [showParticipants, setShowParticipants] = useState(true);
    const [showChat, setShowChat] = useState(true);
    const [isHandRaised, setIsHandRaised] = useState(false);
    const [participants, setParticipants] = useState<Participant[]>([]);

    const {
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
    } = useAgora();

    const checkSessionStatus = useCallback(async () => {
        try {
            const res = await fetchWithAuth(API_ENDPOINTS.courses.sessionStatus(courseId));
            if (res.ok) {
                const data = await res.json();
                setSessionStatus(data);
            }
        } catch (err) {
            console.error("Error checking session status:", err);
        }
    }, [courseId]);

    useEffect(() => {
        const fetchInitialData = async () => {
            await checkSessionStatus();
            try {
                const res = await fetchWithAuth('http://127.0.0.1:5000/api/users/me');
                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };
        fetchInitialData();
    }, [courseId, checkSessionStatus]);

    // Update participants list
    useEffect(() => {
        const updatedParticipants: Participant[] = [];
        
        // Add tutor to participants
        if (sessionStatus?.is_tutor) {
            // Current user is the tutor
            updatedParticipants.push({
                uid: sessionData?.uid || 'tutor',
                hasVideo: isVideoEnabled,
                hasAudio: isAudioEnabled,
                isTutor: true,
                name: user ? `${user.first_name} ${user.last_name}`.trim() : 'Tutor'
            });
        } else {
            // Find tutor in remote users
            // Convert both to numbers for comparison
            const tutorUid = Number(sessionStatus?.tutor_uid);
            const tutorUser = remoteUsers.find(u => Number(u.uid) === tutorUid);
            
            if (tutorUser) {
                updatedParticipants.push({
                    uid: tutorUser.uid,
                    hasVideo: !!tutorUser.videoTrack,
                    hasAudio: !!tutorUser.audioTrack,
                    isTutor: true,
                    name: 'Tutor'
                });
            } else {
                console.log('Tutor not found in remote users. Looking for UID:', tutorUid, 'Remote UIDs:', remoteUsers.map(u => u.uid));
            }
        }
        
        if (!sessionStatus?.is_tutor && sessionData) {
            updatedParticipants.push({
                uid: sessionData.uid,
                hasVideo: isVideoEnabled,
                hasAudio: isAudioEnabled,
                name: user ? `${user.first_name} ${user.last_name}`.trim() : 'You',
                isHandRaised: isHandRaised
            });
        }
        
        // Add remote users (excluding tutor who's already added above)
        const tutorUidNum = Number(sessionStatus?.tutor_uid);
        const localUid = sessionData?.uid;
        
        remoteUsers.forEach(remoteUser => {
            const remoteUid = Number(remoteUser.uid);
            
            // Skip if this remote user is the tutor (already added) or the local user
            if (remoteUid === tutorUidNum || remoteUser.uid === localUid) {
                return;
            }
            
            updatedParticipants.push({
                uid: remoteUser.uid,
                hasVideo: !!remoteUser.videoTrack,
                hasAudio: !!remoteUser.audioTrack,
                name: `Student ${remoteUser.uid}`
            });
        });
        
        setParticipants(updatedParticipants);
    }, [remoteUsers, sessionStatus, sessionData, isVideoEnabled, isAudioEnabled, user, isHandRaised]);


        const handleJoinSession = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetchWithAuth(API_ENDPOINTS.courses.join(courseId), {
                method: "POST",
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to join session");
            }

            const data = await res.json();
            const sessionConfig: SessionData = {
                appId: data.app_id,
                channel: data.channel_name,
                token: data.token,
                uid: data.uid,
                role: data.role,
                courseId: courseId
            };

            setSessionData(sessionConfig);
            await joinSession(sessionConfig);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            console.error("Join session error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLeaveSession = async () => {
        setIsLoading(true);
        try {
            await fetchWithAuth(API_ENDPOINTS.courses.leave(courseId), {
                method: "POST",
            });

            await leaveSession();
            setSessionData(null);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            console.error("Leave session error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRaiseHand = () => {
        setIsHandRaised(!isHandRaised);
        const message: Message = {
            user: 'System',
            text: isHandRaised ? `${user ? user.first_name : 'Student'} lowered their hand` : `${user ? user.first_name : 'Student'} raised their hand`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSystemMessage: true
        };
        setMessages([...messages, message]);
    };

    const handleSendMessage = () => {
        if (chatMessage.trim()) {
            const newMessage: Message = {
                user: user ? `${user.first_name} ${user.last_name}`.trim() : "You",
                text: chatMessage.trim(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isSystemMessage: false
            };
            setMessages([...messages, newMessage]);
            setChatMessage("");
        }
    };

    // Auto-play local video when track is available
    useEffect(() => {
        if (localVideoTrack && typeof window !== 'undefined') {
            const localPlayer = document.getElementById('local-player');
            if (localPlayer) {
                localVideoTrack.play('local-player');
            }
        }
    }, [localVideoTrack]);

    if (!sessionStatus) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-700 font-medium text-lg">Loading live session...</p>
                </div>
            </div>
        );
    }

    const isTutor = sessionStatus?.is_tutor;

    return (
        <div className="bg-gray-50">
            <div className="flex-1">
                    <div className="flex flex-col h-screen">
                        {/* Modern Header with Status Bar */}
                        <div className="bg-white border-b border-gray-200 shrink-0">
                            <div className="px-4 sm:px-6 py-3 sm:py-4">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-600 flex items-center justify-center">
                                                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 flex flex-wrap items-center gap-2">
                                                <span className="truncate">AI & ML Bootcamp - Live Session</span>
                                                {isTutor && (
                                                    <span className="text-xs px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-200 font-medium whitespace-nowrap">
                                                        Tutor View
                                                    </span>
                                                )}
                                            </h1>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                                    <span className={`font-medium ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
                                                        {isConnected ? 'Live' : 'Offline'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                    <Users className="w-4 h-4" />
                                                    <span>{participants.length} participant{participants.length !== 1 ? 's' : ''}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                                        {error && (
                                            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                                                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                                <span className="text-xs sm:text-sm text-red-600 break-words">{error}</span>
                                            </div>
                                        )}
                                        {!isConnected ? (
                                            <button
                                                onClick={handleJoinSession}
                                                disabled={isLoading}
                                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
                                            >
                                                <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span>{isLoading ? 'Joining...' : 'Join Live Session'}</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleLeaveSession}
                                                disabled={isLoading}
                                                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
                                            >
                                                <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span>{isLoading ? 'Leaving...' : 'Leave Session'}</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 overflow-hidden">
                            <div className="h-full flex flex-col lg:flex-row gap-3 sm:gap-4 p-3 sm:p-4">
                                {/* Video Section */}
                                <div className={`${showChat || showParticipants ? 'lg:flex-[3]' : 'flex-1'} flex flex-col gap-3 sm:gap-4 transition-all duration-300`}>
                                    {/* Main Video Display */}
                                    <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-lg relative border border-gray-200">
                                        {isConnected ? (
                                            <>
                                                <div 
                                                    id={isTutor ? 'local-player' : `remote-video-${sessionStatus?.tutor_uid}`} 
                                                    className="w-full h-full bg-black"
                                                />
                                                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex items-center gap-2 bg-white/95 backdrop-blur-md text-gray-900 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-200 shadow-lg">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                                        <UserCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                    </div>
                                                    <div className="hidden sm:block">
                                                        <p className="text-sm font-semibold">{isTutor ? (user ? `${user.first_name} ${user.last_name}`.trim() : 'You (Tutor)') : 'Tutor'}</p>
                                                        <p className="text-xs text-gray-600">Presenting</p>
                                                    </div>
                                                </div>
                                                {isScreenSharing && (
                                                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-blue-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-2 shadow-lg">
                                                        <Monitor className="w-4 h-4" />
                                                        <span className="text-xs sm:text-sm font-medium hidden sm:inline">Screen Sharing</span>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                <div className="text-center">
                                                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6 border-4 border-gray-200">
                                                        <VideoOff className="w-12 h-12 text-gray-400" />
                                                    </div>
                                                    <p className="text-gray-900 text-xl font-semibold mb-2">No Active Stream</p>
                                                    <p className="text-gray-600 text-sm">Join the session to start</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Control Bar */}
                                    {isConnected && (
                                        <div className="bg-white rounded-xl sm:rounded-2xl px-3 sm:px-6 py-3 sm:py-4 border border-gray-200 shadow-lg">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <button
                                                        onClick={toggleAudio}
                                                        className={`p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl font-medium transition-colors ${isAudioEnabled ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'}`}
                                                        title={isAudioEnabled ? "Mute" : "Unmute"}
                                                    >
                                                        {isAudioEnabled ? <Mic className="w-4 h-4 sm:w-5 sm:h-5" /> : <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />}
                                                    </button>

                                                    <button
                                                        onClick={toggleVideo}
                                                        className={`p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl font-medium transition-colors ${isVideoEnabled ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'}`}
                                                        title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
                                                    >
                                                        {isVideoEnabled ? <Video className="w-4 h-4 sm:w-5 sm:h-5" /> : <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />}
                                                    </button>

                                                    {isTutor && (
                                                        <button
                                                            onClick={toggleScreenShare}
                                                            className={`p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl font-medium transition-colors ${isScreenSharing ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                                                            title={isScreenSharing ? "Stop sharing" : "Share screen"}
                                                        >
                                                            {isScreenSharing ? <MonitorOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />}
                                                        </button>
                                                    )}

                                                    {!isTutor && (
                                                        <button
                                                            onClick={handleRaiseHand}
                                                            className={`p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl font-medium transition-colors ${isHandRaised ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                                                            title={isHandRaised ? "Lower hand" : "Raise hand"}
                                                        >
                                                            <Hand className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setShowChat(!showChat)}
                                                        className={`px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base ${showChat ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                                                    >
                                                        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        <span className="hidden sm:inline">Chat</span>
                                                    </button>

                                                    <button
                                                        onClick={() => setShowParticipants(!showParticipants)}
                                                        className={`px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base ${showParticipants ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                                                    >
                                                        <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        <span className="hidden sm:inline">People</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Participant Video Grid */}
                                    {isConnected && participants.length > 1 && (
                                        <div className="h-24 sm:h-32 bg-white rounded-xl sm:rounded-2xl p-2 sm:p-4 border border-gray-200 shadow-lg">
                                            <div className="flex gap-3 overflow-x-auto h-full">
                                                {participants
                                                    .filter(p => !(isTutor && p.isTutor) && !(!isTutor && p.isTutor))
                                                    .map((participant) => (
                                                        <div key={participant.uid} className="relative flex-shrink-0 w-20 sm:w-28 h-full bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 group hover:border-blue-500 transition-colors">
                                                            <div 
                                                                id={participant.uid === sessionData?.uid ? 'local-player' : `remote-video-${participant.uid}`} 
                                                                className="w-full h-full bg-black"
                                                            />
                                                            {!participant.hasVideo && (
                                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                                                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-blue-600 flex items-center justify-center">
                                                                        <UserCircle className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className="absolute bottom-1 sm:bottom-1.5 left-1 sm:left-1.5 right-1 sm:right-1.5 bg-white/95 backdrop-blur-sm text-gray-900 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium truncate flex items-center gap-1 sm:gap-1.5 border border-gray-200">
                                                                {!participant.hasAudio && <MicOff className="w-3 h-3 text-red-500 flex-shrink-0" />}
                                                                <span className="truncate">{participant.name}</span>
                                                            </div>
                                                            {participant.isHandRaised && (
                                                                <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-1.5 shadow-lg animate-bounce">
                                                                    <Hand className="w-3 h-3 text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sidebar - Chat & Participants */}
                                {(showChat || showParticipants) && (
                                    <div className="hidden lg:flex lg:w-80 xl:w-96 flex-col gap-4 transition-all duration-300">
                                        {showParticipants && (
                                            <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden flex flex-col">
                                                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                            <Users className="w-5 h-5 text-gray-700" />
                                                            Participants ({participants.length})
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                                    {participants.map((participant) => (
                                                        <div key={participant.uid} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200">
                                                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                                                <UserCircle className="w-6 h-6 text-white" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                                    {participant.name}
                                                                    {participant.isTutor && (
                                                                        <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                                                                            Tutor
                                                                        </span>
                                                                    )}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    {participant.hasVideo ? <Video className="w-3 h-3 text-green-600" /> : <VideoOff className="w-3 h-3 text-gray-400" />}
                                                                    {participant.hasAudio ? <Mic className="w-3 h-3 text-green-600" /> : <MicOff className="w-3 h-3 text-gray-400" />}
                                                                </div>
                                                            </div>
                                                            {participant.isHandRaised && (
                                                                <div className="bg-yellow-100 p-2 rounded-full border border-yellow-200">
                                                                    <Hand className="w-4 h-4 text-yellow-700" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {showChat && (
                                            <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden flex flex-col">
                                                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                            <MessageSquare className="w-5 h-5 text-gray-700" />
                                                            Live Chat
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                                    {messages.length === 0 ? (
                                                        <div className="text-center text-gray-400 py-8">
                                                            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                            <p className="text-sm">No messages yet</p>
                                                        </div>
                                                    ) : (
                                                        messages.map((msg, index) => (
                                                            <div key={index} className={`${msg.isSystemMessage ? 'text-center' : ''}`}>
                                                                {msg.isSystemMessage ? (
                                                                    <div className="inline-block px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg">
                                                                        <p className="text-xs text-gray-600">{msg.text}</p>
                                                                    </div>
                                                                ) : (
                                                                    <div className={`flex ${msg.user === (user ? `${user.first_name} ${user.last_name}`.trim() : 'You') ? 'justify-end' : 'justify-start'}`}>
                                                                        <div className={`max-w-xs ${msg.user === (user ? `${user.first_name} ${user.last_name}`.trim() : 'You') ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-xl p-3 shadow-sm border ${msg.user === (user ? `${user.first_name} ${user.last_name}`.trim() : 'You') ? 'border-blue-600' : 'border-gray-200'}`}>
                                                                            <p className={`text-xs font-medium mb-1 ${msg.user === (user ? `${user.first_name} ${user.last_name}`.trim() : 'You') ? 'text-blue-100' : 'text-gray-600'}`}>{msg.user}</p>
                                                                            <p className="text-sm">{msg.text}</p>
                                                                            <p className={`text-xs mt-1 ${msg.user === (user ? `${user.first_name} ${user.last_name}`.trim() : 'You') ? 'text-blue-200' : 'text-gray-500'}`}>{msg.time}</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                                <div className="p-3 sm:p-4 border-t border-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            value={chatMessage}
                                                            onChange={(e) => setChatMessage(e.target.value)}
                                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                            placeholder="Type a message..."
                                                            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                                        />
                                                        <button 
                                                            onClick={handleSendMessage} 
                                                            className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-colors flex-shrink-0"
                                                        >
                                                            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}
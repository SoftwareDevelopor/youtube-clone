'use client'
import { useParams } from 'next/navigation'
import React from 'react'

import { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer'
import io from 'socket.io-client';



const socket = io('https://youtube-clone-1-7t1w.onrender.com'); 




export default function Call() {
    let {callerid}=useParams()
    const myVideo = useRef();
    const userVideo = useRef();
    const screenShareVideo = useRef();
    const connectionRef = useRef();
    const screenShareConnectionRef = useRef();
    const [stream, setStream] = useState();
    const [screenStream, setScreenStream] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [receivingCall, setReceivingCall] = useState(false);
    const [callerSignal, setCallerSignal] = useState();
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    useEffect(() => {
        if (!callerid) return;
        
        // Get user media (camera and microphone)
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }
            })
            .catch((err) => {
                console.error('Error accessing media devices:', err);
                alert('Please allow camera and microphone access to make video calls.');
            });

        // Generate a unique user ID for this session
        const userId = socket.id; // Socket ID can be used as a temporary user ID

        socket.emit('join-room', callerid, userId);

        socket.on('user-connected', (peerId) => {
            
            // Initiate a call to the new user
            callUser(peerId, stream);
        });

        socket.on('signal', ({ senderId, signal }) => {
            if (!connectionRef.current) { // If we don't have an active connection, it's an incoming call
                setReceivingCall(true);
                setCallerSignal(signal);
                // Optionally store senderId to know who is calling
            } else {
                connectionRef.current.signal(signal);
            }
        });

        socket.on('screen-share-signal', ({ senderId, signal }) => {
            if (screenShareConnectionRef.current) {
                screenShareConnectionRef.current.signal(signal);
            }
        });

        socket.on('recording-status', (status) => {
            if (status === 'started') {
                setRecording(true);
                
            } else if (status === 'stopped') {
                setRecording(false);
                
            }
        });

        // Clean up on component unmount
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (screenStream) {
                screenStream.getTracks().forEach(track => track.stop());
            }
            if (connectionRef.current) {
                connectionRef.current.destroy();
            }
            if (screenShareConnectionRef.current) {
                screenShareConnectionRef.current.destroy();
            }
            socket.off('user-connected');
            socket.off('signal');
            socket.off('screen-share-signal');
            socket.off('recording-status');
            socket.disconnect();
        };
    }, [callerid, stream]); // Re-run if callerid or stream changes

    const callUser = (peerId, currentStream) => {
        const peer = new Peer({
            initiator: true, // This peer initiates the connection
            trickle: false, // Don't send ICE candidates until offer is complete
            stream: currentStream,
        });

        peer.on('signal', (data) => {
            socket.emit('signal', { targetId: peerId, signal: data });
        });

        peer.on('stream', (incomingStream) => {
            userVideo.current.srcObject = incomingStream;
        });

        peer.on('connect', () => {
            setCallAccepted(true);
            
        });

        peer.on('error', (err) => {
            console.error('Peer error:', err);
        });

        connectionRef.current = peer;
    };

    const answerCall = () => {
        setCallAccepted(true);
        setReceivingCall(false);

        const peer = new Peer({
            initiator: false, // This peer is not initiating
            trickle: false,
            stream: stream,
        });

        peer.on('signal', (data) => {
            socket.emit('signal', { targetId: callerSignal.senderId, signal: data });
        });

        peer.on('stream', (incomingStream) => {
            userVideo.current.srcObject = incomingStream;
        });

        peer.on('connect', () => {
            console.log('Peer connected (answered)!');
        });

        peer.on('error', (err) => {
            console.error('Peer error:', err);
        });

        peer.signal(callerSignal.signal); // Apply the received signal
        connectionRef.current = peer;
    };

    const shareScreen = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
            setScreenStream(screenStream);
            if (screenShareVideo.current) {
                screenShareVideo.current.srcObject = screenStream;
            }

            // Create a new Peer connection for screen sharing
            const screenPeer = new Peer({
                initiator: true,
                trickle: false,
                stream: screenStream,
            });

            screenPeer.on('signal', (data) => {
                // Send screen share signal to the other peer
                if (connectionRef.current && connectionRef.current.connected) {
                    socket.emit('screen-share-signal', { targetId: connectionRef.current._remoteTracks[0]._peer.id, signal: data });
                }
            });

            screenPeer.on('stream', (incomingScreenStream) => {
                screenShareVideo.current.srcObject = incomingScreenStream;
            });

            screenShareConnectionRef.current = screenPeer;

            // Stop sharing if the user stops it from the browser UI
            screenStream.getVideoTracks()[0].onended = () => {
                
                if (screenShareConnectionRef.current) {
                    screenShareConnectionRef.current.destroy();
                    setScreenStream(null);
                }
            };

        } catch (err) {
            console.error('Error sharing screen:', err);
        }
    };

    const stopScreenShare = () => {
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
            setScreenStream(null);
        }
        if (screenShareConnectionRef.current) {
            screenShareConnectionRef.current.destroy();
            screenShareConnectionRef.current = null;
        }
    };

    const startRecording = () => {
        if (!stream) {
            alert('Cannot record without a media stream.');
            return;
        }

        const combinedStream = new MediaStream();
        stream.getTracks().forEach(track => combinedStream.addTrack(track));
        if (screenStream) {
            screenStream.getTracks().forEach(track => combinedStream.addTrack(track));
        }

        mediaRecorderRef.current = new MediaRecorder(combinedStream);
        recordedChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunksRef.current.push(event.data);
            }
        };

        mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style = 'display: none';
            a.href = url;
            a.download = `recorded-call-${Date.now()}.webm`;
            a.click();
            window.URL.revokeObjectURL(url);
        };

        mediaRecorderRef.current.start();
        setRecording(true);
        socket.emit('start-recording', callerid); // Notify server
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setRecording(false);
            socket.emit('stop-recording', callerid); // Notify server
        }
    };
    
  return (
    <div style={{ padding: '20px' }}>
    <h1>Video Call Room: {callerid}</h1>

    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div>
            <h2>My Video</h2>
            <video playsInline muted ref={myVideo} autoPlay style={{ width: '400px', border: '1px solid gray' }} />
        </div>
        <div>
            <h2>Other User's Video</h2>
            {callAccepted ? (
                <video playsInline ref={userVideo} autoPlay style={{ width: '400px', border: '1px solid gray' }} />
            ) : (
                <p>Waiting for other user...</p>
            )}
        </div>
    </div>

    {screenStream && (
        <div>
            <h2>Screen Share</h2>
            <video playsInline ref={screenShareVideo} autoPlay style={{ width: '800px', border: '1px solid blue' }} />
        </div>
    )}

    <div style={{ marginTop: '20px' }}>
        {!callAccepted && receivingCall && (
            <button onClick={answerCall} style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px' }}>
                Answer Call
            </button>
        )}
        {!screenStream ? (
            <button onClick={shareScreen} style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px' }}>
                Share Screen
            </button>
        ) : (
            <button onClick={stopScreenShare} style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px', backgroundColor: 'orange' }}>
                Stop Screen Share
            </button>
        )}
        {!recording ? (
            <button onClick={startRecording} style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: 'green', color: 'white' }}>
                Start Recording
            </button>
        ) : (
            <button onClick={stopRecording} style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: 'red', color: 'white' }}>
                Stop Recording
            </button>
        )}
    </div>
</div>
);
}

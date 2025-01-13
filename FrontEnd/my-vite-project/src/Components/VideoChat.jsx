import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:3000"); // Backend URL

const VideoChat = ({ recipientSocketId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    // Ensure we have a valid recipientSocketId
    if (!recipientSocketId) return;

    // Create a new peer connection when the component mounts
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // STUN server for WebRTC
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('iceCandidate', {
          candidate: event.candidate,
          to: recipientSocketId, // Send ICE candidate to the other peer
        });
      }
    };

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0]; // Show remote video
    };

    // Get local media stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideoRef.current.srcObject = stream; // Show local video
        stream.getTracks().forEach(track => pc.addTrack(track, stream)); // Add local stream to peer connection
      });

    setPeerConnection(pc);

    // Clean up peer connection when the component unmounts
    return () => {
      pc.close();
    };
  }, [recipientSocketId]);

  const createOffer = async () => {
    if (!recipientSocketId || !peerConnection) return;

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Emit the offer to the recipient
    socket.emit('offer', {
      offer: offer,
      to: recipientSocketId, // Send offer to recipient
    });
  };

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted className="local-video"></video>
      <video ref={remoteVideoRef} autoPlay className="remote-video"></video>
      {/* Button to start the video chat */}
      <button onClick={createOffer}>Start Video Chat</button>
    </div>
  );
};

export default VideoChat;

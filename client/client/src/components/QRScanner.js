import React, { useRef, useEffect, useState } from 'react';

const QRScanner = ({ onScan }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const constraints = {
      video: { facingMode: 'environment' }
    };

    let animationFrameId;

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', true); // required to tell iOS safari we don't want fullscreen
          await videoRef.current.play();
          tick();
        }
      } catch (err) {
        setError('Error accessing camera: ' + err.message);
      }
    };

    const tick = () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Use jsQR or similar library here to scan QR code from canvas image data
        // For example:
        // const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
        // const code = jsQR(imageData.data, imageData.width, imageData.height);
        // if (code) {
        //   onScan(code.data);
        // }

        animationFrameId = requestAnimationFrame(tick);
      }
    };

    startVideo();

    return () => {
      const video = videoRef.current;
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [onScan]);

  return (
    <div style={{ textAlign: 'center' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <video ref={videoRef} style={{ width: '100%', maxWidth: '400px', borderRadius: '12px' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default QRScanner;

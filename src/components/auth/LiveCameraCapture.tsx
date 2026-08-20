import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle2, AlertCircle, Sparkles, Upload, ShieldCheck } from 'lucide-react';
import { Badge } from '../common/Badge';

interface LiveCameraCaptureProps {
  onPhotoCaptured: (photoDataUrl: string) => void;
  initialPhoto?: string;
}

export const LiveCameraCapture: React.FC<LiveCameraCaptureProps> = ({ onPhotoCaptured, initialPhoto }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(initialPhoto || null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Start webcam
  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 640 }
        },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access denied or unavailable. You can upload a clear photo instead.');
      setCameraActive(false);
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (!capturedPhoto) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, []);

  // Snap photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Mirror the horizontal axis for selfie preview
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPhoto(dataUrl);
      onPhotoCaptured(dataUrl);
      stopCamera();
    }
  };

  const startCountdownAndSnap = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          capturePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const result = event.target.result as string;
          setCapturedPhoto(result);
          onPhotoCaptured(result);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden Canvas for snapshot rendering */}
      <canvas ref={canvasRef} className="hidden" />
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        onChange={handleFileUpload} 
        className="hidden" 
      />

      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-violet-400" />
            Live Photo KYC Verification
          </h4>
          <Badge variant="purple">AI Secured</Badge>
        </div>
        <p className="text-xs text-slate-400">
          Position your face in the frame and snap a clear live selfie for Admin review.
        </p>
      </div>

      {/* Camera / Snapshot Box */}
      <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-2 border-violet-500/50 bg-slate-950 shadow-xl glow-purple flex items-center justify-center">
        
        {/* State 1: Photo Captured Preview */}
        {capturedPhoto ? (
          <div className="relative w-full h-full animate-in fade-in">
            <img 
              src={capturedPhoto} 
              alt="Live KYC Selfie" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-3">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Live Selfie Captured
              </span>
            </div>
          </div>
        ) : cameraActive ? (
          /* State 2: Live Video Stream */
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover -scale-x-100"
            />

            {/* Oval Face Guide Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-44 h-56 rounded-[50%] border-2 border-dashed border-violet-400/70 shadow-[0_0_20px_rgba(139,92,246,0.3)] animate-pulse-slow flex items-center justify-center">
                <span className="text-[10px] text-violet-200 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  Align Face Here
                </span>
              </div>
            </div>

            {/* Countdown Display */}
            {countdown !== null && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                <span className="text-6xl font-extrabold text-white animate-ping">
                  {countdown}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* State 3: Camera Offline or Error */
          <div className="p-4 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
            <p className="text-xs text-slate-300">
              {cameraError || 'Camera initializing...'}
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/50 text-xs font-bold text-violet-200 transition flex items-center gap-1.5 mx-auto"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Clear Selfie Photo</span>
            </button>
          </div>
        )}

      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-center gap-3 pt-1">
        {capturedPhoto ? (
          <button
            type="button"
            onClick={handleRetake}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-violet-400" />
            <span>Retake Selfie</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={startCountdownAndSnap}
              disabled={!cameraActive || countdown !== null}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
              <span>Take Live Selfie (3s)</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition"
              title="Upload photo from device"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Your photo is encrypted and only reviewed by authorized Super Admins.</span>
      </div>

    </div>
  );
};

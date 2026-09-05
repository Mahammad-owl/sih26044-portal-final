import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, Video, Upload, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function CameraDemonstration({ onSnapshotCaptured, onEvidenceUploaded, taskTitle }) {
  const [streamActive, setStreamActive] = useState(false);
  const [permissionError, setPermissionError] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'upload'
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const startCamera = async () => {
    setPermissionError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser environment. Please use file upload fallback.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setStreamActive(true);
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setPermissionError(err.message || 'Camera permission was denied or device is not available. Please use file upload.');
      setStreamActive(false);
      setActiveTab('upload');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
    if (recording) {
      clearInterval(timerRef.current);
      setRecording(false);
    }
  };

  const captureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Overlay verification timestamp & task
    context.fillStyle = 'rgba(15, 23, 42, 0.8)';
    context.fillRect(10, canvas.height - 40, canvas.width - 20, 30);
    context.fillStyle = '#38bdf8';
    context.font = '12px monospace';
    context.fillText(`SIH26044 Evidence | ${taskTitle || 'Practical Task'} | ${new Date().toLocaleTimeString()}`, 20, canvas.height - 20);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setSnapshot(dataUrl);
    if (onSnapshotCaptured) {
      onSnapshotCaptured(dataUrl);
    }
  };

  const toggleRecording = () => {
    if (!recording) {
      setRecording(true);
      setRecordSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRecording(false);
      // Auto-capture frame upon demonstration completion
      captureSnapshot();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      // Generate a mock evidence payload
      const mockEvidenceUrl = `uploads/evidence_${Date.now()}_${file.name}`;
      if (onEvidenceUploaded) {
        onEvidenceUploaded(mockEvidenceUrl, file.name);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="bg-slate-900 rounded-xl p-4 text-white border border-slate-700 shadow-md">
      {/* Header with Mode Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h4 className="text-sm font-semibold text-slate-100">
            Practical Demonstration Evidence
          </h4>
        </div>
        <div className="flex gap-1 bg-slate-800 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeTab === 'camera' ? 'bg-brand-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Camera
          </button>
          <button
            type="button"
            onClick={() => { stopCamera(); setActiveTab('upload'); }}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeTab === 'upload' ? 'bg-brand-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            File Upload Fallback
          </button>
        </div>
      </div>

      {activeTab === 'camera' ? (
        <div className="mt-3">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
            {streamActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
            ) : (
              <div className="text-center p-6">
                <Camera className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Click 'Start Camera' to record your hands-on demonstration, oscilloscope test, or live code explanation.
                </p>
                {permissionError && (
                  <div className="mt-2 text-amber-400 text-xs flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{permissionError}</span>
                  </div>
                )}
              </div>
            )}

            {/* Recording badge */}
            {recording && (
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-rose-600/90 text-white text-xs px-2.5 py-1 rounded-full animate-pulse font-mono">
                <span className="w-2 h-2 rounded-full bg-white" />
                REC 00:{recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds}
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Camera Action Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2">
            <div className="flex gap-2">
              {!streamActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white transition-all"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Start Camera
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-medium text-slate-200"
                  >
                    <CameraOff className="w-3.5 h-3.5" />
                    Stop Camera
                  </button>
                  <button
                    type="button"
                    onClick={captureSnapshot}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-xs font-semibold text-white"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Capture Snapshot
                  </button>
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all ${
                      recording ? 'bg-rose-600 hover:bg-rose-700 animate-pulse' : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    {recording ? 'Stop & Save Demo' : 'Record Demo'}
                  </button>
                </>
              )}
            </div>

            {snapshot && (
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Evidence Snapshot Attached</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* File Upload Fallback */
        <div className="mt-3">
          <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-brand-500 transition-colors">
            <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-xs text-slate-300 font-medium">Upload demonstration recording or test results</p>
            <p className="text-[11px] text-slate-500 mt-1">Supports MP4, WebM, PNG, PDF, Logic Analyzer captures (up to 25MB)</p>
            <label className="mt-3 inline-block cursor-pointer px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg border border-slate-600">
              Browse Files
              <input type="file" onChange={handleFileUpload} className="hidden" accept="video/*,image/*,.pdf,.zip" />
            </label>
          </div>
          {uploadedFileName && (
            <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Evidence attached: {uploadedFileName}</span>
            </div>
          )}
        </div>
      )}

      {/* Snapshot Preview if Captured */}
      {snapshot && (
        <div className="mt-3 pt-3 border-t border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Captured Demonstration Frame:</span>
          <div className="mt-1 relative rounded overflow-hidden border border-slate-700 max-w-[200px]">
            <img src={snapshot} alt="Captured evidence" className="w-full h-auto" />
          </div>
        </div>
      )}

      <p className="text-[10px] text-slate-500 mt-3 italic">
        * System Principle: Video/camera data is evaluated as supporting evidence of practical competence alongside code and assessment consistency.
      </p>
    </div>
  );
}

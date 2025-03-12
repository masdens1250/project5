import React, { useState, useRef, useEffect } from 'react';
import { Video, Users, Calendar, Plus, FileText, X, MessageSquare, Download, Mic, MicOff, Camera, CameraOff, Share, StopCircle, Send, Trash2 } from 'lucide-react';

export function VideoConference() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sharedFiles, setSharedFiles] = useState([
    { id: 1, name: 'تقرير التوجيه.pdf', size: '2.5 MB', date: 'منذ ساعة' },
    { id: 2, name: 'نتائج الاختبارات.xlsx', size: '1.8 MB', date: 'منذ 3 ساعات' },
    { id: 3, name: 'خطة التوجيه.docx', size: '950 KB', date: 'منذ يوم' }
  ]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filesContainerRef = useRef<HTMLDivElement>(null);

  const handleStartCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setIsCallActive(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const handleEndCall = () => {
    if (localVideoRef.current?.srcObject) {
      const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCallActive(false);
  };

  const handleToggleMute = () => {
    if (localVideoRef.current?.srcObject) {
      const audioTracks = (localVideoRef.current.srcObject as MediaStream).getAudioTracks();
      audioTracks.forEach(track => track.enabled = !track.enabled);
      setIsMuted(!isMuted);
    }
  };

  const handleToggleCamera = () => {
    if (localVideoRef.current?.srcObject) {
      const videoTracks = (localVideoRef.current.srcObject as MediaStream).getVideoTracks();
      videoTracks.forEach(track => track.enabled = !track.enabled);
      setIsCameraOff(!isCameraOff);
    }
  };

  const handleShareScreen = async () => {
    try {
      if (!isSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsSharing(true);
      } else {
        await handleStartCall();
        setIsSharing(false);
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSendFile = () => {
    if (selectedFile) {
      const newFile = {
        id: Date.now(),
        name: selectedFile.name,
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        date: 'الآن'
      };
      setSharedFiles(prevFiles => {
        const updatedFiles = [newFile, ...prevFiles];
        // Scroll to top after state update
        setTimeout(() => {
          if (filesContainerRef.current) {
            filesContainerRef.current.scrollTop = 0;
          }
        }, 0);
        return updatedFiles;
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteFile = (fileId: number) => {
    setSharedFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">مؤتمر الفيديو</h1>
        {!isCallActive && (
          <button 
            onClick={handleStartCall}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>بدء مكالمة جديدة</span>
          </button>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Zone de visioconférence */}
        <div className="lg:col-span-2 bg-[#1a2234] rounded-lg overflow-hidden flex flex-col">
          {isCallActive ? (
            <div className="relative flex-1 flex flex-col">
              {/* Vidéo distante */}
              <video
                ref={remoteVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
              />
              
              {/* Vidéo locale (petite fenêtre) */}
              <video
                ref={localVideoRef}
                className="absolute top-4 right-4 w-48 h-36 rounded-lg object-cover border-2 border-white"
                autoPlay
                playsInline
                muted
              />

              {/* Contrôles */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <div className="flex justify-center items-center gap-4">
                  <button
                    onClick={handleToggleMute}
                    className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600'} hover:bg-opacity-80`}
                  >
                    {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                  </button>
                  <button
                    onClick={handleToggleCamera}
                    className={`p-3 rounded-full ${isCameraOff ? 'bg-red-500' : 'bg-gray-600'} hover:bg-opacity-80`}
                  >
                    {isCameraOff ? <CameraOff className="w-6 h-6 text-white" /> : <Camera className="w-6 h-6 text-white" />}
                  </button>
                  <button
                    onClick={handleShareScreen}
                    className={`p-3 rounded-full ${isSharing ? 'bg-green-500' : 'bg-gray-600'} hover:bg-opacity-80`}
                  >
                    {isSharing ? <StopCircle className="w-6 h-6 text-white" /> : <Share className="w-6 h-6 text-white" />}
                  </button>
                  <button
                    onClick={handleEndCall}
                    className="p-3 rounded-full bg-red-500 hover:bg-red-600"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-white">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl">اضغط على "بدء مكالمة جديدة" للبدء</p>
              </div>
            </div>
          )}
        </div>

        {/* Panneau latéral */}
        <div className="flex flex-col gap-6 min-h-0">
          {/* Participants */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex-shrink-0">
            <h2 className="text-xl font-semibold mb-4">المشاركون</h2>
            <div className="space-y-4">
              {[
                { name: 'أحمد محمود', status: 'متصل', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
                { name: 'سارة خالد', status: 'متصل', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
              ].map((user, index) => (
                <div key={index} className="flex items-center gap-3 p-2">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <span className="text-sm text-green-600">{user.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partage de fichiers */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex-1 flex flex-col min-h-0">
            <h2 className="text-xl font-semibold mb-4">الملفات المشتركة</h2>
            <div 
              ref={filesContainerRef}
              className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2"
            >
              {sharedFiles.map((file) => (
                <div 
                  key={file.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <span className="text-sm text-gray-500">{file.size}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm text-gray-500">{file.date}</span>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Download className="w-5 h-5 text-gray-600 hover:text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Zone d'envoi de fichiers */}
            <div className="mt-4 pt-4 border-t">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                multiple
              />
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span>اختيار ملف</span>
                </button>
                <button
                  onClick={handleSendFile}
                  disabled={!selectedFile}
                  className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 ${
                    selectedFile
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              {selectedFile && (
                <div className="mt-2 text-sm text-gray-600">
                  تم اختيار: {selectedFile.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
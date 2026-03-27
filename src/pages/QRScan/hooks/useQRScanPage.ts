import type { ChangeEvent, RefObject } from 'react';

import { App } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';

type CameraStatus = 'loading' | 'ready' | 'error';

type CaptureRecord = {
  badgeLabel: 'SHOT' | 'UPLOAD';
  capturedAt: string;
  headline: string;
  photoUrl: string;
  summary: string;
};

type UseQRScanPageReturn = {
  cameraStatus: CameraStatus;
  cameraStatusText: string;
  captureRecord: CaptureRecord | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleCapturePhoto: () => Promise<void>;
  handleGalleryFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleOpenGallery: () => void;
  isCapturing: boolean;
  isFlashVisible: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
};

function formatCapturedAt(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

function revokeObjectUrl(photoUrl: string | null) {
  if (!photoUrl) {
    return;
  }

  URL.revokeObjectURL(photoUrl);
}

function stopMediaStream(stream: MediaStream | null) {
  if (!stream) {
    return;
  }

  stream.getTracks().forEach((track) => {
    track.stop();
  });
}

function resolveCameraErrorMessage(error: unknown) {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError') {
      return '카메라 권한이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해 주세요.';
    }

    if (error.name === 'NotFoundError' || error.name === 'OverconstrainedError') {
      return '사용 가능한 후면 카메라를 찾지 못했습니다. 다른 카메라로 다시 시도해 주세요.';
    }

    if (error.name === 'NotReadableError') {
      return '카메라가 다른 앱에서 사용 중입니다. 잠시 후 다시 시도해 주세요.';
    }
  }

  return '카메라를 시작하지 못했습니다. 권한과 기기 연결 상태를 확인해 주세요.';
}

async function requestCameraStream() {
  const rearCameraConstraints: MediaStreamConstraints = {
    audio: false,
    video: {
      facingMode: {
        ideal: 'environment',
      },
      height: {
        ideal: 1280,
      },
      width: {
        ideal: 720,
      },
    },
  };

  try {
    return await navigator.mediaDevices.getUserMedia(rearCameraConstraints);
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.name === 'OverconstrainedError' || error.name === 'NotFoundError')
    ) {
      return navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
    }

    throw error;
  }
}

export function useQRScanPage(): UseQRScanPageReturn {
  const { message } = App.useApp();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const latestPhotoUrlRef = useRef<string | null>(null);
  const flashTimerRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('loading');
  const [cameraStatusText, setCameraStatusText] = useState('후면 카메라를 연결하는 중입니다.');
  const [captureRecord, setCaptureRecord] = useState<CaptureRecord | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isFlashVisible, setIsFlashVisible] = useState(false);

  const triggerCaptureFlash = useCallback(() => {
    if (flashTimerRef.current) {
      window.clearTimeout(flashTimerRef.current);
    }

    setIsFlashVisible(true);
    flashTimerRef.current = window.setTimeout(() => {
      if (isMountedRef.current) {
        setIsFlashVisible(false);
      }
    }, 180);
  }, []);

  const updateCaptureRecord = useCallback((nextRecord: CaptureRecord) => {
    revokeObjectUrl(latestPhotoUrlRef.current);
    latestPhotoUrlRef.current = nextRecord.photoUrl;
    setCaptureRecord(nextRecord);
  }, []);

  const startCamera = useCallback(async () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    if (!window.isSecureContext) {
      setCameraStatus('error');
      setCameraStatusText(
        '카메라 프리뷰는 보안 연결(https 또는 localhost)에서만 사용할 수 있습니다.',
      );
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraStatus('error');
      setCameraStatusText('이 브라우저는 카메라 프리뷰를 지원하지 않습니다.');
      return;
    }

    setCameraStatus('loading');
    setCameraStatusText('후면 카메라를 연결하는 중입니다.');

    try {
      const nextStream = await requestCameraStream();

      if (!isMountedRef.current) {
        stopMediaStream(nextStream);
        return;
      }

      stopMediaStream(streamRef.current);
      streamRef.current = nextStream;

      const videoElement = videoRef.current;

      if (videoElement) {
        videoElement.srcObject = nextStream;

        try {
          await videoElement.play();
        } catch (error) {
          console.warn('Failed to start camera preview playback.', error);
        }
      }

      setCameraStatus('ready');
      setCameraStatusText('후면 카메라가 연결되었습니다. 버튼을 눌러 현재 화면을 촬영하세요.');
    } catch (error) {
      console.error('Failed to start QR camera preview.', error);

      if (!isMountedRef.current) {
        return;
      }

      setCameraStatus('error');
      setCameraStatusText(resolveCameraErrorMessage(error));
    }
  }, []);

  useEffect(() => {
    void startCamera();

    return () => {
      isMountedRef.current = false;

      if (flashTimerRef.current) {
        window.clearTimeout(flashTimerRef.current);
      }

      revokeObjectUrl(latestPhotoUrlRef.current);
      stopMediaStream(streamRef.current);
    };
  }, [startCamera]);

  const handleCapturePhoto = useCallback(async () => {
    if (cameraStatus !== 'ready') {
      await startCamera();
      return;
    }

    const videoElement = videoRef.current;

    if (!videoElement || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      message.warning('카메라 준비가 아직 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    setIsCapturing(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      const context = canvas.getContext('2d');

      if (!context) {
        message.error('사진 촬영을 준비하지 못했습니다. 다시 시도해 주세요.');
        return;
      }

      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      const photoBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.92);
      });

      if (!photoBlob) {
        message.error('사진 파일을 만들지 못했습니다. 다시 시도해 주세요.');
        return;
      }

      const capturedAt = formatCapturedAt(new Date());
      const photoUrl = URL.createObjectURL(photoBlob);

      updateCaptureRecord({
        badgeLabel: 'SHOT',
        capturedAt,
        headline: '후면 카메라 프레임을 촬영했습니다.',
        photoUrl,
        summary: '현재 화면을 캡처해 최근 기록에 반영했습니다.',
      });
      triggerCaptureFlash();
      message.success('사진을 촬영했습니다.');
    } finally {
      if (isMountedRef.current) {
        setIsCapturing(false);
      }
    }
  }, [cameraStatus, message, startCamera, triggerCaptureFlash, updateCaptureRecord]);

  const handleOpenGallery = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleGalleryFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];

      if (!selectedFile) {
        return;
      }

      const photoUrl = URL.createObjectURL(selectedFile);

      updateCaptureRecord({
        badgeLabel: 'UPLOAD',
        capturedAt: formatCapturedAt(new Date()),
        headline: selectedFile.name,
        photoUrl,
        summary: '갤러리 이미지를 불러와 최근 기록에 반영했습니다.',
      });
      message.success('갤러리 이미지를 불러왔습니다.');
      event.target.value = '';
    },
    [message, updateCaptureRecord],
  );

  return {
    cameraStatus,
    cameraStatusText,
    captureRecord,
    fileInputRef,
    handleCapturePhoto,
    handleGalleryFileChange,
    handleOpenGallery,
    isCapturing,
    isFlashVisible,
    videoRef,
  };
}

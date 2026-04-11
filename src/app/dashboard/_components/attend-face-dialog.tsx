'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { cn, handleApiError } from '@/lib/utils'
import { FaceService } from '@/service/face-recog/face-recog-service'
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import { CameraIcon, Loader2Icon, RefreshCwIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface AttendFaceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const BLINK_THRESHOLD = 0.6

export default function AttendFaceDialog({
  open,
  onOpenChange,
  onSuccess
}: AttendFaceDialogProps) {
  const [cameraActive, setCameraActive] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const landmarkerRef = useRef<FaceLandmarker | null>(null)
  const requestRef = useRef<number | null>(null)
  const lastBlinkRef = useRef<boolean>(false)
  const handleAutoCaptureRef = useRef<() => Promise<void>>(async () => {})
  const predictWebcamRef = useRef<() => void>(() => {})

  // Load MediaPipe Model
  useEffect(() => {
    const initLandmarker = async () => {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
      )
      const faceLandmarker = await FaceLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: 'GPU'
          },
          outputFaceBlendshapes: true,
          runningMode: 'VIDEO',
          numFaces: 1
        }
      )
      landmarkerRef.current = faceLandmarker
      setModelLoaded(true)
    }

    if (open && !landmarkerRef.current) {
      initLandmarker()
    }
  }, [open])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (requestRef.current) cancelAnimationFrame(requestRef.current)
    setCameraActive(false)
    setFaceDetected(false)
    setIsBlinking(false)
  }, [])

  const captureImage = useCallback((): Promise<File | null> => {
    return new Promise((resolve) => {
      const video = videoRef.current
      if (!video) return resolve(null)
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480
      const ctx = canvas.getContext('2d')
      if (!ctx) return resolve(null)
      ctx.drawImage(video, 0, 0)
      canvas.toBlob(
        (blob) => {
          if (blob)
            resolve(new File([blob], 'face-attend.jpg', { type: 'image/jpeg' }))
          else resolve(null)
        },
        'image/jpeg',
        0.92
      )
    })
  }, [])

  const handleAutoCapture = useCallback(async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    // Freeze video
    if (videoRef.current) videoRef.current.pause()
    if (requestRef.current) cancelAnimationFrame(requestRef.current)

    try {
      const image = await captureImage()
      if (!image) throw new Error('Failed to capture image')
      await FaceService.verify(image)
      toast.success('Successfully clock in!')
      stopCamera()
      onOpenChange(false)
      onSuccess?.()
    } catch (err: unknown) {
      toast.error(handleApiError(err, 'Failed to record attendance'))
      setHasError(true)
      lastBlinkRef.current = false
      if (videoRef.current && cameraActive) {
        videoRef.current.play().catch(() => {})
        requestRef.current = requestAnimationFrame(() =>
          predictWebcamRef.current()
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [
    captureImage,
    stopCamera,
    onOpenChange,
    onSuccess,
    isSubmitting,
    cameraActive
  ])

  handleAutoCaptureRef.current = handleAutoCapture

  const startCamera = useCallback(async () => {
    setHasError(false)
    lastBlinkRef.current = false
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setCameraActive(true)
      }
    } catch {
      toast.error('Cannot access camera. Please allow camera permission.')
    }
  }, [])

  const predictWebcam = useCallback(() => {
    if (!videoRef.current || !landmarkerRef.current || !cameraActive) return

    const startTimeMs = performance.now()
    const results = landmarkerRef.current.detectForVideo(
      videoRef.current,
      startTimeMs
    )

    if (results.faceLandmarks && results.faceLandmarks.length > 0) {
      setFaceDetected(true)

      // Use Blendshapes for eye blink detection
      const blendshapes = results.faceBlendshapes?.[0]?.categories
      if (blendshapes) {
        const eyeBlinkLeft =
          blendshapes.find((c) => c.categoryName === 'eyeBlinkLeft')?.score || 0
        const eyeBlinkRight =
          blendshapes.find((c) => c.categoryName === 'eyeBlinkRight')?.score ||
          0

        const isCurrentlyBlinking =
          eyeBlinkLeft > BLINK_THRESHOLD && eyeBlinkRight > BLINK_THRESHOLD

        if (isCurrentlyBlinking && !lastBlinkRef.current) {
          setIsBlinking(true)
        } else if (!isCurrentlyBlinking && lastBlinkRef.current) {
          setIsBlinking(false)
          handleAutoCaptureRef.current()
          return
        }
        lastBlinkRef.current = isCurrentlyBlinking
      }
    } else {
      setFaceDetected(false)
    }

    requestRef.current = requestAnimationFrame(predictWebcam)
  }, [cameraActive])

  predictWebcamRef.current = predictWebcam

  useEffect(() => {
    if (cameraActive && modelLoaded) {
      requestRef.current = requestAnimationFrame(predictWebcam)
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [cameraActive, modelLoaded, predictWebcam])

  // Cleanup when dialog closes
  useEffect(() => {
    if (!open) {
      stopCamera()
      setTimeout(() => {
        setIsSubmitting(false)
      }, 200)
    }
  }, [open, stopCamera])

  const title = 'Clock In - Face Recognition'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="[&>button]:hidden p-0 gap-0 !max-w-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">
            Attend using face recognition
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          {/* Camera view */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border-2 border-blue-400">
            <video
              ref={videoRef}
              className="h-full w-full object-cover -scale-x-100"
              autoPlay
              muted
              playsInline
            />

            {/* Circle face guide */}
            {cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/30" />
                <div
                  className={cn(
                    'relative z-10 h-74 w-74 rounded-full border-4 transition-colors duration-300',
                    faceDetected ? 'border-white' : 'border-white/40'
                  )}
                />
              </div>
            )}

            {/* Blink indicator */}
            {cameraActive && faceDetected && !isSubmitting && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl bg-black/40 px-4 py-3 backdrop-blur-sm transition-all duration-300',
                    isBlinking ? 'scale-110 border-2 border-white' : 'scale-100'
                  )}
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-white">
                    {isBlinking ? 'Nice! Keep it' : 'Blink to Capture'}
                  </p>
                  <div className="flex gap-1.5">
                    <div
                      className={cn(
                        'h-1.5 w-6 rounded-full transition-all duration-300',
                        isBlinking ? 'bg-white' : 'bg-white/40'
                      )}
                    />
                    <div
                      className={cn(
                        'h-1.5 w-6 rounded-full transition-all duration-300',
                        isBlinking ? 'bg-white' : 'bg-white/40'
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submitting overlay */}
            {isSubmitting && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                <Loader2Icon className="h-10 w-10 animate-spin text-white" />
                <p className="mt-2 text-sm font-medium text-white">
                  Verifying Face...
                </p>
              </div>
            )}

            {/* Model loading */}
            {!modelLoaded && open && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                <div className="flex flex-col items-center gap-2">
                  <Loader2Icon className="h-8 w-8 animate-spin text-white" />
                </div>
              </div>
            )}

            {/* Scanning status */}
            {cameraActive && !faceDetected && !isSubmitting && (
              <div className="absolute inset-x-0 bottom-3 flex justify-center z-20">
                <span className="rounded-full bg-black/60 px-4 py-1 text-xs text-white">
                  Scanning for face...
                </span>
              </div>
            )}

            {/* Activate camera placeholder */}
            {!cameraActive && modelLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <CameraIcon className="h-22 w-22 text-white/40" />
                <p className="text-lg text-white/50">Camera not active</p>
              </div>
            )}
          </div>

          {/* Status and Action Section */}
          {!cameraActive && (
            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground px-4">
                Click below to activate camera for face recognition attendance
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  onClick={startCamera}
                  disabled={isSubmitting || !modelLoaded}
                >
                  {hasError ? (
                    <>
                      <RefreshCwIcon className="mr-2 h-4 w-4" />
                      Try Again
                    </>
                  ) : (
                    <>
                      <CameraIcon className="mr-2 h-4 w-4" />
                      Activate Camera
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-11 border border-gray-300"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {cameraActive && (
            <div className="rounded-lg bg-blue-50 p-3 flex items-center gap-3 border border-blue-100">
              <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <div className="h-1 w-1 rounded-full bg-white animate-ping" />
              </div>
              <p className="text-xs text-blue-700 leading-relaxed">
                Position your face in the center and{' '}
                <span className="font-bold">blink your eyes</span> to record
                attendance automatically.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

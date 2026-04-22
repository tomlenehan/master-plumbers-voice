import { useState, useEffect, useRef, useCallback } from 'react'
import './VoiceCall.css'

function VoiceCall({ isOpen, onClose }) {
  const [status, setStatus] = useState('idle') // idle | connecting | connected | error | ended
  const [transcript, setTranscript] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [audioLevel, setAudioLevel] = useState(0)

  const wsRef = useRef(null)
  const audioContextRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const processorRef = useRef(null)
  const audioQueueRef = useRef([])
  const isPlayingRef = useRef(false)
  const analyserRef = useRef(null)
  const animationFrameRef = useRef(null)
  const sampleRateRef = useRef(24000)

  const BASE_URL = import.meta.env.VITE_WS_URL || `wss://${window.location.host}`

  // Audio visualization loop
  const startVisualization = useCallback(() => {
    if (!analyserRef.current) return
    const loop = () => {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
      setAudioLevel(average / 255)
      animationFrameRef.current = requestAnimationFrame(loop)
    }
    animationFrameRef.current = requestAnimationFrame(loop)
  }, [])

  const stopVisualization = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    setAudioLevel(0)
  }, [])

  // Play queued audio chunks
  const playNextChunk = useCallback(async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) return
    isPlayingRef.current = true

    const base64 = audioQueueRef.current.shift()
    try {
      const binaryString = atob(base64)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const pcm16 = new Int16Array(bytes.buffer)
      const float32 = new Float32Array(pcm16.length)
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768.0
      }

      const audioBuffer = audioContextRef.current.createBuffer(1, float32.length, sampleRateRef.current)
      audioBuffer.copyToChannel(float32, 0)
      const source = audioContextRef.current.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContextRef.current.destination)
      source.onended = () => {
        isPlayingRef.current = false
        playNextChunk()
      }
      source.start()
    } catch (e) {
      isPlayingRef.current = false
      playNextChunk()
    }
  }, [])

  const enqueueAudio = useCallback((base64Chunk) => {
    audioQueueRef.current.push(base64Chunk)
    playNextChunk()
  }, [playNextChunk])

  // Initialize call
  const startCall = useCallback(async () => {
    setStatus('connecting')
    setErrorMessage('')
    setTranscript('')
    audioQueueRef.current = []
    isPlayingRef.current = false

    try {
      // Initialize AudioContext at 24kHz to match xAI default
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: sampleRateRef.current,
      })

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream

      // Set up analyser for visualization
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      startVisualization()

      // Connect to backend WebSocket
      const ws = new WebSocket(`${BASE_URL}/ws/voice`)
      wsRef.current = ws

      ws.onopen = () => {
        setStatus('connected')
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        switch (data.type) {
          case 'connected':
            setStatus('connected')
            break
          case 'session_ready':
            // Start sending audio once session is configured
            startAudioCapture(ws, stream)
            break
          case 'audio':
            enqueueAudio(data.audio)
            break
          case 'transcript':
            setTranscript(prev => prev + data.delta)
            break
          case 'response_done':
            // Response completed
            break
          case 'error':
            setErrorMessage(data.message)
            setStatus('error')
            break
          case 'pong':
            // Heartbeat response
            break
          default:
            break
        }
      }

      ws.onerror = () => {
        setErrorMessage('WebSocket error')
        setStatus('error')
      }

      ws.onclose = () => {
        if (status !== 'ended' && status !== 'error') {
          setStatus('ended')
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to start call')
      setStatus('error')
    }
  }, [BASE_URL, startVisualization, enqueueAudio, status])

  // Capture microphone audio and send to backend
  const startAudioCapture = (ws, stream) => {
    const audioContext = audioContextRef.current
    const input = audioContext.createMediaStreamSource(stream)
    const bufferSize = 4096
    const processor = audioContext.createScriptProcessor(bufferSize, 1, 1)
    processorRef.current = processor

    processor.onaudioprocess = (e) => {
      if (ws.readyState !== WebSocket.OPEN || isMuted) return
      const inputData = e.inputBuffer.getChannelData(0)
      // Convert Float32 to Int16 (PCM16 little-endian)
      const int16Data = new Int16Array(inputData.length)
      for (let i = 0; i < inputData.length; i++) {
        int16Data[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF
      }
      const bytes = new Uint8Array(int16Data.buffer)
      const base64 = btoa(String.fromCharCode(...bytes))
      ws.send(JSON.stringify({ type: 'audio', audio: base64 }))
    }

    input.connect(processor)
    processor.connect(audioContext.destination)
  }

  // End call and cleanup
  const endCall = useCallback(() => {
    setStatus('ended')
    stopVisualization()

    if (wsRef.current) {
      try {
        wsRef.current.send(JSON.stringify({ type: 'end' }))
      } catch (e) { /* ignore */ }
      try {
        wsRef.current.close()
      } catch (e) { /* ignore */ }
      wsRef.current = null
    }

    if (processorRef.current) {
      try {
        processorRef.current.disconnect()
      } catch (e) { /* ignore */ }
      processorRef.current = null
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close()
      } catch (e) { /* ignore */ }
      audioContextRef.current = null
    }

    audioQueueRef.current = []
    isPlayingRef.current = false
    onClose()
  }, [onClose, stopVisualization])

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getAudioTracks().forEach(track => {
          track.enabled = !next
        })
      }
      return next
    })
  }, [])

  // Start call when modal opens
  useEffect(() => {
    if (isOpen && status === 'idle') {
      startCall()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVisualization()
      if (wsRef.current) {
        try { wsRef.current.close() } catch (e) { /* ignore */ }
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
      }
      if (audioContextRef.current) {
        try { audioContextRef.current.close() } catch (e) { /* ignore */ }
      }
    }
  }, [stopVisualization])

  if (!isOpen) return null

  const statusLabels = {
    idle: 'Initializing...',
    connecting: 'Please wait...',
    connected: 'On Call',
    error: 'Call Error',
    ended: 'Call Ended',
  }

  return (
    <div className="voice-call-overlay">
      <div className="voice-call-modal">
        <div className="voice-call-header">
          <h3>Master Plumbers</h3>
          <div className={`call-status ${status}`}>
            <span className="status-dot"></span>
            {statusLabels[status] || status}
          </div>
        </div>

        <div className="voice-call-body">
          <div className="audio-visualizer">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="viz-bar"
                style={{
                  height: status === 'connected'
                    ? `${Math.max(8, audioLevel * 100 * (0.5 + Math.random() * 0.5))}%`
                    : '8%',
                  animationDuration: `${0.4 + i * 0.05}s`,
                }}
              />
            ))}
          </div>

          {transcript && (
            <div className="transcript-box">
              <p>{transcript}</p>
            </div>
          )}

          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}
        </div>

        <div className="voice-call-controls">
          <button
            className={`control-btn mute-btn ${isMuted ? 'muted' : ''}`}
            onClick={toggleMute}
            disabled={status !== 'connected'}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            )}
          </button>

          <button
            className="control-btn end-call-btn"
            onClick={endCall}
            title="End Call"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L10.68 13.31z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default VoiceCall

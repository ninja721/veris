'use client'

import { useState, useRef } from 'react'
import { Image, Video, Type, X, Upload, Send } from 'lucide-react'

type SubmitMode = 'text' | 'image' | 'video'

export default function SubmitPage() {
  const [mode, setMode] = useState<SubmitMode>('text')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (mode === 'text' && !text.trim()) return
    if ((mode === 'image' || mode === 'video') && !file) return

    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()

      if (mode === 'text') {
        formData.append('text', text)
      } else {
        if (file) formData.append('file', file)
        if (text.trim()) formData.append('text', text)
      }

      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        setText('')
        setFile(null)
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to submit. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  function handleFileSelect(selectedFile: File) {
    const isImage = selectedFile.type.startsWith('image/')
    const isVideo = selectedFile.type.startsWith('video/')

    if (!isImage && !isVideo) {
      alert('Please upload only images or videos')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File too large. Maximum size is 10MB.')
      return
    }

    setFile(selectedFile)
    setMode(isImage ? 'image' : 'video')
  }

  return (
    <div className="min-h-screen bg-paper-800 py-8 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="newspaper-card transform rotate-1 transition-transform hover:rotate-0 duration-500">
          {/* Header */}
          <div className="border-b-2 border-ink-900 pb-4 mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-black text-ink-900 uppercase tracking-tight">
                Submit a Tip
              </h1>
              <p className="font-mono text-xs text-ink-600 mt-1 uppercase tracking-widest">
                Help us verify the truth
              </p>
            </div>
            {loading && (
              <div className="font-mono text-xs font-bold text-ink-500 animate-pulse uppercase border border-ink-500 px-2 py-1">
                Transmitting...
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Mode Selector */}
            <div className="flex gap-4 border-b border-ink-300 pb-6">
              <button
                onClick={() => setMode('text')}
                className={`flex-1 flex flex-col items-center gap-2 p-4 border-2 transition-all ${mode === 'text'
                    ? 'bg-ink-900 text-paper-100 border-ink-900 shadow-md transform -translate-y-1'
                    : 'bg-paper-100 text-ink-600 border-ink-300 hover:border-ink-900 hover:text-ink-900'
                  }`}
              >
                <Type size={24} />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">Text</span>
              </button>
              <button
                onClick={() => setMode('image')}
                className={`flex-1 flex flex-col items-center gap-2 p-4 border-2 transition-all ${mode === 'image'
                    ? 'bg-ink-900 text-paper-100 border-ink-900 shadow-md transform -translate-y-1'
                    : 'bg-paper-100 text-ink-600 border-ink-300 hover:border-ink-900 hover:text-ink-900'
                  }`}
              >
                <Image size={24} />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">Image</span>
              </button>
              <button
                onClick={() => setMode('video')}
                className={`flex-1 flex flex-col items-center gap-2 p-4 border-2 transition-all ${mode === 'video'
                    ? 'bg-ink-900 text-paper-100 border-ink-900 shadow-md transform -translate-y-1'
                    : 'bg-paper-100 text-ink-600 border-ink-300 hover:border-ink-900 hover:text-ink-900'
                  }`}
              >
                <Video size={24} />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">Video</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'text' ? (
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full min-h-[300px] p-6 text-lg font-serif bg-paper-50 border-2 border-ink-200 focus:border-ink-900 focus:ring-0 resize-none placeholder:text-ink-400 transition-colors"
                    placeholder="Type your story here..."
                    autoFocus
                  />
                  <div className="absolute bottom-4 right-4 font-mono text-xs text-ink-400">
                    {text.length} chars
                  </div>
                </div>
              ) : (
                <div
                  className={`aspect-video rounded-sm border-2 border-dashed flex flex-col items-center justify-center transition-all ${dragActive
                      ? 'border-ink-900 bg-paper-200'
                      : 'border-ink-300 bg-paper-50 hover:border-ink-500'
                    }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="relative w-full h-full p-2">
                      {mode === 'image' ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <video
                          src={URL.createObjectURL(file)}
                          className="w-full h-full object-contain"
                          controls
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="absolute top-4 right-4 p-2 bg-ink-900 text-paper-100 hover:bg-ink-700 transition-colors border border-paper-100 shadow-md"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-16 h-16 border-2 border-ink-300 rounded-full flex items-center justify-center mx-auto mb-4 text-ink-400">
                        <Upload size={32} />
                      </div>
                      <p className="text-xl font-heading font-bold text-ink-900 mb-2">
                        Drop Evidence Here
                      </p>
                      <p className="font-serif text-ink-600 mb-6">
                        or
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-secondary text-sm"
                      >
                        Select File
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={mode === 'image' ? 'image/*' : 'video/*'}
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              )}

              {(mode === 'image' || mode === 'video') && file && (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full p-4 border-2 border-ink-200 bg-paper-50 focus:border-ink-900 focus:ring-0 resize-none font-serif text-sm"
                  placeholder="Add context to this evidence..."
                  rows={3}
                />
              )}

              <div className="flex items-center justify-end pt-6 border-t-2 border-ink-900">
                <button
                  type="submit"
                  disabled={loading || (mode === 'text' && !text.trim()) || ((mode === 'image' || mode === 'video') && !file)}
                  className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  {loading ? (
                    'Transmitting...'
                  ) : (
                    <>
                      Submit for Verification <Send size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Result Notification */}
        {result && (
          <div className={`mt-6 p-6 border-2 ${result.success
              ? 'bg-paper-100 border-ink-900'
              : 'bg-paper-100 border-ink-900'
            } shadow-xl relative overflow-hidden`}>
            {/* Stamp Effect */}
            <div className={`absolute top-4 right-4 border-4 ${result.success ? 'border-green-800 text-green-800' : 'border-red-800 text-red-800'
              } p-2 font-black uppercase tracking-widest transform rotate-12 opacity-80 text-xl pointer-events-none`}>
              {result.success ? 'RECEIVED' : 'REJECTED'}
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-heading font-bold text-ink-900 mb-2">
                  {result.success ? 'Submission Received' : 'Transmission Error'}
                </h3>
                <p className="font-serif text-ink-700">
                  {result.message}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

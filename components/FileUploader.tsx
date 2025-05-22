/*
MIT License

Copyright (c) 2024 Diky Diwo Suwanto

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

--- code modified by Andrei Dascalu*/

'use client'

import {
  ChangeEvent,
  FormEvent,
  useRef,
  useState
} from 'react'

export default function FileUploader(props: {bucket: string}) {
  const { bucket } = props
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [fileName, setFileName] = useState<string>('')
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    abortControllerRef.current = new AbortController()

    try {
      setError(null)
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: fileName, fileType: file.type, bucket: bucket })
      })
      const { signedUrl, error } = await response.json()

      if (!signedUrl) {
        return setError(error)
      }

      await uploadFileWithProgress(
        file,
        signedUrl,
        abortControllerRef.current.signal
      )
      setFile(null)
      setFileName('')
      window.dispatchEvent(new CustomEvent('file-uploaded'))
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Upload cancelled')
      } else {
        console.error('Error uploading file:', error)
        alert('Error uploading file')
      }
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      abortControllerRef.current = null
    }
  }

  const uploadFileWithProgress = (
    file: File,
    signedUrl: string,
    signal: AbortSignal
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.open('PUT', signedUrl)
      xhr.setRequestHeader('Content-Type', file.type)

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100
          setUploadProgress(percentComplete)
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve()
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      }

      xhr.onerror = () => {
        reject(new Error('Upload failed'))
      }

      xhr.send(file)

      signal.addEventListener('abort', () => {
        xhr.abort()
        reject(new Error('Upload cancelled'))
      })
    })
  }

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const handleFileNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value)
  }

  let [error, setError] = useState<string | null>(null)

  return (
    <>
    <div className="w-full mx-auto mt-6 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Adaugă o lectură</h2>
      {error && <>
      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
        <span className="font-medium">Eroare!</span> {error}
      </div>
      </>}
      <form onSubmit={handleUpload} className="mb-8">
        <div className="flex-1 items-center space-y-4">
          <label className="flex-1 block">
            <span className="text-gray-700">Titlu</span>
            <input
              type="text"
              value={fileName}
              onChange={handleFileNameChange}
              disabled={isUploading}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex-1">
              <input
                type="file"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
                id="file-upload"
              />
              <div className="cursor-pointer bg-blue-50 text-blue-500 rounded-lg px-4 py-2 border border-blue-300 hover:bg-blue-100 transition duration-300">
                {file ? file.name : 'Alege un fișier'}
                  <span className="text-sm text-gray-500 ml-2">
                      {file ? `(${file.size > 1024 * 900 ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : (file.size / 1024).toFixed(2) + ' KB'})` : ''}
                  </span>
              </div>
            </label>
            <button
              type="submit"
              disabled={!file || isUploading || !fileName}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              {isUploading ? 'Se încarcă...' : 'Încarcă fișierul'}
            </button>
          </div>
        </div>
      </form>

      {isUploading && (
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {uploadProgress.toFixed(2)}% încărcat
            </p>
            <button
              onClick={handleCancelUpload}
              className="text-red-500 hover:text-red-600 transition duration-300"
            >
              Anulează încărcarea
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  )
}

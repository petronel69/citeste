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

import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef
} from 'react'
import { FileObject } from '@/app/lib/r2'
import { stringToHexcolor } from '@/app/lib/utils'
import { useSession } from 'next-auth/react'
import { Trash2, Download } from 'lucide-react'

export function FileListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-md shadow-md flex flex-col justify-between border-t border-gray-200 animate-pulse opacity-60"
        >
          <div className="flex-1 animate-pulse">
            <h3 className="font-light text-lg text-gray-800 truncate mb-1">━━━━━━━━━━━━━━━━━━━━━━━</h3>
            <p className="font-light text-sm text-gray-500">━━━━━━━━━━━━━━━━━━━━━━━━━</p>
            <p className="font-light text-sm text-gray-500">━━━━━━━━━━━━━━━━━━━━━━━━━</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function FileList(props: {bucket: string, clasa: any[]}) {
  const { bucket, clasa } = props
  const [files, setFiles] = useState<FileObject[] | null>(null)
  const session = useSession()

  useEffect(() => {
    fetchFiles(bucket)
  }, [])

  const fetchFiles = async (bucket: string) => {
    try {
      const response = await fetch(`/api/files?${bucket}`)
      const data = await response.json()
      setFiles(Array.isArray(data) ? data : null)
    } catch (error) {
      console.error('Error fetching files:', error)
      setFiles([])
    }
  }

  const handleDownload = async (key: string) => {
    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, bucket })
      })
      const { signedUrl } = await response.json()
      setTimeout(() => window.open(signedUrl, '_top'))
    } catch (error) {
      console.error('Error downloading file:', error)
      alert('Error downloading file')
    }
  }
  useEffect(() => {
    const handleFileUploaded = (event: Event) => {
      fetchFiles(bucket)
    }

    window.addEventListener('file-uploaded', handleFileUploaded)
    return () => window.removeEventListener('file-uploaded', handleFileUploaded)
  }, [])

  const handleDelete = async (key: string) => {
    try {
      await fetch('/api/files', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, bucket })
      })
      // alert('File deleted successfully!')
      fetchFiles(bucket)
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Error deleting file')
    }
  }

  if(!files) {
    return (
      <FileListSkeleton />
    )
  }

  return (
    <>
      {files?.length === 0 ? (
        <p className="text-gray-500 italic">Nicio lectură disponibilă</p>
      ) : (
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
          {files
            ?.slice()
            .sort((a, b) => (a.LastModified || 0) < (b.LastModified || 0) ? 1 : -1)
            .map((file) => (
              <div
                key={file.Key}
                className="bg-white p-4 rounded-md shadow-md flex flex-col justify-between border-t border-gray-200 animate-fadeIn"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800 truncate mb-1">{file.Key?.replace(/\.pdf$/, '')}</h3>
                  <p className="text-sm text-gray-500">
                    {file.LastModified ? new Intl.DateTimeFormat('ro', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(file.LastModified)) : 'Niciună'}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  {clasa[0]?.created_by === session?.data?.user?.id && (
                    <button
                      onClick={() => file.Key && handleDelete(file.Key)}
                      className="text-red-500 hover:text-red-800 hover:cursor-pointer transition duration-300 font-semibold flex items-center gap-x-1 bg-red-50 hover:bg-red-100 rounded-md p-2"
                    >
                      <Trash2 className="h-5 w-5" />
                      Șterge
                    </button>
                  )}
                  <button
                    onClick={() => file.Key && handleDownload(file.Key)}
                    className="text-blue-500 hover:text-blue-800 hover:cursor-pointer transition duration-300 font-semibold ml-auto flex items-center gap-x-3 bg-blue-50 hover:bg-blue-100 rounded-md p-2"
                  >
                    Descarcă 
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
      <style jsx>{`
        .animate-fadeIn {
          opacity: 0;
          animation: fadeIn 0.5s forwards;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          } 
        }
      `}
      </style>
    </>
  )
}

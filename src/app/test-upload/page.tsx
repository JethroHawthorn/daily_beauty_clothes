'use client';

import { useState } from 'react';
import { uploadImages } from '@/app/actions/upload-images';

export default function TestUploadPage() {
  const [status, setStatus] = useState<string>('');
  const [urls, setUrls] = useState<string[]>([]);

  async function handleSubmit(formData: FormData) {
    setStatus('Uploading...');
    setUrls([]);
    const result = await uploadImages(formData);

    if (result.success && result.urls) {
      setStatus('Upload Successful!');
      setUrls(result.urls);
    } else {
      setStatus(`Upload Failed: ${result.error}`);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Google Drive Upload</h1>
      <form action={handleSubmit} className="space-y-4">
        <input
          type="file"
          name="files"
          accept="image/*"
          multiple
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </form>

      {status && <p className="mt-4 font-semibold">{status}</p>}

      {urls.length > 0 && (
        <div className="mt-4">
          <h2 className="font-bold">Uploaded URLs:</h2>
          <ul className="list-disc pl-5">
            {urls.map((url, i) => (
              <li key={i}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

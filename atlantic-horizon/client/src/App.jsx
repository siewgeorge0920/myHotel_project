import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/test')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err))
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-8">
        Atlantic Horizon
      </h1>
      <p className="text-xl mb-4 text-center">
        Vite React + Tailwind CSS + Express Backend 🚀
      </p>
      
      <div className="p-6 max-w-md w-full bg-slate-800 rounded-xl shadow-[0_0_15px_rgba(52,211,153,0.3)] border border-emerald-500/20">
        <div className="flex flex-col space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Message from Server (/api/test)</div>
          <p className="text-lg text-gray-200">
            {message ? message : "Waiting for backend..."}
          </p>
        </div>
      </div>
      
      <div className="mt-12 text-sm text-gray-400">
        <p>Images go in <code className="bg-gray-800 px-1 py-0.5 rounded text-blue-300">client/src/assets/</code> or <code className="bg-gray-800 px-1 py-0.5 rounded text-blue-300">client/public/</code></p>
      </div>
    </div>
  )
}

export default App

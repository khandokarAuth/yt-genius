import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Sparkles, Play } from 'lucide-react'

export default function Auth() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin // অটোমেটিক অ্যাপে ফেরত আসবে
      }
    })
    if (error) alert(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-genius-dark bg-genius-gradient relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-genius-purple rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-genius-accent rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* Glass Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-genius-accent to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <Play className="text-white w-8 h-8 fill-current" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">YT Genius</h1>
        <p className="text-gray-300 mb-8">AI-Powered YouTube Growth Engine</p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-white text-genius-dark font-bold py-3 px-6 rounded-xl hover:bg-genius-accent transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
        >
          {loading ? 'Connecting...' : (
            <>
              <Sparkles className="w-5 h-5 text-yellow-600" />
              Continue with Google
            </>
          )}
        </button>
        
        <p className="mt-6 text-xs text-white/40">
          Zero Cost. High Performance. Secure.
        </p>
      </div>
    </div>
  )
}
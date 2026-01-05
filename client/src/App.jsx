import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // 2. Listen for auth changes (Login/Logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-genius-dark flex items-center justify-center text-genius-accent">
        Loading System...
      </div>
    )
  }

  // যদি সেশন না থাকে -> লগিন পেজ দেখাও
  if (!session) {
    return <Auth />
  }

  // যদি সেশন থাকে -> ড্যাশবোর্ড দেখাও
  return <Dashboard session={session} />
}

export default App
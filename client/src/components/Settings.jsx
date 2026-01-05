import { User, CreditCard, Bell, Shield, Mail, Zap } from 'lucide-react'

export default function Settings({ user, coins }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in p-4">
      <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
        <SettingsIcon className="w-6 h-6 text-gray-400" />
        Settings
      </h2>
      <p className="text-gray-400 mb-8">Manage your account preferences and subscription.</p>
      
      {/* 1. Profile Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-genius-accent to-blue-500 p-1 shadow-lg shadow-genius-accent/20">
            {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full rounded-full border-2 border-[#0d1117]" />
            ) : (
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-2xl font-bold">
                    {user?.email?.[0].toUpperCase()}
                </div>
            )}
        </div>
        <div>
            <h3 className="text-xl font-bold text-white">{user?.user_metadata?.full_name || 'Creator'}</h3>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <div className="flex items-center gap-3 mt-3">
                <span className="px-3 py-1 bg-genius-accent/10 border border-genius-accent/20 text-genius-accent text-xs rounded-full font-bold uppercase tracking-wider">
                    Free Plan
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 text-xs rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    {coins} Coins Left
                </span>
            </div>
        </div>
      </div>

      {/* 2. Settings Grid */}
      <div className="grid gap-4">
          {/* Subscription */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-xl flex items-center justify-between hover:bg-white/10 transition cursor-pointer group">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:bg-blue-500/20 transition"><CreditCard className="w-5 h-5"/></div>
                  <div>
                      <p className="font-medium text-white">Subscription</p>
                      <p className="text-sm text-gray-500">Upgrade to Pro for unlimited audits</p>
                  </div>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-genius-accent to-emerald-500 text-black font-bold rounded-lg text-sm hover:opacity-90 transition">
                Upgrade
              </button>
          </div>

          {/* Notifications */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-xl flex items-center justify-between hover:bg-white/10 transition cursor-pointer group">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:bg-purple-500/20 transition"><Bell className="w-5 h-5"/></div>
                  <div>
                      <p className="font-medium text-white">Notifications</p>
                      <p className="text-sm text-gray-500">Receive weekly growth reports</p>
                  </div>
              </div>
              <div className="w-10 h-5 bg-white/20 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0 border-2 border-gray-600"></div>
              </div>
          </div>

          {/* Support */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-xl flex items-center justify-between hover:bg-white/10 transition cursor-pointer group">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400 group-hover:bg-orange-500/20 transition"><Mail className="w-5 h-5"/></div>
                  <div>
                      <p className="font-medium text-white">Support</p>
                      <p className="text-sm text-gray-500">Contact our engineering team</p>
                  </div>
              </div>
          </div>
      </div>

      <div className="pt-8 text-center text-xs text-gray-600">
        <p>YT-Genius Architect v1.0.0 (MVP)</p>
        <p>ID: {user?.id}</p>
      </div>
    </div>
  )
}

function SettingsIcon({className}) {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
}
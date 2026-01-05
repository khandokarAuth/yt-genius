import { LogOut, Zap, LayoutGrid, Command, FileText, Image as ImageIcon, BarChart3, Settings, PanelLeftClose, PanelLeftOpen, Wand2, History } from 'lucide-react'

export default function Sidebar({ task, setTask, coins, onSignOut, isCollapsed, toggleSidebar }) {
  
  const menuItems = [
    { id: 'metadata', label: 'Metadata Kit', icon: <Wand2 className="w-5 h-5" /> }, // 👈 New
    { id: 'audit', label: 'Deep Audit', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'script', label: 'Video Script', icon: <FileText className="w-5 h-5" /> },
    { id: 'thumbnail', label: 'Thumbnail Rater', icon: <ImageIcon className="w-5 h-5" /> },
    { id: 'history', label: 'History', icon: <History className="w-5 h-5" /> },
  ]

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-black/20 backdrop-blur-2xl border-r border-white/5 flex flex-col relative z-20 pt-6 transition-all duration-300 ease-in-out`}>
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 bg-[#161b22] border border-white/10 text-gray-400 hover:text-white p-1 rounded-full shadow-lg z-50 transition hover:scale-110"
      >
        {isCollapsed ? <PanelLeftOpen className="w-3 h-3" /> : <PanelLeftClose className="w-3 h-3" />}
      </button>

      {/* Brand */}
      <div className={`px-5 mb-8 flex items-center gap-3 text-white/80 ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 min-w-[32px] bg-gradient-to-tr from-genius-accent to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-genius-accent/20">
           <span className="text-xs font-bold text-black font-mono">YT</span>
        </div>
        {!isCollapsed && <span className="font-semibold tracking-tight text-sm text-white whitespace-nowrap overflow-hidden">Genius Architect</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2">
        {!isCollapsed && <p className="px-3 text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest opacity-80">Tools</p>}
        
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTask(item.id)}
            title={isCollapsed ? item.label : ''}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
              task === item.id 
                ? 'bg-white/10 text-white shadow-sm' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            {task === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-genius-accent rounded-r-full" />
            )}
            <span className={`${task === item.id ? 'text-genius-accent' : 'text-gray-500 group-hover:text-white'} transition-colors`}>
              {item.icon}
            </span>
            {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">{item.label}</span>}
          </button>
        ))}

        {/* Settings */}
        <div className={`pt-4 mt-4 border-t border-white/5 ${isCollapsed ? 'flex justify-center' : ''}`}>
            {!isCollapsed && <p className="px-3 text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest opacity-80">System</p>}
            <button
                onClick={() => setTask('settings')}
                title="Settings"
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                task === 'settings' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'
                } ${isCollapsed ? 'justify-center' : ''}`}
            >
                <span className={task === 'settings' ? 'text-genius-accent' : 'text-gray-500 group-hover:text-white'}><Settings className="w-5 h-5" /></span>
                {!isCollapsed && <span>Settings</span>}
            </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 bg-black/20 border-t border-white/5">
         {!isCollapsed ? (
             <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 mb-3">
                <div className="flex items-center gap-3">
                   <div className="bg-yellow-500/10 p-2 rounded-lg"><Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" /></div>
                   <div className="overflow-hidden">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Balance</p>
                      <p className="text-sm font-bold font-mono text-white">{coins}</p>
                   </div>
                </div>
             </div>
         ) : (
            <div className="flex justify-center mb-4 group relative">
                <div className="bg-yellow-500/10 p-2 rounded-lg"><Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" /></div>
            </div>
         )}
         <button onClick={onSignOut} title="Sign Out" className={`w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-red-400 transition py-2.5 ${isCollapsed ? 'px-0' : ''}`}>
           <LogOut className="w-4 h-4" /> {!isCollapsed && "Sign Out"}
         </button>
      </div>
    </aside>
  )
}
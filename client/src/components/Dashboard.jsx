import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Video, Loader2, BarChart3, LayoutGrid, Settings as SettingsIcon, ChevronRight, Copy, Check, Zap, Youtube, Image as ImageIcon, FileText, Hash, AlignLeft, Type, Lightbulb, AlertCircle, Target, ShieldAlert, Wand2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Sidebar from './Sidebar'
import Toast from './ui/Toast'
import Settings from './Settings'
import History from './History'

export default function Dashboard({ session }) {
  const [user, setUser] = useState(null)
  const [coins, setCoins] = useState(0)
  const [prompt, setPrompt] = useState('')
  const [task, setTask] = useState('audit') // Default
  const [metadataType, setMetadataType] = useState('title') // 👈 Sub-task for metadata

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    async function getProfile() {
      const { user } = session
      setUser(user)
      const { data } = await supabase.from('profiles').select('coins').eq('id', user.id).single()
      if (data) setCoins(data.coins)
    }
    getProfile()
  }, [session])

  useEffect(() => {
    if ((task === 'audit' || task === 'thumbnail') && prompt.includes('youtube.com/watch?v=')) {
      const videoId = prompt.split('v=')[1]?.split('&')[0]
      if (videoId) setThumbnailPreview(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
      else setThumbnailPreview(null)
    } else {
      setThumbnailPreview(null)
    }
  }, [prompt, task])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const copyToClipboard = async (text) => {
    if (!text) return
    await navigator.clipboard.writeText(typeof text === 'object' ? JSON.stringify(text) : text)
    showToast('Copied to clipboard!', 'success')
  }

  const saveToHistory = (taskType, inputPrompt, outputResult) => {
    try {
      const newItem = { id: Date.now(), task_type: taskType, prompt: inputPrompt, result: outputResult, created_at: new Date().toISOString() }
      const existingHistory = JSON.parse(localStorage.getItem('yt_genius_history') || '[]')
      const updatedHistory = [newItem, ...existingHistory].slice(0, 50)
      localStorage.setItem('yt_genius_history', JSON.stringify(updatedHistory))
    } catch (error) { console.error("History Save Error", error) }
  }

  const handleGenerate = async () => {
    if (!prompt) { showToast('Please enter a prompt', 'error'); return }
    setLoading(true)
    setResult(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        // Pass metadata_type
        body: JSON.stringify({ prompt, task_type: task, metadata_type: task === 'metadata' ? metadataType : null })
      })

      const data = await response.json()
      if (response.ok) {
        setResult(data.result)
        setCoins(data.coins_left)
        saveToHistory(task === 'metadata' ? `Metadata: ${metadataType}` : task, prompt, data.result)
        showToast('Generated!', 'success')
      } else {
        showToast(data.detail || "Error", 'error')
      }
    } catch (error) {
      showToast("System Error", 'error')
    } finally {
      setLoading(false)
    }
  }

  const isUrlInput = task === 'audit' || task === 'thumbnail'

  // Metadata Tabs Config
  const metadataTools = [
    { id: 'title', label: 'Title', icon: <Type className="w-4 h-4"/>, placeholder: 'Enter video topic (e.g. iPhone 16 Review)' },
    { id: 'description', label: 'Description', icon: <AlignLeft className="w-4 h-4"/>, placeholder: 'Enter video topic & key points...' },
    { id: 'tags', label: 'Tags', icon: <Hash className="w-4 h-4"/>, placeholder: 'Enter main keyword...' },
    { id: 'hashtags', label: 'Hashtags', icon: <Wand2 className="w-4 h-4"/>, placeholder: 'Enter niche (e.g. Gaming, Cooking)...' },
    { id: 'disclaimer', label: 'Disclaimer', icon: <ShieldAlert className="w-4 h-4"/>, placeholder: 'Enter type (e.g. Financial Advice, Affiliate Link)...' },
  ]

  return (
    <div className="flex h-screen bg-[#020420] text-white font-sans overflow-hidden selection:bg-genius-accent selection:text-black relative">
      <Toast toast={toast} onClose={() => setToast(null)} />
      
      <Sidebar 
        task={task} 
        setTask={(t) => {setTask(t); setResult(null); setPrompt('')}} 
        coins={coins} 
        onSignOut={() => supabase.auth.signOut()} 
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className="flex-1 flex flex-col relative bg-gradient-to-br from-[#020420] via-[#0f172a] to-[#020420] transition-all duration-300">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-white/[0.01] backdrop-blur-sm sticky top-0 z-10 flex-none">
          <div className="flex items-center gap-2 text-sm text-gray-500">
             <LayoutGrid className="w-4 h-4" /> <span>Dashboard</span> <ChevronRight className="w-3 h-3 text-gray-700" /> <span className="text-white capitalize">{task}</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
             <span className="hidden sm:inline text-[10px] font-bold text-gray-300 tracking-wide uppercase">System Online</span>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {task === 'settings' ? <Settings user={user} coins={coins} /> : 
           task === 'history' ? <History /> : (
            
            <div className="max-w-4xl mx-auto flex flex-col gap-6 h-full">
              
              {/* INPUT PANEL */}
              <div className="w-full flex-none">
                <div className="bg-[#0f172a]/80 border border-white/5 rounded-2xl p-1 backdrop-blur-xl shadow-2xl flex flex-col">
                   
                   {/* 🚀 TAB HEADER (Only for Metadata Kit) */}
                   {task === 'metadata' ? (
                     <div className="p-2 border-b border-white/5 overflow-x-auto custom-scrollbar">
                        <div className="flex items-center gap-1">
                            {metadataTools.map((tool) => (
                                <button
                                    key={tool.id}
                                    onClick={() => { setMetadataType(tool.id); setPrompt(''); setResult(null); }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${metadataType === tool.id ? 'bg-genius-accent text-black shadow-lg shadow-genius-accent/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    {tool.icon} {tool.label}
                                </button>
                            ))}
                        </div>
                     </div>
                   ) : (
                     <div className="p-4 border-b border-white/5 flex justify-between items-center">
                       <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{isUrlInput ? 'Target Video' : 'Creative Brief'}</h3>
                       <div className="flex gap-2"><span className="w-2 h-2 rounded-full bg-white/10"></span><span className="w-2 h-2 rounded-full bg-white/10"></span></div>
                     </div>
                   )}
                   
                   <div className="p-4 flex flex-col gap-4">
                      {isUrlInput ? (
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Youtube className="h-5 w-5 text-gray-500 group-focus-within:text-red-500 transition" />
                            </div>
                            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Paste YouTube Link..." className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-genius-accent/50 focus:ring-1 focus:ring-genius-accent/20 transition" />
                        </div>
                      ) : (
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            // Dynamic Placeholder
                            placeholder={task === 'metadata' ? metadataTools.find(t => t.id === metadataType)?.placeholder : "Describe your video idea in detail..."}
                            className={`w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-genius-accent/50 focus:ring-1 focus:ring-genius-accent/20 resize-none transition ${task === 'metadata' ? 'h-24' : 'h-32'}`}
                        />
                      )}

                      {thumbnailPreview && (
                        <div className="rounded-xl overflow-hidden border border-white/10 relative h-48 w-full">
                          <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover opacity-80" />
                        </div>
                      )}

                      <button onClick={handleGenerate} disabled={loading || !prompt} className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-white/10 hover:shadow-white/20 hover:-translate-y-0.5 transform">
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Zap className="w-4 h-4 fill-black" />}
                        {loading ? 'Processing...' : 'Generate'}
                      </button>
                   </div>
                </div>
              </div>

              {/* OUTPUT PANEL */}
              <div className="w-full flex-1 min-h-0 pb-10">
                 {!result && !loading && (
                    <div className="h-64 border border-white/5 rounded-2xl bg-[#020420]/50 flex flex-col items-center justify-center text-gray-600 border-dashed">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 mb-4 animate-pulse-glow">
                           {task === 'metadata' ? <Wand2 className="w-8 h-8 opacity-20" /> : <FileText className="w-8 h-8 opacity-20" />}
                        </div>
                        <p className="text-sm font-medium">Ready to Create</p>
                    </div>
                 )}

                 {/* AUDIT OUTPUT (Visual Cards) */}
                 {result && typeof result === 'object' && task === 'audit' && (
                    <div className="space-y-6 animate-fade-in-down">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1 bg-[#0f172a] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 z-10">SEO Score</h3>
                                <div className="text-6xl font-black text-white z-10 flex items-baseline">{result.score}<span className="text-lg text-gray-500 font-medium">/100</span></div>
                                <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold z-10 ${result.score >= 80 ? 'bg-green-500/20 text-green-400' : result.score >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {result.score >= 80 ? 'Excellent' : result.score >= 50 ? 'Needs Work' : 'Critical'}
                                </div>
                            </div>
                            <div className="md:col-span-2 bg-gradient-to-br from-genius-purple/20 to-[#0f172a] border border-genius-purple/30 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-2 bg-genius-purple/20 rounded-lg text-genius-purple"><Lightbulb className="w-5 h-5" /></div>
                                    <h3 className="text-white font-bold">Growth Hack</h3>
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed">{result.growth_hack}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-3 text-blue-400 font-bold text-sm"><Type className="w-4 h-4"/> Title Check</div>
                                <p className="text-sm text-gray-400 leading-relaxed">{result.title_analysis}</p>
                            </div>
                            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-3 text-pink-400 font-bold text-sm"><Target className="w-4 h-4"/> Hook Analysis</div>
                                <p className="text-sm text-gray-400 leading-relaxed">{result.hook_analysis}</p>
                            </div>
                        </div>
                        
                        <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-orange-400 text-sm font-bold"><AlertCircle className="w-4 h-4"/> Missing Opportunities</div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {result.missing_keywords.map((kw, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg text-xs text-orange-300 font-medium">+ {kw}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                 )}

                 {/* SCRIPT OUTPUT */}
                 {result && typeof result === 'object' && task === 'script' && (
                    <div className="space-y-4 pb-10">
                        <div className="bg-[#0f172a] border border-white/10 rounded-xl p-4">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2 text-genius-accent text-sm font-bold"><Type className="w-4 h-4"/> Optimized Title</div>
                                <button onClick={() => copyToClipboard(result.title)} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition"><Copy className="w-3 h-3"/></button>
                            </div>
                            <p className="text-lg font-medium">{result.title}</p>
                        </div>
                        {/* ... Tags & Desc cards (same style) ... */}
                         <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                                <div className="flex items-center gap-2 text-gray-200 text-sm font-bold"><FileText className="w-4 h-4"/> Script</div>
                                <button onClick={() => copyToClipboard(result.script_body)} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition text-gray-300 hover:text-white"><Copy className="w-3.5 h-3.5"/> Copy</button>
                            </div>
                            <div className="prose prose-invert prose-sm max-w-none prose-p:text-gray-400">
                                <ReactMarkdown>{result.script_body}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                 )}

                 {/* METADATA & GENERAL TEXT OUTPUT */}
                 {result && (typeof result === 'string' || task === 'metadata') && (
                    <div className="bg-[#0f172a]/80 border border-white/10 rounded-2xl backdrop-blur-md p-6 overflow-y-auto custom-scrollbar animate-fade-in-down">
                        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                             <div className="flex items-center gap-2 text-genius-accent font-bold text-sm uppercase">
                                {task === 'metadata' ? metadataType : 'Result'}
                             </div>
                             <button onClick={() => copyToClipboard(result)} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition text-gray-300 hover:text-white"><Copy className="w-3.5 h-3.5"/> Copy</button>
                        </div>
                        <div className="prose prose-invert prose-sm max-w-none prose-ul:text-gray-300 prose-li:marker:text-genius-accent">
                            <ReactMarkdown>{typeof result === 'object' ? JSON.stringify(result) : result}</ReactMarkdown>
                        </div>
                    </div>
                 )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
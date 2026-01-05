import { useEffect, useState } from 'react'
import { Clock, ChevronRight, Trash2, FileText, Youtube, BarChart3, Image as ImageIcon, Trash } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function History() {
  const [history, setHistory] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  function fetchHistory() {
    // 🚀 Load from LocalStorage
    const storedHistory = JSON.parse(localStorage.getItem('yt_genius_history') || '[]')
    setHistory(storedHistory)
  }

  function clearHistory() {
    if (confirm("Are you sure you want to clear all history?")) {
      localStorage.removeItem('yt_genius_history')
      setHistory([])
      setSelectedItem(null)
    }
  }

  function deleteItem(id, e) {
    e.stopPropagation()
    const updated = history.filter(item => item.id !== id)
    localStorage.setItem('yt_genius_history', JSON.stringify(updated))
    setHistory(updated)
    if (selectedItem?.id === id) setSelectedItem(null)
  }

  const getIcon = (type) => {
    if (type === 'audit') return <BarChart3 className="w-4 h-4 text-genius-accent" />
    if (type === 'thumbnail') return <ImageIcon className="w-4 h-4 text-purple-400" />
    return <FileText className="w-4 h-4 text-blue-400" />
  }

  return (
    <div className="h-full flex gap-6 animate-fade-in-down">
      
      {/* 1. LEFT: History List */}
      <div className={`flex-1 flex flex-col bg-[#0f172a]/80 border border-white/5 rounded-2xl backdrop-blur-xl overflow-hidden ${selectedItem ? 'hidden md:flex md:w-1/3 md:flex-none' : 'w-full'}`}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Local History
            </h3>
            <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{history.length} items</span>
                {history.length > 0 && (
                    <button onClick={clearHistory} className="text-xs text-red-400 hover:text-white transition">Clear All</button>
                )}
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {history.length === 0 ? (
                <div className="text-center p-10 text-gray-500 text-xs">No history found. Start creating!</div>
            ) : (
                history.map((item) => (
                    <div 
                        key={item.id} 
                        onClick={() => setSelectedItem(item)}
                        className={`p-3 rounded-xl cursor-pointer transition border border-transparent hover:border-white/5 group relative ${selectedItem?.id === item.id ? 'bg-white/10 border-white/10' : 'bg-transparent hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-1.5 rounded bg-white/5">{getIcon(item.task_type)}</div>
                            <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">{item.task_type}</span>
                            <span className="ml-auto text-[10px] text-gray-600">{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-white line-clamp-2 opacity-80 font-medium">
                            {item.prompt.includes('http') ? 'Analyzed Video URL' : item.prompt}
                        </p>
                        
                        {/* Delete Button */}
                        <button 
                            onClick={(e) => deleteItem(item.id, e)}
                            className="absolute right-2 top-2 p-1.5 bg-red-500/10 hover:bg-red-500 rounded text-red-400 hover:text-white opacity-0 group-hover:opacity-100 transition"
                        >
                            <Trash className="w-3 h-3" />
                        </button>
                    </div>
                ))
            )}
        </div>
      </div>

      {/* 2. RIGHT: Details View */}
      {selectedItem && (
        <div className="flex-1 bg-[#020420]/80 border border-white/10 rounded-2xl backdrop-blur-md flex flex-col overflow-hidden animate-fade-in">
             <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedItem(null)} className="md:hidden p-1 hover:bg-white/10 rounded"><ChevronRight className="w-4 h-4 rotate-180"/></button>
                    <span className="text-sm font-bold text-white">Result Details</span>
                </div>
                <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-gray-500 font-mono">ID: {selectedItem.id}</span>
                </div>
             </div>
             
             <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                {/* JSON (Audit/Script) */}
                {selectedItem.result.score ? (
                     <div className="space-y-4">
                        <div className="text-4xl font-bold text-genius-accent">{selectedItem.result.score}/100 <span className="text-sm text-gray-500">Score</span></div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <h4 className="text-blue-400 font-bold text-sm mb-2">Growth Hack</h4>
                            <p className="text-sm text-gray-300">{selectedItem.result.growth_hack}</p>
                        </div>
                        <pre className="text-xs text-gray-500 bg-black/30 p-4 rounded-xl overflow-auto custom-scrollbar">
                            {JSON.stringify(selectedItem.result, null, 2)}
                        </pre>
                     </div>
                ) : typeof selectedItem.result === 'object' ? (
                     <pre className="text-xs text-gray-500 bg-black/30 p-4 rounded-xl overflow-auto custom-scrollbar">
                        {JSON.stringify(selectedItem.result, null, 2)}
                     </pre>
                ) : (
                    /* Text */
                    <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>
                            {selectedItem.result} 
                        </ReactMarkdown>
                    </div>
                )}
             </div>
        </div>
      )}
    </div>
  )
}
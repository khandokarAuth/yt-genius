import { Check, AlertCircle, X } from 'lucide-react'

export default function Toast({ toast, onClose }) {
  if (!toast) return null

  return (
    <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border animate-fade-in-down ${
        toast.type === 'error' 
        ? 'bg-red-500/10 border-red-500/20 text-red-200' 
        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
    }`}>
        {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
        <span className="font-medium text-sm">{toast.message}</span>
        <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100">
            <X className="w-4 h-4" />
        </button>
    </div>
  )
}
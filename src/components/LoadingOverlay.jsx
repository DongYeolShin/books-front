function LoadingOverlay({ open }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
      <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />
    </div>
  )
}

export default LoadingOverlay

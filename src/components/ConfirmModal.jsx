function ConfirmModal({
  open,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="w-[400px] max-w-[90%] bg-white rounded-xl shadow-2xl p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[15px] text-[#1F2937] leading-[1.6] whitespace-pre-wrap text-center pt-2">
          {message}
        </p>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-11 rounded-lg border border-[#E0E0E0] bg-white text-sm font-semibold text-[#374151] hover:bg-[#F5F5F5] transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-11 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal

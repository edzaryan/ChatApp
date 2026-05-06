
function TypingIndicator() {
  return (
    <div className="bg-gray-100 rounded-2xl px-3 py-2 flex items-center gap-1 shadow-sm">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
    </div>
  );
}

export default TypingIndicator;
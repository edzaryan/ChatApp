
function ChatIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="60 80 280 240" xmlns="http://www.w3.org/2000/svg">
        <rect x="60" y="80" width="280" height="180" rx="36" fill="white"/>
        <path d="M90,250 Q75,300 60,320 Q120,310 200,260" fill="white"/>
        <circle cx="140" cy="170" r="16" fill="#6B7280"/>
        <circle cx="200" cy="170" r="16" fill="#6B7280"/>
        <circle cx="260" cy="170" r="16" fill="#6B7280"/>
    </svg>
  );
}

export default ChatIcon;

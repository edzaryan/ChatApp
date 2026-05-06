const emojis = {
  "Smileys & People": [
    ...new Set([
      "😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😋","😎",
      "😍","😘","🥰","😗","😙","😚","🙂","🤗","🤔","🫠","😐","😑",
      "🙄","😏","😣","😥","😮","🤐","😯","😪","😫","🥱","😴","😌",
      "😛","😜","🤪","😝","🫡","🤨","🧐","🤓","😕","😟","🙁","☹️",
      "😮‍💨","😤","😭","😢","🥺","😡","🤯","😳","🥶","😱","😨","😰",
      "😬","🙈","🙉","🙊","🤠","🥳","😇","🤡","🤥","😷","🤒","🤕",
      "🤑","🤢","🤮","🤧","😵","🥴","😵‍💫","😈","👿","👹","👺",
      "💀","☠️","👻","👽","🤖","🎃","😺","😸","😹","😻","😼","😽",
      "🙀","😿","😾","🫶","👍","👎","👏","🙌","🤝","🙏","👌","✌️",
      "🤞","👀","💪","👋","✋","🤌","🖕","🤙","🫰","🫳","🫴","👈",
      "👉","👆","👇","☝️","✊","👊","🤛","🤜","👐"
    ])
  ],

  "Animals & Nature": [
    ...new Set([
      "🐶","🐱","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵",
      "🐔","🐧","🐦","🐤","🦄","🐝","🦋","🐢","🐍","🦖","🐙","🦑",
      "🐬","🦈","🐳","🐊","🦕","🌲","🌳","🌴","🌵","🌸","🌹","🌺",
      "🌻","🌼","🍀","☘️","🌿","🍁","🍂","🍃","🌍","🌎","🌏","🌞",
      "🌝","🌚","⭐","🌟","✨","⚡","☄️","🔥","🌈","☀️","⛅","❄️"
    ])
  ],

  "Food & Drink": [
    ...new Set([
      "🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍈","🍒",
      "🍑","🥭","🍍","🥥","🥝","🍅","🥑","🍆","🥔","🥕","🌽","🌶️",
      "🥒","🥬","🥦","🧄","🧅","🍄","🥜","🌰","🍞","🥐","🥖","🥨",
      "🧀","🥚","🍳","🥞","🧇","🥓","🍔","🍟","🍕","🌭","🥪","🌮",
      "🌯","🥙","🍝","🍜","🍲","🍛","🍣","🍱","🥟","🍤","🍙","🍚",
      "🍘","🍥","🥠","🍢","🍡","🍧","🍨","🍦","🥧","🍰","🎂","🍮",
      "🍭","🍬","🍫","🍿","🍩","🍪","☕","🍵","🧃","🥤","🍺","🍷"
    ])
  ],

  "Activities": [
    ...new Set([
      "⚽","🏀","🏈","⚾","🎾","🏐","🏉","🥏","🎱","🏓","🏸","🥊",
      "🥋","🎮","🕹️","🎲","♟️","🎯","🎳","🎰","🚗","🏎️","🚓","🚑",
      "✈️","🚀","🛸","🚁","⛵","🚤","🛶","🏆","🥇","🥈","🥉","🎖️",
      "🎨","🎭","🎤","🎧","🎼","🎹","🥁","🎷","🎸","🎺","🎻","📱",
      "💻","⌨️","🖥️","🖨️","📷","📹","💡","🔦","📚","✏️","📎","🧸"
    ])
  ],

  "Hearts & Symbols": [
    ...new Set([
      "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕",
      "💞","💓","💗","💖","💘","💝","💟","☮️","✝️","☪️","🕉️","☸️",
      "✡️","🔯","🕎","☯️","☦️","🛐","⛎","♈","♉","♊","♋","♌",
      "♍","♎","♏","♐","♑","♒","♓","🆔","⚠️","🚫","❌","⭕",
      "✔️","☑️","🔴","🟠","🟡","🟢","🔵","🟣","⚫","⚪","🟥","🟦"
    ])
  ]
};

type Message = {
  onSelect: (emoji: string) => void;
  isOpened: boolean;
};

function EmojiPicker({ onSelect, isOpened }: Message) {
  return (
    <div
      className={`
        absolute bottom-12 right-0 z-[2000]
        bg-white border border-gray-100
        rounded-2xl p-2
        shadow-[0_0_25px_rgba(0,0,0,0.12)]
        ${isOpened ? "" : "hidden"}
      `}
    >
      <div
        className="
          w-[308px] h-[400px]
          overflow-x-hidden overflow-y-auto
          pr-1

          [&::-webkit-scrollbar]:w-4

          [&::-webkit-scrollbar-track]:bg-gray-200
          [&::-webkit-scrollbar-track:hover]:bg-gray-300
          [&::-webkit-scrollbar-track]:transition-colors

          [&::-webkit-scrollbar-thumb]:bg-gray-400
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:border-4
          [&::-webkit-scrollbar-thumb]:border-transparent
          [&::-webkit-scrollbar-thumb]:bg-clip-padding
          [&::-webkit-scrollbar-thumb:hover]:bg-gray-500
        "
      >
        {Object.entries(emojis).map(([category, items]) => (
          <div key={category}>
            <div
              className="
                sticky top-0 z-10
                bg-white
                text-gray-500 text-xs font-semibold
                px-2 py-2
              "
            >
              {category}
            </div>

            <div className="grid grid-cols-[repeat(6,50px)]">
              {items.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => onSelect(emoji)}
                  className="
                    w-[50px] h-[50px]
                    text-2xl
                    rounded-lg
                    cursor-pointer
                    hover:bg-gray-100
                    transition duration-150

                    flex items-center justify-center
                    leading-none
                  "
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmojiPicker;
"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Smile } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

// Emoji categories
const emojiCategories = [
  {
    id: "smileys",
    name: "Smileys",
    icon: "😊",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "🤣",
      "😂",
      "🙂",
      "🙃",
      "😉",
      "😊",
      "😇",
      "🥰",
      "😍",
      "🤩",
      "😘",
      "😗",
      "☺️",
      "😚",
      "😙",
      "🥲",
      "😋",
      "😛",
      "😜",
      "🤪",
      "😝",
      "🤑",
      "🤗",
      "🤭",
      "🤫",
      "🤔",
      "🤐",
      "🤨",
      "😐",
      "😑",
      "😶",
      "😏",
      "😒",
      "🙄",
    ],
  },
  {
    id: "objects",
    name: "Objects",
    icon: "📊",
    emojis: [
      "📊",
      "📈",
      "📉",
      "📆",
      "📅",
      "🗓️",
      "📋",
      "📌",
      "📍",
      "📎",
      "🧮",
      "📏",
      "📐",
      "✂️",
      "🔒",
      "🔓",
      "🔏",
      "🔐",
      "🔑",
      "🗝️",
      "💻",
      "⌨️",
      "🖥️",
      "🖱️",
      "🖨️",
      "📱",
      "📲",
      "☎️",
      "📞",
      "📟",
      "📠",
      "🔋",
      "🔌",
      "💡",
      "🔦",
      "🕯️",
      "🧯",
      "🛢️",
      "💸",
      "💵",
    ],
  },
  {
    id: "people",
    name: "People",
    icon: "👨",
    emojis: [
      "🧠",
      "👁️",
      "👀",
      "🦴",
      "🦷",
      "🗣️",
      "👤",
      "👥",
      "👶",
      "🧒",
      "👦",
      "👧",
      "🧑",
      "👱",
      "👨",
      "🧔",
      "👨‍🦰",
      "👨‍🦱",
      "👨‍🦳",
      "👨‍🦲",
      "👩",
      "👩‍🦰",
      "🧑‍🦰",
      "👩‍🦱",
      "🧑‍🦱",
      "👩‍🦳",
      "🧑‍🦳",
      "👩‍🦲",
      "🧑‍🦲",
      "👱‍♀️",
      "👴",
      "👵",
      "🧓",
      "👲",
      "👳",
      "👳‍♀️",
      "🧕",
      "👮",
      "👮‍♀️",
      "👷",
    ],
  },
  {
    id: "nature",
    name: "Nature",
    icon: "🌍",
    emojis: [
      "🌍",
      "🌎",
      "🌏",
      "🌐",
      "🗺️",
      "🗾",
      "🧭",
      "🏔️",
      "⛰️",
      "🌋",
      "🗻",
      "🏕️",
      "🏖️",
      "🏜️",
      "🏝️",
      "🏞️",
      "🏟️",
      "🏛️",
      "🏗️",
      "🧱",
      "🏘️",
      "🏚️",
      "🏠",
      "🏡",
      "🏢",
      "🏣",
      "🏤",
      "🏥",
      "🏦",
      "🏨",
      "🌱",
      "🌲",
      "🌳",
      "🌴",
      "🌵",
      "🌾",
      "🌿",
      "☘️",
      "🍀",
      "🍁",
    ],
  },
  {
    id: "symbols",
    name: "Symbols",
    icon: "⭐",
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❣️",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "💟",
      "☮️",
      "✝️",
      "☪️",
      "🕉️",
      "☸️",
      "✡️",
      "🔯",
      "🕎",
      "☯️",
      "☦️",
      "🛐",
      "⚛️",
      "🆔",
      "®️",
      "™️",
      "©️",
      "🆚",
      "⚠️",
      "☢️",
      "☣️",
      "🚸",
    ],
  },
  {
    id: "recently-used",
    name: "Recent",
    icon: "🕒",
    emojis: ["📊", "📈", "📉", "📝", "✅", "⭐", "📌", "🔍", "💡", "🎯"],
  },
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  selectedEmoji?: string;
  buttonClassName?: string;
}

export function EmojiPicker({
  onEmojiSelect,
  selectedEmoji,
  buttonClassName,
}: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("smileys");

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setOpen(false);
  };

  const currentCategory =
    emojiCategories.find((c) => c.id === activeCategory) || emojiCategories[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className={buttonClassName}>
          {selectedEmoji ? selectedEmoji : <Smile className="h-4 w-4" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" side="top">
        <div className="space-y-3">
          {/* Category Nav */}
          <div className="flex justify-between border-b pb-2">
            {emojiCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8 rounded-md"
                title={category.name}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.icon}
              </Button>
            ))}
          </div>

          {/* Category Content */}
          <div>
            <h3 className="text-xs text-muted-foreground mb-2">
              {currentCategory.name}
            </h3>
            <ScrollArea className="h-52 rounded-md">
              <div className="grid grid-cols-8 gap-1">
                {currentCategory.emojis.map((emoji, index) => (
                  <Button
                    key={`${currentCategory.id}-${index}`}
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

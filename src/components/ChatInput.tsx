"use client";

import { FC, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Button from "./ui/Button";
import axios from "axios";
import toast from "react-hot-toast";
import { Icons } from "./ui/Icons";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  chatPartner: User;
  chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input) return;

    setLoading(true);
    try {
      await axios.post("/api/message/send", { text: input, chatId });
      setInput("");
      textareaRef.current?.focus();
    } catch (error) {
      toast.error("Couldn't send message. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
      <div className="relative flex  items-center overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
        <TextareaAutosize
          maxRows={6}
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.name}`}
          className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
        />
        <Button
          className={cn('bg-white hover:bg-slate-200 ring-inset m-1')}
          onClick={sendMessage}
          type="submit"
        >
          <Icons.Logo className="h-6 w-auto text-indigo-600"></Icons.Logo>
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;

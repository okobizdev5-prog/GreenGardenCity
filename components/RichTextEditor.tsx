"use client";

import React, { useRef, useEffect } from "react";
import { Bold, Italic, List, ListOrdered, Underline } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (editorRef.current) {
      if (isInternalChange.current) {
        isInternalChange.current = false;
        return;
      }
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, val: string = "") => {
    document.execCommand(command, false, val);
    handleInput();
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col bg-gray-50 focus-within:ring-2 focus-within:ring-green-500 focus-within:bg-white focus-within:border-transparent transition-all duration-200">
      {/* Editor Toolbar */}
      <div className="bg-gray-100/80 backdrop-blur-xs border-b border-gray-200 p-2 flex gap-1 items-center flex-wrap select-none">
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className="p-2 hover:bg-gray-200 rounded-lg text-gray-700 hover:text-gray-900 transition active:scale-95 cursor-pointer"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          className="p-2 hover:bg-gray-200 rounded-lg text-gray-700 hover:text-gray-900 transition active:scale-95 cursor-pointer"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("underline")}
          className="p-2 hover:bg-gray-200 rounded-lg text-gray-700 hover:text-gray-900 transition active:scale-95 cursor-pointer"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </button>
        <div className="w-px h-4 bg-gray-300 mx-1.5"></div>
        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          className="p-2 hover:bg-gray-200 rounded-lg text-gray-700 hover:text-gray-900 transition active:scale-95 cursor-pointer"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("insertOrderedList")}
          className="p-2 hover:bg-gray-200 rounded-lg text-gray-700 hover:text-gray-900 transition active:scale-95 cursor-pointer"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-40 focus:outline-none text-gray-800 text-sm leading-relaxed prose prose-sm max-w-none bg-transparent"
        data-placeholder={placeholder}
      />
    </div>
  );
}

export default RichTextEditor;

"use client";

import { useEffect, useRef, useState } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  RemoveFormatting, 
  Code,
  Eye
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Write project details here..." }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showCode, setShowCode] = useState(false);
  const [htmlContent, setHtmlContent] = useState(value);

  // Sync value from props to state (only if it changes externally)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
      setHtmlContent(value);
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setHtmlContent(html);
      onChange(html);
    }
  };

  const executeCommand = (command: string, arg: string = "") => {
    document.execCommand(command, false, arg);
    handleInput();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setHtmlContent(val);
    onChange(val);
  };

  // Helper to format block commands correctly
  const handleBlockChange = (tag: string) => {
    executeCommand("formatBlock", tag);
  };

  return (
    <div className="w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition-all">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-gray-50 border-b border-gray-150 p-2 text-gray-700">
        <button
          type="button"
          onClick={() => executeCommand("bold")}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition text-gray-700 hover:text-gray-950 font-bold"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("italic")}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition text-gray-700 hover:text-gray-950"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("underline")}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition text-gray-700 hover:text-gray-950"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1"></span>

        <button
          type="button"
          onClick={() => handleBlockChange("h1")}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition text-gray-700 hover:text-gray-950"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleBlockChange("h2")}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition text-gray-700 hover:text-gray-950"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleBlockChange("h3")}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition text-gray-700 hover:text-gray-950"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleBlockChange("p")}
          className="px-2 py-1 text-xs font-semibold rounded-lg hover:bg-gray-200 transition text-gray-700 hover:text-gray-950"
          title="Paragraph"
        >
          P
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1"></span>

        <button
          type="button"
          onClick={() => executeCommand("insertUnorderedList")}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition text-gray-700 hover:text-gray-950"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("insertOrderedList")}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition text-gray-700 hover:text-gray-950"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleBlockChange("blockquote")}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition text-gray-700 hover:text-gray-950"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1"></span>

        <button
          type="button"
          onClick={() => executeCommand("removeFormat")}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition text-gray-700 hover:text-gray-950"
          title="Clear Formatting"
        >
          <RemoveFormatting className="h-4 w-4" />
        </button>

        <span className="flex-grow"></span>

        {/* Toggle Mode */}
        <button
          type="button"
          onClick={() => setShowCode(!showCode)}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
            showCode ? "bg-green-100 text-green-800" : "hover:bg-gray-200 text-gray-600"
          }`}
          title={showCode ? "Show Editor" : "Show HTML Code"}
        >
          {showCode ? (
            <>
              <Eye className="h-3.5 w-3.5" />
              <span>Editor</span>
            </>
          ) : (
            <>
              <Code className="h-3.5 w-3.5" />
              <span>HTML</span>
            </>
          )}
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="relative min-h-[220px]">
        {showCode ? (
          <textarea
            value={htmlContent}
            onChange={handleCodeChange}
            className="w-full h-full min-h-[220px] p-4 text-xs font-mono bg-gray-950 text-emerald-400 outline-none resize-y border-0 focus:ring-0"
            placeholder="<html> code editor"
          />
        ) : (
          <>
            <div
              ref={editorRef}
              contentEditable
              onInput={handleInput}
              onBlur={handleInput}
              className="prose prose-sm prose-green max-w-none w-full min-h-[220px] p-4 outline-none overflow-y-auto text-gray-800 text-sm leading-relaxed"
              style={{ minHeight: "220px" }}
            />
            {!htmlContent || htmlContent === "<br>" ? (
              <div className="absolute top-4 left-4 text-sm text-gray-400 pointer-events-none font-medium">
                {placeholder}
              </div>
            ) : null}
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 border-t border-gray-150 py-1.5 px-3 flex justify-between text-xxs font-medium text-gray-400">
        <span>Press Enter for paragraph, Shift+Enter for line break</span>
        <span>HTML Length: {htmlContent?.length || 0} chars</span>
      </div>
    </div>
  );
}

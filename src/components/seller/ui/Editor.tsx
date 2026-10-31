'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import { cn } from "@/lib/utils/"

interface EditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function Editor({ value, onChange, placeholder, className }: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm dark:prose-invert focus:outline-none min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  return (
    <div className="space-y-2">
      <EditorContent editor={editor} placeholder={placeholder} />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Tip: Use Markdown shortcuts for formatting</span>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className="px-2 py-1 rounded hover:bg-muted"
          >
            Bold (Ctrl+B)
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className="px-2 py-1 rounded hover:bg-muted"
          >
            Italic (Ctrl+I)
          </button>
        </div>
      </div>
    </div>
  )
}
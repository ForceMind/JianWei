/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Button } from '@/components/ui/button'

interface EditorProps {
  content: any
  onChange: (content: any) => void
  onEditorReady?: (editor: any) => void
}

const ImageBlock = Image.extend({
  name: 'imageBlock',
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
      },
      height: {
        default: null,
      },
    }
  }
}).configure({
  inline: true,
  allowBase64: true,
})

const Editor = ({ content, onChange, onEditorReady }: EditorProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      ImageBlock,
    ],
    content: content,
    onCreate: ({ editor }) => {
        if (onEditorReady) {
            onEditorReady(editor)
        }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
    editorProps: {
        attributes: {
            class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] p-4 font-serif'
        }
    }
  })

  // 同步外部内容变化
  useEffect(() => {
    if (editor && content && editor.isEmpty && mounted) {
        editor.commands.setContent(content)
    }
  }, [content, editor, mounted])

   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const src = e.target?.result as string
        const img = new window.Image()
        img.src = src
        img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const MAX_WIDTH = 1000
            let width = img.width
            let height = img.height

            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width
                width = MAX_WIDTH
            }

            canvas.width = width
            canvas.height = height
            ctx?.drawImage(img, 0, 0, width, height)
            
            const compressedSrc = canvas.toDataURL('image/jpeg', 0.7) // 70% quality
             editor?.chain().focus().setImage({ src: compressedSrc }).run()
        }
      }
      reader.readAsDataURL(file)
    }
  }

  if (!mounted || !editor) {
    return <div className="min-h-[500px] p-4 border rounded-lg bg-white">加载中...</div>
  }

  return (
    <div className="border rounded-lg shadow-sm bg-white dark:bg-gray-900 flex flex-col h-full">
      <div className="border-b p-2 flex gap-2 items-center bg-gray-50 dark:bg-gray-800 rounded-t-lg sticky top-0 z-10">
        <Button 
            variant="ghost" 
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()} 
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''}
        >
          粗体
        </Button>
        <Button 
            variant="ghost" 
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''}
        >
          斜体
        </Button>
         <Button 
            variant="ghost" 
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
            className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-700' : ''}
        >
          标题 2
        </Button>
        <Button 
            variant="ghost" 
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
            className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-700' : ''}
        >
          标题 3
        </Button>
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
        <label className="cursor-pointer">
            <span className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3">
                📷 插入截图
            </span>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
        </label>
      </div>
      <div className="flex-1 overflow-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default Editor

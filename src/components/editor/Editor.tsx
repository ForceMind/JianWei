/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import { Bold, Italic, Heading1, Heading2, Quote, List, ListOrdered } from 'lucide-react'

// Lucide React is required for icons, if not present I'll fallback to text or install it.
// Assuming Lucide is available in Shadcn UI projects usually. If not, I will fix.
// Wait, I should check if lucide-react is installed.
// Checking package.json...

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
      Placeholder.configure({
        placeholder: '输入内容，或输入 "/" 唤起命令...',
      }),
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
            class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] p-8 font-serif outline-none'
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
            const MAX_WIDTH = 1200
            let width = img.width
            let height = img.height

            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width
                width = MAX_WIDTH
            }

            canvas.width = width
            canvas.height = height
            ctx?.drawImage(img, 0, 0, width, height)
            
            const compressedSrc = canvas.toDataURL('image/jpeg', 0.8) 
             editor?.chain().focus().setImage({ src: compressedSrc }).run()
        }
      }
      reader.readAsDataURL(file)
    }
  }

  if (!mounted || !editor) {
    return <div className="min-h-[500px] p-4 border rounded-lg bg-white">编辑器加载中...</div>
  }

  return (
    <div className="relative flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg">
      
      {/* 顶部常驻工具栏 */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b p-2 flex gap-1 items-center overflow-x-auto rounded-t-lg">
         <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-slate-200' : ''}>
           <Bold className="w-4 h-4" />
         </Button>
         <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-slate-200' : ''}>
           <Italic className="w-4 h-4" />
         </Button>
         <div className="w-px h-6 bg-gray-200 mx-1" />
         <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'bg-slate-200' : ''}>
           <Heading1 className="w-4 h-4" />
         </Button>
         <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-slate-200' : ''}>
           <Heading2 className="w-4 h-4" />
         </Button>
         <div className="w-px h-6 bg-gray-200 mx-1" />
         <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'bg-slate-200' : ''}>
           <Quote className="w-4 h-4" />
         </Button>
         <label className="cursor-pointer ml-auto bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
            <span>📷 插入图片</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
        </label>
      </div>

      {/* 浮动气泡菜单 (右键/选中时) */}
      {editor && (
        <BubbleMenu editor={editor} className="flex bg-white shadow-xl border rounded-md p-1 gap-1">
            <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-slate-100 text-blue-600' : ''}>
            <Bold className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-slate-100 text-blue-600' : ''}>
            <Italic className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'bg-slate-100 text-blue-600' : ''}>
             <span className="line-through">S</span>
            </Button>
             <div className="w-px h-4 bg-gray-200 mx-1 self-center" />
             <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-slate-100 text-blue-600' : ''}>
             H2
            </Button>
        </BubbleMenu>
      )}

      {/* 编辑区域 */}
      <div className="flex-1 overflow-auto bg-white dark:bg-gray-900 cursor-text" onClick={() => editor.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default Editor

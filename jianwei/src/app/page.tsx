// 客户端组件
'use client'

import { useState, useEffect } from 'react'
import Editor from '@/components/editor/Editor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

import { sampleDocContent } from '@/lib/sample-doc'

export default function Home() {
  const [content, setContent] = useState<any>({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: '在此开始撰写您的 UX 审计报告... 在段落之间插入截图。', // Start writing... translated
          },
        ],
      },
    ],
  })

  // 尝试加载 doc.txt 内容 (使用 sample-doc 模拟)
  useEffect(() => {
      // 模拟从 doc.txt 加载内容
      if (sampleDocContent) {
          // 将普通文本转换为 Tiptap JSON 结构
          const lines = sampleDocContent.split('\n');
          const docContent = lines.map(line => {
              if (line.trim() === '') return { type: 'paragraph' };
              return {
                  type: 'paragraph',
                  content: [{ type: 'text', text: line }]
              };
          });
          
          setContent({
              type: 'doc',
              content: docContent
          });
      }
  }, [])


  // AI 润色逻辑占位符
  const handlePolish = async () => {
    alert("AI 扩展功能即将推出！这将触发 API 路由。")
    // 步骤:
    // 1. 处理 'content' JSON
    // 2. 识别图片节点并替换为 [[IMAGE_ID]]
    // 3. 调用 /api/generate
    // 4. 将结果与图片合并
  }

  // 导出逻辑占位符
  const handleExport = () => {
    alert("导出逻辑即将推出！这将生成一个独立的 HTML 文件。")
    // 步骤:
    // 1. 将状态转换为 HTML 字符串
    // 2. 内联 CSS
    // 3. 将图片转换为 Base64
    // 4. 创建 Blob 并下载
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">见微 (JianWei)</h1>
             <p className="text-gray-500 dark:text-gray-400">AI 驱动的 UX 研究报告生成器</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              下载 HTML (Download HTML)
            </Button>
            <Button onClick={handlePolish} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              ✨ 润色与扩展 (Polish & Expand)
            </Button>
          </div>
        </header>

        <Card className="min-h-[700px] flex flex-col shadow-md border-gray-200 dark:border-gray-800">
           <CardHeader className="pb-4">
                <CardTitle>草稿编辑器 (Draft Editor)</CardTitle>
                <CardDescription>撰写您的粗略笔记并插入截图。</CardDescription>
           </CardHeader>
           <CardContent className="flex-1 p-0 overflow-hidden rounded-b-xl border-t border-gray-100 dark:border-gray-800">
             <Editor content={content} onChange={setContent} />
           </CardContent>
        </Card>
        
        {/* 调试视图 */}
        <details className="text-xs text-gray-400">
            <summary>查看 JSON 内容 (View JSON Content)</summary>
            <pre className="mt-2 bg-gray-900 p-4 rounded overflow-auto max-h-64 text-green-400 font-mono">
                {JSON.stringify(content, null, 2)}
            </pre>
        </details>
      </div>
    </main>
  )
}

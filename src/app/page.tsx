/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import Editor from '@/components/editor/Editor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { sampleDocContent } from '@/lib/sample-doc'

export default function Home() {
  const [content, setContent] = useState<any>(null)
  const [editorInstance, setEditorInstance] = useState<any>(null)

  // 初始化内容：优先从 LocalStorage 读取，否则加载 Sample
  useEffect(() => {
    const saved = localStorage.getItem('jianwei_draft_content')
    if (saved) {
      try {
        console.log("Loading from localStorage...")
        setContent(JSON.parse(saved))
        return
      } catch (e) {
        console.error("Failed to parse saved content", e)
      }
    }
    
    // Fallback logic
    console.log("Loading sample content...")
    if (sampleDocContent) {
        const lines = sampleDocContent.split('\n');
        setContent({
            type: 'doc',
            content: lines.map(line => ({
                type: 'paragraph' as const,
                content: line.trim() === '' ? [] : [{ type: 'text' as const, text: line }]
            }))
        });
    } else {
        setContent({
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [{ type: 'text', text: '开始撰写... ' }]
                }
            ]
        })
    }
  }, [])

  // 自动保存
  useEffect(() => {
    if (content) {
        localStorage.setItem('jianwei_draft_content', JSON.stringify(content))
    }
  }, [content])

  // AI 润色逻辑占位符
  const handlePolish = async () => {
    alert("AI 扩展功能即将推出！")
  }

  // 导出逻辑 - 现代学术风格
  const handleExport = () => {
    if (!editorInstance) {
        alert("编辑器尚未就绪。")
        return
    }

    const htmlContent = editorInstance.getHTML()
    
    // 构建完整的 HTML 文档
    const fullHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>UX Research Report - JianWei Export</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>
  :root {
    --primary-color: #0f172a;
    --accent-color: #3b82f6;
    --text-primary: #334155;
    --bg-sidebar: #f8fafc;
    --border-color: #e2e8f0;
  }
  
  body { 
    font-family: 'Noto Serif SC', 'Songti SC', serif;
    color: var(--text-primary);
    margin: 0;
    display: flex;
    min-height: 100vh;
    background-color: #fff;
  }

  /* Sidebar Navigation */
  .sidebar {
    width: 280px;
    background: var(--bg-sidebar);
    border-right: 1px solid var(--border-color);
    position: fixed;
    height: 100vh;
    overflow-y: auto;
    padding: 2rem 1.5rem;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
  }
  
  .toc-header {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #64748b;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }

  .toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .toc-list li {
    margin-bottom: 0.75rem;
  }
  
  .toc-list a {
    text-decoration: none;
    color: #475569;
    font-size: 0.9rem;
    display: block;
    transition: all 0.2s;
    line-height: 1.4;
  }
  
  .toc-list a:hover {
    color: var(--accent-color);
  }
  
  .toc-list a.active {
    color: var(--accent-color);
    font-weight: 600;
  }

  /* Main Content */
  .main-content {
    margin-left: 280px;
    flex: 1;
    padding: 4rem 6rem;
    max-width: 800px;
  }

  h1, h2, h3, h4 {
    color: var(--primary-color);
    font-weight: 700;
  }

  h1 { font-size: 2.25rem; border-bottom: 3px solid var(--primary-color); padding-bottom: 1rem; margin-bottom: 2rem; }
  h2 { font-size: 1.75rem; margin-top: 3rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; }
  h3 { font-size: 1.25rem; margin-top: 2rem; color: #1e293b; }

  p {
    margin-bottom: 1.5rem;
    font-size: 1.05rem;
    line-height: 1.8;
    text-align: justify;
  }

  img {
    max-width: 100%;
    height: auto;
    display: inline-block;
    margin: 10px;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    vertical-align: top;
  }
  
  /* 图片容器段落居中 */
  p img {
      margin-left: auto;
      margin-right: auto;
  }
  
  /* 尝试让包含图片的段落居中，如果浏览器支持 :has */
  p:has(img) {
      text-align: center;
  }
  
  /* 支持多图并排 */
  .image-row {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin: 2rem 0;
  }
  .image-row img { margin: 0; }

  blockquote {
    border-left: 4px solid var(--accent-color);
    background: #eff6ff;
    padding: 1rem 1.5rem;
    margin: 2rem 0;
    border-radius: 0 8px 8px 0;
    font-style: italic;
    color: #1e40af;
  }

  .chart-placeholder {
    width: 100%;
    height: 300px;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    font-family: 'Inter', sans-serif;
    margin: 2rem 0;
    position: relative;
    overflow: hidden;
  }
  
  .chart-placeholder::after {
    content: "Interactive Data Chart";
    font-weight: 600;
    font-size: 1.2rem;
  }

  @media (max-width: 1024px) {
    .sidebar { display: none; }
    .main-content { margin-left: 0; padding: 2rem; }
  }
  
  @media print {
    .sidebar { display: none; }
    .main-content { margin-left: 0; padding: 0; }
  }
</style>
</head>
<body>

<nav class="sidebar">
  <div class="toc-header">Report Contents / 目录</div>
  <ul class="toc-list" id="toc"></ul>
  
  <div style="margin-top: 3rem;">
    <div class="toc-header">Meta Info</div>
    <div style="font-size: 0.85rem; color: #64748b;">
        <p>Project: JianWei</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
    </div>
  </div>
</nav>

<main class="main-content">
  <article>
    ${htmlContent}
  </article>
</main>

<script>
  // 自动生成 TOC
  document.addEventListener('DOMContentLoaded', () => {
    const toc = document.getElementById('toc');
    const headers = document.querySelectorAll('.main-content h1, .main-content h2, .main-content h3');
    
    headers.forEach((header, index) => {
        // 为 header 添加 ID
        const id = 'section-' + index;
        if (!header.id) header.id = id;
        
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + header.id;
        a.textContent = header.innerText;
        
        if (header.tagName === 'H3') {
            a.style.paddingLeft = '1.5rem';
        } else if (header.tagName === 'H1') {
            a.style.fontWeight = '700';
            a.style.color = '#0f172a';
        }
        
        a.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(a.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
        
        li.appendChild(a);
        toc.appendChild(li);
    });
  });
</script>

</body>
</html>
    `

    const blob = new Blob([fullHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'JianWei_UX_Report.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Debug View toggle
  const [debugOpen, setDebugOpen] = useState(false);

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
              下载学术版 HTML
            </Button>
            <Button onClick={handlePolish} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              ✨ AI 润色与扩展
            </Button>
          </div>
        </header>

        <Card className="min-h-[700px] flex flex-col shadow-md border-gray-200 dark:border-gray-800">
           <CardHeader className="pb-4">
                <CardTitle>评估报告草稿</CardTitle>
                <CardDescription>请在此撰写，内容将通过 LocalStorage 自动保存。</CardDescription>
           </CardHeader>
           <CardContent className="flex-1 p-0 overflow-hidden rounded-b-xl border-t border-gray-100 dark:border-gray-800">
             {/* 只有在 content 加载完成后才渲染 Editor，避免覆盖为空 */}
             {content && (
                 <Editor content={content} onChange={setContent} onEditorReady={setEditorInstance} />
             )}
           </CardContent>
        </Card>
        
        <div className="text-xs text-gray-400">
            <button 
                onClick={() => setDebugOpen(!debugOpen)} 
                className="hover:text-gray-600 underline focus:outline-none"
            >
                {debugOpen ? '▼ 收起调试信息' : '▶ 调试：查看 JSON 数据'}
            </button>
            {debugOpen && (
                <div className="mt-2">
                    <div className="flex justify-between mb-1">
                        <span>当前文档结构 (JSON):</span>
                        <button 
                            onClick={() => { localStorage.removeItem('jianwei_draft_content'); window.location.reload(); }}
                            className="text-red-400 hover:text-red-500"
                        >
                            清空缓存并重置
                        </button>
                    </div>
                    <pre className="bg-gray-900 p-4 rounded overflow-auto max-h-64 text-green-400 font-mono">
                        {JSON.stringify(content, null, 2)}
                    </pre>
                </div>
            )}
        </div>
      </div>
    </main>
  )
}

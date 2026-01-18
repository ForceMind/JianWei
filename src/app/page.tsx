/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import Editor from '@/components/editor/Editor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function Home() {
  const [content, setContent] = useState<any>(null)
  const [editorInstance, setEditorInstance] = useState<any>(null)

  // 初始化内容：优先从 LocalStorage 读取，否则为空
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
    
    // 默认空内容，等待用户输入
    setContent({
        type: 'doc',
        content: [
            {
                type: 'paragraph',
                content: []
            }
        ]
    })
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

  // 导出逻辑 - 新瑞士主义美学
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
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --color-primary: #0F172A; /* Deep Blue */
    --color-accent: #D97706;  /* Amber */
    --color-bg: #FDFBF7;      /* Warm Off-White */
    --color-text: #334155;
    --color-border: #E2E8F0;
    --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }
  
  * { box-sizing: border-box; }
  
  html { scroll-behavior: smooth; }

  body { 
    font-family: var(--font-sans);
    background-color: var(--color-bg);
    color: var(--color-text);
    margin: 0;
    display: flex;
    min-height: 100vh;
    line-height: 1.6;
  }

  /* Asymmetric Layout: Left Sidebar (300px) */
  .sidebar {
    width: 320px;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background: #fff;
    border-right: 1px solid var(--color-border);
    padding: 3rem 2rem;
    overflow-y: auto;
    z-index: 100;
  }

  /* Swiss Typography for Sidebar */
  .report-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
    line-height: 1.2;
    margin-bottom: 0.5rem;
    letter-spacing: -0.02em;
  }
  
  .report-subtitle {
    font-size: 0.875rem;
    color: #64748B;
    font-family: var(--font-mono);
    margin-bottom: 3rem;
  }

  .nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .nav-item {
    margin-bottom: 1rem;
  }

  .nav-link {
    text-decoration: none;
    color: #64748B;
    font-size: 0.95rem;
    font-weight: 500;
    display: block;
    padding: 0.5rem 0;
    transition: all 0.3s ease;
    border-left: 2px solid transparent;
    padding-left: 1rem;
    margin-left: -1rem;
  }

  .nav-link:hover, .nav-link.active {
    color: var(--color-primary);
    border-left-color: var(--color-accent);
    padding-left: 1.5rem;
  }
  
  .meta-info {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid var(--color-border);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: #94A3B8;
  }

  /* Main Content Area */
  .main-content {
    margin-left: 320px;
    flex: 1;
    padding: 5rem 6rem;
    max-width: 900px;
    animation: fadeIn 0.8s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Content Typography */
  h1, h2, h3 {
    color: var(--color-primary);
    letter-spacing: -0.03em;
  }

  h1 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 2rem;
    line-height: 1.1;
  }

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    margin-top: 4rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--color-primary);
    display: flex;
    align-items: center;
  }
  
  h2::before {
    content: '■';
    color: var(--color-accent);
    font-size: 0.8em;
    margin-right: 1rem;
    transform: translateY(-2px);
  }

  h3 {
    font-size: 1.4rem;
    font-weight: 600;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
  }
  
  h4 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-top: 1.5rem;
    color: #475569;
  }

  p {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    color: #334155;
    text-align: justify;
    line-height: 1.8;
  }

  /* Data & Technical Elements (JetBrains Mono) */
  code, pre, .data-point {
    font-family: var(--font-mono);
    background: #F1F5F9;
    color: #0F172A;
    border-radius: 4px;
    font-size: 0.9em;
  }
  
  code { padding: 0.2rem 0.4rem; }

  /* Lists */
  ul, ol {
    padding-left: 1.5rem;
    margin-bottom: 2rem;
  }
  
  li {
    margin-bottom: 0.75rem;
    padding-left: 0.5rem;
  }
  
  li::marker {
    color: var(--color-accent);
    font-weight: bold;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto; 
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    margin: 1rem 0.5rem;
    transition: all 0.2s ease;
    cursor: zoom-in;
    vertical-align: middle;
  }
  
  /* 缩略图模式 */
  p img {
      max-height: 200px;
      width: auto;
      display: inline-block;
  }

  /* 居中图片容器 */
  p:has(img) {
      text-align: center;
  }
  
  img:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  }

  /* Lightbox Overlay */
  .lightbox-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(15, 23, 42, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  
  .lightbox-overlay.active {
    opacity: 1;
    pointer-events: auto;
  }
  
  .lightbox-img {
    max-width: 90%;
    max-height: 90vh;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    border-radius: 4px;
    transform: scale(0.95);
    transition: transform 0.3s cubic-bezier(0.2, 0, 0.2, 1);
  }
  
  .lightbox-overlay.active .lightbox-img {
    transform: scale(1);
  }
  
  .lightbox-close {
    position: absolute;
    top: 2rem;
    right: 2rem;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    background: none;
    border: none;
  }

  blockquote {
    border-left: 4px solid var(--color-accent);
    background: #FFF7ED;
    padding: 1.5rem 2rem;
    margin: 2rem 0;
    font-style: italic;
    font-weight: 500;
    color: #9A3412;
    border-radius: 0 8px 8px 0;
  }
  
  strong {
    color: var(--color-primary);
    font-weight: 600;
  }
  
  hr {
    border: none;
    height: 1px;
    background: var(--color-border);
    margin: 4rem 0;
  }

  @media (max-width: 1024px) {
    .sidebar { display: none; }
    .main-content { margin-left: 0; padding: 2rem; }
  }
  
  @media print {
    .sidebar { display: none; }
    .main-content { margin-left: 0; padding: 0; }
    body { background: white; }
  }
</style>
</head>
<body>


<nav class="sidebar">
  <div class="report-title">见微JianWei<br>文档编辑器</div>
  <div class="report-subtitle">By Kenneth</div>
  
  <ul class="nav-list" id="toc">
    <!-- TOC generated by JS -->
  </ul>
</nav>

<main class="main-content">
  <article>
    <!-- Content injected here -->
    ${htmlContent}
  </article>
  
  <footer style="margin-top: 6rem; border-top: 2px solid var(--color-primary); padding-top: 2rem; font-family: var(--font-mono); font-size: 0.8rem; color: #64748B;">
    Written using the Jianwei editor.
  </footer>
</main>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    // Lightbox Logic
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<button class="lightbox-close">&times;</button><img class="lightbox-img" src="" alt="Full view">';
    document.body.appendChild(overlay);
    
    const lightboxImg = overlay.querySelector('.lightbox-img');
    const closeBtn = overlay.querySelector('.lightbox-close');
    
    const closeLightbox = () => {
        overlay.classList.remove('active');
    };
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target === closeBtn) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    document.querySelectorAll('.main-content img').forEach(img => {
        img.addEventListener('click', () => {
             lightboxImg.src = img.src;
             overlay.classList.add('active');
        });
    });

    // TOC and Observer Logic
    const toc = document.getElementById('toc');
    const headers = document.querySelectorAll('.main-content h1, .main-content h2, .main-content h3');
    
    // Intersection Observer for Active State
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(\`.nav-link[href="#\${entry.target.id}"]\`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    headers.forEach((header, index) => {
        const id = 'section-' + index;
        if (!header.id) header.id = id;
        observer.observe(header);
        
        const li = document.createElement('li');
        li.className = 'nav-item';
        
        const a = document.createElement('a');
        a.className = 'nav-link';
        a.href = '#' + id;
        a.textContent = header.innerText;
        
        // H3 indentation
        if (header.tagName === 'H3') {
            a.style.paddingLeft = '2.5rem';
            a.style.fontSize = '0.85rem';
            a.style.fontWeight = '400';
        }
        
        // Skip H1 (Title) in sidebar to keep it clean
        if (header.tagName !== 'H1') {
             toc.appendChild(li);
             li.appendChild(a);
        }
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
    a.download = 'JianWei_MajaGo_Report.html'
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
              下载瑞士风格报告 (HTML)
            </Button>
            {/* AI 功能暂时隐藏 */}
          </div>
        </header>

        <Card className="min-h-[700px] flex flex-col shadow-md border-gray-200 dark:border-gray-800">
           <CardHeader className="pb-4">
                <CardTitle>草稿编辑器</CardTitle>
                <CardDescription>所见即所得，内容将通过 LocalStorage 自动保存。</CardDescription>
           </CardHeader>
           <CardContent className="flex-1 p-0 overflow-hidden rounded-b-xl border-t border-gray-100 dark:border-gray-800">
             {/* 只有在 content 加载完成后才渲染 Editor，避免覆盖为空 */}
             {content && (
                 <Editor content={content} onChange={setContent} onEditorReady={setEditorInstance} />
             )}
           </CardContent>
        </Card>
        
        <div className="text-xs text-gray-400 mt-4 border-t pt-4">
            <h3 className="font-semibold text-gray-500 mb-2">调试与开发选项</h3>
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => { 
                        if(confirm('确定要清空所有草稿内容吗？此操作不可恢复。')) {
                            localStorage.removeItem('jianwei_draft_content'); 
                            window.location.reload(); 
                        }
                    }}
                    className="text-red-500 hover:text-red-600 underline text-sm"
                >
                    ⚠ 重置并清空草稿
                </button>
                
                <button 
                    onClick={() => setDebugOpen(!debugOpen)} 
                    className="text-blue-500 hover:text-blue-600 underline text-sm"
                >
                    {debugOpen ? '收起文档源码' : '查看文档 JSON 源码'}
                </button>
            </div>
            
            {debugOpen && (
                <div className="mt-2">
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

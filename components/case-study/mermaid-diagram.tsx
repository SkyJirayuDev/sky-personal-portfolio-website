"use client";

import { useEffect, useRef, useCallback } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  content: string;
}

export function MermaidDiagram({ content }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const renderContent = useCallback(async () => {
    if (!containerRef.current) return;

    // Split content by mermaid code blocks
    const mermaidRegex = /```mermaid\n([\s\S]*?)\n```/g;
    let lastIndex = 0;
    let match;
    let processedContent = "";
    let diagramIndex = 0;

    while ((match = mermaidRegex.exec(content)) !== null) {
      // Add content before the mermaid block
      processedContent += content.slice(lastIndex, match.index);

      // Create a unique ID for this diagram
      const diagramId = `mermaid-diagram-${diagramIndex++}`;

      try {
        // Render the mermaid diagram
        const diagramCode = match[1];
        if (diagramCode) {
          const { svg } = await mermaid.render(diagramId, diagramCode);
          processedContent += `<div class="mermaid-container my-8 flex justify-center">${svg}</div>`;
        }
      } catch (error) {
        console.error("Error rendering mermaid diagram:", error);
        // Fallback to code block if rendering fails
        const diagramCode = match[1] || "";
        processedContent += `<pre class="bg-muted p-4 rounded-lg overflow-x-auto"><code>${diagramCode}</code></pre>`;
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining content
    processedContent += content.slice(lastIndex);

    // Convert markdown-like syntax to HTML
    processedContent = processedContent
      // Headers
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-2xl font-bold mt-8 mb-4">$1</h3>'
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-3xl font-bold mt-12 mb-6">$1</h2>'
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-4xl font-bold mt-16 mb-8">$1</h1>'
      )
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Code blocks (non-mermaid)
      .replace(
        /```(\w+)?\n([\s\S]*?)\n```/g,
        '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code class="language-$1">$2</code></pre>'
      )
      // Inline code
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-muted px-2 py-1 rounded text-sm">$1</code>'
      )
      // Lists
      .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(
        /(<li.*<\/li>)/,
        '<ul class="list-disc list-inside space-y-2 my-4">$1</ul>'
      )
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(?!<[h|u|p|d])(.+)$/gim, '<p class="mb-4">$1</p>');

    // Wrap in a container
    processedContent = `<div class="prose prose-lg dark:prose-invert max-w-none">${processedContent}</div>`;

    containerRef.current.innerHTML = processedContent;
  }, [content]);

  useEffect(() => {
    // Initialize mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "inherit",
    });

    // Process the content and render diagrams
    if (containerRef.current) {
      renderContent();
    }
  }, [renderContent]);

  return <div ref={containerRef} className="w-full" />;
}

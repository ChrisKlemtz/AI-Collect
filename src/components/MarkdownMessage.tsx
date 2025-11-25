import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from '../contexts/ThemeContext'
import './MarkdownMessage.scss'

interface MarkdownMessageProps {
  content: string
}

function MarkdownMessage({ content }: MarkdownMessageProps) {
  const { theme } = useTheme()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, language: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(language)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="markdown-message">
      <ReactMarkdown
        components={{
          code(props) {
            const { children, className, ...rest } = props
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            const codeString = String(children).replace(/\n$/, '')
            const isInline = !className

            return !isInline && language ? (
              <div className="code-block-wrapper">
                <div className="code-block-header">
                  <span className="code-language">{language}</span>
                  <button
                    className="copy-button"
                    onClick={() => copyToClipboard(codeString, language)}
                    title="Copy code"
                  >
                    {copiedCode === language ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="16"
                        height="16"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="16"
                        height="16"
                      >
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                      </svg>
                    )}
                  </button>
                </div>
                <SyntaxHighlighter
                  style={theme === 'dark' ? oneDark : oneLight}
                  language={language}
                  PreTag="div"
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={className} {...rest}>
                {children}
              </code>
            )
          },
          a(props) {
            const { children, href, ...rest } = props
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
                {children}
              </a>
            )
          },
          table(props) {
            const { children, ...rest } = props
            return (
              <div className="table-wrapper">
                <table {...rest}>{children}</table>
              </div>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownMessage

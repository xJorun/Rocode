import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const window = new JSDOM('').window
const purify = DOMPurify(window as any)

export function sanitizeHtml(dirty: string): string {
  return purify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote'],
    ALLOWED_ATTR: [],
  })
}

export function sanitizeString(input: string): string {
  return input.replace(/[<>]/g, '')
}


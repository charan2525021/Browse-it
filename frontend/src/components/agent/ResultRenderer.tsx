import { useState } from 'react'

/* Try to extract a JSON array/object from a string (handles ```json fences and inline JSON) */
function tryParseJSON(text: string): unknown | null {
  // Strip markdown code fences
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = fenceMatch ? fenceMatch[1].trim() : text.trim()

  // Find first { or [ and last } or ]
  const firstBrace = Math.min(
    ...[candidate.indexOf('['), candidate.indexOf('{')].filter(i => i >= 0)
  )
  if (!isFinite(firstBrace)) return null
  const lastBrace = Math.max(candidate.lastIndexOf(']'), candidate.lastIndexOf('}'))
  if (lastBrace <= firstBrace) return null

  const slice = candidate.slice(firstBrace, lastBrace + 1)
  try {
    return JSON.parse(slice)
  } catch {
    return null
  }
}

/* Detect a markdown table */
function isMarkdownTable(text: string): boolean {
  const lines = text.trim().split('\n').filter(l => l.trim())
  if (lines.length < 2) return false
  return lines[0].includes('|') && /\|?[\s:-]+\|/.test(lines[1])
}

function parseMarkdownTable(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.trim().split('\n').filter(l => l.includes('|'))
  const parseRow = (line: string) => line.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1 || (arr[0] !== '' && arr[arr.length - 1] !== ''))
  const clean = (line: string) => line.replace(/^\||\|$/g, '').split('|').map(c => c.trim())
  const headers = clean(lines[0])
  const rows = lines.slice(2).map(clean)
  return { headers, rows }
}

/* Recursively render a cell value - nested objects/arrays become readable, not raw JSON */
function CellValue({ val }: { val: unknown }) {
  if (val === null || val === undefined || val === '') return <span className="text-bark/30 dark:text-gray-600">—</span>

  // Array
  if (Array.isArray(val)) {
    // Array of primitives → comma chips
    if (val.every(v => typeof v !== 'object' || v === null)) {
      return (
        <div className="flex flex-wrap gap-1">
          {val.map((v, i) => (
            <span key={i} className="px-1.5 py-0.5 rounded bg-cream-200/70 dark:bg-night-lighter text-xs">{String(v)}</span>
          ))}
        </div>
      )
    }
    // Array of objects → stacked
    return (
      <div className="flex flex-col gap-2">
        {val.map((v, i) => <div key={i} className="pl-2 border-l-2 border-gold/30"><CellValue val={v} /></div>)}
      </div>
    )
  }

  // Object → key: value rows
  if (typeof val === 'object') {
    return (
      <div className="flex flex-col gap-1">
        {Object.entries(val as Record<string, unknown>).map(([k, v]) => (
          <div key={k} className="flex gap-2 text-xs">
            <span className="font-semibold text-bark dark:text-gray-200 capitalize whitespace-nowrap">{k.replace(/_/g, ' ')}:</span>
            <span className="text-bark/70 dark:text-gray-400 min-w-0"><CellValue val={v} /></span>
          </div>
        ))}
      </div>
    )
  }

  return <span>{String(val)}</span>
}

/* Render a table from array of objects */
function DataTable({ data }: { data: Record<string, unknown>[] }) {
  const keys = Array.from(new Set(data.flatMap(obj => Object.keys(obj))))
  return (
    <div className="overflow-x-auto rounded-xl border border-cream-300 dark:border-night-lighter">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-cream-200 dark:bg-night-lighter">
            {keys.map(k => (
              <th key={k} className="text-left px-3 py-2 font-semibold text-bark dark:text-white capitalize whitespace-nowrap border-b border-cream-300 dark:border-night-lighter">
                {k.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="even:bg-cream-100/50 dark:even:bg-night/50 hover:bg-gold/5 transition-colors align-top">
              {keys.map(k => (
                <td key={k} className="px-3 py-2 text-bark/80 dark:text-gray-300 border-b border-cream-200 dark:border-night-lighter align-top min-w-[120px]">
                  <CellValue val={row[k]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* Render markdown table */
function MarkdownTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-cream-300 dark:border-night-lighter">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-cream-200 dark:bg-night-lighter">
            {headers.map((h, i) => (
              <th key={i} className="text-left px-3 py-2 font-semibold text-bark dark:text-white whitespace-nowrap border-b border-cream-300 dark:border-night-lighter">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="even:bg-cream-100/50 dark:even:bg-night/50 hover:bg-gold/5 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-bark/80 dark:text-gray-300 border-b border-cream-200 dark:border-night-lighter align-top">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* Render a key-value object as a definition list */
function ObjectView({ obj }: { obj: Record<string, unknown> }) {
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(obj).map(([k, v]) => (
        <div key={k} className="flex gap-3 text-sm">
          <span className="font-semibold text-bark dark:text-white capitalize min-w-[140px] shrink-0">{k.replace(/_/g, ' ')}:</span>
          <span className="text-bark/70 dark:text-gray-300 min-w-0"><CellValue val={v} /></span>
        </div>
      ))}
    </div>
  )
}

type ViewMode = 'auto' | 'table' | 'raw'

export default function ResultRenderer({ text }: { text: string }) {
  const [mode, setMode] = useState<ViewMode>('auto')

  const json = tryParseJSON(text)
  const isArrayOfObjects = Array.isArray(json) && json.length > 0 && json.every(item => typeof item === 'object' && item !== null && !Array.isArray(item))
  const isObject = json !== null && typeof json === 'object' && !Array.isArray(json)
  const isArrayOfPrimitives = Array.isArray(json) && json.every(item => typeof item !== 'object')
  const mdTable = isMarkdownTable(text)

  const hasStructure = isArrayOfObjects || isObject || isArrayOfPrimitives || mdTable

  // View toggle (only show if there's structured data)
  const toggle = hasStructure && (
    <div className="flex items-center gap-1 mb-3">
      <button onClick={() => setMode('auto')} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${mode === 'auto' ? 'bg-gold text-bark' : 'bg-cream-200 dark:bg-night-lighter text-bark/60 dark:text-gray-400'}`}>📊 Formatted</button>
      <button onClick={() => setMode('raw')} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${mode === 'raw' ? 'bg-gold text-bark' : 'bg-cream-200 dark:bg-night-lighter text-bark/60 dark:text-gray-400'}`}>📄 Raw</button>
    </div>
  )

  if (mode === 'raw' || !hasStructure) {
    return (
      <>
        {toggle}
        <p className="text-sm whitespace-pre-wrap leading-relaxed text-bark/80 dark:text-gray-300 font-mono">{text}</p>
      </>
    )
  }

  return (
    <>
      {toggle}
      {isArrayOfObjects && <DataTable data={json as Record<string, unknown>[]} />}
      {isArrayOfPrimitives && (
        <ul className="flex flex-col gap-1.5">
          {(json as unknown[]).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-bark/80 dark:text-gray-300">
              <span className="text-gold mt-0.5">•</span><span>{String(item)}</span>
            </li>
          ))}
        </ul>
      )}
      {isObject && !isArrayOfObjects && <ObjectView obj={json as Record<string, unknown>} />}
      {mdTable && !json && <MarkdownTable {...parseMarkdownTable(text)} />}
    </>
  )
}

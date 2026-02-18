import { useMemo, useState } from 'react'

type FormState = {
  contentType: 'Page' | 'Article' | 'Event'
  domain: 'mejuvante.ai' | 'products.mejuvante.ai' | 'mejuvante.com' | 'mejuvante.co.in'
  title: string
  goal: string
  requirements: string
}

type QueueItem = FormState & {
  status: string
  createdAt: string
  createdBy: string
  id: string
}

const defaultState: FormState = {
  contentType: 'Page',
  domain: 'mejuvante.ai',
  title: '',
  goal: '',
  requirements: ''
}

type ContentFormProps = {
  token: string
}

export function ContentForm({ token }: ContentFormProps) {
  const [form, setForm] = useState<FormState>(defaultState)
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [aiDraft, setAiDraft] = useState<Record<string, unknown> | null>(null)
  const [message, setMessage] = useState('')

  const aiJson = useMemo(() => {
    if (aiDraft) return aiDraft

    const sections = ['hero', 'proof', 'case-studies', 'cta']
    if (form.contentType === 'Event') sections.splice(2, 0, 'speaker-lineup')
    if (form.domain === 'mejuvante.com') sections.splice(2, 0, 'gdpr-note')

    return {
      domain: form.domain,
      pageType: form.contentType === 'Article' ? 'thought-leadership' : 'service-landing',
      title: form.title || 'Draft title will appear here',
      sections,
      themeTokens: { accent: '#61c4ca', style: 'dark-glow' },
      status: 'pending_editor_approval'
    }
  }, [aiDraft, form])

  const refreshQueue = async () => {
    const response = await fetch('/api/cms/submissions', {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!response.ok) {
      setMessage('Could not load submissions.')
      return
    }

    const data = (await response.json()) as QueueItem[]
    setQueue(data)
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setMessage('')

    const response = await fetch('/api/cms/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })

    if (!response.ok) {
      setMessage('Submission failed. Please verify inputs.')
      return
    }

    const data = (await response.json()) as { submission: QueueItem; aiDraft: Record<string, unknown> }
    setAiDraft(data.aiDraft)
    setForm(defaultState)
    setMessage('Draft created and queued successfully.')
    await refreshQueue()
  }

  return (
    <section className="cms-grid">
      <div className="panel">
        <h3>Non-Technical Content Submission</h3>
        <form className="form" onSubmit={onSubmit}>
          <label>
            Content Type
            <select value={form.contentType} onChange={(e) => setForm((p) => ({ ...p, contentType: e.target.value as FormState['contentType'] }))}>
              <option>Page</option>
              <option>Article</option>
              <option>Event</option>
            </select>
          </label>
          <label>
            Domain
            <select value={form.domain} onChange={(e) => setForm((p) => ({ ...p, domain: e.target.value as FormState['domain'] }))}>
              <option>mejuvante.ai</option>
              <option>products.mejuvante.ai</option>
              <option>mejuvante.com</option>
              <option>mejuvante.co.in</option>
            </select>
          </label>
          <label>
            Title
            <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="AI Transformation for Manufacturing" required />
          </label>
          <label>
            Goal
            <input value={form.goal} onChange={(e) => setForm((p) => ({ ...p, goal: e.target.value }))} placeholder="Increase enterprise demos" required />
          </label>
          <label>
            Requirements
            <textarea value={form.requirements} onChange={(e) => setForm((p) => ({ ...p, requirements: e.target.value }))} placeholder="Create trust-first page layout with proof points and CTA" required />
          </label>
          <button className="btn">Generate AI Draft</button>
        </form>
        {message && <p className="muted">{message}</p>}
      </div>

      <div className="panel">
        <h3>Gemini Structured Output (Preview)</h3>
        <pre>{JSON.stringify(aiJson, null, 2)}</pre>
      </div>

      <div className="panel queue-panel">
        <div className="row-between">
          <h3>Submission Queue</h3>
          <div className="row-gap">
            <button className="btn ghost" onClick={() => setQueue([])}>Clear UI</button>
            <button className="btn ghost" onClick={() => void refreshQueue()}>Refresh</button>
          </div>
        </div>
        {queue.length === 0 ? <p className="muted">No submissions yet.</p> : queue.map((q) => (
          <article className="queue-item" key={q.id}>
            <strong>{q.title}</strong>
            <p>{q.requirements}</p>
            <div className="chips">
              <span>{q.contentType}</span><span>{q.domain}</span><span>{q.status}</span><span>{q.createdBy}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

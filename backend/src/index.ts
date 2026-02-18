import express from 'express'
import cors from 'cors'
import { contentSubmissionSchema, loginSchema } from './types.js'
import { createSubmission, findUserByToken, listSubmissions, login } from './store.js'

const app = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'mejuvante-backend' })
})

app.post('/api/auth/login', (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() })
  }

  const result = login(parsed.data.email, parsed.data.password)
  if (!result) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  return res.json(result)
})

app.get('/api/config/site-config', (_req, res) => {
  res.json({
    'mejuvante.ai': { theme: 'ai', localeDefault: 'en', logo: 'ai-logo.svg' },
    'products.mejuvante.ai': { theme: 'ai', localeDefault: 'en', logo: 'ai-logo.svg' },
    'mejuvante.com': { theme: 'germany', localeDefault: 'de', logo: 'gmbh-logo.svg' },
    'mejuvante.co.in': { theme: 'india', localeDefault: 'en', logo: 'india-logo.svg' }
  })
})

app.get('/api/cms/submissions', (req, res) => {
  const user = findUserByToken(req.header('authorization'))
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  return res.json(listSubmissions())
})

app.post('/api/cms/submissions', (req, res) => {
  const user = findUserByToken(req.header('authorization'))
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const parsed = contentSubmissionSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() })
  }

  const submission = createSubmission(parsed.data, user.id)

  const sections = ['hero', 'proof', 'case-studies', 'cta']
  if (submission.contentType === 'Event') sections.splice(2, 0, 'speaker-lineup')
  if (submission.domain === 'mejuvante.com') sections.splice(2, 0, 'gdpr-compliance-note')

  return res.status(201).json({
    submission,
    aiDraft: {
      domain: submission.domain,
      pageType: submission.contentType === 'Article' ? 'thought-leadership' : 'service-landing',
      title: submission.title,
      sections,
      themeTokens: { accent: '#61c4ca', style: 'dark-glow' },
      status: 'pending_editor_approval'
    }
  })
})

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`)
})

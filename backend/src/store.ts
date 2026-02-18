import crypto from 'node:crypto'
import type { ContentSubmission, StoredSubmission } from './types.js'

const submissions: StoredSubmission[] = []
const sessions = new Map<string, string>()

const users = [
  {
    id: 'u-admin',
    name: 'Mejuvante Admin',
    email: 'admin@mejuvante.ai',
    password: 'Password@123',
    role: 'admin'
  },
  {
    id: 'u-editor',
    name: 'Content Editor',
    email: 'editor@mejuvante.ai',
    password: 'Password@123',
    role: 'editor'
  }
]

export function listSubmissions() {
  return submissions
}

export function createSubmission(payload: ContentSubmission, userId: string): StoredSubmission {
  const record: StoredSubmission = {
    ...payload,
    id: crypto.randomUUID(),
    status: 'draft',
    createdAt: new Date().toISOString(),
    createdBy: userId
  }
  submissions.unshift(record)
  return record
}

export function login(email: string, password: string) {
  const user = users.find((entry) => entry.email === email && entry.password === password)
  if (!user) return null

  const token = crypto.randomBytes(24).toString('hex')
  sessions.set(token, user.id)

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  }
}

export function findUserByToken(token: string | undefined) {
  if (!token) return null
  const cleanToken = token.replace(/^Bearer\s+/i, '').trim()
  const userId = sessions.get(cleanToken)
  if (!userId) return null
  return users.find((entry) => entry.id === userId) ?? null
}

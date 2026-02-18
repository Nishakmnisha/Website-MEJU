import { useState } from 'react'
import { ParticleCanvas } from './components/ParticleCanvas'
import { Hero3D } from './components/Hero3D'
import { ContentForm } from './components/ContentForm'

type LoginResponse = {
  token: string
  user: { id: string; name: string; email: string; role: string }
}

const domains = [
  { name: 'mejuvante.ai', desc: 'Global AI brand, services, products and thought leadership.' },
  { name: 'products.mejuvante.ai', desc: 'AI product marketplace with demos, subscriptions and billing.' },
  { name: 'mejuvante.com', desc: 'Germany consulting credibility with GDPR and legal-first pages.' },
  { name: 'mejuvante.co.in', desc: 'India consulting, delivery capabilities and local trust.' }
]

export function App() {
  const [email, setEmail] = useState('admin@mejuvante.ai')
  const [password, setPassword] = useState('Password@123')
  const [token, setToken] = useState('')
  const [userName, setUserName] = useState('')
  const [message, setMessage] = useState('Login to manage content queue and publish requests.')

  const onLogin: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setMessage('')

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      setMessage('Login failed. Check credentials from README.')
      return
    }

    const data = (await response.json()) as LoginResponse
    setToken(data.token)
    setUserName(data.user.name)
    setMessage(`Logged in as ${data.user.name} (${data.user.role}).`)
  }

  return (
    <>
      <ParticleCanvas />
      <header className="topbar">
        <div className="brand">MEJUVANTE<span>AI</span></div>
        <button className="btn">Book AI Strategy Call</button>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <p className="eyebrow">AI-FIRST MULTI-DOMAIN ECOSYSTEM</p>
            <h1>Build Mejuvante as a global AI product company</h1>
            <p className="muted">Modern UI + 3D animation + non-technical CMS workflow + AI-assisted page drafting with approval control.</p>
          </div>
          <Hero3D />
        </section>

        <section>
          <h2>Domain Ecosystem</h2>
          <div className="grid grid-4">
            {domains.map((d) => (
              <article className="card" key={d.name}>
                <h3>{d.name}</h3>
                <p>{d.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2>Architecture</h2>
          <div className="pipeline">
            <div>Next.js / React Frontends</div>
            <div>API Gateway</div>
            <div>Django / FastAPI / Node Services</div>
            <div>LLM Orchestration (Gemini)</div>
            <div>PostgreSQL + Redis + Storage</div>
          </div>
        </section>

        <section className="panel">
          <h2>Login</h2>
          <form className="login-grid" onSubmit={onLogin}>
            <label>
              Email
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>
            <button className="btn">Login</button>
          </form>
          {message && <p className="muted">{message}</p>}
          {userName && <p className="muted">Active session: {userName}</p>}
        </section>

        {token && <ContentForm token={token} />}
      </main>
    </>
  )
}

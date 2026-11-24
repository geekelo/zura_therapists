import { useState } from 'react'
import { useStore } from '../store'

const SAMPLES = [
  { code: 'ZURA-4418', name: 'Amara Cole', role: 'Lead therapist' },
  { code: 'ZURA-2207', name: 'Noor Vermeer', role: 'Therapist' },
]

export default function Login() {
  const { login } = useStore()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    const message = login(code)
    setError(message || '')
  }

  return (
    <main className="login">
      <section className="login-aside">
        <p className="login-mark">Zura</p>
        <p className="login-kicker">Therapist studio · Keizersgracht</p>
        <h1>The floor, the work, and the care you keep for yourself.</h1>
        <p className="login-copy">
          The floor timeline, your tasks, leave, learning, earnings, and Stillwater sessions live here. Guest bookings do not.
        </p>
      </section>
      <section className="login-panel">
        <form onSubmit={submit} className="login-form">
          <p className="eyebrow">Sign in</p>
          <h2>Your therapist code</h2>
          <p className="lede">It is on your contract and on the card behind the staff door. It does not change.</p>
          <label className="field">
            <span>Unique code</span>
            <input
              className="code-input"
              value={code}
              onChange={(event) => {
                setCode(event.target.value.toUpperCase())
                setError('')
              }}
              autoComplete="off"
              spellCheck={false}
              placeholder="ZURA-····"
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'code-error' : undefined}
            />
          </label>
          {error ? (
            <p id="code-error" className="error" role="alert">
              {error}
            </p>
          ) : null}
          <button className="btn primary" type="submit">
            Enter the studio
          </button>
          <div className="code-chips">
            <p className="eyebrow">Demo floor codes</p>
            {SAMPLES.map((sample) => (
              <button
                key={sample.code}
                type="button"
                className="code-chip"
                onClick={() => {
                  setCode(sample.code)
                  setError('')
                }}
              >
                <strong>{sample.name}</strong>
                <span>
                  {sample.role} · {sample.code}
                </span>
              </button>
            ))}
          </div>
        </form>
      </section>
    </main>
  )
}

import { useState } from 'react'
import { useStore } from '../store'
import { prettyDate } from '../data'
import { PageHead, StatusPill, Field } from '../ui'

const AREAS = ['Guest care', 'Equipment', 'Safety', 'Schedule', 'Team', 'Other']
const URGENCY = ['Low', 'Medium', 'High']

export default function Escalate() {
  const { bundle, addEscalation, go } = useStore()
  const [area, setArea] = useState(AREAS[0])
  const [urgency, setUrgency] = useState('Medium')
  const [description, setDescription] = useState('')
  const [need, setNeed] = useState('')
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    if (description.trim().length < 12) {
      setError('Describe what happened, in enough detail for a lead who was not there.')
      return
    }
    if (need.trim().length < 8) {
      setError('Say what you need them to do.')
      return
    }
    addEscalation({
      area,
      urgency,
      description: description.trim(),
      need: need.trim(),
    })
    setDescription('')
    setNeed('')
    setError('')
  }

  return (
    <>
      <PageHead
        eyebrow="Floor"
        title="Escalate an issue"
        lede="Use this when something needs a lead above your usual channel. For a question with an answer, raise a query instead."
      >
        <button type="button" className="btn ghost" onClick={() => go('queries')}>
          Raise a query instead
        </button>
      </PageHead>
      <div className="split">
        <form className="card stack-form" onSubmit={submit}>
          <Field label="Area">
            <select value={area} onChange={(event) => setArea(event.target.value)}>
              {AREAS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <div className="field">
            <span>Urgency</span>
            <div className="scores" role="group" aria-label="Urgency">
              {URGENCY.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={urgency === item ? 'score on wide-score' : 'score wide-score'}
                  aria-pressed={urgency === item}
                  onClick={() => setUrgency(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <Field label="What happened">
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
          </Field>
          <Field label="What you need">
            <textarea value={need} onChange={(event) => setNeed(event.target.value)} />
          </Field>
          {error ? <p className="error">{error}</p> : null}
          <button className="btn primary" type="submit">
            Escalate
          </button>
        </form>
        <section className="stack">
          <h2 className="side-title">Your escalations</h2>
          {bundle.escalations.map((item) => (
            <article key={item.id} className="card">
              <span className="row-top">
                <span className="kicker">
                  {item.area} · {item.urgency} · {prettyDate(item.opened)}
                </span>
                <StatusPill status={item.status} />
              </span>
              <p className="story">{item.description}</p>
              <p className="meta">Asked for</p>
              <p>{item.need}</p>
              <div className="paper">
                <p className="kicker">Status</p>
                <p>{item.update}</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </>
  )
}

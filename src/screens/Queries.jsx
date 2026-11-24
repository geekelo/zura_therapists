import { useState } from 'react'
import { useStore } from '../store'
import { prettyDate } from '../data'
import { PageHead, Segment, StatusPill, Field, Empty } from '../ui'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'resolved', label: 'Resolved' },
]

export default function Queries() {
  const { bundle, addQuery, go } = useStore()
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(bundle.queries[0]?.id)
  const [writing, setWriting] = useState(false)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const items = bundle.queries.filter((query) => filter === 'all' || query.status === filter)
  const activeId = items.some((query) => query.id === selected) ? selected : items[0]?.id
  const active = bundle.queries.find((query) => query.id === activeId)

  function submit(event) {
    event.preventDefault()
    if (subject.trim().length < 3) {
      setError('Give the query a subject.')
      return
    }
    if (body.trim().length < 8) {
      setError('Write the question in a sentence or two.')
      return
    }
    addQuery(subject.trim(), body.trim())
    setSubject('')
    setBody('')
    setError('')
    setWriting(false)
    setFilter('open')
    setSelected('')
  }

  return (
    <>
      <PageHead
        eyebrow="Desk"
        title="Queries and resolutions"
        lede="Questions you have asked the house, and the answer when one has been written. A problem that needs a lead belongs under Escalate."
      >
        <button type="button" className="btn primary" onClick={() => setWriting((open) => !open)}>
          {writing ? 'Close form' : 'Raise a query'}
        </button>
      </PageHead>
      {writing ? (
        <form className="card stack-form" onSubmit={submit}>
          <Field label="Subject">
            <input value={subject} onChange={(event) => setSubject(event.target.value)} />
          </Field>
          <Field label="The question">
            <textarea value={body} onChange={(event) => setBody(event.target.value)} />
          </Field>
          {error ? <p className="error">{error}</p> : null}
          <div className="actions">
            <button className="btn primary" type="submit">
              Send query
            </button>
            <button type="button" className="btn ghost" onClick={() => go('escalate')}>
              This is an issue to escalate
            </button>
          </div>
        </form>
      ) : null}
      <Segment label="Query status" value={filter} onChange={setFilter} options={FILTERS} />
      {items.length === 0 ? (
        <Empty>Nothing in this set.</Empty>
      ) : (
        <div className="master">
          <div className="card rows">
            {items.map((query) => (
              <button
                key={query.id}
                type="button"
                className={query.id === activeId ? 'row on' : 'row'}
                onClick={() => setSelected(query.id)}
              >
                <span className="row-top">
                  <span className="kicker">{prettyDate(query.opened)}</span>
                  <StatusPill status={query.status} />
                </span>
                <strong className="row-title">{query.subject}</strong>
              </button>
            ))}
          </div>
          {active ? (
            <article className="card detail">
              <span className="row-top">
                <p className="kicker">Opened {prettyDate(active.opened)}</p>
                <StatusPill status={active.status} />
              </span>
              <h2>{active.subject}</h2>
              <p>{active.body}</p>
              <div className={active.resolution ? 'paper resolution' : 'paper muted-paper'}>
                <p className="kicker">Resolution</p>
                {active.resolution ? <p>{active.resolution}</p> : <p>No resolution yet. This query is still open.</p>}
              </div>
            </article>
          ) : null}
        </div>
      )}
    </>
  )
}

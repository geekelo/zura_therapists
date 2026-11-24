import { useState } from 'react'
import { useStore } from '../store'
import { money, prettyDate } from '../data'
import { PageHead, Segment, StatusPill, Field, Empty } from '../ui'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'leave', label: 'Leave' },
  { id: 'funding', label: 'Funding' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'declined', label: 'Declined' },
]

export default function Applications() {
  const { bundle, addApplication } = useStore()
  const [tab, setTab] = useState('status')
  const [filter, setFilter] = useState('all')
  const [leave, setLeave] = useState({ type: 'Annual', from: '', to: '', reason: '' })
  const [funding, setFunding] = useState({ purpose: '', amount: '', needed: '', reason: '' })
  const [error, setError] = useState('')

  const items = bundle.applications.filter((item) => {
    if (filter === 'all') return true
    if (filter === 'leave' || filter === 'funding') return item.kind === filter
    return item.status === filter
  })

  function submitLeave(event) {
    event.preventDefault()
    if (!leave.from || !leave.to) {
      setError('Choose the first day and the last day.')
      return
    }
    if (leave.to < leave.from) {
      setError('The last day needs to be on or after the first.')
      return
    }
    if (leave.reason.trim().length < 8) {
      setError('Write a short reason, at least a sentence.')
      return
    }
    const from = prettyDate(leave.from)
    const to = prettyDate(leave.to)
    addApplication('leave', `${leave.type} leave · ${from} to ${to}`, leave.reason.trim())
    setLeave({ type: 'Annual', from: '', to: '', reason: '' })
    setError('')
    setFilter('pending')
    setTab('status')
  }

  function submitFunding(event) {
    event.preventDefault()
    const amount = Number(funding.amount)
    if (funding.purpose.trim().length < 3) {
      setError('Name what the funding is for.')
      return
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter an amount in euros.')
      return
    }
    if (funding.reason.trim().length < 8) {
      setError('Say how this helps the floor.')
      return
    }
    const when = funding.needed ? ` Needed by ${prettyDate(funding.needed)}.` : ''
    addApplication(
      'funding',
      `${funding.purpose.trim()} · ${money(amount)}`,
      `${funding.reason.trim()}${when}`,
    )
    setFunding({ purpose: '', amount: '', needed: '', reason: '' })
    setError('')
    setFilter('pending')
    setTab('status')
  }

  return (
    <>
      <PageHead
        eyebrow="People desk"
        title="Leave and funding"
        lede="Ask for leave or for funding, then watch the answer. Pending, approved, and declined all stay on this list."
      />
      <Segment
        label="Leave and funding sections"
        value={tab}
        onChange={(next) => {
          setTab(next)
          setError('')
        }}
        options={[
          { id: 'status', label: 'Approval status' },
          { id: 'leave', label: 'Request leave' },
          { id: 'funding', label: 'Request funding' },
        ]}
      />

      {tab === 'status' ? (
        <>
          <Segment label="Filter applications" value={filter} onChange={setFilter} options={FILTERS} />
          {items.length === 0 ? (
            <Empty>Nothing in this set.</Empty>
          ) : (
            <div className="stack">
              {items.map((item) => (
                <article key={item.id} className="card">
                  <span className="row-top">
                    <span className="kicker">
                      {item.kind === 'leave' ? 'Leave' : 'Funding'} · sent {prettyDate(item.submitted)}
                    </span>
                    <StatusPill status={item.status} />
                  </span>
                  <h2>{item.title}</h2>
                  <p>{item.detail}</p>
                  <p className="decision">{item.decision}</p>
                </article>
              ))}
            </div>
          )}
        </>
      ) : null}

      {tab === 'leave' ? (
        <form className="card form-grid" onSubmit={submitLeave}>
          <Field label="Type of leave">
            <select value={leave.type} onChange={(event) => setLeave({ ...leave, type: event.target.value })}>
              <option>Annual</option>
              <option>Sick</option>
              <option>Compassionate</option>
              <option>Study</option>
            </select>
          </Field>
          <Field label="First day">
            <input type="date" value={leave.from} onChange={(event) => setLeave({ ...leave, from: event.target.value })} />
          </Field>
          <Field label="Last day">
            <input type="date" value={leave.to} onChange={(event) => setLeave({ ...leave, to: event.target.value })} />
          </Field>
          <Field label="Reason" className="wide">
            <textarea value={leave.reason} onChange={(event) => setLeave({ ...leave, reason: event.target.value })} />
          </Field>
          {error ? <p className="error wide">{error}</p> : null}
          <div className="actions wide">
            <button className="btn primary" type="submit">
              Send leave request
            </button>
          </div>
        </form>
      ) : null}

      {tab === 'funding' ? (
        <form className="card form-grid" onSubmit={submitFunding}>
          <Field label="What it pays for" className="wide">
            <input
              value={funding.purpose}
              onChange={(event) => setFunding({ ...funding, purpose: event.target.value })}
              placeholder="Course, conference, equipment"
            />
          </Field>
          <Field label="Amount (€)">
            <input
              inputMode="decimal"
              value={funding.amount}
              onChange={(event) => setFunding({ ...funding, amount: event.target.value })}
            />
          </Field>
          <Field label="Needed by">
            <input type="date" value={funding.needed} onChange={(event) => setFunding({ ...funding, needed: event.target.value })} />
          </Field>
          <Field label="How it helps the floor" className="wide">
            <textarea value={funding.reason} onChange={(event) => setFunding({ ...funding, reason: event.target.value })} />
          </Field>
          {error ? <p className="error wide">{error}</p> : null}
          <div className="actions wide">
            <button className="btn primary" type="submit">
              Send funding request
            </button>
          </div>
        </form>
      ) : null}
    </>
  )
}

import { useState } from 'react'
import { useStore } from '../store'
import { BIO_FIELDS, prettyDate } from '../data'
import { PageHead, StatusPill, Field } from '../ui'

export default function Bio() {
  const { therapist, bundle, addBioEdit } = useStore()
  const [field, setField] = useState(BIO_FIELDS[0].id)
  const [value, setValue] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const rows = [
    ['Therapist code', therapist.id, null],
    ['Role', therapist.role, null],
    ['Branch', `Zura Spa, ${therapist.branch}`, null],
    ['Contract', therapist.contract, null],
    ['Working with Zura since', therapist.joined, null],
    ['Phone', therapist.phone, 'phone'],
    ['Email', therapist.email, 'email'],
    ['Home address', therapist.address, 'address'],
    ['Emergency contact', therapist.emergency, 'emergency'],
    ['Languages', therapist.languages, 'languages'],
    ['Specialties', therapist.specialties, 'specialties'],
    ['Qualifications', therapist.qualifications, null],
  ]

  function pendingFor(key) {
    if (!key) return null
    return bundle.bioEdits.find((edit) => edit.field === key && edit.status === 'pending')
  }

  function submit(event) {
    event.preventDefault()
    if (bundle.bioEdits.some((edit) => edit.field === field && edit.status === 'pending')) {
      setError('You already have a pending edit for that field.')
      return
    }
    if (value.trim().length < 3) {
      setError('Write the detail you want on the profile.')
      return
    }
    if (reason.trim().length < 8) {
      setError('Tell the people desk why it should change.')
      return
    }
    const chosen = BIO_FIELDS.find((item) => item.id === field)
    addBioEdit(field, chosen.label, value.trim(), reason.trim())
    setValue('')
    setReason('')
    setError('')
  }

  return (
    <>
      <PageHead
        eyebrow="People desk"
        title="My details"
        lede="This is the bio the house holds for you. Ask for an edit when something is wrong. The profile changes only after approval."
      />
      <div className="split">
        <section className="card">
          <div className="who large">
            <span className="avatar" aria-hidden="true">
              {therapist.initials}
            </span>
            <span>
              <strong>{therapist.name}</strong>
              <span>{therapist.role}</span>
            </span>
          </div>
          <dl className="bio">
            {rows.map(([label, valueText, key]) => {
              const pending = pendingFor(key)
              return (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>
                    {valueText}
                    {pending ? <StatusPill status="pending" /> : null}
                  </dd>
                </div>
              )
            })}
          </dl>
        </section>
        <div className="stack">
          <form className="card stack-form" onSubmit={submit}>
            <h2>Request an edit</h2>
            <Field label="Field">
              <select value={field} onChange={(event) => setField(event.target.value)}>
                {BIO_FIELDS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="What it should say">
              <textarea value={value} onChange={(event) => setValue(event.target.value)} />
            </Field>
            <Field label="Why">
              <textarea value={reason} onChange={(event) => setReason(event.target.value)} />
            </Field>
            {error ? <p className="error">{error}</p> : null}
            <button className="btn primary" type="submit">
              Send edit request
            </button>
          </form>
          <section className="card">
            <h2>Requests</h2>
            <div className="rows">
              {bundle.bioEdits.map((edit) => (
                <article key={edit.id} className="row static">
                  <span className="row-top">
                    <span className="kicker">{prettyDate(edit.submitted)}</span>
                    <StatusPill status={edit.status} />
                  </span>
                  <strong className="row-title">{edit.label}</strong>
                  <p>{edit.value}</p>
                  <p className="meta">{edit.reason}</p>
                  <p className="decision">{edit.decision}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

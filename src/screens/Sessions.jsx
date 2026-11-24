import { useState } from 'react'
import { useStore } from '../store'
import { prettyDate, whenLabel } from '../data'
import { PageHead, StatusPill, Field, Empty } from '../ui'

const MOODS = ['Light', 'Steady', 'Heavy']

export default function Sessions() {
  const { bundle, addSessionNote, submitAssignment } = useStore()
  const { progress } = bundle
  const ratio = Math.round((progress.attended / progress.planned) * 100)
  const upcoming = bundle.sessions.filter((session) => session.status === 'upcoming')
  const attended = bundle.sessions.filter((session) => session.status === 'attended')
  const [date, setDate] = useState(attended[0]?.date || bundle.sessions[0].date)
  const [mood, setMood] = useState('Steady')
  const [text, setText] = useState('')
  const [noteError, setNoteError] = useState('')
  const [drafts, setDrafts] = useState({})
  const [assignError, setAssignError] = useState('')

  function saveNote(event) {
    event.preventDefault()
    if (text.trim().length < 8) {
      setNoteError('Write a few lines. This note is for you and for Helen.')
      return
    }
    addSessionNote({ date, mood, text: text.trim() })
    setText('')
    setNoteError('')
  }

  function sendAssignment(event, assignment) {
    event.preventDefault()
    const value = (drafts[assignment.id] || '').trim()
    if (value.length < 8) {
      setAssignError(assignment.id)
      return
    }
    submitAssignment(assignment.id, value)
    setAssignError('')
  }

  return (
    <>
      <PageHead
        eyebrow={`${progress.programme} · ${progress.cycle}`}
        title="Internal psychotherapy"
        lede="Your own sessions, progress, notes, and assignments. Guest treatments stay on the task list. These notes stay on your login."
      />

      <section className="card meter-card">
        <div>
          <p className="kicker">Progress with {progress.with}</p>
          <h2>
            {progress.attended} of {progress.planned} sessions
          </h2>
          <p className="meta">
            {upcoming.length} on the calendar · {progress.planned - progress.attended} left in this cycle
          </p>
        </div>
        <div className="meter" role="img" aria-label={`${progress.attended} of ${progress.planned} sessions attended`}>
          <span style={{ width: `${ratio}%` }} />
        </div>
        <ul className="themes">
          {progress.themes.map((theme) => (
            <li key={theme}>{theme}</li>
          ))}
        </ul>
      </section>

      <div className="split">
        <section className="card">
          <h2>Schedule</h2>
          <p className="kicker">Upcoming</p>
          {upcoming.length === 0 ? <Empty>Nothing booked.</Empty> : null}
          <div className="rows">
            {upcoming.map((session) => (
              <article key={session.id} className="row static">
                <span className="row-top">
                  <span className="kicker">{session.time}</span>
                  <StatusPill status={session.status} />
                </span>
                <strong className="row-title">{prettyDate(session.date)}</strong>
                <span className="meta">
                  {session.with} · {session.place}
                </span>
                <p>{session.focus}</p>
              </article>
            ))}
          </div>
          <p className="kicker spaced">Attended</p>
          <div className="rows">
            {attended.map((session) => (
              <article key={session.id} className="row static">
                <span className="row-top">
                  <span className="kicker">{session.time}</span>
                  <StatusPill status={session.status} />
                </span>
                <strong className="row-title">{prettyDate(session.date)}</strong>
                <p>{session.focus}</p>
              </article>
            ))}
          </div>
        </section>

        <form className="card stack-form" onSubmit={saveNote}>
          <h2>Session note</h2>
          <p className="meta">A private note after a session. It is not a guest record.</p>
          <Field label="Session">
            <select value={date} onChange={(event) => setDate(event.target.value)}>
              {bundle.sessions.map((session) => (
                <option key={session.id} value={session.date}>
                  {prettyDate(session.date)} · {session.focus}
                </option>
              ))}
            </select>
          </Field>
          <div className="field">
            <span>How you left the room</span>
            <div className="scores" role="group" aria-label="How you left the room">
              {MOODS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={mood === item ? 'score on wide-score' : 'score wide-score'}
                  aria-pressed={mood === item}
                  onClick={() => setMood(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <Field label="Note">
            <textarea value={text} onChange={(event) => setText(event.target.value)} />
          </Field>
          {noteError ? <p className="error">{noteError}</p> : null}
          <button className="btn primary" type="submit">
            Save note
          </button>
          {bundle.sessionNotes.length === 0 ? <Empty>No notes yet.</Empty> : null}
          {bundle.sessionNotes.map((note) => (
            <article key={note.id} className="note">
              <span>
                {whenLabel(note.date)} · {note.mood}
              </span>
              {note.text}
            </article>
          ))}
        </form>
      </div>

      <section className="stack">
        <h2 className="side-title">Assignments</h2>
        {bundle.assignments.map((assignment) => (
          <article key={assignment.id} className="card">
            <span className="row-top">
              <span className="kicker">Due {prettyDate(assignment.due)}</span>
              <StatusPill status={assignment.status === 'submitted' ? 'submitted' : 'open'} />
            </span>
            <h2>{assignment.title}</h2>
            <p>{assignment.prompt}</p>
            {assignment.status === 'submitted' ? (
              <div className="paper">
                <p className="kicker">Sent {prettyDate(assignment.submittedOn)}</p>
                <p>{assignment.submission}</p>
              </div>
            ) : (
              <form className="stack-form" onSubmit={(event) => sendAssignment(event, assignment)}>
                <Field label="Your assignment">
                  <textarea
                    value={drafts[assignment.id] || ''}
                    onChange={(event) => setDrafts({ ...drafts, [assignment.id]: event.target.value })}
                  />
                </Field>
                {assignError === assignment.id ? <p className="error">Write the assignment before you send it.</p> : null}
                <button className="btn primary" type="submit">
                  Submit assignment
                </button>
              </form>
            )}
          </article>
        ))}
      </section>
    </>
  )
}

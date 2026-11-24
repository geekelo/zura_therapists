import { useState } from 'react'
import { useStore } from '../store'
import { clockStamp, whenLabel } from '../data'
import { Field, PageHead } from '../ui'

function byNewest(a, b) {
  return b.date.localeCompare(a.date) || b.time.localeCompare(a.time)
}

export default function Accountability() {
  const { therapist, house, go, addReport } = useStore()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const reports = (house.reports || []).slice().sort(byNewest)

  function file(event) {
    event.preventDefault()
    if (title.trim().length < 3) {
      setError('Give the report a title.')
      return
    }
    if (body.trim().length < 8) {
      setError('Write what the floor should be able to look up later.')
      return
    }
    addReport({
      from: therapist.name,
      title: title.trim(),
      body: body.trim(),
      time: clockStamp(),
    })
    setTitle('')
    setBody('')
    setError('')
  }

  return (
    <>
      <PageHead
        eyebrow="Record"
        title="Accountability"
        lede="Reports the floor has filed, newest first. This is the record. It is not a post on the timeline."
      >
        <button type="button" className="btn ghost" onClick={() => go('posts')}>
          Back to posts
        </button>
      </PageHead>

      <form className="card stack-form composer-card" onSubmit={file}>
        <div className="card-head">
          <h2>File a report</h2>
        </div>
        <Field label="Title">
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </Field>
        <Field label="What should stay on the record">
          <textarea className="composer" value={body} onChange={(event) => setBody(event.target.value)} />
        </Field>
        {error ? <p className="error">{error}</p> : null}
        <div className="actions">
          <button className="btn primary" type="submit">
            File report
          </button>
        </div>
      </form>

      <ol className="timeline">
        {reports.map((report) => (
          <li key={report.id} className="card report">
            <p className="kicker">
              {whenLabel(report.date)} · {report.time} · {report.from}
            </p>
            <h2>{report.title}</h2>
            <p className="story">{report.body}</p>
          </li>
        ))}
      </ol>
    </>
  )
}

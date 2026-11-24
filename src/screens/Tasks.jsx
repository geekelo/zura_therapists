import { useState } from 'react'
import { useStore } from '../store'
import { TASK_TYPES, TYPE_NAME, whenLabel } from '../data'
import { PageHead, Segment, StatusPill, Empty } from '../ui'

const STATUSES = [
  { id: 'all', label: 'Any status' },
  { id: 'assigned', label: 'Assigned' },
  { id: 'inprogress', label: 'In progress' },
  { id: 'done', label: 'Done' },
]

export default function Tasks() {
  const { bundle, selectedTaskId, selectTask, setTaskStatus, toggleCheck, addTaskNote } = useStore()
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  const [note, setNote] = useState('')
  const tasks = bundle.tasks.filter((task) => {
    if (type !== 'all' && task.type !== type) return false
    if (status !== 'all' && task.status !== status) return false
    return true
  })
  const activeId = tasks.some((task) => task.id === selectedTaskId) ? selectedTaskId : tasks[0]?.id
  const active = bundle.tasks.find((task) => task.id === activeId)

  function saveNote(event) {
    event.preventDefault()
    if (!active || !note.trim()) return
    addTaskNote(active.id, note.trim())
    setNote('')
  }

  return (
    <>
      <PageHead
        eyebrow="Floor book"
        title="Tasks"
        lede="Sessions, cleaning, operations, leadership, and social work assigned to you. Guest treatments stay in this list. Your own psychotherapy does not."
      />
      <div className="seg-stack">
        <Segment label="Task type" value={type} onChange={setType} options={TASK_TYPES} />
        <Segment label="Task status" value={status} onChange={setStatus} options={STATUSES} />
      </div>
      {tasks.length === 0 ? (
        <Empty>Nothing in this set.</Empty>
      ) : (
        <div className="master">
          <div className="card rows">
            {tasks.map((task) => (
              <button
                key={task.id}
                type="button"
                className={task.id === activeId ? 'row on' : 'row'}
                onClick={() => selectTask(task.id)}
              >
                <span className="row-top">
                  <span className="kicker">
                    {TYPE_NAME[task.type]} · {whenLabel(task.date)}
                  </span>
                  <StatusPill status={task.status} />
                </span>
                <strong className="row-title">{task.title}</strong>
                <span className="meta">
                  {task.time} · {task.place}
                </span>
              </button>
            ))}
          </div>
          {active ? (
            <article className="card detail">
              <span className="row-top">
                <p className="kicker">{TYPE_NAME[active.type]}</p>
                <StatusPill status={active.status} />
              </span>
              <h2>{active.title}</h2>
              <p className="meta">
                {whenLabel(active.date)} · {active.time}
                <br />
                {active.place}
                {active.channel ? ` · ${active.channel}` : ''}
              </p>
              <p>{active.detail}</p>
              <h3>Checklist</h3>
              <ul className="checks">
                {active.checklist.map((item, index) => (
                  <li key={item.label}>
                    <label className={item.done ? 'check done' : 'check'}>
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleCheck(active.id, index)}
                      />
                      <span>{item.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
              {active.notes.length > 0 ? (
                <>
                  <h3>Notes</h3>
                  {active.notes.map((item) => (
                    <p key={item.id} className="note">
                      {item.text}
                      <span>{whenLabel(item.at)}</span>
                    </p>
                  ))}
                </>
              ) : null}
              <form onSubmit={saveNote} className="stack-form">
                <label className="field">
                  <span>Add a note</span>
                  <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="What the next person should know" />
                </label>
                <div className="actions">
                  <button className="btn ghost" type="submit" disabled={!note.trim()}>
                    Save note
                  </button>
                  {active.status === 'assigned' ? (
                    <button className="btn ghost" type="button" onClick={() => setTaskStatus(active.id, 'inprogress')}>
                      Start
                    </button>
                  ) : null}
                  {active.status !== 'done' ? (
                    <button className="btn primary" type="button" onClick={() => setTaskStatus(active.id, 'done')}>
                      Mark done
                    </button>
                  ) : null}
                </div>
              </form>
            </article>
          ) : null}
        </div>
      )}
    </>
  )
}

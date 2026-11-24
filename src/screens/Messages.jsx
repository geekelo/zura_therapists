import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { TYPE_NAME, whenLabel } from '../data'
import { PageHead, Segment, Empty, Pill } from '../ui'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'task', label: 'Tasks' },
  { id: 'activity', label: 'Activities' },
]

export default function Messages() {
  const { bundle, selectedMessageId, openMessage, openTask } = useStore()
  const [filter, setFilter] = useState('all')
  const messages = bundle.messages.filter((message) => filter === 'all' || message.kind === filter)
  const activeId = messages.some((message) => message.id === selectedMessageId) ? selectedMessageId : messages[0]?.id
  const active = bundle.messages.find((message) => message.id === activeId)
  const task = active?.taskId ? bundle.tasks.find((item) => item.id === active.taskId) : null

  useEffect(() => {
    if (active?.unread) openMessage(active.id)
  }, [active])

  return (
    <>
      <PageHead
        eyebrow="Inbox"
        title="Messages"
        lede="Everything here is tied to a task on your book, or to a house activity. Nothing in this inbox is a guest writing in."
      />
      <Segment label="Message type" value={filter} onChange={setFilter} options={FILTERS} />
      {messages.length === 0 ? (
        <Empty>Nothing in this set.</Empty>
      ) : (
        <div className="master">
          <div className="card rows">
            {messages.map((message) => (
              <button
                key={message.id}
                type="button"
                className={message.id === activeId ? 'row on' : 'row'}
                onClick={() => openMessage(message.id)}
              >
                <span className="row-top">
                  <span className="kicker">
                    {message.kind === 'task' ? 'Task' : 'Activity'} · {whenLabel(message.date)}
                  </span>
                  {message.unread ? <Pill tone="gold">Unread</Pill> : null}
                </span>
                <strong className="row-title">{message.subject}</strong>
                <span className="meta">{message.from}</span>
              </button>
            ))}
          </div>
          {active ? (
            <article className="card detail">
              <p className="kicker">
                {active.kind === 'task' ? 'About a task' : `Activity · ${active.activity}`}
              </p>
              <h2>{active.subject}</h2>
              <p className="meta">
                {active.from} · {whenLabel(active.date)} · {active.time}
              </p>
              <p>{active.body}</p>
              {task ? (
                <div className="paper">
                  <p className="kicker">Linked task</p>
                  <strong>{task.title}</strong>
                  <p className="meta">
                    {TYPE_NAME[task.type]} · {task.time} · {task.place}
                  </p>
                  <button type="button" className="btn primary small" onClick={() => openTask(task.id)}>
                    Open the task
                  </button>
                </div>
              ) : null}
            </article>
          ) : null}
        </div>
      )}
    </>
  )
}

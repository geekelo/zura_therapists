import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { ANNOUNCE_NEW_FROM, whenLabel } from '../data'
import { PageHead, Segment, Empty, Pill } from '../ui'

const FILTERS = [
  { id: 'new', label: 'New' },
  { id: 'older', label: 'Older' },
]

export default function Announcements() {
  const { house, bundle, seeAnnouncement } = useStore()
  const [filter, setFilter] = useState('new')
  const seen = new Set(bundle.seenAnnouncements || [])
  const items = (house.announcements || [])
    .filter((item) => (filter === 'new' ? item.date >= ANNOUNCE_NEW_FROM : item.date < ANNOUNCE_NEW_FROM))
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
  const [picked, setPicked] = useState('')
  const activeId = items.some((item) => item.id === picked) ? picked : items[0]?.id
  const active = items.find((item) => item.id === activeId)

  useEffect(() => {
    if (active && !seen.has(active.id)) seeAnnouncement(active.id)
  }, [active])

  return (
    <>
      <PageHead
        eyebrow="House"
        title="Announcements"
        lede="Notes from the desk and the leads. New is this week. Older stays here so you can look a note up later."
      />
      <Segment label="Announcement age" value={filter} onChange={setFilter} options={FILTERS} />
      {items.length === 0 ? (
        <Empty>{filter === 'new' ? 'Nothing new this week.' : 'No older notes yet.'}</Empty>
      ) : (
        <div className="master">
          <div className="card rows">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === activeId ? 'row on' : 'row'}
                onClick={() => setPicked(item.id)}
              >
                <span className="row-top">
                  <span className="kicker">
                    {whenLabel(item.date)} · {item.time}
                  </span>
                  {seen.has(item.id) ? null : <Pill tone="gold">New</Pill>}
                </span>
                <strong className="row-title">{item.title}</strong>
                <span className="meta">{item.from}</span>
              </button>
            ))}
          </div>
          {active ? (
            <article className="card detail">
              <p className="kicker">
                {active.from} · {whenLabel(active.date)} · {active.time}
              </p>
              <h2>{active.title}</h2>
              <p>{active.body}</p>
            </article>
          ) : null}
        </div>
      )}
    </>
  )
}

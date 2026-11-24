import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store'
import { APP_TODAY, unreadAnnouncements, unreadTalk } from '../data'
import Today from './Today'
import Messages from './Messages'
import Tasks from './Tasks'
import Sessions from './Sessions'
import Reviews from './Reviews'
import Applications from './Applications'
import Learning from './Learning'
import Earnings from './Earnings'
import Queries from './Queries'
import Escalate from './Escalate'
import Bio from './Bio'
import Attendance from './Attendance'
import Announcements from './Announcements'
import Chat from './Chat'

const SCREENS = {
  today: Today,
  messages: Messages,
  tasks: Tasks,
  sessions: Sessions,
  reviews: Reviews,
  applications: Applications,
  learning: Learning,
  earnings: Earnings,
  queries: Queries,
  escalate: Escalate,
  bio: Bio,
  attendance: Attendance,
  announcements: Announcements,
  chat: Chat,
}

export default function Shell() {
  const { therapist, bundle, house, route, go, logout, flash, clearFlash } = useStore()
  const mainRef = useRef(null)
  const unread = bundle.messages.filter((message) => message.unread).length
  const openTasks = bundle.tasks.filter((task) => task.status !== 'done').length
  const reviewDue = !bundle.team.some((review) => review.date === APP_TODAY && review.from === therapist.name)
  const clockedIn = (bundle.attendance || []).some((day) => day.date === APP_TODAY && day.clockIn)
  const announceNew = unreadAnnouncements(house.announcements, bundle.seenAnnouncements).length
  const chatNew = unreadTalk(house.talk, therapist.name, bundle.seenTalk).length
  const [moreOpen, setMoreOpen] = useState(false)
  const tabIds = ['today', 'attendance', 'chat', 'tasks']

  const groups = [
    {
      label: 'Work',
      items: [
        { id: 'today', label: 'Today' },
        { id: 'attendance', label: 'Attendance', dot: !clockedIn },
        { id: 'messages', label: 'Messages', badge: unread },
        { id: 'chat', label: 'Chat', badge: chatNew },
        { id: 'announcements', label: 'Announcements', badge: announceNew },
        { id: 'tasks', label: 'Tasks', badge: openTasks },
      ],
    },
    {
      label: 'Practice',
      items: [
        { id: 'sessions', label: 'Psychotherapy' },
        { id: 'reviews', label: 'Reviews', dot: reviewDue },
      ],
    },
    {
      label: 'Desk',
      items: [
        { id: 'applications', label: 'Leave & funding' },
        { id: 'learning', label: 'Learning' },
        { id: 'earnings', label: 'Earnings' },
        { id: 'queries', label: 'Queries' },
        { id: 'escalate', label: 'Escalate' },
        { id: 'bio', label: 'My details' },
      ],
    },
  ]

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
    window.scrollTo(0, 0)
    setMoreOpen(false)
  }, [route])

  useEffect(() => {
    document.body.classList.toggle('more-open', moreOpen)
    return () => document.body.classList.remove('more-open')
  }, [moreOpen])

  useEffect(() => {
    if (!moreOpen) return undefined
    function onKey(event) {
      if (event.key === 'Escape') setMoreOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [moreOpen])

  const Screen = SCREENS[route] || Today

  function itemButton(item) {
    return (
      <button
        key={item.id}
        type="button"
        className={route === item.id ? 'nav-btn active' : 'nav-btn'}
        aria-current={route === item.id ? 'page' : undefined}
        onClick={() => go(item.id)}
      >
        <span>{item.label}</span>
        {item.badge ? <span className="badge">{item.badge}</span> : null}
        {item.dot ? <span className="dot" aria-label="Due today" /> : null}
      </button>
    )
  }

  return (
    <div className="shell">
      <aside className="sider">
        <div className="brand">
          <strong>Zura</strong>
          <span>Therapist studio</span>
        </div>
        <div className="nav-scroll">
          {groups.map((group) => (
            <div key={group.label} className="nav-group">
              <p className="nav-label">{group.label}</p>
              {group.items.map(itemButton)}
            </div>
          ))}
        </div>
        <div className="sider-foot">
          <div className="who">
            <span className="avatar" aria-hidden="true">
              {therapist.initials}
            </span>
            <span>
              <strong>{therapist.name}</strong>
              <span>{therapist.id}</span>
            </span>
          </div>
          <button type="button" className="text-btn" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>
      <div className="main" ref={mainRef}>
        <div className="mobile-bar">
          <div className="brand">
            <strong>Zura</strong>
            <span>{therapist.first}</span>
          </div>
          <button type="button" className="text-btn" onClick={logout}>
            Sign out
          </button>
        </div>
        <div className="page">
          {flash ? (
            <div className="flash" role="status">
              <p>{flash}</p>
              <button type="button" onClick={clearFlash} aria-label="Dismiss">
                Close
              </button>
            </div>
          ) : null}
          <Screen />
        </div>
      </div>
      <nav className="tabbar" aria-label="Floor">
        {groups
          .flatMap((group) => group.items)
          .filter((item) => tabIds.includes(item.id))
          .map((item) => (
            <button
              key={item.id}
              type="button"
              className={route === item.id ? 'tab on' : 'tab'}
              aria-current={route === item.id ? 'page' : undefined}
              onClick={() => go(item.id)}
            >
              <span>{item.label}</span>
              {item.badge ? <span className="badge">{item.badge}</span> : null}
              {item.dot ? <span className="dot" aria-label="Due today" /> : null}
            </button>
          ))}
        <button
          type="button"
          className={!tabIds.includes(route) || moreOpen ? 'tab on' : 'tab'}
          aria-expanded={moreOpen}
          aria-controls="more-menu"
          onClick={() => setMoreOpen((open) => !open)}
        >
          <span>More</span>
          {unread + announceNew > 0 ? <span className="badge">{unread + announceNew}</span> : null}
          {reviewDue ? <span className="dot" aria-label="Due today" /> : null}
        </button>
      </nav>
      {moreOpen ? (
        <div className="more-sheet" onClick={() => setMoreOpen(false)}>
          <div
            id="more-menu"
            className="more-panel"
            role="dialog"
            aria-modal="true"
            aria-label="More"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="more-head">
              <strong>More</strong>
              <button type="button" className="btn ghost small" onClick={() => setMoreOpen(false)}>
                Close
              </button>
            </div>
            {groups.map((group) => {
              const items = group.items.filter((item) => !tabIds.includes(item.id))
              if (!items.length) return null
              return (
                <div key={group.label}>
                  <p className="more-label">{group.label}</p>
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={route === item.id ? 'more-btn on' : 'more-btn'}
                      aria-current={route === item.id ? 'page' : undefined}
                      onClick={() => go(item.id)}
                    >
                      <span>{item.label}</span>
                      {item.badge ? <span className="badge">{item.badge}</span> : null}
                      {item.dot ? <span className="dot" aria-label="Due today" /> : null}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

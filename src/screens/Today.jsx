import { useStore } from '../store'
import { APP_TODAY, TYPE_NAME, greeting, money, prettyDate, weekday, closedMonths, sumAmounts, unreadAnnouncements, whenLabel } from '../data'
import { StatusPill } from '../ui'
import { ClockCard } from './Attendance'

function shortDay(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function Today() {
  const { therapist, bundle, house, go, openTask, openMessage } = useStore()
  const todayTasks = bundle.tasks.filter((task) => task.date === APP_TODAY)
  const remaining = todayTasks.filter((task) => task.status !== 'done')
  const unread = bundle.messages.filter((message) => message.unread)
  const nextSession = bundle.sessions
    .filter((session) => session.status === 'upcoming')
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))[0]
  const total = sumAmounts(closedMonths(bundle.months))
  const reviewDue = !bundle.team.some((review) => review.date === APP_TODAY && review.from === therapist.name)
  const latest = unread[0] || bundle.messages[0]
  const fresh = unreadAnnouncements(house.announcements, bundle.seenAnnouncements)[0]

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">
            {weekday(APP_TODAY)} · {prettyDate(APP_TODAY)} · {therapist.branch}
          </p>
          <h1>{greeting(therapist.first)}</h1>
          <p className="lede">
            {therapist.role} on the floor until {therapist.shift.split('–')[1]}. {remaining.length} task
            {remaining.length === 1 ? '' : 's'} still open today
            {reviewDue ? ', and the team review is waiting for you.' : '.'}
          </p>
        </div>
      </header>

      <section className="stats">
        <button type="button" className="stat card" onClick={() => go('tasks')}>
          <span className="kicker">On today</span>
          <b>{remaining.length}</b>
          <span>Tasks still open</span>
        </button>
        <button type="button" className="stat card" onClick={() => go('messages')}>
          <span className="kicker">Inbox</span>
          <b>{unread.length}</b>
          <span>Unread messages</span>
        </button>
        <button type="button" className="stat card" onClick={() => go('sessions')}>
          <span className="kicker">Stillwater</span>
          <b>{nextSession ? shortDay(nextSession.date) : '—'}</b>
          <span>{nextSession ? `${nextSession.time.split('–')[0]} · ${nextSession.with}` : 'No session booked'}</span>
        </button>
        <button type="button" className="stat card" onClick={() => go('earnings')}>
          <span className="kicker">Earnings</span>
          <b className="money">{money(total)}</b>
          <span>Since {therapist.joinedShort}, excluding this month</span>
        </button>
      </section>

      <div className="split">
        <section className="card">
          <div className="card-head">
            <h2>Today’s tasks</h2>
            <button type="button" className="btn ghost small" onClick={() => go('tasks')}>
              All tasks
            </button>
          </div>
          <div className="rows">
            {todayTasks.map((task) => (
              <button key={task.id} type="button" className="row" onClick={() => openTask(task.id)}>
                <span className="row-top">
                  <span className="kicker">
                    {TYPE_NAME[task.type]} · {task.time}
                  </span>
                  <StatusPill status={task.status} />
                </span>
                <strong className="row-title">{task.title}</strong>
                <span className="meta">{task.place}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="stack">
          <ClockCard />
          {fresh ? (
            <section className="card">
              <p className="kicker">New announcement</p>
              <h2>{fresh.title}</h2>
              <p className="meta">
                {fresh.from} · {whenLabel(fresh.date)}
              </p>
              <p>{fresh.body}</p>
              <button type="button" className="btn ghost small" onClick={() => go('announcements')}>
                Read announcements
              </button>
            </section>
          ) : null}
          <section className="card">
            <p className="kicker">Next internal session</p>
            {nextSession ? (
              <>
                <h2>{prettyDate(nextSession.date)}</h2>
                <p className="meta">
                  {nextSession.time} · {nextSession.with}
                  <br />
                  {nextSession.place}
                </p>
                <p>{nextSession.focus}</p>
                <button type="button" className="btn ghost small" onClick={() => go('sessions')}>
                  Open psychotherapy
                </button>
              </>
            ) : (
              <p>Nothing booked.</p>
            )}
          </section>

          <section className="card">
            <p className="kicker">{latest?.unread ? 'Unread' : 'Latest message'}</p>
            {latest ? (
              <>
                <h2>{latest.subject}</h2>
                <p className="meta">
                  {latest.from} · {latest.kind === 'task' ? 'Task' : `Activity · ${latest.activity}`}
                </p>
                <p>{latest.body}</p>
                <button type="button" className="btn ghost small" onClick={() => {
                  openMessage(latest.id)
                  go('messages', { selectedMessageId: latest.id })
                }}>
                  Read it
                </button>
              </>
            ) : null}
          </section>

          {reviewDue ? (
            <section className="card quiet-card">
              <p className="kicker">Due today</p>
              <h2>Team review</h2>
              <p>The day board is open. Your note closes it.</p>
              <button type="button" className="btn primary small" onClick={() => go('reviews')}>
                Write today’s review
              </button>
            </section>
          ) : (
            <section className="card">
              <p className="kicker">Reviews</p>
              <h2>Today’s team note is in.</h2>
              <button type="button" className="btn ghost small" onClick={() => go('reviews')}>
                See the board
              </button>
            </section>
          )}
        </div>
      </div>
    </>
  )
}

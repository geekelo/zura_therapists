import { useState } from 'react'
import { useStore } from '../store'
import { APP_TODAY, clockStamp, describeDay, minutesOf, prettyDate, weekday } from '../data'
import { Empty, PageHead, Segment, StatusPill } from '../ui'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'present', label: 'Present' },
  { id: 'late', label: 'Late' },
  { id: 'absent', label: 'Absent' },
  { id: 'leave', label: 'Leave' },
]

export function ClockCard() {
  const { therapist, bundle, clockIn, clockOut, go, route } = useStore()
  const today = (bundle.attendance || []).find((day) => day.date === APP_TODAY)
  const view = describeDay(today, therapist.shift)
  const [start, end] = therapist.shift.split('–')
  const stillIn = today?.clockIn && !today.clockOut

  return (
    <section className="card clock-card">
      <span className="row-top">
        <p className="kicker">Shift {therapist.shift}</p>
        {today ? <StatusPill status={view.status} /> : <StatusPill status="due" />}
      </span>
      {view.status === 'due' ? (
        <>
          <h2>Not clocked in</h2>
          <p>The book starts at {start}. Arriving more than ten minutes after that is marked late.</p>
        </>
      ) : null}
      {stillIn ? (
        <>
          <p className="clock-time">{today.clockIn}</p>
          <p>{view.late ? `Late against the ${start} start. You are on the floor until ${end}.` : `On the floor until ${end}.`}</p>
        </>
      ) : null}
      {today?.clockOut ? (
        <>
          <p className="clock-time">
            {today.clockIn}–{today.clockOut}
          </p>
          <p>{view.hours ? `${view.hours} on the floor.` : 'Today is closed.'}</p>
        </>
      ) : null}
      <div className="actions">
        {view.status === 'due' ? (
          <button type="button" className="btn primary" onClick={() => clockIn(clockStamp())}>
            Clock in
          </button>
        ) : null}
        {stillIn ? (
          <button type="button" className="btn primary" onClick={() => clockOut(clockStamp())}>
            Clock out
          </button>
        ) : null}
        {route !== 'attendance' ? (
          <button type="button" className="btn ghost small" onClick={() => go('attendance')}>
            See attendance
          </button>
        ) : null}
      </div>
    </section>
  )
}

function monthLabel(key) {
  const [year, month] = key.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

function monthHours(records) {
  const minutes = records.reduce((total, day) => {
    if (!day.clockIn || !day.clockOut) return total
    const span = minutesOf(day.clockOut) - minutesOf(day.clockIn)
    return span > 0 ? total + span : total
  }, 0)
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins ? `${hours}h ${mins}m` : `${hours}h`
}

export default function Attendance() {
  const { therapist, bundle } = useStore()
  const records = bundle.attendance || []
  const months = [...new Set(records.map((day) => day.date.slice(0, 7)))].sort((a, b) => b.localeCompare(a))
  const [picked, setMonth] = useState('')
  const month = months.includes(picked) ? picked : months.find((item) => item === APP_TODAY.slice(0, 7)) || months[0] || ''
  const [filter, setFilter] = useState('all')
  const inMonth = records.filter((day) => day.date.startsWith(month))
  const described = inMonth.map((day) => ({ day, view: describeDay(day, therapist.shift) }))
  const visible = described.filter((item) => filter === 'all' || item.view.status === filter)
  const count = (status) => described.filter((item) => item.view.status === status).length

  return (
    <>
      <PageHead
        eyebrow={therapist.branch}
        title="Attendance"
        lede="Clock in when you reach the floor, and clock out when you leave. The month below is what the house has already recorded."
      />
      <ClockCard />
      <section className="stats">
          <article className="stat card">
            <span className="kicker">Present</span>
            <b>{count('present')}</b>
            <span>On time, closed</span>
          </article>
          <article className="stat card">
            <span className="kicker">Late</span>
            <b>{count('late')}</b>
            <span>After the ten-minute grace</span>
          </article>
          <article className="stat card">
            <span className="kicker">Absent</span>
            <b>{count('absent')}</b>
            <span>Called off the book</span>
          </article>
          <article className="stat card">
            <span className="kicker">Hours</span>
            <b className="money">{monthHours(inMonth)}</b>
            <span>Closed days this month</span>
          </article>
        </section>
      <Segment
        label="Month"
        value={month}
        onChange={setMonth}
        options={months.map((item) => ({ id: item, label: monthLabel(item) }))}
      />
      <Segment label="Attendance type" value={filter} onChange={setFilter} options={FILTERS} />
      {visible.length === 0 ? (
        <Empty>Nothing in this set.</Empty>
      ) : (
        <div className="stack">
          {visible
            .slice()
            .sort((a, b) => b.day.date.localeCompare(a.day.date))
            .map(({ day, view }) => (
              <article key={day.id} className="card">
                <span className="row-top">
                  <span className="kicker">
                    {day.date === APP_TODAY ? 'Today' : weekday(day.date)} · {prettyDate(day.date)}
                  </span>
                  <StatusPill status={view.status} />
                </span>
                <h2>
                  {day.clockIn ? `${day.clockIn}${day.clockOut ? `–${day.clockOut}` : ''}` : day.kind === 'leave' ? 'Leave' : 'Did not attend'}
                </h2>
                <p className="meta">
                  {view.hours ? `${view.hours}` : ''}
                  {view.hours && day.note ? ' · ' : ''}
                  {day.note}
                  {!view.hours && !day.note && day.clockIn && !day.clockOut ? 'Still on the floor.' : ''}
                </p>
              </article>
            ))}
        </div>
      )}
    </>
  )
}

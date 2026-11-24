export function PageHead({ eyebrow, title, lede, children }) {
  return (
    <header className="page-head">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {lede ? <p className="lede">{lede}</p> : null}
      </div>
      {children}
    </header>
  )
}

export function Pill({ tone = 'ink', children }) {
  return <span className={`pill ${tone}`}>{children}</span>
}

const STATUS = {
  assigned: ['wait', 'Assigned'],
  inprogress: ['ink', 'In progress'],
  done: ['ok', 'Done'],
  pending: ['wait', 'Pending'],
  approved: ['ok', 'Approved'],
  declined: ['no', 'Declined'],
  open: ['wait', 'Open'],
  resolved: ['ok', 'Resolved'],
  received: ['wait', 'Received'],
  inreview: ['ink', 'In review'],
  submitted: ['ok', 'Submitted'],
  upcoming: ['gold', 'Upcoming'],
  attended: ['ok', 'Attended'],
  current: ['ink', 'In progress'],
  complete: ['ok', 'Complete'],
  ahead: ['gold', 'Up next'],
  due: ['gold', 'Not in'],
  in: ['ink', 'On the floor'],
  present: ['ok', 'Present'],
  late: ['wait', 'Late'],
  absent: ['no', 'Absent'],
  leave: ['gold', 'Leave'],
}

export function StatusPill({ status }) {
  const [tone, label] = STATUS[status] || ['ink', status]
  return <Pill tone={tone}>{label}</Pill>
}

export function Field({ label, children, className = '' }) {
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      {children}
    </label>
  )
}

export function Segment({ value, onChange, options, label }) {
  return (
    <div className="seg" role="tablist" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="tab"
          aria-selected={value === option.id}
          className={value === option.id ? 'on' : ''}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export function ScorePicker({ label, value, onChange }) {
  return (
    <div className="field">
      <span>{label}</span>
      <div className="scores" role="group" aria-label={label}>
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            className={value === score ? 'score on' : 'score'}
            aria-pressed={value === score}
            onClick={() => onChange(score)}
          >
            {score}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Empty({ children }) {
  return <p className="empty">{children}</p>
}

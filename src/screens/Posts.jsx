import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { APP_TODAY, POST_LABELS, clockStamp, postLabel, whenLabel } from '../data'
import { Empty, Field, PageHead, Pill, Segment } from '../ui'

const FILTERS = [{ id: 'all', label: 'All' }, ...POST_LABELS.map(({ id, label }) => ({ id, label }))]

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function byNewest(a, b) {
  return b.date.localeCompare(a.date) || b.time.localeCompare(a.time)
}

export default function Posts() {
  const { therapist, house, go, addPost, addComment } = useStore()
  const people = [therapist.name, ...therapist.peers]
  const [filter, setFilter] = useState('all')
  const [label, setLabel] = useState('reminder')
  const [to, setTo] = useState(therapist.name)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [commentFor, setCommentFor] = useState('')
  const [drafts, setDrafts] = useState({})

  const needsPerson = label === 'task' || label === 'session'
  const posts = house.posts || []

  const visible = useMemo(() => {
    return posts
      .filter((post) => {
        if (filter === 'all') return true
        if (post.label !== filter) return false
        if (filter === 'task') return post.to === therapist.name || post.from === therapist.name
        return true
      })
      .slice()
      .sort(byNewest)
  }, [posts, filter, therapist.name])

  function publish(event) {
    event.preventDefault()
    const note = text.trim()
    if (note.length < 8) {
      setError('Write the note in a sentence or two.')
      return
    }
    if (needsPerson && !to) {
      setError('Choose who this is for.')
      return
    }
    addPost({
      label,
      from: therapist.name,
      to: needsPerson ? to : '',
      title: note,
      body: note,
      time: clockStamp(),
    })
    setText('')
    setError('')
    setFilter('all')
  }

  function sendComment(event, postId) {
    event.preventDefault()
    const text = (drafts[postId] || '').trim()
    if (text.length < 2) return
    addComment(postId, therapist.name, text, clockStamp())
    setDrafts((current) => ({ ...current, [postId]: '' }))
    setCommentFor('')
  }

  return (
    <>
      <PageHead
        eyebrow={`${therapist.branch} · ${whenLabel(APP_TODAY)}`}
        title="Posts"
        lede="Tasks, queries, sanctions, reminders, and assigned sessions, in the order they landed. A comment stays on the post."
      />

      <form className="post-compose" onSubmit={publish}>
        <select aria-label="Label" value={label} onChange={(event) => setLabel(event.target.value)}>
          {POST_LABELS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        {needsPerson ? (
          <select
            aria-label={label === 'task' ? 'This task is for' : 'This session is for'}
            value={to}
            onChange={(event) => setTo(event.target.value)}
          >
            {people.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        ) : null}
        <input
          className="post-field"
          value={text}
          placeholder="Post to the floor"
          aria-label="Post"
          onChange={(event) => {
            setText(event.target.value)
            setError('')
          }}
        />
        <button className="btn primary" type="submit">
          Post
        </button>
        {error ? <p className="error post-error">{error}</p> : null}
      </form>

      <div className="label-row">
        <Segment label="Post label" value={filter} onChange={setFilter} options={FILTERS} />
        <button type="button" className="account-jump" onClick={() => go('accountability')}>
          Accountability
        </button>
      </div>

      {visible.length === 0 ? (
        <Empty>
          {filter === 'task' ? 'Nothing assigned to you under this label.' : 'Nothing on the timeline with this label.'}
        </Empty>
      ) : (
        <div className="feed">
          {visible.map((post) => {
            const meta = postLabel(post.label)
            const comments = post.comments || []
            const open = commentFor === post.id
            return (
              <article key={post.id} className="card post">
                <header className="post-top">
                  <span className="avatar sm" aria-hidden="true">
                    {initials(post.from)}
                  </span>
                  <span>
                    <strong>{post.from}</strong>
                    <span className="meta">
                      {whenLabel(post.date)} · {post.time}
                    </span>
                  </span>
                  <Pill tone={meta.tone}>{meta.label}</Pill>
                </header>
                {post.title !== post.body ? <h2>{post.title}</h2> : null}
                {post.to ? (
                  <p className="meta post-for">{post.to === therapist.name ? 'For you' : `For ${post.to}`}</p>
                ) : null}
                <p className="story">{post.title === post.body ? post.title : post.body}</p>
                {comments.length > 0 ? (
                  <ul className="comments">
                    {comments.map((comment) => (
                      <li key={comment.id} className="comment">
                        <span className="comment-by">
                          {comment.from}
                          <span>
                            {whenLabel(comment.date)} · {comment.time}
                          </span>
                        </span>
                        <p>{comment.text}</p>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {open ? (
                  <form className="compose" onSubmit={(event) => sendComment(event, post.id)}>
                    <Field label={`Comment as ${therapist.first}`}>
                      <textarea
                        className="composer"
                        value={drafts[post.id] || ''}
                        onChange={(event) =>
                          setDrafts((current) => ({ ...current, [post.id]: event.target.value }))
                        }
                      />
                    </Field>
                    <button className="btn primary" type="submit">
                      Comment
                    </button>
                  </form>
                ) : (
                  <button type="button" className="btn ghost small" onClick={() => setCommentFor(post.id)}>
                    {comments.length ? `Comment · ${comments.length}` : 'Comment'}
                  </button>
                )}
              </article>
            )
          })}
        </div>
      )}
    </>
  )
}

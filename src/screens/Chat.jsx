import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store'
import { clockStamp, unreadTalk, whenLabel } from '../data'
import { PageHead, Segment, Field, Empty, Pill } from '../ui'

const MODES = [
  { id: 'floor', label: 'The floor' },
  { id: 'direct', label: 'A colleague' },
]

function byTime(a, b) {
  return a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
}

export default function Chat() {
  const { therapist, house, bundle, seeTalk, postPublic, sendChat } = useStore()
  const seen = new Set(bundle.seenTalk || [])
  const talk = house.talk || []
  const waiting = unreadTalk(talk, therapist.name, bundle.seenTalk)
  const unreadPeer = therapist.peers.find((name) => waiting.some((item) => item.from === name && item.to === therapist.name))
  const [mode, setMode] = useState(unreadPeer ? 'direct' : 'floor')
  const [peer, setPeer] = useState(unreadPeer || therapist.peers[0])
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const threadRef = useRef(null)

  const floor = talk.filter((item) => item.kind === 'public').slice().sort(byTime)
  const direct = talk
    .filter(
      (item) =>
        item.kind === 'direct' &&
        ((item.from === therapist.name && item.to === peer) || (item.from === peer && item.to === therapist.name)),
    )
    .slice()
    .sort(byTime)
  const visible = mode === 'floor' ? floor : direct

  useEffect(() => {
    const ids = visible.filter((item) => !seen.has(item.id)).map((item) => item.id)
    if (ids.length) seeTalk(ids)
  }, [mode, peer, talk])

  useEffect(() => {
    const node = threadRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [mode, peer, visible.length])

  function send(event) {
    event.preventDefault()
    const note = text.trim()
    if (!note) {
      setError(mode === 'floor' ? 'Write a note for the floor.' : `Write a note to ${peer}.`)
      return
    }
    const time = clockStamp()
    if (mode === 'floor') postPublic(therapist.name, note, time)
    else sendChat(therapist.name, peer, note, time)
    setText('')
    setError('')
  }

  return (
    <>
      <PageHead
        eyebrow="Floor"
        title="Chat"
        lede="Write to one colleague, or leave a note the whole floor can read. Guests never see this."
      />
      <Segment label="Who can read this" value={mode} onChange={setMode} options={MODES} />
      {mode === 'floor' ? (
        <article className="card">
          <p className="kicker">Everyone at Keizersgracht</p>
          <h2>The floor</h2>
          <Thread items={visible} me={therapist.name} threadRef={threadRef} empty="The floor is quiet." />
          <Composer
            label="Note for the floor"
            text={text}
            setText={setText}
            error={error}
            onSubmit={send}
            action="Post to the floor"
          />
        </article>
      ) : (
        <div className="master">
          <div className="card rows">
            {therapist.peers.map((name) => {
              const thread = talk
                .filter(
                  (item) =>
                    item.kind === 'direct' &&
                    ((item.from === therapist.name && item.to === name) || (item.from === name && item.to === therapist.name)),
                )
                .slice()
                .sort(byTime)
              const last = thread[thread.length - 1]
              const fresh = waiting.some((item) => item.from === name)
              return (
                <button
                  key={name}
                  type="button"
                  className={name === peer ? 'row on' : 'row'}
                  aria-label={name}
                  onClick={() => {
                    setPeer(name)
                    setError('')
                  }}
                >
                  <span className="row-top">
                    <strong className="row-title">{name}</strong>
                    {fresh ? <Pill tone="gold">New</Pill> : null}
                  </span>
                  <span className="meta">{last ? last.text : 'No notes yet'}</span>
                </button>
              )
            })}
          </div>
          <article className="card">
            <p className="kicker">Only the two of you</p>
            <h2>{peer}</h2>
            <Thread
              items={visible}
              me={therapist.name}
              threadRef={threadRef}
              empty={`No notes with ${peer} yet. Write the first one.`}
            />
            <Composer
              label={`Note to ${peer}`}
              text={text}
              setText={setText}
              error={error}
              onSubmit={send}
              action="Send"
            />
          </article>
        </div>
      )}
    </>
  )
}

function Thread({ items, me, threadRef, empty }) {
  if (!items.length) {
    return (
      <div className="thread" ref={threadRef}>
        <Empty>{empty}</Empty>
      </div>
    )
  }
  return (
    <div className="thread" ref={threadRef}>
      {items.map((item) => (
        <div key={item.id} className={item.from === me ? 'bubble mine' : 'bubble'}>
          <span className="meta">
            {item.from} · {whenLabel(item.date)} · {item.time}
          </span>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  )
}

function Composer({ label, text, setText, error, onSubmit, action }) {
  return (
    <form className="compose" onSubmit={onSubmit}>
      <Field label={label}>
        <textarea className="composer" value={text} onChange={(event) => setText(event.target.value)} />
      </Field>
      <button type="submit" className="btn primary">
        {action}
      </button>
      {error ? <p className="error wide-error">{error}</p> : null}
    </form>
  )
}

import { useState } from 'react'
import { useStore } from '../store'
import { APP_TODAY, FLOOR_WORDS, TEAM_PROMPT, whenLabel } from '../data'
import { PageHead, Segment, ScorePicker, Field } from '../ui'

export default function Reviews() {
  const { therapist, bundle, submitTeamReview, submitP2P } = useStore()
  const [tab, setTab] = useState('team')
  const [floor, setFloor] = useState(0)
  const [worked, setWorked] = useState('')
  const [fix, setFix] = useState('')
  const [shout, setShout] = useState('')
  const [teamError, setTeamError] = useState('')
  const [peer, setPeer] = useState(therapist.peers[0])
  const [presence, setPresence] = useState(0)
  const [craft, setCraft] = useState(0)
  const [teamwork, setTeamwork] = useState(0)
  const [note, setNote] = useState('')
  const [peerError, setPeerError] = useState('')

  const mineToday = bundle.team.some((review) => review.date === APP_TODAY && review.from === therapist.name)
  const dates = [...new Set(bundle.team.map((review) => review.date))].sort((a, b) => b.localeCompare(a))
  const received = bundle.p2p.filter((review) => review.to === therapist.name)
  const given = bundle.p2p.filter((review) => review.from === therapist.name)

  function sendTeam(event) {
    event.preventDefault()
    if (!floor) {
      setTeamError('Score the floor from 1 to 5.')
      return
    }
    if (worked.trim().length < 8 || fix.trim().length < 8) {
      setTeamError('Say what worked, and what tomorrow should protect.')
      return
    }
    submitTeamReview({
      from: therapist.name,
      floor,
      worked: worked.trim(),
      fix: fix.trim(),
      shout: shout.trim(),
    })
    setWorked('')
    setFix('')
    setShout('')
    setFloor(0)
    setTeamError('')
  }

  function sendPeer(event) {
    event.preventDefault()
    if (!presence || !craft || !teamwork) {
      setPeerError('Score presence, craft, and teamwork.')
      return
    }
    if (note.trim().length < 8) {
      setPeerError('Leave one specific sentence.')
      return
    }
    submitP2P({
      from: therapist.name,
      to: peer,
      presence,
      craft,
      teamwork,
      note: note.trim(),
    })
    setNote('')
    setPresence(0)
    setCraft(0)
    setTeamwork(0)
    setPeerError('')
  }

  return (
    <>
      <PageHead
        eyebrow={whenLabel(APP_TODAY)}
        title="Reviews"
        lede="The team review closes the day together. A peer review is one colleague, said plainly, about the work beside you."
      />
      <Segment
        label="Review type"
        value={tab}
        onChange={setTab}
        options={[
          { id: 'team', label: 'Daily team' },
          { id: 'p2p', label: 'Peer to peer' },
        ]}
      />

      {tab === 'team' ? (
        <div className="split">
          <div className="stack">
            {mineToday ? (
              <section className="card">
                <p className="kicker">Today</p>
                <h2>Your team review is on the board.</h2>
                <p>One note a day. You can still read everyone else’s.</p>
              </section>
            ) : (
              <form className="card stack-form" onSubmit={sendTeam}>
                <p className="kicker">Today’s prompt</p>
                <h2>{TEAM_PROMPT}</h2>
                <ScorePicker label="How the floor felt" value={floor} onChange={setFloor} />
                <p className="meta">{floor ? FLOOR_WORDS[floor] : '1 is strained. 5 is excellent.'}</p>
                <Field label="What worked">
                  <textarea value={worked} onChange={(event) => setWorked(event.target.value)} />
                </Field>
                <Field label="What tomorrow’s lead should protect">
                  <textarea value={fix} onChange={(event) => setFix(event.target.value)} />
                </Field>
                <Field label="A shout, if you have one">
                  <input value={shout} onChange={(event) => setShout(event.target.value)} />
                </Field>
                {teamError ? <p className="error">{teamError}</p> : null}
                <button className="btn primary" type="submit">
                  Put it on the board
                </button>
              </form>
            )}
          </div>
          <section className="stack">
            {dates.map((date) => (
              <section key={date} className="card">
                <h2>{whenLabel(date)}</h2>
                {bundle.team
                  .filter((review) => review.date === date)
                  .map((review) => (
                    <article key={review.id} className="note">
                      <span>
                        {review.from}
                        {review.from === therapist.name ? ' · you' : ''} · {FLOOR_WORDS[review.floor]} {review.floor}
                      </span>
                      <p>
                        <strong>Worked. </strong>
                        {review.worked}
                      </p>
                      <p>
                        <strong>Protect. </strong>
                        {review.fix}
                      </p>
                      {review.shout ? (
                        <p>
                          <strong>Shout. </strong>
                          {review.shout}
                        </p>
                      ) : null}
                    </article>
                  ))}
              </section>
            ))}
          </section>
        </div>
      ) : (
        <div className="split">
          <form className="card stack-form" onSubmit={sendPeer}>
            <h2>Review a colleague</h2>
            <p className="meta">One person, for today. They will see it on their login.</p>
            <Field label="Colleague">
              <select value={peer} onChange={(event) => setPeer(event.target.value)}>
                {therapist.peers.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </Field>
            <ScorePicker label="Presence" value={presence} onChange={setPresence} />
            <ScorePicker label="Craft" value={craft} onChange={setCraft} />
            <ScorePicker label="Teamwork" value={teamwork} onChange={setTeamwork} />
            <Field label="One specific sentence">
              <textarea value={note} onChange={(event) => setNote(event.target.value)} />
            </Field>
            {peerError ? <p className="error">{peerError}</p> : null}
            <button className="btn primary" type="submit">
              Send peer review
            </button>
          </form>
          <div className="stack">
            <section className="card">
              <h2>For you</h2>
              {received.length === 0 ? <p className="meta">No peer review for you yet.</p> : null}
              {received.map((review) => (
                <PeerNote key={review.id} review={review} who={`From ${review.from}`} />
              ))}
            </section>
            <section className="card">
              <h2>From you</h2>
              {given.length === 0 ? <p className="meta">You have not written one yet.</p> : null}
              {given.map((review) => (
                <PeerNote key={review.id} review={review} who={`To ${review.to}`} />
              ))}
            </section>
          </div>
        </div>
      )}
    </>
  )
}

function PeerNote({ review, who }) {
  return (
    <article className="note">
      <span>
        {who} · {whenLabel(review.date)}
      </span>
      <p className="meta">
        Presence {review.presence} · Craft {review.craft} · Teamwork {review.teamwork}
      </p>
      <p>{review.note}</p>
    </article>
  )
}

import { useState } from 'react'
import { useStore } from '../store'
import { prettyDate } from '../data'
import { PageHead, StatusPill } from '../ui'

export default function Learning() {
  const { therapist, bundle } = useStore()
  const [moduleId, setModuleId] = useState(bundle.modules.find((item) => item.status === 'current')?.id || bundle.modules[0].id)
  const [certificateId, setCertificateId] = useState(bundle.certificates[0]?.id)
  const current = bundle.modules.find((item) => item.id === moduleId) || bundle.modules[0]
  const certificate = bundle.certificates.find((item) => item.id === certificateId) || bundle.certificates[0]
  const doneLessons = bundle.modules.reduce(
    (count, item) => count + item.lessons.filter((lesson) => lesson.done).length,
    0,
  )
  const allLessons = bundle.modules.reduce((count, item) => count + item.lessons.length, 0)
  const ratio = allLessons ? Math.round((doneLessons / allLessons) * 100) : 0

  return (
    <>
      <PageHead
        eyebrow="People desk"
        title="Learning"
        lede="Your training journey at Zura, and the certificates already on your name."
      />
      <section className="card meter-card">
        <div>
          <p className="kicker">Journey</p>
          <h2>{ratio}% of the path</h2>
          <p className="meta">
            {doneLessons} of {allLessons} lessons complete
          </p>
        </div>
        <div className="meter" aria-hidden="true">
          <span style={{ width: `${ratio}%` }} />
        </div>
      </section>

      <div className="master">
        <div className="card rows">
          {bundle.modules.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={item.id === current.id ? 'row on' : 'row'}
              onClick={() => setModuleId(item.id)}
            >
              <span className="row-top">
                <span className="kicker">Module {index + 1}</span>
                <StatusPill status={item.status} />
              </span>
              <strong className="row-title">{item.title}</strong>
              <span className="meter slim" aria-hidden="true">
                <span style={{ width: `${item.progress}%` }} />
              </span>
            </button>
          ))}
        </div>
        <article className="card detail">
          <p className="kicker">{current.progress}% complete</p>
          <h2>{current.title}</h2>
          <p>{current.summary}</p>
          <ul className="lesson-list">
            {current.lessons.map((lesson) => (
              <li key={lesson.title} className={lesson.done ? 'done' : ''}>
                <span aria-hidden="true">{lesson.done ? '✓' : '○'}</span>
                {lesson.title}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <section>
        <div className="card-head plain">
          <h2>Certificates</h2>
        </div>
        <div className="certs">
          {bundle.certificates.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === certificate?.id ? 'certificate on' : 'certificate'}
              onClick={() => setCertificateId(item.id)}
            >
              <span className="seal">Z</span>
              <span className="kicker">Zura Spa</span>
              <strong>{item.title}</strong>
              <span className="meta">{item.code}</span>
            </button>
          ))}
        </div>
        {certificate ? (
          <article className="certificate featured">
            <span className="seal">Z</span>
            <p className="kicker">Certificate of completion</p>
            <h2>{certificate.title}</h2>
            <p>
              Awarded to {therapist.name}
              <br />
              {prettyDate(certificate.issued)}
            </p>
            <p className="meta">
              {certificate.code} · Zura Spa, {therapist.branch}
            </p>
          </article>
        ) : null}
      </section>
    </>
  )
}

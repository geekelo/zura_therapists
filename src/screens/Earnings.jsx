import { useState } from 'react'
import { useStore } from '../store'
import { CURRENT_MONTH_KEY, CURRENT_MONTH_LABEL, closedMonths, money, sumAmounts } from '../data'
import { PageHead, Segment, Empty } from '../ui'

export default function Earnings() {
  const { therapist, bundle } = useStore()
  const closed = closedMonths(bundle.months)
  const years = [...new Set(closed.map((month) => month.year))].sort((a, b) => b - a)
  const [year, setYear] = useState(years[0])
  const total = sumAmounts(closed)
  const yearMonths = closed.filter((month) => month.year === year)
  const yearTotal = sumAmounts(yearMonths)
  const peak = Math.max(...yearMonths.map((month) => month.amount), 1)
  const latest = yearMonths[yearMonths.length - 1]
  const earliest = yearMonths[0]

  return (
    <>
      <PageHead
        eyebrow={`With Zura since ${therapist.joinedShort}`}
        title="Earnings"
        lede={`${CURRENT_MONTH_LABEL} is still open, so it is left out. Every total below stops at the last closed month.`}
      />
      {closed.length === 0 ? (
        <Empty>No closed month yet. Earnings appear here once a month has finished.</Empty>
      ) : (
        <>
          <section className="card hero-money">
            <p className="kicker">Total so far</p>
            <p className="money-xl">{money(total)}</p>
            <p className="meta">
              Recorded earnings at Zura Spa, {therapist.branch}, from {therapist.joined} through the last closed month.
            </p>
          </section>
          <Segment
            label="Year"
            value={String(year)}
            onChange={(value) => setYear(Number(value))}
            options={years.map((item) => ({ id: String(item), label: String(item) }))}
          />
          <section className="card">
            <div className="card-head">
              <div>
                <p className="kicker">
                  {year}
                  {year === Number(CURRENT_MONTH_KEY.slice(0, 4)) ? ' · excluding this month' : ' · closed months'}
                </p>
                <h2>{money(yearTotal)}</h2>
              </div>
              <p className="meta">
                {earliest?.label} – {latest?.label}
              </p>
            </div>
            <div className="bars">
              {yearMonths.map((month) => (
                <div key={month.key} className="bar-row">
                  <span>{month.label}</span>
                  <div className="bar" aria-hidden="true">
                    <span style={{ width: `${(month.amount / peak) * 100}%` }} />
                  </div>
                  <strong>{money(month.amount)}</strong>
                </div>
              ))}
            </div>
            <table className="sheet">
              <caption className="sr">
                Earnings for each closed month in {year}
              </caption>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Earnings</th>
                </tr>
              </thead>
              <tbody>
                {yearMonths.map((month) => (
                  <tr key={month.key}>
                    <td>
                      {month.label} {month.year}
                    </td>
                    <td>{money(month.amount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th>Year, excluding the open month</th>
                  <td>{money(yearTotal)}</td>
                </tr>
              </tfoot>
            </table>
            {year === 2026 ? (
              <p className="note excluded">
                {CURRENT_MONTH_LABEL} is not listed. It closes at the end of the month.
              </p>
            ) : null}
          </section>
        </>
      )}
    </>
  )
}

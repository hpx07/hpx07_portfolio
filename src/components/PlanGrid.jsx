import Link from 'next/link'

export default function PlanGrid({ plans }) {
  return (
    <div className="plan-grid">
      {plans.map((plan, i) => (
        <article
          key={plan.id || plan.name}
          className={`plan-card ${Number(plan.highlighted) ? 'hot' : ''}`}
          data-reveal
          style={{ '--reveal-delay': `${i * 0.1}s` }}
        >
          {plan.badge && <span className="plan-badge">{plan.badge}</span>}
          <h3>{plan.name}</h3>
          <p className="plan-tagline">{plan.tagline}</p>
          <div className="plan-price">
            <b>{plan.currency}{plan.price}</b>
            <span>{plan.period}</span>
          </div>
          <ul className="plan-features">
            {(plan.features || []).map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <Link href={plan.cta_link || '/contact'} className={`btn ${Number(plan.highlighted) ? 'btn-ember' : 'btn-ghost'}`}>
            {plan.cta_label || 'Get started'}
          </Link>
        </article>
      ))}
    </div>
  )
}

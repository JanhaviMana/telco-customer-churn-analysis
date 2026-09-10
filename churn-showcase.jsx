import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const INK = '#14171A';
const PANEL = '#1D2124';
const PANEL2 = '#20242A';
const PAPER = '#ECE7DA';
const MUTED = '#9A9C94';
const LINE = 'rgba(236,231,218,0.10)';
const RISK = '#E2A33D';
const RISK_DIM = 'rgba(226,163,61,0.16)';
const SAFE = '#4FA98F';
const SAFE_DIM = 'rgba(79,169,143,0.16)';

const fontVoice = "'Fraunces', Georgia, serif";
const fontSans = "'Inter', 'Helvetica Neue', sans-serif";

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'foundation', label: '01 — Data foundation' },
  { id: 'findings', label: '02 — Findings' },
  { id: 'validation', label: '03 — Validation' },
  { id: 'model', label: '04 — Prediction' },
  { id: 'explain', label: '05 — Explainability' },
  { id: 'atrisk', label: 'At-risk list' },
];

const segmentData = {
  contract: [
    { name: 'Month-to-month', rate: 42.71 },
    { name: 'One year', rate: 11.27 },
    { name: 'Two year', rate: 2.83 },
  ],
  payment: [
    { name: 'Electronic check', rate: 45.29 },
    { name: 'Mailed check', rate: 19.11 },
    { name: 'Bank transfer', rate: 16.71 },
    { name: 'Credit card', rate: 15.24 },
  ],
  internet: [
    { name: 'Fiber optic', rate: 41.89 },
    { name: 'DSL', rate: 18.96 },
    { name: 'No internet', rate: 7.40 },
  ],
  tenure: [
    { name: 'New, under 12mo', rate: 48.28 },
    { name: 'Established', rate: 17.49 },
  ],
};

const chiSquare = [
  { factor: 'Contract type', p: '5.86 \u00d7 10\u207b\u00b2\u2075\u2078', stat: '1184.60' },
  { factor: 'Payment method', p: '3.68 \u00d7 10\u207b\u00b9\u2074\u2070', stat: '648.14' },
  { factor: 'Internet service', p: '9.57 \u00d7 10\u207b\u00b9\u2076\u2070', stat: '732.31' },
  { factor: 'Tenure group', p: '3.07 \u00d7 10\u207b\u00b9\u2075\u2076', stat: '709.14' },
];

const models = [
  { name: 'Logistic regression', accuracy: 75, recall: 78, precision: 52, f1: 62, selected: true },
  { name: 'XGBoost, SMOTE', accuracy: 79, recall: 53, precision: 62, f1: 57 },
  { name: 'XGBoost, weighted', accuracy: 76, recall: 68, precision: 54, f1: 60 },
  { name: 'Random forest, weighted', accuracy: 79, recall: 47, precision: 63, f1: 54 },
];

const shapFeatures = [
  { feature: 'Tenure', direction: 'Short tenure pushes toward churn', weight: 92 },
  { feature: 'Total charges', direction: 'Low lifetime spend pushes toward churn', weight: 84 },
  { feature: 'Monthly charges', direction: 'Higher monthly bill pushes toward churn', weight: 61 },
  { feature: 'Tech support', direction: 'No tech support pushes toward churn', weight: 34 },
  { feature: 'Two-year contract', direction: 'Presence pushes toward retention', weight: 31, positive: true },
  { feature: 'Paperless billing', direction: 'Presence pushes slightly toward churn', weight: 22 },
];

const atRisk = [
  { id: '5150-ITWWB', prob: 95.8 },
  { id: '6350-XFYGW', prob: 94.2 },
  { id: '2545-EBUPK', prob: 94.1 },
  { id: '3320-VEOYC', prob: 94.1 },
  { id: '6630-UJZMY', prob: 93.8 },
  { id: '4847-TAJYI', prob: 93.7 },
  { id: '0187-QSXOE', prob: 93.5 },
  { id: '6229-LSCKB', prob: 93.4 },
  { id: '0021-IKXGC', prob: 93.3 },
  { id: '4115-NZRKS', prob: 93.3 },
  { id: '7225-CBZPL', prob: 92.9 },
  { id: '9603-OAIHC', prob: 92.9 },
];

function ScrollLink({ id, label, active, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        background: 'none',
        border: 'none',
        padding: '7px 0',
        cursor: 'pointer',
        fontFamily: fontSans,
        fontSize: 13,
        letterSpacing: '0.01em',
        color: active ? PAPER : MUTED,
        borderLeft: active ? `2px solid ${RISK}` : '2px solid transparent',
        paddingLeft: 14,
        transition: 'color 0.15s ease',
      }}
    >
      {label}
    </button>
  );
}

function SegmentChart({ data, unit }) {
  return (
    <ResponsiveContainer width="100%" height={data.length * 46 + 20}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 40, left: 8, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke={LINE} />
        <XAxis type="number" domain={[0, 55]} tick={{ fill: MUTED, fontSize: 11, fontFamily: fontSans }} axisLine={{ stroke: LINE }} tickLine={false} unit="%" />
        <YAxis type="category" dataKey="name" width={130} tick={{ fill: PAPER, fontSize: 12, fontFamily: fontSans }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: PANEL2, border: `1px solid ${LINE}`, borderRadius: 4, fontFamily: fontSans, fontSize: 12 }}
          labelStyle={{ color: PAPER }}
          itemStyle={{ color: RISK }}
          formatter={(v) => [`${v}%`, 'Churn rate']}
        />
        <Bar dataKey="rate" radius={[0, 3, 3, 0]} barSize={22}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.rate > 30 ? RISK : entry.rate > 15 ? '#C6934A' : SAFE} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function ChurnShowcase() {
  const [active, setActive] = useState('overview');

  const scrollTo = (id) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ background: INK, color: PAPER, fontFamily: fontSans, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: ${RISK_DIM}; color: ${PAPER}; }
      `}</style>

      <div style={{ display: 'flex', maxWidth: 1180, margin: '0 auto' }}>
        {/* Sidebar index */}
        <nav style={{
          width: 200, flexShrink: 0, position: 'sticky', top: 0, height: '100vh',
          padding: '48px 20px 24px 0', borderRight: `1px solid ${LINE}`,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontFamily: fontVoice, fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Case file</div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 28 }}>Telco churn, 7,043 accounts</div>
            {sections.map((s) => (
              <ScrollLink key={s.id} id={s.id} label={s.label} active={active === s.id} onClick={scrollTo} />
            ))}
          </div>
          <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.6 }}>
            SQL &middot; Python &middot; Power BI<br />Excel &middot; scikit-learn &middot; SHAP
          </div>
        </nav>

        {/* Main content */}
        <main style={{ flex: 1, padding: '48px 40px 100px 48px', minWidth: 0 }}>

          {/* Hero */}
          <section id="overview" style={{ marginBottom: 88 }}>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 14 }}>Customer retention investigation</div>
            <h1 style={{ fontFamily: fontVoice, fontWeight: 500, fontSize: 40, lineHeight: 1.15, margin: '0 0 24px', maxWidth: 640 }}>
              Why are we losing customers?
            </h1>
            <p style={{ fontSize: 15, color: MUTED, maxWidth: 520, lineHeight: 1.7, margin: '0 0 40px' }}>
              A full-stack investigation into telecom customer churn &mdash; from raw data to a
              statistically validated, deployable risk model. Every finding below was
              cross-checked across four independent tools before being trusted.
            </p>

            <div style={{ display: 'flex', gap: 48, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: fontVoice, fontSize: 64, fontWeight: 500, color: RISK, lineHeight: 1 }}>26.5%</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 8 }}>Overall churn rate &mdash; roughly 1 in 4 customers</div>
              </div>
              <div style={{ display: 'flex', gap: 28, borderLeft: `1px solid ${LINE}`, paddingLeft: 28 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 500 }}>7,043</div>
                  <div style={{ fontSize: 11, color: MUTED }}>accounts analyzed</div>
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 500 }}>4</div>
                  <div style={{ fontSize: 11, color: MUTED }}>risk factors confirmed</div>
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 500 }}>78%</div>
                  <div style={{ fontSize: 11, color: MUTED }}>recall on churners</div>
                </div>
              </div>
            </div>
          </section>

          {/* Stage 01 */}
          <section id="foundation" style={{ marginBottom: 88 }}>
            <SectionHeader n="01" title="Data foundation" />
            <p style={{ fontSize: 14, color: MUTED, maxWidth: 620, lineHeight: 1.75, marginBottom: 20 }}>
              The SSMS import wizard silently mistyped multi-category text columns as
              <code style={{ color: PAPER }}> BIT</code>, collapsing values like
              &ldquo;No internet service&rdquo; into <code style={{ color: PAPER }}>NULL</code>.
              The schema was rebuilt by hand instead &mdash; every column typed deliberately,
              with reasoning that survives a follow-up question.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 620 }}>
              <FactCard label="Bug found" value="BIT columns collapsing 3+ categories into NULL on import" />
              <FactCard label="TotalCharges decision" value="Kept as text, then explicitly cast &mdash; blanks set to NULL, not 0, since 11 new customers hadn't been billed yet" />
            </div>
          </section>

          {/* Stage 02 */}
          <section id="findings" style={{ marginBottom: 88 }}>
            <SectionHeader n="02" title="Segment findings" />
            <p style={{ fontSize: 14, color: MUTED, maxWidth: 620, lineHeight: 1.75, marginBottom: 32 }}>
              Four factors show a consistent, large gap in churn rate between customer
              segments. Bars above 30% are flagged as high risk.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px 40px' }}>
              <div>
                <ChartLabel>Contract type</ChartLabel>
                <SegmentChart data={segmentData.contract} />
              </div>
              <div>
                <ChartLabel>Payment method</ChartLabel>
                <SegmentChart data={segmentData.payment} />
              </div>
              <div>
                <ChartLabel>Internet service</ChartLabel>
                <SegmentChart data={segmentData.internet} />
              </div>
              <div>
                <ChartLabel>Tenure</ChartLabel>
                <SegmentChart data={segmentData.tenure} />
              </div>
            </div>
          </section>

          {/* Stage 03 */}
          <section id="validation" style={{ marginBottom: 88 }}>
            <SectionHeader n="03" title="Statistical validation" />
            <p style={{ fontSize: 14, color: MUTED, maxWidth: 620, lineHeight: 1.75, marginBottom: 24 }}>
              A large gap in percentages isn&rsquo;t proof by itself. Each factor above was
              tested with a chi-square test of independence &mdash; every relationship holds
              with overwhelming confidence.
            </p>
            <table style={{ width: '100%', maxWidth: 620, borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${LINE}` }}>
                  <th style={thStyle}>Factor</th>
                  <th style={thStyle}>&chi;&sup2; statistic</th>
                  <th style={thStyle}>p-value</th>
                  <th style={thStyle}>Result</th>
                </tr>
              </thead>
              <tbody>
                {chiSquare.map((r) => (
                  <tr key={r.factor} style={{ borderBottom: `1px solid ${LINE}` }}>
                    <td style={tdStyle}>{r.factor}</td>
                    <td style={{ ...tdStyle, color: MUTED }}>{r.stat}</td>
                    <td style={{ ...tdStyle, color: MUTED }}>{r.p}</td>
                    <td style={tdStyle}>
                      <span style={{ background: SAFE_DIM, color: SAFE, fontSize: 11, padding: '3px 8px', borderRadius: 3 }}>
                        Confirmed, p &lt; 0.05
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Stage 04 */}
          <section id="model" style={{ marginBottom: 88 }}>
            <SectionHeader n="04" title="Prediction model" />
            <p style={{ fontSize: 14, color: MUTED, maxWidth: 620, lineHeight: 1.75, marginBottom: 24 }}>
              Three model families were tested and tuned. Accuracy is a poor judge here &mdash;
              a model that always predicts &ldquo;no churn&rdquo; already scores 73.5%.
              <strong style={{ color: PAPER, fontWeight: 500 }}> Recall</strong> matters
              more: missing a real churner costs a lost customer, while a false alarm
              costs one unnecessary retention email.
            </p>
            <div style={{ maxWidth: 620 }}>
              {models.map((m) => (
                <div key={m.name} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0',
                  borderBottom: `1px solid ${LINE}`,
                }}>
                  <div style={{ width: 168, fontSize: 13, color: m.selected ? PAPER : MUTED }}>
                    {m.name}
                    {m.selected && (
                      <span style={{ display: 'block', fontSize: 10, color: RISK, marginTop: 2 }}>Selected</span>
                    )}
                  </div>
                  <MetricBar label="Recall" value={m.recall} highlight={m.selected} />
                  <MetricBar label="Precision" value={m.precision} />
                  <MetricBar label="Accuracy" value={m.accuracy} />
                </div>
              ))}
            </div>
          </section>

          {/* Stage 05 */}
          <section id="explain" style={{ marginBottom: 88 }}>
            <SectionHeader n="05" title="Explainability" />
            <p style={{ fontSize: 14, color: MUTED, maxWidth: 620, lineHeight: 1.75, marginBottom: 24 }}>
              SHAP values show what actually drives each prediction, ranked by average
              impact. The result independently confirms the segment findings above.
            </p>
            <div style={{ maxWidth: 620 }}>
              {shapFeatures.map((f) => (
                <div key={f.feature} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                    <span>{f.feature}</span>
                    <span style={{ color: MUTED, fontSize: 12 }}>{f.direction}</span>
                  </div>
                  <div style={{ height: 6, background: PANEL2, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      width: `${f.weight}%`, height: '100%',
                      background: f.positive ? SAFE : RISK, borderRadius: 3,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* At-risk list */}
          <section id="atrisk" style={{ marginBottom: 40 }}>
            <SectionHeader n="\u2192" title="Top at-risk customers" />
            <p style={{ fontSize: 14, color: MUTED, maxWidth: 620, lineHeight: 1.75, marginBottom: 24 }}>
              Currently active customers, ranked by model-predicted churn probability.
              This is the deliverable a retention team would actually work from.
            </p>
            <table style={{ width: '100%', maxWidth: 460, borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${LINE}` }}>
                  <th style={thStyle}>Customer ID</th>
                  <th style={thStyle}>Churn probability</th>
                </tr>
              </thead>
              <tbody>
                {atRisk.map((c) => (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${LINE}` }}>
                    <td style={tdStyle}>{c.id}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 100, height: 5, background: PANEL2, borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${c.prob}%`, height: '100%', background: RISK }} />
                        </div>
                        <span style={{ color: RISK, fontSize: 12 }}>{c.prob}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 24, fontSize: 12, color: MUTED }}>
            Built with SQL Server &middot; pandas &middot; scipy &middot; scikit-learn &middot; SHAP &middot; Power BI &middot; Excel
          </div>
        </main>
      </div>
    </div>
  );
}

function SectionHeader({ n, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 18 }}>
      <span style={{ fontFamily: fontVoice, fontSize: 15, color: RISK }}>{n}</span>
      <h2 style={{ fontFamily: fontVoice, fontWeight: 500, fontSize: 24, margin: 0 }}>{title}</h2>
    </div>
  );
}

function ChartLabel({ children }) {
  return <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>{children}</div>;
}

function FactCard({ label, value }) {
  return (
    <div style={{ background: PANEL, border: `1px solid ${LINE}`, borderRadius: 4, padding: '14px 16px' }}>
      <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 13, lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  );
}

function MetricBar({ label, value, highlight }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUTED, marginBottom: 4 }}>
        <span>{label}</span>
        <span style={{ color: highlight && label === 'Recall' ? RISK : MUTED }}>{value}%</span>
      </div>
      <div style={{ height: 5, background: PANEL2, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          width: `${value}%`, height: '100%', borderRadius: 3,
          background: highlight && label === 'Recall' ? RISK : '#4A4D50',
        }} />
      </div>
    </div>
  );
}

const thStyle = { textAlign: 'left', padding: '8px 12px 8px 0', color: MUTED, fontWeight: 500, fontSize: 11 };
const tdStyle = { padding: '10px 12px 10px 0', color: PAPER };

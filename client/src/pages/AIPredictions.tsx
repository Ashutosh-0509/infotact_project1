import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';

// ─── Grok API ─────────────────────────────────────────────────────────────────
const askGrok = async (prompt: string): Promise<string> => {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'grok-3',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    }),
  });
  if (!response.ok) throw new Error('API error');
  const data = await response.json();
  return data.choices[0].message.content;
};

// ─── Festival Data ────────────────────────────────────────────────────────────
type Impact = 'High' | 'Medium' | 'Low';

interface Festival {
  name: string;
  date: Date;
  impact: Impact;
}

const ALL_FESTIVALS: Festival[] = [
  { name: 'Dr. Ambedkar Jayanti', date: new Date('2026-04-14'), impact: 'Low' },
  { name: 'Ram Navami', date: new Date('2026-04-17'), impact: 'Medium' },
  { name: 'Eid ul-Fitr', date: new Date('2026-05-01'), impact: 'High' },
  { name: 'Buddha Purnima', date: new Date('2026-05-12'), impact: 'Low' },
  { name: 'Eid ul-Adha', date: new Date('2026-06-07'), impact: 'High' },
  { name: 'Muharram', date: new Date('2026-07-06'), impact: 'Medium' },
  { name: 'Raksha Bandhan', date: new Date('2026-08-09'), impact: 'High' },
  { name: 'Independence Day', date: new Date('2026-08-15'), impact: 'Medium' },
  { name: 'Janmashtami', date: new Date('2026-08-16'), impact: 'Medium' },
  { name: 'Ganesh Chaturthi', date: new Date('2026-08-27'), impact: 'High' },
  { name: 'Navratri', date: new Date('2026-09-22'), impact: 'High' },
  { name: 'Dussehra', date: new Date('2026-10-02'), impact: 'High' },
  { name: 'Diwali', date: new Date('2026-10-20'), impact: 'High' },
  { name: 'Bhai Dooj', date: new Date('2026-10-23'), impact: 'Medium' },
  { name: 'Guru Nanak Jayanti', date: new Date('2026-11-05'), impact: 'Medium' },
  { name: 'Christmas', date: new Date('2026-12-25'), impact: 'High' },
];

const getDaysLeft = (date: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

const formatDate = (date: Date): string =>
  date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// Show festivals of the current month + next 30 days
const getRelevantFestivals = (): Festival[] => {
  const today = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(today.getDate() + 60);
  return ALL_FESTIVALS.filter((f) => {
    const d = getDaysLeft(f.date);
    return d >= -7 && f.date <= cutoff;
  });
};

// ─── Sales Graph Data ─────────────────────────────────────────────────────────
// Current day of week: April 12, 2026 is a Sunday (index 6 = all days passed)
// For demo purposes treat Mon-Wed as "passed" and Thu-Sun as "predicted"
const TODAY_DAY_INDEX = 2; // Wed (0=Mon)

const SALES_DATA = [
  { day: 'Mon', lastWeek: 12400, thisWeek: 14200 },
  { day: 'Tue', lastWeek: 18200, thisWeek: 19800 },
  { day: 'Wed', lastWeek: 15600, thisWeek: 17300 },
  { day: 'Thu', lastWeek: 22100, thisWeek: 24500 },
  { day: 'Fri', lastWeek: 28500, thisWeek: 31000 },
  { day: 'Sat', lastWeek: 35200, thisWeek: 38500 },
  { day: 'Sun', lastWeek: 31800, thisWeek: 35000 },
];

// Split this week into actual vs predicted for dual-line rendering
const SALES_DATA_ACTUAL = SALES_DATA.map((d, i) => ({
  ...d,
  thisWeekActual: i <= TODAY_DAY_INDEX ? d.thisWeek : null,
  thisWeekPredicted: i >= TODAY_DAY_INDEX ? d.thisWeek : null,
}));

const LAST_WEEK_TOTAL = 163800;
const THIS_WEEK_PROJECTED = 180300;
const PCT_CHANGE = (((THIS_WEEK_PROJECTED - LAST_WEEK_TOTAL) / LAST_WEEK_TOTAL) * 100).toFixed(1);

// ─── Sub-components ───────────────────────────────────────────────────────────

const ImpactBadge = ({ impact }: { impact: Impact }) => {
  const styles: Record<Impact, React.CSSProperties> = {
    High: { background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' },
    Medium: { background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' },
    Low: { background: '#D1FAE5', color: '#059669', border: '1px solid #A7F3D0' },
  };
  return (
    <span
      style={{
        ...styles[impact],
        fontSize: 11,
        fontWeight: 600,
        padding: '2px 10px',
        borderRadius: 20,
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
      }}
    >
      {impact}
    </span>
  );
};

const SkeletonBox = ({ width = '100%', height = 18 }: { width?: string | number; height?: number }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 6,
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }}
  />
);

// Custom Tooltip for the line chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 10,
        padding: '10px 16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        fontSize: 13,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <p style={{ fontWeight: 700, marginBottom: 6, color: '#111827' }}>{label}</p>
      {payload.map((entry: any) => (
        entry.value !== null && (
          <p key={entry.dataKey} style={{ color: entry.color, margin: '3px 0', fontWeight: 500 }}>
            {entry.name}:{' '}
            <span style={{ fontWeight: 700 }}>
              {'\u20B9'}{Number(entry.value).toLocaleString('en-IN')}
            </span>
          </p>
        )
      ))}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AIPredictions() {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(true);
  const [insightError, setInsightError] = useState(false);

  const festivals = getRelevantFestivals();

  useEffect(() => {
    const load = async () => {
      setInsightLoading(true);
      setInsightError(false);
      try {
        const today = new Date().toLocaleDateString('en-IN');
        const prompt = `Today is ${today}. Looking at the next 30 days of Indian festivals and seasonal trends, give ONE short actionable stock recommendation for a retail store. Maximum 2 sentences. No emojis. Focus on specific products to stock.`;
        const result = await askGrok(prompt);
        setAiInsight(result);
      } catch {
        setInsightError(true);
        setAiInsight(
          'With the upcoming festival season, consider increasing stock of gift items, sweets, and premium packaged foods to meet elevated consumer demand in the next 30 days.'
        );
      } finally {
        setInsightLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .ai-page * { box-sizing: border-box; }
        .festival-row:hover { background: #F9FAFB !important; }
        .summary-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.10) !important; transform: translateY(-1px); }
        .summary-card { transition: box-shadow 0.2s, transform 0.2s; }
      `}</style>

      <div className="theme-admin min-h-screen">
        <Layout>
          <div
            className="ai-page"
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              maxWidth: 1100,
              margin: '0 auto',
              paddingBottom: 48,
            }}
          >

            {/* ── Page Header ───────────────────────────────────────────────── */}
            <div style={{ marginBottom: 32 }}>
              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: '#0F172A',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                AI Predictions
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748B', fontWeight: 500 }}>
                Powered by Grok AI
              </p>
              <div
                style={{
                  marginTop: 16,
                  height: 1,
                  background: 'linear-gradient(to right, #E2E8F0, transparent)',
                }}
              />
            </div>

            {/* ══════════════════════════════════════════════════════════════
                SECTION 1 — Monthly Festival Impact
            ══════════════════════════════════════════════════════════════ */}
            <section style={{ marginBottom: 40 }}>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#1E293B',
                  margin: '0 0 16px',
                  letterSpacing: '-0.01em',
                }}
              >
                Monthly Festival Impact
              </h2>

              {/* Table Card */}
              <div
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 2px 12px rgba(0,0,0,0.04)',
                  overflow: 'hidden',
                  border: '1px solid #F1F5F9',
                }}
              >
                <div style={{ overflowX: 'auto' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: 14,
                      color: '#1E293B',
                    }}
                  >
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                        {['Festival', 'Date', 'Days Left', 'Expected Impact'].map((h) => (
                          <th
                            key={h}
                            style={{
                              textAlign: 'left',
                              padding: '12px 20px',
                              fontSize: 12,
                              fontWeight: 600,
                              color: '#64748B',
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {festivals.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ padding: '24px 20px', color: '#94A3B8', textAlign: 'center' }}>
                            No upcoming festivals in the next 60 days.
                          </td>
                        </tr>
                      ) : (
                        festivals.map((f, i) => {
                          const daysLeft = getDaysLeft(f.date);
                          const isPast = daysLeft < 0;
                          return (
                            <tr
                              key={f.name}
                              className="festival-row"
                              style={{
                                borderBottom: i < festivals.length - 1 ? '1px solid #F1F5F9' : 'none',
                                background: 'transparent',
                                transition: 'background 0.15s',
                                opacity: isPast ? 0.5 : 1,
                              }}
                            >
                              <td style={{ padding: '14px 20px', fontWeight: 500 }}>
                                {f.name}
                              </td>
                              <td
                                style={{ padding: '14px 20px', color: '#475569', fontVariantNumeric: 'tabular-nums' }}
                              >
                                {formatDate(f.date)}
                              </td>
                              <td style={{ padding: '14px 20px' }}>
                                {isPast ? (
                                  <span style={{ color: '#94A3B8', fontSize: 13 }}>Passed</span>
                                ) : (
                                  <span
                                    style={{
                                      fontWeight: 700,
                                      color: daysLeft <= 14 ? '#DC2626' : daysLeft <= 30 ? '#D97706' : '#0F172A',
                                      fontVariantNumeric: 'tabular-nums',
                                    }}
                                  >
                                    {daysLeft} days
                                  </span>
                                )}
                              </td>
                              <td style={{ padding: '14px 20px' }}>
                                <ImpactBadge impact={f.impact} />
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI Insight Alert Box */}
              <div
                style={{
                  marginTop: 16,
                  borderRadius: 10,
                  borderLeft: '4px solid #00BFA5',
                  background: '#F0FDFA',
                  padding: '16px 20px',
                  border: '1px solid #CCFBF1',
                  borderLeftWidth: 4,
                  borderLeftColor: '#00BFA5',
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#0F766E',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    margin: '0 0 8px',
                  }}
                >
                  AI Insight
                </p>

                {insightLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <SkeletonBox height={14} width="90%" />
                    <SkeletonBox height={14} width="70%" />
                  </div>
                ) : (
                  <>
                    <p
                      style={{
                        fontSize: 14,
                        color: '#134E4A',
                        lineHeight: 1.65,
                        margin: 0,
                        fontWeight: 500,
                      }}
                    >
                      {aiInsight}
                    </p>
                    {insightError && (
                      <p
                        style={{
                          fontSize: 11,
                          color: '#6B7280',
                          marginTop: 8,
                          fontStyle: 'italic',
                        }}
                      >
                        Unable to load AI insight. Showing cached data.
                      </p>
                    )}
                  </>
                )}
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                SECTION 2 — Weekly Sales Prediction
            ══════════════════════════════════════════════════════════════ */}
            <section>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#1E293B',
                  margin: '0 0 16px',
                  letterSpacing: '-0.01em',
                }}
              >
                Weekly Sales Prediction
              </h2>

              {/* Graph Card */}
              <div
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 2px 12px rgba(0,0,0,0.04)',
                  border: '1px solid #F1F5F9',
                  padding: '28px 24px 20px',
                  marginBottom: 20,
                }}
              >
                {/* Graph header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: 24,
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 500 }}>
                      Week of 6 – 12 April 2026
                    </p>
                  </div>
                  {/* Legend */}
                  <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="28" height="10">
                        <line x1="0" y1="5" x2="28" y2="5" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5 3" />
                      </svg>
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>Last Week</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="28" height="10">
                        <line x1="0" y1="5" x2="28" y2="5" stroke="#00BFA5" strokeWidth="2.5" />
                      </svg>
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#00897B' }}>This Week</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="28" height="10">
                        <line x1="0" y1="5" x2="28" y2="5" stroke="#00BFA5" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />
                      </svg>
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8' }}>Predicted</span>
                    </div>
                  </div>
                </div>

                {/* Recharts line graph */}
                <div style={{ height: 300, minHeight: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={SALES_DATA_ACTUAL}
                      margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#F1F5F9"
                        strokeOpacity={1}
                      />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 12, fontWeight: 500, fill: '#94A3B8', fontFamily: 'Inter, sans-serif' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tickFormatter={(v) => `\u20B9${(v / 1000).toFixed(0)}k`}
                        tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'Inter, sans-serif' }}
                        axisLine={false}
                        tickLine={false}
                        width={48}
                      />
                      <Tooltip content={<CustomTooltip />} />

                      {/* Vertical reference line for "today" */}
                      <ReferenceLine
                        x={SALES_DATA_ACTUAL[TODAY_DAY_INDEX].day}
                        stroke="#E2E8F0"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        label={{
                          value: 'Today',
                          position: 'top',
                          fontSize: 11,
                          fill: '#94A3B8',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      />

                      {/* Last Week — grey dashed */}
                      <Line
                        type="monotone"
                        dataKey="lastWeek"
                        name="Last Week"
                        stroke="#CBD5E1"
                        strokeWidth={2}
                        strokeDasharray="6 4"
                        dot={false}
                        activeDot={{ r: 5, fill: '#CBD5E1', stroke: '#fff', strokeWidth: 2 }}
                      />

                      {/* This Week Actual — teal solid */}
                      <Line
                        type="monotone"
                        dataKey="thisWeekActual"
                        name="This Week"
                        stroke="#00BFA5"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#00BFA5', stroke: '#fff', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#00BFA5', stroke: '#fff', strokeWidth: 2 }}
                        connectNulls={false}
                      />

                      {/* This Week Predicted — teal dashed */}
                      <Line
                        type="monotone"
                        dataKey="thisWeekPredicted"
                        name="Predicted"
                        stroke="#00BFA5"
                        strokeWidth={2}
                        strokeDasharray="5 4"
                        strokeOpacity={0.65}
                        dot={{ r: 4, fill: '#fff', stroke: '#00BFA5', strokeWidth: 2, strokeOpacity: 0.65 }}
                        activeDot={{ r: 6, fill: '#00BFA5', stroke: '#fff', strokeWidth: 2 }}
                        connectNulls={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Summary Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 16,
                }}
              >
                {/* Card 1 — Last Week Total */}
                <div
                  className="summary-card"
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    border: '1px solid #F1F5F9',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    padding: '20px 22px',
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#94A3B8',
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      margin: '0 0 10px',
                    }}
                  >
                    Last Week Total
                  </p>
                  <p
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: '#0F172A',
                      margin: 0,
                      letterSpacing: '-0.02em',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {'\u20B9'}1,63,800
                  </p>
                  <p style={{ margin: '8px 0 0', fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>
                    Baseline reference
                  </p>
                </div>

                {/* Card 2 — This Week Projected */}
                <div
                  className="summary-card"
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    border: '1px solid #F1F5F9',
                    borderTop: '3px solid #00BFA5',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    padding: '20px 22px',
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#94A3B8',
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      margin: '0 0 10px',
                    }}
                  >
                    This Week Projected
                  </p>
                  <p
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: '#0F172A',
                      margin: 0,
                      letterSpacing: '-0.02em',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {'\u20B9'}1,80,300
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        background: '#D1FAE5',
                        color: '#059669',
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 20,
                      }}
                    >
                      {/* Up arrow SVG */}
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M5 2L9 8H1L5 2Z" fill="#059669" />
                      </svg>
                      +{PCT_CHANGE}%
                    </span>
                    <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>vs last week</span>
                  </div>
                </div>

                {/* Card 3 — Best Day */}
                <div
                  className="summary-card"
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    border: '1px solid #F1F5F9',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    padding: '20px 22px',
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#94A3B8',
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      margin: '0 0 10px',
                    }}
                  >
                    Projected Best Day
                  </p>
                  <p
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: '#0F172A',
                      margin: 0,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Saturday
                  </p>
                  <p style={{ margin: '8px 0 0', fontSize: 12, color: '#64748B', fontWeight: 500 }}>
                    {'\u20B9'}38,500 expected
                  </p>
                </div>
              </div>
            </section>

          </div>
        </Layout>
      </div>
    </>
  );
}

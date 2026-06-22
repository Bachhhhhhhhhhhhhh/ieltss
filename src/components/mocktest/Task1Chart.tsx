import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../context/LanguageContext';
import type { Task1ChartData } from '../../types';

const COLORS = ['#14B8A6', '#6366F1', '#A855F7', '#F43F5E', '#F59E0B', '#3B82F6'];

interface Task1ChartProps {
  chart: Task1ChartData;
}

export function Task1Chart({ chart }: Task1ChartProps) {
  const { bt } = useLanguage();

  if (chart.type === 'table') {
    return (
      <div className="mb-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
        <p className="text-sm font-bold text-center py-3 bg-slate-100 dark:bg-slate-800">{bt(chart.title)}</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80">
              <th className="p-3 text-left font-semibold text-slate-600 dark:text-slate-300" />
              {chart.labels.map((l) => (
                <th key={l} className="p-3 text-center font-semibold text-slate-600 dark:text-slate-300">{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.series.map((s, si) => (
              <tr key={s.label} className={si % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/30'}>
                <td className="p-3 font-medium text-slate-700 dark:text-slate-200">{s.label}</td>
                {s.values.map((v, vi) => (
                  <td key={vi} className="p-3 text-center text-slate-600 dark:text-slate-400">
                    {v}{chart.unit ?? ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const data = chart.labels.map((label, i) => {
    const row: Record<string, string | number> = { label };
    chart.series.forEach((s) => { row[s.label] = s.values[i] ?? 0; });
    return row;
  });

  const pieData = chart.labels.map((label, i) => ({
    name: label,
    value: chart.series[0]?.values[i] ?? 0,
  }));

  return (
    <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
      <p className="text-sm font-bold text-center mb-4 text-slate-700 dark:text-slate-200">{bt(chart.title)}</p>
      <ResponsiveContainer width="100%" height={260}>
        {chart.type === 'bar' ? (
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit={chart.unit} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {chart.series.map((s, i) => (
              <Bar key={s.label} dataKey={s.label} fill={s.color ?? COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        ) : chart.type === 'line' ? (
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit={chart.unit} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {chart.series.map((s, i) => (
              <Line key={s.label} type="monotone" dataKey={s.label} stroke={s.color ?? COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 4 }} />
            ))}
          </LineChart>
        ) : (
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, fontSize: 12 }} />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
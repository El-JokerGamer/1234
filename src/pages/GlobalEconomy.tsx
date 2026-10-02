import { Globe, TrendingUp, TrendingDown, ArrowRight, DollarSign } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { countries, resources, marketOffers, jobs } from '../data/mockData';

export default function GlobalEconomy() {
  const countryComparison = countries.map((c) => ({
    name: c.name,
    flag: c.flag,
    treasury: c.treasury / 1000000,
    gdp: c.gdp / 1000000,
    population: c.population / 1000,
    taxRate: c.taxRate,
  }));

  const resourceComparison = resources.map((r) => ({
    name: r.name,
    price: r.price,
    supply: r.supply / 1000,
    demand: r.demand / 1000,
  }));

  const radarData = countries.map((c) => ({
    country: c.name,
    economy: (c.gdp / 14500000) * 100,
    treasury: (c.treasury / 4100000) * 100,
    population: (c.population / 18900) * 100,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Globe size={28} className="text-primary-light" />
          الاقتصاد العالمي
        </h1>
        <p className="text-dark-muted mt-1">مقارنة اقتصادية بين جميع دول اللعبة</p>
      </div>

      {/* Country Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((country) => (
          <div key={country.id} className="glass rounded-xl p-5 hover:border-primary/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{country.flag}</span>
                <div>
                  <h3 className="text-white font-semibold">{country.name}</h3>
                  <p className="text-dark-muted text-xs">{country.currency}</p>
                </div>
              </div>
              <span className="text-dark-muted text-xs px-2 py-1 rounded bg-dark-bg border border-dark-border">
                #{countries.indexOf(country) + 1}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-dark-muted text-xs">الخزينة</p>
                <p className="text-white font-semibold text-sm">{(country.treasury / 1000000).toFixed(2)}M</p>
              </div>
              <div>
                <p className="text-dark-muted text-xs">الناتج</p>
                <p className="text-white font-semibold text-sm">{(country.gdp / 1000000).toFixed(1)}M</p>
              </div>
              <div>
                <p className="text-dark-muted text-xs">السكان</p>
                <p className="text-white font-semibold text-sm">{country.population.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-dark-muted text-xs">الضريبة</p>
                <p className="text-white font-semibold text-sm">{country.taxRate}%</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-dark-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-dark-muted">ناتج للفرد</span>
                <span className="text-secondary font-medium">
                  {(country.gdp / country.population).toFixed(0)} {country.currency}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Treasury Comparison */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <DollarSign size={18} className="text-primary-light" />
            مقارنة الخزائن
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={countryComparison} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v.toFixed(1)}M`} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={70} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value: number) => [`${value.toFixed(2)}M`, 'الخزينة']}
              />
              <Bar dataKey="treasury" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GDP Comparison */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-secondary" />
            مقارنة الناتج المحلي
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={countryComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v.toFixed(0)}M`} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value: number) => [`${value.toFixed(1)}M`, 'الناتج']}
              />
              <Bar dataKey="gdp" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resource Market Comparison */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Globe size={18} className="text-accent" />
          أسعار الموارد العالمية
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-right text-dark-muted text-xs font-medium pb-3">المورد</th>
                <th className="text-right text-dark-muted text-xs font-medium pb-3">السعر</th>
                <th className="text-right text-dark-muted text-xs font-medium pb-3">التغير</th>
                <th className="text-right text-dark-muted text-xs font-medium pb-3">العرض (K)</th>
                <th className="text-right text-dark-muted text-xs font-medium pb-3">الطلب (K)</th>
                <th className="text-right text-dark-muted text-xs font-medium pb-3">نسبة العرض/طلب</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => {
                const ratio = resource.supply / resource.demand;
                return (
                  <tr key={resource.id} className="border-b border-dark-border/50 hover:bg-dark-border/20 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{resource.icon}</span>
                        <span className="text-white text-sm font-medium">{resource.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-white text-sm font-mono">{resource.price.toFixed(1)}</td>
                    <td className="py-3">
                      <span className={`flex items-center gap-1 text-sm font-medium ${resource.change24h >= 0 ? 'text-secondary' : 'text-danger'}`}>
                        {resource.change24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {resource.change24h > 0 ? '+' : ''}{resource.change24h}%
                      </span>
                    </td>
                    <td className="py-3 text-dark-muted text-sm">{(resource.supply / 1000).toFixed(1)}K</td>
                    <td className="py-3 text-dark-muted text-sm">{(resource.demand / 1000).toFixed(1)}K</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-dark-border overflow-hidden">
                          <div
                            className={`h-full rounded-full ${ratio > 1 ? 'bg-secondary' : 'bg-danger'}`}
                            style={{ width: `${Math.min(ratio * 50, 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${ratio > 1 ? 'text-secondary' : 'text-danger'}`}>
                          {ratio.toFixed(2)}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Job Market */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <ArrowRight size={18} className="text-primary-light" />
            عروض العمل العالمية
          </h3>
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-dark-bg/50 border border-dark-border/50">
                <div>
                  <p className="text-white text-sm font-medium">{job.title}</p>
                  <p className="text-dark-muted text-xs">{job.country} • {job.company}</p>
                </div>
                <div className="text-left">
                  <p className="text-secondary text-sm font-mono">{job.salary}/يوم</p>
                  <p className="text-dark-muted text-xs">{job.filled}/{job.slots} موظف</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Globe size={18} className="text-accent" />
            آخر العروض العالمية
          </h3>
          <div className="space-y-3">
            {marketOffers.map((offer) => (
              <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg bg-dark-bg/50 border border-dark-border/50">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${offer.type === 'sell' ? 'bg-danger/20 text-danger' : 'bg-secondary/20 text-secondary'}`}>
                    {offer.type === 'sell' ? 'بيع' : 'شراء'}
                  </span>
                  <div>
                    <p className="text-white text-sm">{offer.resource}</p>
                    <p className="text-dark-muted text-xs">{offer.country}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-mono">{offer.price.toFixed(1)}</p>
                  <p className="text-dark-muted text-xs">×{offer.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

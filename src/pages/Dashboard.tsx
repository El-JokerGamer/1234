import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Briefcase,
  ShoppingBag,
  Coins,
  BarChart3,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { countries, resources, marketOffers, jobs, treasuryHistory, revenueData, taxBreakdown } from '../data/mockData';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Dashboard() {
  const country = countries[0]; // Nordia - player's country

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">{country.flag}</span>
            اقتصاد {country.name}
          </h1>
          <p className="text-dark-muted mt-1">نظرة شاملة على الوضع الاقتصادي لبلدك</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-dark-muted text-sm">العملة:</span>
          <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary-light text-sm font-medium">
            {country.currency}
          </span>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'الخزينة',
            value: `${(country.treasury / 1000000).toFixed(2)}M`,
            change: '+5.2%',
            positive: true,
            icon: DollarSign,
            color: 'from-primary to-primary-light',
          },
          {
            label: 'الناتج المحلي',
            value: `${(country.gdp / 1000000).toFixed(1)}M`,
            change: '+3.8%',
            positive: true,
            icon: BarChart3,
            color: 'from-secondary to-emerald-400',
          },
          {
            label: 'عدد السكان',
            value: country.population.toLocaleString(),
            change: '+1.2%',
            positive: true,
            icon: Users,
            color: 'from-accent to-yellow-400',
          },
          {
            label: 'معدل الضريبة',
            value: `${country.taxRate}%`,
            change: '-0.5%',
            positive: false,
            icon: Coins,
            color: 'from-pink-500 to-rose-400',
          },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl p-5 hover:border-primary/30 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.positive ? 'text-secondary' : 'text-danger'}`}>
                {stat.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-dark-muted text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Treasury Chart */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <DollarSign size={18} className="text-primary-light" />
            تطور الخزينة
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={treasuryHistory}>
              <defs>
                <linearGradient id="treasuryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value: number) => [`${(value / 1000000).toFixed(2)}M ${country.currency}`, 'الخزينة']}
              />
              <Area type="monotone" dataKey="price" stroke="#6366f1" fill="url(#treasuryGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue vs Expenses */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-secondary" />
            الإيرادات vs المصروفات
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value: number) => [`${(value / 1000).toFixed(0)}K`, '']}
              />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="الإيرادات" />
              <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="المصروفات" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resources & Tax */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Resources Table */}
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <ShoppingBag size={18} className="text-accent" />
            أسعار الموارد
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-right text-dark-muted text-xs font-medium pb-3">المورد</th>
                  <th className="text-right text-dark-muted text-xs font-medium pb-3">السعر</th>
                  <th className="text-right text-dark-muted text-xs font-medium pb-3">التغير 24س</th>
                  <th className="text-right text-dark-muted text-xs font-medium pb-3">العرض</th>
                  <th className="text-right text-dark-muted text-xs font-medium pb-3">الطلب</th>
                </tr>
              </thead>
              <tbody>
                {resources.slice(0, 6).map((resource) => (
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
                    <td className="py-3 text-dark-muted text-sm">{resource.supply.toLocaleString()}</td>
                    <td className="py-3 text-dark-muted text-sm">{resource.demand.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tax Breakdown */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Coins size={18} className="text-primary-light" />
            توزيع الضرائب
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={taxBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                dataKey="amount"
                nameKey="category"
              >
                {taxBreakdown.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                formatter={(value: number) => [`${(value / 1000).toFixed(0)}K`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {taxBreakdown.slice(0, 4).map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-dark-muted text-xs">{item.category}</span>
                </div>
                <span className="text-white text-xs font-medium">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Offers & Jobs */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Market Offers */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <ShoppingBag size={18} className="text-secondary" />
            آخر عروض السوق
          </h3>
          <div className="space-y-3">
            {marketOffers.slice(0, 5).map((offer) => (
              <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg bg-dark-bg/50 border border-dark-border/50 hover:border-primary/20 transition-all">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${offer.type === 'sell' ? 'bg-danger/20 text-danger' : 'bg-secondary/20 text-secondary'}`}>
                    {offer.type === 'sell' ? 'بيع' : 'شراء'}
                  </span>
                  <div>
                    <p className="text-white text-sm font-medium">{offer.resource}</p>
                    <p className="text-dark-muted text-xs">{offer.country} • {offer.timestamp}</p>
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

        {/* Jobs */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Briefcase size={18} className="text-accent" />
            سوق العمل
          </h3>
          <div className="space-y-3">
            {jobs.slice(0, 5).map((job) => (
              <div key={job.id} className="p-3 rounded-lg bg-dark-bg/50 border border-dark-border/50 hover:border-primary/20 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white text-sm font-medium">{job.title}</p>
                  <span className="text-secondary text-sm font-mono">{job.salary} {country.currency}/يوم</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-dark-muted text-xs">{job.company}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-dark-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                        style={{ width: `${(job.filled / job.slots) * 100}%` }}
                      />
                    </div>
                    <span className="text-dark-muted text-xs">{job.filled}/{job.slots}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

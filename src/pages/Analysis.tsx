import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Target, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fetchResources, fetchResourcePriceHistory } from '../lib/database';
import type { DBResource } from '../lib/database';

export default function Analysis() {
  const [resources, setResources] = useState<DBResource[]>([]);
  const [selectedResource, setSelectedResource] = useState('Iron Ore');
  const [priceData, setPriceData] = useState<{ date: string; price: number }[]>([]);

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    loadPriceHistory();
  }, [selectedResource]);

  const loadResources = async () => {
    const r = await fetchResources();
    setResources(r);
    if (r.length > 0 && !r.find(res => res.name === selectedResource)) {
      setSelectedResource(r[0].name);
    }
  };

  const loadPriceHistory = async () => {
    const data = await fetchResourcePriceHistory(selectedResource);
    setPriceData(data);
  };

  // Generate trends based on resource data
  const trends = resources.map(r => ({
    resource: r.name,
    trend: r.change_24h > 1 ? 'up' : r.change_24h < -1 ? 'down' : 'stable',
    strength: Math.abs(r.change_24h) > 3 ? 'strong' : Math.abs(r.change_24h) > 1 ? 'moderate' : 'weak',
    prediction: r.change_24h > 3 ? 'ارتفاع قوي متوقع' :
                r.change_24h > 1 ? 'ارتفاع طفيف متوقع' :
                r.change_24h < -3 ? 'هبوط حاد - تجنب الشراء' :
                r.change_24h < -1 ? 'انخفاض متوقع' :
                'استقرار متوقع',
    icon: r.icon || '📊',
  }));

  const opportunities = resources
    .filter(r => Math.abs(r.change_24h) > 1)
    .map(r => ({
      type: r.change_24h > 0 ? 'buy' as const : 'sell' as const,
      resource: r.name,
      reason: r.change_24h > 0 ? `اتجاه صعودي (${r.change_24h}%)` : `اتجاه هبوطي (${r.change_24h}%)`,
      potential: r.change_24h > 0 ? `+${Math.min(r.change_24h * 2, 20).toFixed(0)}-${Math.min(r.change_24h * 3, 30).toFixed(0)}%` : `${Math.max(r.change_24h * 2, -20).toFixed(0)}-${Math.max(r.change_24h * 3, -30).toFixed(0)}%`,
      urgency: Math.abs(r.change_24h) > 3 ? 'high' as const : Math.abs(r.change_24h) > 2 ? 'medium' as const : 'low' as const,
    }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Activity size={28} className="text-primary-light" />
          التحليل والتنبؤات
        </h1>
        <p className="text-dark-muted mt-1">تحليل اتجاهات الأسعار والفرص الاقتصادية بناءً على بيانات Supabase</p>
      </div>

      {/* Trend Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {trends.map((trend, i) => (
          <div key={i} className="glass rounded-xl p-3 text-center hover:border-primary/30 transition-all">
            <span className="text-xl mb-1 block">{trend.icon}</span>
            <p className="text-white text-xs font-medium truncate">{trend.resource}</p>
            <div className={`flex items-center justify-center gap-1 mt-1 text-xs font-medium ${
              trend.trend === 'up' ? 'text-secondary' : trend.trend === 'down' ? 'text-danger' : 'text-accent'
            }`}>
              {trend.trend === 'up' ? <ArrowUpRight size={12} /> : trend.trend === 'down' ? <ArrowDownRight size={12} /> : <span>→</span>}
              {trend.trend === 'up' ? 'صاعد' : trend.trend === 'down' ? 'هابط' : 'مستقر'}
            </div>
          </div>
        ))}
      </div>

      {/* Price Chart */}
      <div className="glass rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-light" />
            تتبع الأسعار عبر الوقت
          </h3>
          <div className="flex flex-wrap gap-2">
            {resources.slice(0, 8).map((resource) => (
              <button
                key={resource.id}
                onClick={() => setSelectedResource(resource.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedResource === resource.name
                    ? 'bg-primary text-white'
                    : 'bg-dark-bg border border-dark-border text-dark-muted hover:text-white hover:border-primary/30'
                }`}
              >
                {resource.name}
              </button>
            ))}
          </div>
        </div>
        {priceData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={priceData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Area type="monotone" dataKey="price" stroke="#6366f1" fill="url(#priceGradient)" strokeWidth={2} name="السعر" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-dark-muted">
            <div className="text-center">
              <Activity size={40} className="mx-auto mb-3 opacity-50" />
              <p>لا توجد بيانات تاريخية لهذا المورد</p>
              <p className="text-xs mt-1">أضف بيانات في جدول resource_price_history</p>
            </div>
          </div>
        )}
      </div>

      {/* Predictions & Opportunities */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Predictions */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Target size={18} className="text-accent" />
            التنبؤات
          </h3>
          <div className="space-y-3">
            {trends.slice(0, 6).map((trend, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-dark-bg/50 border border-dark-border/50">
                <span className="text-xl">{trend.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-white text-sm font-medium">{trend.resource}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      trend.strength === 'strong' ? 'bg-primary/20 text-primary-light' :
                      trend.strength === 'moderate' ? 'bg-accent/20 text-accent' :
                      'bg-dark-border text-dark-muted'
                    }`}>
                      {trend.strength === 'strong' ? 'قوي' : trend.strength === 'moderate' ? 'متوسط' : 'ضعيف'}
                    </span>
                  </div>
                  <p className="text-dark-muted text-xs mt-1">{trend.prediction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-secondary" />
            فرص استثمارية
          </h3>
          <div className="space-y-3">
            {opportunities.length > 0 ? opportunities.slice(0, 6).map((opp, i) => (
              <div key={i} className={`p-3 rounded-lg border ${
                opp.type === 'buy' ? 'bg-secondary/5 border-secondary/20' : 'bg-danger/5 border-danger/20'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      opp.type === 'buy' ? 'bg-secondary/20 text-secondary' : 'bg-danger/20 text-danger'
                    }`}>
                      {opp.type === 'buy' ? '📈 شراء' : '📉 بيع'}
                    </span>
                    <span className="text-white text-sm font-medium">{opp.resource}</span>
                  </div>
                  <span className={`text-sm font-bold ${opp.type === 'buy' ? 'text-secondary' : 'text-danger'}`}>
                    {opp.potential}
                  </span>
                </div>
                <p className="text-dark-muted text-xs">{opp.reason}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-dark-muted text-xs">الأولوية:</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    opp.urgency === 'high' ? 'bg-danger/20 text-danger' :
                    opp.urgency === 'medium' ? 'bg-accent/20 text-accent' :
                    'bg-dark-border text-dark-muted'
                  }`}>
                    {opp.urgency === 'high' ? 'عالية' : opp.urgency === 'medium' ? 'متوسطة' : 'منخفضة'}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-dark-muted">
                <Target size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">لا توجد فرص حاليًا</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

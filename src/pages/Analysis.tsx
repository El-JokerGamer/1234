import { useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Target, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { resources, resourcePriceHistory } from '../data/mockData';

export default function Analysis() {
  const [selectedResource, setSelectedResource] = useState('Iron Ore');
  const priceData = resourcePriceHistory[selectedResource] || [];

  const trends = [
    { resource: 'Oil', trend: 'up', strength: 'strong', prediction: 'متوقع ارتفاع 8-12% خلال الأسبوع', icon: '🛢️' },
    { resource: 'Iron Ore', trend: 'up', strength: 'moderate', prediction: 'ارتفاع طفيف متوقع 2-4%', icon: '⛏️' },
    { resource: 'Gold', trend: 'down', strength: 'moderate', prediction: 'انخفاض متوقع بسبب زيادة العرض', icon: '🥇' },
    { resource: 'Coal', trend: 'down', strength: 'strong', prediction: 'هبوط حاد - تجنب الشراء الآن', icon: 'ite' },
    { resource: 'Diamond', trend: 'up', strength: 'strong', prediction: 'طلب مرتفع - فرصة استثمارية', icon: '💎' },
    { resource: 'Food', trend: 'stable', strength: 'weak', prediction: 'استقرار متوقع - لا تغيير كبير', icon: '🌾' },
  ];

  const opportunities = [
    {
      type: 'buy',
      resource: 'Diamond',
      reason: 'الطلب أعلى من العرض بنسبة 50%',
      potential: '+15-20%',
      urgency: 'high',
    },
    {
      type: 'buy',
      resource: 'Oil',
      reason: 'اتجاه صعودي قوي + نقص في المعروض',
      potential: '+8-12%',
      urgency: 'medium',
    },
    {
      type: 'sell',
      resource: 'Coal',
      reason: 'فائض في العرض + اتجاه هبوطي',
      potential: '-10-15%',
      urgency: 'high',
    },
    {
      type: 'sell',
      resource: 'Gold',
      reason: 'زيادة العرض المتوقعة خلال أيام',
      potential: '-5-8%',
      urgency: 'low',
    },
  ];

  const cheapestMarkets = [
    { resource: 'Iron Ore', country: 'Verdania', price: 42.1, avgPrice: 45.2, saving: '6.9%' },
    { resource: 'Wood', country: 'Verdania', price: 10.5, avgPrice: 12.8, saving: '18.0%' },
    { resource: 'Food', country: 'Aqualis', price: 7.2, avgPrice: 8.4, saving: '14.3%' },
    { resource: 'Oil', country: 'Ignara', price: 148.0, avgPrice: 156.7, saving: '5.6%' },
  ];

  const expensiveMarkets = [
    { resource: 'Gold', country: 'Terranova', price: 920.0, avgPrice: 892.5, premium: '3.1%' },
    { resource: 'Diamond', country: 'Solaria', price: 2450.0, avgPrice: 2340.0, premium: '4.7%' },
    { resource: 'Silver', country: 'Ignara', price: 248.0, avgPrice: 234.6, premium: '5.7%' },
    { resource: 'Iron Ore', country: 'Solaria', price: 48.5, avgPrice: 45.2, premium: '7.3%' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Activity size={28} className="text-primary-light" />
          التحليل والتنبؤات
        </h1>
        <p className="text-dark-muted mt-1">تحليل اتجاهات الأسعار والفرص الاقتصادية</p>
      </div>

      {/* Trend Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {trends.map((trend, i) => (
          <div key={i} className="glass rounded-xl p-4 text-center hover:border-primary/30 transition-all">
            <span className="text-2xl mb-2 block">{trend.icon}</span>
            <p className="text-white text-sm font-medium">{trend.resource}</p>
            <div className={`flex items-center justify-center gap-1 mt-2 text-xs font-medium ${
              trend.trend === 'up' ? 'text-secondary' : trend.trend === 'down' ? 'text-danger' : 'text-accent'
            }`}>
              {trend.trend === 'up' ? <ArrowUpRight size={14} /> : trend.trend === 'down' ? <ArrowDownRight size={14} /> : <span>→</span>}
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
            {Object.keys(resourcePriceHistory).map((resource) => (
              <button
                key={resource}
                onClick={() => setSelectedResource(resource)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedResource === resource
                    ? 'bg-primary text-white'
                    : 'bg-dark-bg border border-dark-border text-dark-muted hover:text-white hover:border-primary/30'
                }`}
              >
                {resource}
              </button>
            ))}
          </div>
        </div>
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
            {trends.map((trend, i) => (
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
            {opportunities.map((opp, i) => (
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
            ))}
          </div>
        </div>
      </div>

      {/* Market Comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Cheapest Markets */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingDown size={18} className="text-secondary" />
            أرخص الأسواق
          </h3>
          <div className="space-y-3">
            {cheapestMarkets.map((market, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-dark-bg/50 border border-dark-border/50">
                <div>
                  <p className="text-white text-sm font-medium">{market.resource}</p>
                  <p className="text-dark-muted text-xs">{market.country}</p>
                </div>
                <div className="text-left">
                  <p className="text-secondary text-sm font-mono">{market.price}</p>
                  <p className="text-dark-muted text-xs">متوسط: {market.avgPrice}</p>
                </div>
                <span className="text-secondary text-xs font-bold bg-secondary/10 px-2 py-1 rounded">
                  -{market.saving}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Expensive Markets */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-danger" />
            أغلى الأسواق
          </h3>
          <div className="space-y-3">
            {expensiveMarkets.map((market, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-dark-bg/50 border border-dark-border/50">
                <div>
                  <p className="text-white text-sm font-medium">{market.resource}</p>
                  <p className="text-dark-muted text-xs">{market.country}</p>
                </div>
                <div className="text-left">
                  <p className="text-danger text-sm font-mono">{market.price}</p>
                  <p className="text-dark-muted text-xs">متوسط: {market.avgPrice}</p>
                </div>
                <span className="text-danger text-xs font-bold bg-danger/10 px-2 py-1 rounded">
                  +{market.premium}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

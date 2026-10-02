import { Link } from 'react-router-dom';
import {
  Shield,
  BarChart3,
  Globe,
  TrendingUp,
  Lock,
  Zap,
  ChevronLeft,
  Users,
  DollarSign,
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-dark-bg to-secondary/10" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/15 rounded-full blur-3xl" />

        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-white font-bold text-xl">Eclesiar</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-dark-muted hover:text-white transition-colors px-4 py-2"
            >
              تسجيل الدخول
            </Link>
            <Link
              to="/signup"
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              إنشاء حساب
            </Link>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Zap size={16} className="text-primary-light" />
            <span className="text-primary-light text-sm font-medium">منصة اقتصادية متكاملة للعبة Eclesiar</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            لوحة التحكم
            <br />
            <span className="gradient-text">الاقتصادية</span>
          </h1>
          <p className="text-xl text-dark-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            تابع اقتصاد بلدك في اللعبة من مكان واحد. الخزينة، الموارد، الأسواق، الوظائف، والضرائب — كل ما تحتاجه في لوحة موحّدة مع نظام أمان متقدم.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              ابدأ الآن
              <ChevronLeft size={20} />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 border border-dark-border hover:border-primary/50 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="relative -mt-16 z-20 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Globe, label: 'دولة', value: '6', color: 'from-primary to-primary-light' },
            { icon: Users, label: 'لاعب نشط', value: '12,400+', color: 'from-secondary to-emerald-400' },
            { icon: DollarSign, label: 'معاملة يومية', value: '45,000+', color: 'from-accent to-yellow-400' },
            { icon: BarChart3, label: 'موردtracked', value: '25+', color: 'from-pink-500 to-rose-400' },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass rounded-xl p-5 text-center hover:border-primary/30 transition-all"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-dark-muted text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">مميزات المنصة</h2>
          <p className="text-dark-muted text-lg max-w-2xl mx-auto">
            كل الأدوات التي تحتاجها لمتابعة وتحليل الاقتصاد في لعبة Eclesiar
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: BarChart3,
              title: 'لوحة اقتصادية شاملة',
              description: 'الخزينة، العملات، الإيرادات، المصروفات، الضرائب، الموارد، الوظائف — كل شيء في مكان واحد.',
              color: 'from-primary to-primary-light',
            },
            {
              icon: Globe,
              title: 'اقتصاد عالمي',
              description: 'قارن الأسعار بين الدول، تابع الأسواق العالمية، واكتشف أفضل الفرص التجارية.',
              color: 'from-secondary to-emerald-400',
            },
            {
              icon: TrendingUp,
              title: 'تحليل متقدم',
              description: 'تتبع تغير الأسعار مع الوقت، حلل الاتجاهات، وتنبأ بحركة السوق.',
              color: 'from-accent to-yellow-400',
            },
            {
              icon: Shield,
              title: 'أمان متعدد الطبقات',
              description: 'سيريال فريد + بصمة الجهاز + حماية الجلسة. حسابك محمي بالكامل.',
              color: 'from-pink-500 to-rose-400',
            },
            {
              icon: Lock,
              title: 'تخصيص حسب الجنسية',
              description: 'النظام يتعرف على بلدك تلقائيًا ويعرض لك اقتصاد بلدك فقط.',
              color: 'from-cyan-500 to-blue-400',
            },
            {
              icon: Zap,
              title: 'تحديث لحظي',
              description: 'البيانات تتحدث تلقائيًا من API اللعبة. لا تفوّت أي تغير في السوق.',
              color: 'from-violet-500 to-purple-400',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group glass rounded-xl p-6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon size={24} className="text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-dark-muted leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="glass rounded-2xl p-8 md:p-12 border border-primary/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">نظام أمان متقدم</h2>
              <p className="text-dark-muted mb-6 leading-relaxed">
                ثلاث طبقات حماية تمنع الوصول غير المصرح به لحسابك. حتى لو حصل شخص على كلمة مرورك، لن يتمكن من الدخول بدون جهازك المسجل.
              </p>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'ID اللعبة', desc: 'أدخل معرف حسابك في اللعبة' },
                  { step: '2', title: 'سيريال فريد', desc: 'سيريال 16 خانة مربوط بجهازك' },
                  { step: '3', title: 'بصمة الجهاز', desc: 'حماية إضافية تمنع الدخول من جهاز آخر' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-light text-sm font-bold">{item.step}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-dark-muted text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-border">
                      <Shield size={40} className="text-white" />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center animate-bounce">
                  <Lock size={14} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">جاهز تبدأ؟</h2>
        <p className="text-dark-muted text-lg mb-8">
          سجّل الآن وتابع اقتصاد بلدك في لعبة Eclesiar من مكان واحد
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          إنشاء حساب مجاني
          <ChevronLeft size={20} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-border py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-dark-muted text-sm">© 2026 Eclesiar Economic Dashboard</span>
          </div>
          <p className="text-dark-muted text-sm">
            صُمم خصيصًا لمجتمع لعبة Eclesiar
          </p>
        </div>
      </footer>
    </div>
  );
}

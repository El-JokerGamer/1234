import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Key, Copy, CheckCircle, AlertCircle } from 'lucide-react';

export default function Signup() {
  const [gameId, setGameId] = useState('');
  const [step, setStep] = useState<'input' | 'serial' | 'waiting'>('input');
  const [serial, setSerial] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const generateSerial = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const segments = [];
    for (let i = 0; i < 4; i++) {
      let segment = '';
      for (let j = 0; j < 4; j++) {
        segment += chars[Math.floor(Math.random() * chars.length)];
      }
      segments.push(segment);
    }
    return segments.join('-');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameId) return;
    setLoading(true);

    setTimeout(() => {
      const newSerial = generateSerial();
      setSerial(newSerial);
      setStep('serial');
      setLoading(false);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(serial);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-dark-bg to-secondary/5" />
      <div className="absolute top-40 right-40 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">إنشاء حساب</h1>
          <p className="text-dark-muted">سجّل حسابك وابدأ متابعة الاقتصاد</p>
        </div>

        <div className="glass rounded-2xl p-8">
          {step === 'input' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-dark-muted text-sm font-medium mb-2">
                  ID اللعبة
                </label>
                <input
                  type="text"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  placeholder="أدخل معرف حسابك في اللعبة"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-dark-muted/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                />
                <p className="text-dark-muted/70 text-xs mt-2">
                  سيتم جلب بياناتك تلقائيًا من API اللعبة
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !gameId}
                className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري التحقق...
                  </>
                ) : (
                  'التالي'
                )}
              </button>
            </form>
          )}

          {step === 'serial' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center mx-auto mb-4">
                  <Key size={28} className="text-secondary" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">تم إنشاء السيريال</h3>
                <p className="text-dark-muted text-sm">
                  انسخ هذا السيريال وأرسله للأدمن لتفعيل حسابك
                </p>
              </div>

              <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-dark-muted text-xs font-medium">السيريال الخاص بك</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-primary-light hover:text-primary text-xs font-medium transition-colors"
                  >
                    {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                    {copied ? 'تم النسخ' : 'نسخ'}
                  </button>
                </div>
                <p className="text-white font-mono text-lg tracking-wider text-center py-2">
                  {serial}
                </p>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/10 border border-accent/30">
                <AlertCircle size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-accent text-sm font-medium">ملاحظة مهمة</p>
                  <p className="text-dark-muted text-xs mt-1">
                    هذا السيريال مربوط ببصمة جهازك. لا تشاركه مع أي شخص. الحساب سيظل معطّلًا حتى يفعّله الأدمن.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setStep('waiting')}
                className="w-full border border-dark-border hover:border-primary/50 text-white py-3 rounded-lg font-semibold transition-all"
              >
                فهمت، سأتواصل مع الأدمن
              </button>
            </div>
          )}

          {step === 'waiting' && (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto">
                <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">في انتظار التفعيل</h3>
                <p className="text-dark-muted text-sm leading-relaxed">
                  تم إرسال السيريال للأدمن. سيتم تفعيل حسابك في أقرب وقت.
                  <br />
                  ستحصل على إشعار عند التفعيل.
                </p>
              </div>

              <div className="bg-dark-bg border border-dark-border rounded-lg p-4 text-right">
                <p className="text-dark-muted text-xs mb-1">معرف الطلب</p>
                <p className="text-white font-mono">#REQ-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
              </div>

              <Link
                to="/login"
                className="block w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition-all text-center"
              >
                العودة لتسجيل الدخول
              </Link>
            </div>
          )}

          <div className="mt-6 text-center pt-6 border-t border-dark-border">
            <p className="text-dark-muted text-sm">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-primary-light hover:text-primary transition-colors font-medium">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

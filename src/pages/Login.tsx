import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Shield, Eye, EyeOff, Fingerprint } from 'lucide-react';

export default function Login() {
  const [gameId, setGameId] = useState('');
  const [serial, setSerial] = useState('');
  const [showSerial, setShowSerial] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (gameId === '10001' && serial === 'A3F8-B2C1-D4E5-F6A7') {
        login('owner');
        navigate('/dashboard');
      } else if (gameId && serial) {
        login('member');
        navigate('/dashboard');
      } else {
        setError('يرجى إدخال جميع البيانات المطلوبة');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-dark-bg to-secondary/5" />
      <div className="absolute top-40 left-40 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">تسجيل الدخول</h1>
          <p className="text-dark-muted">أدخل بياناتك للوصول إلى لوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
          {error && (
            <div className="bg-danger/10 border border-danger/30 rounded-lg p-3 text-danger text-sm text-center">
              {error}
            </div>
          )}

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
          </div>

          <div>
            <label className="block text-dark-muted text-sm font-medium mb-2">
              السيريال
            </label>
            <div className="relative">
              <input
                type={showSerial ? 'text' : 'password'}
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-dark-muted/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowSerial(!showSerial)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted hover:text-white transition-colors"
              >
                {showSerial ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-bg/50 border border-dark-border/50">
            <Fingerprint size={20} className="text-primary-light flex-shrink-0" />
            <p className="text-dark-muted text-xs">
              سيتم التحقق من بصمة جهازك تلقائيًا عند تسجيل الدخول
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Shield size={18} />
                دخول آمن
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-dark-muted text-sm">
              ليس لديك حساب؟{' '}
              <Link to="/signup" className="text-primary-light hover:text-primary transition-colors font-medium">
                إنشاء حساب
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-dark-muted/50 text-xs">
            للدخول التجريبي: ID = 10001 | السيريال = A3F8-B2C1-D4E5-F6A7
          </p>
        </div>
      </div>
    </div>
  );
}

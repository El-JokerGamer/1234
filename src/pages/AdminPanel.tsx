import { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  UserCheck,
  Ban,
  Trash2,
  Key,
  RefreshCw,
  Search,
  Plus,
  Clock,
  Monitor,
  Database,
  RefreshCw as RefreshIcon,
} from 'lucide-react';
import {
  fetchAllUsers,
  updateUserStatus,
  deleteUser,
  regenerateSerial,
  createActivationCode,
  fetchActivationCodes,
  fetchSecurityLogs,
} from '../lib/database';
import type { DBUser, DBActivationCode, DBSecurityLog } from '../lib/database';

type TabType = 'users' | 'activation' | 'security';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [userList, setUserList] = useState<DBUser[]>([]);
  const [activationCodes, setActivationCodes] = useState<DBActivationCode[]>([]);
  const [securityLogs, setSecurityLogs] = useState<DBSecurityLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [codeDuration, setCodeDuration] = useState('24');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTabData();
  }, [activeTab]);

  const loadTabData = async () => {
    setLoading(true);
    if (activeTab === 'users') {
      const users = await fetchAllUsers();
      setUserList(users);
    } else if (activeTab === 'activation') {
      const codes = await fetchActivationCodes();
      setActivationCodes(codes);
    } else if (activeTab === 'security') {
      const logs = await fetchSecurityLogs();
      setSecurityLogs(logs);
    }
    setLoading(false);
  };

  const filteredUsers = userList.filter(
    (u) =>
      (u.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.game_id.includes(searchQuery) ||
      (u.country?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = async (userId: number, newStatus: 'active' | 'pending' | 'banned') => {
    const success = await updateUserStatus(userId, newStatus);
    if (success) {
      setUserList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    const success = await deleteUser(userId);
    if (success) {
      setUserList((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  const handleRegenerateSerial = async (userId: number) => {
    const newSerial = await regenerateSerial(userId);
    if (newSerial) {
      setUserList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, serial: newSerial } : u))
      );
      alert(`تم تحديث السيريال: ${newSerial}`);
    }
  };

  const handleGenerateCode = async () => {
    const duration = codeDuration === 'unlimited' ? null : parseInt(codeDuration);
    const code = await createActivationCode(duration);
    if (code) {
      setActivationCode(code);
      setShowActivateModal(true);
      // Reload codes
      const codes = await fetchActivationCodes();
      setActivationCodes(codes);
    }
  };

  const tabs = [
    { id: 'users' as TabType, label: 'المستخدمون', icon: Users, count: userList.length },
    { id: 'activation' as TabType, label: 'أكواد التفعيل', icon: Key, count: null },
    { id: 'security' as TabType, label: 'الأمان', icon: Shield, count: null },
  ];

  const stats = [
    { label: 'إجمالي المستخدمين', value: userList.length, icon: Users, color: 'from-primary to-primary-light' },
    { label: 'نشط', value: userList.filter((u) => u.status === 'active').length, icon: UserCheck, color: 'from-secondary to-emerald-400' },
    { label: 'في الانتظار', value: userList.filter((u) => u.status === 'pending').length, icon: Clock, color: 'from-accent to-yellow-400' },
    { label: 'محظور', value: userList.filter((u) => u.status === 'banned').length, icon: Ban, color: 'from-danger to-rose-400' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield size={28} className="text-primary-light" />
            لوحة تحكم الأدمن
          </h1>
          <p className="text-dark-muted mt-1">إدارة المستخدمين والأمان</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadTabData}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-dark-muted hover:text-white hover:border-primary/30 transition-all text-sm"
          >
            <RefreshIcon size={14} />
            تحديث
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border">
            <Database size={14} className="text-secondary" />
            <span className="text-secondary text-xs">Supabase متصل</span>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary-light text-sm font-medium">
            👑 Owner
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-dark-muted text-xs">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-dark-card rounded-xl border border-dark-border w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'text-dark-muted hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.count !== null && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-dark-border'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="glass rounded-xl overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-dark-border">
            <div className="relative">
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث بالاسم، ID اللعبة، أو البلد..."
                className="w-full bg-dark-bg border border-dark-border rounded-lg pr-10 pl-4 py-2.5 text-white placeholder-dark-muted/50 focus:outline-none focus:border-primary/50 transition-all text-sm"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border bg-dark-bg/50">
                  <th className="text-right text-dark-muted text-xs font-medium px-4 py-3">المستخدم</th>
                  <th className="text-right text-dark-muted text-xs font-medium px-4 py-3">ID اللعبة</th>
                  <th className="text-right text-dark-muted text-xs font-medium px-4 py-3">البلد</th>
                  <th className="text-right text-dark-muted text-xs font-medium px-4 py-3">الحالة</th>
                  <th className="text-right text-dark-muted text-xs font-medium px-4 py-3">آخر دخول</th>
                  <th className="text-right text-dark-muted text-xs font-medium px-4 py-3">IP</th>
                  <th className="text-right text-dark-muted text-xs font-medium px-4 py-3">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-dark-border/50 hover:bg-dark-border/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{(user.username || 'U')[0]}</span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{user.username || 'Unknown'}</p>
                          <p className="text-dark-muted text-xs flex items-center gap-1">
                            <Monitor size={10} />
                            {user.device_fingerprint || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white text-sm font-mono">{user.game_id}</td>
                    <td className="px-4 py-3 text-dark-muted text-sm">{user.country?.name || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        user.status === 'active' ? 'bg-secondary/20 text-secondary' :
                        user.status === 'pending' ? 'bg-accent/20 text-accent' :
                        'bg-danger/20 text-danger'
                      }`}>
                        {user.status === 'active' ? 'نشط' : user.status === 'pending' ? 'انتظار' : 'محظور'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-dark-muted text-xs">
                      {user.last_login ? new Date(user.last_login).toLocaleString('ar') : 'لم يدخل بعد'}
                    </td>
                    <td className="px-4 py-3 text-dark-muted text-xs font-mono">{user.last_ip || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {user.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(user.id, 'active')}
                            className="p-1.5 rounded hover:bg-secondary/20 text-secondary transition-colors"
                            title="تفعيل"
                          >
                            <UserCheck size={16} />
                          </button>
                        )}
                        {user.status === 'active' && (
                          <button
                            onClick={() => handleStatusChange(user.id, 'banned')}
                            className="p-1.5 rounded hover:bg-danger/20 text-danger transition-colors"
                            title="حظر"
                          >
                            <Ban size={16} />
                          </button>
                        )}
                        {user.status === 'banned' && (
                          <button
                            onClick={() => handleStatusChange(user.id, 'active')}
                            className="p-1.5 rounded hover:bg-secondary/20 text-secondary transition-colors"
                            title="إلغاء الحظر"
                          >
                            <UserCheck size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleRegenerateSerial(user.id)}
                          className="p-1.5 rounded hover:bg-primary/20 text-primary-light transition-colors"
                          title="إعادة توليد السيريال"
                        >
                          <RefreshCw size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 rounded hover:bg-danger/20 text-danger transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && !loading && (
              <div className="text-center py-12 text-dark-muted">
                <Users size={40} className="mx-auto mb-3 opacity-50" />
                <p>لا يوجد مستخدمون</p>
                <p className="text-xs mt-1">تأكد من تشغيل SQL Schema في Supabase</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Activation Codes Tab */}
      {activeTab === 'activation' && (
        <div className="space-y-6">
          <div className="glass rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Key size={18} className="text-accent" />
              توليد أكواد تفعيل
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-dark-muted text-sm mb-2">مدة الصلاحية</label>
                  <select
                    value={codeDuration}
                    onChange={(e) => setCodeDuration(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 transition-all"
                  >
                    <option value="1">ساعة واحدة</option>
                    <option value="24">24 ساعة</option>
                    <option value="72">3 أيام</option>
                    <option value="168">أسبوع</option>
                    <option value="unlimited">دائم (بدون انتهاء)</option>
                  </select>
                </div>
                <button
                  onClick={handleGenerateCode}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-medium transition-all"
                >
                  <Plus size={18} />
                  توليد كود جديد
                </button>
              </div>
              <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
                <p className="text-dark-muted text-xs mb-2">آخر كود تم توليده</p>
                {activationCode ? (
                  <p className="text-white font-mono text-lg tracking-wider">{activationCode}</p>
                ) : (
                  <p className="text-dark-muted/50 text-sm">لم يتم توليد أي كود بعد</p>
                )}
                {activationCode && (
                  <p className="text-dark-muted text-xs mt-2">
                    المدة: {codeDuration === 'unlimited' ? 'دائم' : `${codeDuration} ساعة`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Generated codes history */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">سجل الأكواد</h3>
            {activationCodes.length > 0 ? (
              <div className="space-y-2">
                {activationCodes.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-dark-bg/50 border border-dark-border/50">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${item.is_used ? 'bg-dark-muted' : 'bg-secondary'}`} />
                      <span className="text-white font-mono text-sm">{item.code}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-dark-muted text-xs">
                        {item.is_unlimited ? 'دائم' : `${item.duration_hours} ساعة`}
                      </span>
                      {item.is_used ? (
                        <span className="text-dark-muted text-xs">مستخدم</span>
                      ) : (
                        <span className="text-secondary text-xs">متاح</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-dark-muted">
                <Key size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">لا توجد أكواد مفعّلة</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="glass rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Shield size={18} className="text-primary-light" />
              سجل النشاط الأمني
            </h3>
            {securityLogs.length > 0 ? (
              <div className="space-y-3">
                {securityLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-dark-bg/50 border border-dark-border/50">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      log.action.includes('success') ? 'bg-secondary' :
                      log.action.includes('failed') ? 'bg-danger' :
                      log.action.includes('signup') ? 'bg-primary-light' :
                      'bg-accent'
                    }`} />
                    <div className="flex-1">
                      <p className="text-white text-sm">{log.action}</p>
                      <p className="text-dark-muted text-xs">
                        {log.device_fingerprint && `جهاز: ${log.device_fingerprint}`}
                        {log.ip_address && ` • IP: ${log.ip_address}`}
                        {' • '}
                        {new Date(log.created_at).toLocaleString('ar')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-dark-muted">
                <Shield size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">لا توجد سجلات أمنية</p>
                <p className="text-xs mt-1">ستظهر هنا عند تسجيل دخول المستخدمين</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Activation Modal */}
      {showActivateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 max-w-sm w-full animate-fade-in">
            <h3 className="text-white font-semibold text-lg mb-4">تم توليد كود التفعيل</h3>
            <div className="bg-dark-bg border border-dark-border rounded-lg p-4 text-center mb-4">
              <p className="text-white font-mono text-xl tracking-wider">{activationCode}</p>
            </div>
            <p className="text-dark-muted text-sm mb-4">
              المدة: {codeDuration === 'unlimited' ? 'دائم' : `${codeDuration} ساعة`}
            </p>
            <button
              onClick={() => setShowActivateModal(false)}
              className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg font-medium transition-all"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

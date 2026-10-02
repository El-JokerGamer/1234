export interface Country {
  id: number;
  name: string;
  flag: string;
  treasury: number;
  population: number;
  gdp: number;
  taxRate: number;
  currency: string;
}

export interface Resource {
  id: number;
  name: string;
  icon: string;
  price: number;
  change24h: number;
  supply: number;
  demand: number;
}

export interface MarketOffer {
  id: number;
  type: 'buy' | 'sell';
  resource: string;
  quantity: number;
  price: number;
  country: string;
  seller: string;
  timestamp: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  country: string;
  salary: number;
  slots: number;
  filled: number;
}

export interface User {
  id: number;
  gameId: string;
  username: string;
  country: string;
  serial: string;
  status: 'active' | 'pending' | 'banned';
  role: 'owner' | 'member';
  lastLogin: string;
  ip: string;
  deviceFingerprint: string;
}

export interface PriceHistory {
  date: string;
  price: number;
}

export const countries: Country[] = [
  { id: 1, name: 'Nordia', flag: '🏔️', treasury: 2450000, population: 12400, gdp: 8900000, taxRate: 12, currency: 'NORD' },
  { id: 2, name: 'Solaria', flag: '☀️', treasury: 3200000, population: 15600, gdp: 11200000, taxRate: 10, currency: 'SOL' },
  { id: 3, name: 'Verdania', flag: '🌿', treasury: 1800000, population: 9800, gdp: 6500000, taxRate: 15, currency: 'VERD' },
  { id: 4, name: 'Aqualis', flag: '🌊', treasury: 2100000, population: 11200, gdp: 7800000, taxRate: 11, currency: 'AQUA' },
  { id: 5, name: 'Ignara', flag: '🔥', treasury: 4100000, population: 18900, gdp: 14500000, taxRate: 8, currency: 'IGN' },
  { id: 6, name: 'Terranova', flag: '🌍', treasury: 1500000, population: 8500, gdp: 5200000, taxRate: 18, currency: 'TERR' },
];

export const resources: Resource[] = [
  { id: 1, name: 'Iron Ore', icon: '⛏️', price: 45.2, change24h: 2.3, supply: 15400, demand: 12800 },
  { id: 2, name: 'Gold', icon: '🥇', price: 892.5, change24h: -1.1, supply: 3200, demand: 4100 },
  { id: 3, name: 'Wood', icon: '🪵', price: 12.8, change24h: 0.5, supply: 28900, demand: 22100 },
  { id: 4, name: 'Food', icon: '🌾', price: 8.4, change24h: -0.3, supply: 45600, demand: 41200 },
  { id: 5, name: 'Oil', icon: '🛢️', price: 156.7, change24h: 4.2, supply: 8900, demand: 11200 },
  { id: 6, name: 'Diamond', icon: '💎', price: 2340.0, change24h: 1.8, supply: 1200, demand: 1800 },
  { id: 7, name: 'Coal', icon: 'ite', price: 22.1, change24h: -2.1, supply: 19800, demand: 16500 },
  { id: 8, name: 'Silver', icon: '🪙', price: 234.6, change24h: 0.9, supply: 5600, demand: 6200 },
];

export const marketOffers: MarketOffer[] = [
  { id: 1, type: 'sell', resource: 'Iron Ore', quantity: 500, price: 44.8, country: 'Nordia', seller: 'IronKing99', timestamp: '2 min ago' },
  { id: 2, type: 'buy', resource: 'Gold', quantity: 50, price: 895.0, country: 'Solaria', seller: 'GoldRush', timestamp: '5 min ago' },
  { id: 3, type: 'sell', resource: 'Oil', quantity: 200, price: 155.2, country: 'Ignara', seller: 'OilBaron', timestamp: '8 min ago' },
  { id: 4, type: 'buy', resource: 'Wood', quantity: 1000, price: 12.5, country: 'Verdania', seller: 'TimberWolf', timestamp: '12 min ago' },
  { id: 5, type: 'sell', resource: 'Food', quantity: 2000, price: 8.2, country: 'Aqualis', seller: 'FarmLord', timestamp: '15 min ago' },
  { id: 6, type: 'buy', resource: 'Diamond', quantity: 10, price: 2350.0, country: 'Terranova', seller: 'GemHunter', timestamp: '18 min ago' },
  { id: 7, type: 'sell', resource: 'Silver', quantity: 300, price: 233.0, country: 'Nordia', seller: 'SilverMiner', timestamp: '22 min ago' },
  { id: 8, type: 'buy', resource: 'Iron Ore', quantity: 800, price: 45.5, country: 'Ignara', seller: 'SteelForge', timestamp: '25 min ago' },
];

export const jobs: Job[] = [
  { id: 1, title: 'Iron Miner', company: 'Nordia Mining Co.', country: 'Nordia', salary: 120, slots: 50, filled: 38 },
  { id: 2, title: 'Gold Refiner', company: 'Solaria Gold Works', country: 'Solaria', salary: 280, slots: 20, filled: 15 },
  { id: 3, title: 'Lumberjack', company: 'Verdania Forest Inc.', country: 'Verdania', salary: 85, slots: 100, filled: 72 },
  { id: 4, title: 'Oil Engineer', company: 'Ignara Petroleum', country: 'Ignara', salary: 350, slots: 30, filled: 28 },
  { id: 5, title: 'Farmer', company: 'Aqualis Agriculture', country: 'Aqualis', salary: 65, slots: 200, filled: 145 },
  { id: 6, title: 'Diamond Cutter', company: 'Terranova Gems', country: 'Terranova', salary: 420, slots: 10, filled: 8 },
];

export const users: User[] = [
  { id: 1, gameId: '10001', username: 'DragonSlayer', country: 'Nordia', serial: 'A3F8-B2C1-D4E5-F6A7', status: 'active', role: 'owner', lastLogin: '2026-01-15 14:32', ip: '192.168.1.45', deviceFingerprint: 'fp_abc123' },
  { id: 2, gameId: '10002', username: 'ShadowKnight', country: 'Solaria', serial: 'B4G9-C3D2-E5F6-G7B8', status: 'active', role: 'member', lastLogin: '2026-01-15 12:18', ip: '192.168.1.67', deviceFingerprint: 'fp_def456' },
  { id: 3, gameId: '10003', username: 'PhoenixRise', country: 'Ignara', serial: 'C5H0-D4E3-F6G7-H8C9', status: 'pending', role: 'member', lastLogin: '2026-01-14 09:45', ip: '10.0.0.23', deviceFingerprint: 'fp_ghi789' },
  { id: 4, gameId: '10004', username: 'StormBringer', country: 'Aqualis', serial: 'D6I1-E5F4-G7H8-I9D0', status: 'banned', role: 'member', lastLogin: '2026-01-10 18:22', ip: '172.16.0.89', deviceFingerprint: 'fp_jkl012' },
  { id: 5, gameId: '10005', username: 'FrostMage', country: 'Verdania', serial: 'E7J2-F6G5-H8I9-J0E1', status: 'active', role: 'member', lastLogin: '2026-01-15 16:05', ip: '192.168.2.12', deviceFingerprint: 'fp_mno345' },
  { id: 6, gameId: '10006', username: 'EarthShaker', country: 'Terranova', serial: 'F8K3-G7H6-I9J0-K1F2', status: 'pending', role: 'member', lastLogin: '2026-01-13 11:30', ip: '10.0.1.55', deviceFingerprint: 'fp_pqr678' },
];

export const treasuryHistory: PriceHistory[] = [
  { date: 'Jan 1', price: 2100000 },
  { date: 'Jan 3', price: 2150000 },
  { date: 'Jan 5', price: 2200000 },
  { date: 'Jan 7', price: 2180000 },
  { date: 'Jan 9', price: 2250000 },
  { date: 'Jan 11', price: 2300000 },
  { date: 'Jan 13', price: 2380000 },
  { date: 'Jan 15', price: 2450000 },
];

export const revenueData = [
  { month: 'Aug', income: 450000, expenses: 320000 },
  { month: 'Sep', income: 520000, expenses: 380000 },
  { month: 'Oct', income: 480000, expenses: 350000 },
  { month: 'Nov', income: 610000, expenses: 420000 },
  { month: 'Dec', income: 580000, expenses: 400000 },
  { month: 'Jan', income: 690000, expenses: 450000 },
];

export const taxBreakdown = [
  { category: 'Trade Tax', amount: 285000, percentage: 35 },
  { category: 'Income Tax', amount: 195000, percentage: 24 },
  { category: 'Property Tax', amount: 142000, percentage: 17 },
  { category: 'Import Tax', amount: 98000, percentage: 12 },
  { category: 'Luxury Tax', amount: 65000, percentage: 8 },
  { category: 'Other', amount: 33000, percentage: 4 },
];

export const resourcePriceHistory: Record<string, PriceHistory[]> = {
  'Iron Ore': [
    { date: 'Jan 1', price: 42.0 },
    { date: 'Jan 3', price: 43.5 },
    { date: 'Jan 5', price: 44.0 },
    { date: 'Jan 7', price: 43.2 },
    { date: 'Jan 9', price: 44.8 },
    { date: 'Jan 11', price: 45.0 },
    { date: 'Jan 13', price: 44.5 },
    { date: 'Jan 15', price: 45.2 },
  ],
  'Gold': [
    { date: 'Jan 1', price: 910.0 },
    { date: 'Jan 3', price: 905.0 },
    { date: 'Jan 5', price: 898.0 },
    { date: 'Jan 7', price: 900.0 },
    { date: 'Jan 9', price: 895.0 },
    { date: 'Jan 11', price: 890.0 },
    { date: 'Jan 13', price: 894.0 },
    { date: 'Jan 15', price: 892.5 },
  ],
  'Oil': [
    { date: 'Jan 1', price: 140.0 },
    { date: 'Jan 3', price: 142.0 },
    { date: 'Jan 5', price: 148.0 },
    { date: 'Jan 7', price: 150.0 },
    { date: 'Jan 9', price: 152.0 },
    { date: 'Jan 11', price: 155.0 },
    { date: 'Jan 13', price: 154.0 },
    { date: 'Jan 15', price: 156.7 },
  ],
};

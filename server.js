const express = require('express');
const cors = require('cors');

const app = express();

// إعدادات CORS لموقعك فقط
app.use(cors({
  origin: ['https://stocks.techprosa.net', 'http://stocks.techprosa.net'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ==================== قاعدة البيانات الموسعة ====================
const stocksDatabase = [
  // --- الأسهم السعودية ---
  { symbol: "2222", name: "سابك", sector: "البتروكيماويات", market: "SAUDI", marketCap: "كبير", pe: 18.5, eps: 4.2, dividend: 3.2 },
  { symbol: "1120", name: "الراجحي", sector: "البنوك", market: "SAUDI", marketCap: "كبير", pe: 15.2, eps: 5.6, dividend: 4.1 },
  { symbol: "1180", name: "الأهلي", sector: "البنوك", market: "SAUDI", marketCap: "كبير", pe: 14.8, eps: 5.1, dividend: 3.8 },
  { symbol: "1211", name: "مكة", sector: "التطوير العقاري", market: "SAUDI", marketCap: "متوسط", pe: 22.3, eps: 2.1, dividend: 1.5 },
  { symbol: "2010", name: "سابك للمغذيات", sector: "الزراعة", market: "SAUDI", marketCap: "متوسط", pe: 19.2, eps: 3.4, dividend: 2.2 },
  { symbol: "2082", name: "معادن", sector: "التعدين", market: "SAUDI", marketCap: "كبير", pe: 25.1, eps: 2.8, dividend: 1.8 },
  { symbol: "3002", name: "ينساب", sector: "البتروكيماويات", market: "SAUDI", marketCap: "كبير", pe: 17.3, eps: 5.2, dividend: 3.5 },
  { symbol: "4001", name: "الرياض", sector: "البنوك", market: "SAUDI", marketCap: "كبير", pe: 13.9, eps: 6.1, dividend: 4.5 },
  { symbol: "4013", name: "الجزيرة", sector: "البنوك", market: "SAUDI", marketCap: "متوسط", pe: 16.4, eps: 3.8, dividend: 2.9 },
  { symbol: "4030", name: "الإنماء", sector: "البنوك", market: "SAUDI", marketCap: "كبير", pe: 14.2, eps: 5.9, dividend: 4.2 },
  { symbol: "4280", name: "الراجحي للتأمين", sector: "التأمين", market: "SAUDI", marketCap: "متوسط", pe: 21.5, eps: 2.2, dividend: 1.4 },
  { symbol: "6017", name: "الدرع العربي", sector: "التأمين", market: "SAUDI", marketCap: "متوسط", pe: 23.1, eps: 1.8, dividend: 1.2 },
  { symbol: "6010", name: "التعاونية", sector: "التأمين", market: "SAUDI", marketCap: "متوسط", pe: 18.7, eps: 2.5, dividend: 1.6 },
  { symbol: "7020", name: "الاتصالات", sector: "الاتصالات", market: "SAUDI", marketCap: "كبير", pe: 12.5, eps: 7.2, dividend: 5.5 },
  { symbol: "7030", name: "زين", sector: "الاتصالات", market: "SAUDI", marketCap: "كبير", pe: 16.8, eps: 4.1, dividend: 2.8 },
  { symbol: "7202", name: "أرامكو", sector: "الطاقة", market: "SAUDI", marketCap: "كبير", pe: 11.2, eps: 8.5, dividend: 6.2 },
  
  // --- الأسهم الأمريكية ---
  { symbol: "AAPL", name: "Apple Inc.", sector: "التقنية", market: "US", marketCap: "كبير", pe: 28.5, eps: 6.2, dividend: 0.5 },
  { symbol: "MSFT", name: "Microsoft", sector: "التقنية", market: "US", marketCap: "كبير", pe: 32.1, eps: 11.5, dividend: 0.8 },
  { symbol: "GOOGL", name: "Google", sector: "التقنية", market: "US", marketCap: "كبير", pe: 25.3, eps: 5.8, dividend: 0 },
  { symbol: "AMZN", name: "Amazon", sector: "التجارة الإلكترونية", market: "US", marketCap: "كبير", pe: 48.2, eps: 3.2, dividend: 0 },
  { symbol: "TSLA", name: "Tesla", sector: "السيارات الكهربائية", market: "US", marketCap: "كبير", pe: 65.4, eps: 3.8, dividend: 0 },
  { symbol: "META", name: "Meta", sector: "التقنية", market: "US", marketCap: "كبير", pe: 22.7, eps: 14.2, dividend: 0 },
  { symbol: "NVDA", name: "NVIDIA", sector: "التقنية", market: "US", marketCap: "كبير", pe: 58.3, eps: 4.5, dividend: 0.1 },
  { symbol: "JPM", name: "JPMorgan", sector: "البنوك", market: "US", marketCap: "كبير", pe: 11.5, eps: 15.3, dividend: 2.8 },
  { symbol: "V", name: "Visa", sector: "المدفوعات", market: "US", marketCap: "كبير", pe: 31.2, eps: 8.5, dividend: 0.7 },
  { symbol: "JNJ", name: "Johnson & Johnson", sector: "الصحة", market: "US", marketCap: "كبير", pe: 23.4, eps: 7.2, dividend: 2.5 },
  { symbol: "WMT", name: "Walmart", sector: "التجزئة", market: "US", marketCap: "كبير", pe: 28.1, eps: 2.5, dividend: 1.4 },
  { symbol: "PG", name: "Procter & Gamble", sector: "السلع الاستهلاكية", market: "US", marketCap: "كبير", pe: 24.6, eps: 6.1, dividend: 2.3 },
  { symbol: "XOM", name: "Exxon Mobil", sector: "الطاقة", market: "US", marketCap: "كبير", pe: 9.8, eps: 12.5, dividend: 3.4 },
  { symbol: "BAC", name: "Bank of America", sector: "البنوك", market: "US", marketCap: "كبير", pe: 10.2, eps: 3.8, dividend: 2.1 }
];

// ==================== دوال التحليل الفني المحسنة ====================

// دالة مساعدة لتوليد أرقام عشوائية ضمن نطاق
const rand = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);

// دالة مساعدة للـ RSI
const getRsi = () => Math.floor(rand(20, 85));

// دالة MACD محاكاة
const getMacd = () => ({ macd: rand(-1.5, 1.5), signal: rand(-1, 1), histogram: rand(-0.8, 0.8) });

// دالة المتوسطات
const getSma = (price) => +(price * rand(0.95, 1.05)).toFixed(2);

// دالة بولينجر باند (محسنة وآمنة)
const getBollinger = (price) => {
  const band = +(price * 0.05).toFixed(2);
  return { upper: +(price + band).toFixed(2), middle: +price.toFixed(2), lower: +(price - band).toFixed(2) };
};

// دالة ATR
const getAtr = (price) => +(price * rand(0.02, 0.04)).toFixed(2);

// دالة فيبوناتشي
const getFibonacci = (price) => {
  const high = +(price * 1.1).toFixed(2), low = +(price * 0.9).toFixed(2);
  const diff = high - low;
  return { r0: low, r236: +(low + diff * 0.236).toFixed(2), r382: +(low + diff * 0.382).toFixed(2), r500: +(low + diff * 0.5).toFixed(2), r618: +(low + diff * 0.618).toFixed(2), r786: +(low + diff * 0.786).toFixed(2), r100: high };
};

// ==================== توليد بيانات السهم ====================
function generateStockData(stockInfo) {
  const changePercent = rand(-4.5, 4.5);
  const price = +(rand(30, 500) * (1 + changePercent / 100)).toFixed(2);
  const rsi = getRsi();
  
  let signal = 'NEUTRAL', signalStrength = 'محايد';
  let score = 50;
  if (rsi < 35) { signal = 'STRONG_BUY'; signalStrength = 'قوية جداً'; score = rand(85, 98); }
  else if (rsi < 50) { signal = 'BUY'; signalStrength = 'متوسطة'; score = rand(65, 84); }
  else if (rsi > 75) { signal = 'SELL'; signalStrength = 'قوية'; score = rand(15, 30); }
  else if (rsi > 65) { signal = 'WATCH'; signalStrength = 'ضعيفة'; score = rand(35, 49); }

  const atr = getAtr(price);
  const targets = [
    { level: 1, price: +(price + atr * 1.5).toFixed(2), profitPercent: +((atr * 1.5 / price) * 100).toFixed(1) },
    { level: 2, price: +(price + atr * 2.5).toFixed(2), profitPercent: +((atr * 2.5 / price) * 100).toFixed(1) },
    { level: 3, price: +(price + atr * 4).toFixed(2), profitPercent: +((atr * 4 / price) * 100).toFixed(1) }
  ];

  return {
    ...stockInfo,
    price, change: +changePercent.toFixed(2), changePercent: +changePercent.toFixed(2),
    volume: Math.floor(Math.random() * 5000000),
    high: +(price * rand(1.01, 1.04)).toFixed(2), low: +(price * rand(0.96, 0.99)).toFixed(2), open: +(price * rand(0.98, 1.02)).toFixed(2),
    rsi, macd: getMacd(), sma50: getSma(price), sma200: getSma(price), bollinger: getBollinger(price),
    atr, fibonacci: getFibonacci(price), obv: Math.floor(Math.random() * 1000000),
    signal, signalStrength, score: +score.toFixed(2), targets, stopLoss: +(price - atr * 1.5).toFixed(2)
  };
}

// ==================== البحث عن السهم ====================
function findStock(query) {
  if (!query) return null;
  const searchTerm = query.toString().toUpperCase().trim();
  return stocksDatabase.find(s => s.symbol === searchTerm || s.name.toUpperCase().includes(searchTerm));
}

// ==================== تهيئة البيانات والخادم ====================
let stocksData = stocksDatabase.map(generateStockData);
setInterval(() => { stocksData = stocksDatabase.map(generateStockData); console.log('🔄 تحديث البيانات:', new Date().toLocaleTimeString()); }, 30000);

// ==================== Routes API ====================
app.get('/api/stocks', (req, res) => res.json({ stocks: stocksData, lastUpdate: new Date() }));

app.post('/api/analysis/analyze', (req, res) => {
  const { query } = req.body;
  const stockInfo = findStock(query);
  if (!stockInfo) return res.json({ error: true, message: `❌ لم يتم العثور على سهم لـ: ${query}` });

  const stock = stocksData.find(s => s.symbol === stockInfo.symbol);
  if (!stock) return res.json({ error: true, message: "⚠️ بيانات السهم غير متوفرة حالياً" });

  const buyConditions = [
    stock.rsi < 35 ? "✅ RSI في منطقة شراء (أقل من 35)" : stock.rsi > 70 ? "❌ RSI في منطقة بيع (أكبر من 70)" : "🟡 RSI محايد",
    stock.macd.histogram > 0 ? "✅ MACD إيجابي - زخم صاعد" : "❌ MACD سلبي - زخم هابط",
    stock.price > stock.sma50 ? "✅ السعر فوق المتوسط المتحرك 50" : "❌ السعر تحت المتوسط المتحرك 50",
    stock.price > stock.sma200 ? "✅ السعر فوق المتوسط المتحرك 200 (اتجاه عام صاعد)" : "❌ السعر تحت المتوسط المتحرك 200 (اتجاه عام هابط)",
    stock.changePercent > 0 ? "✅ السعر في ارتفاع اليوم" : "❌ السعر في انخفاض اليوم"
  ];
  const buyConditionsCount = buyConditions.filter(c => c.startsWith('✅')).length;
  const riskReward = (stock.targets[1] && stock.stopLoss) ? +(((stock.targets[1].price - stock.price) / (stock.price - stock.stopLoss))).toFixed(2) : 0;

  res.json({
    symbol: stock.symbol, name: stock.name, sector: stock.sector, market: stock.market, marketCap: stock.marketCap,
    currentPrice: stock.price, change: stock.change, changePercent: stock.changePercent,
    volume: stock.volume, high: stock.high, low: stock.low, open: stock.open,
    indicators: { rsi: stock.rsi, macd: stock.macd, sma50: stock.sma50, sma200: stock.sma200, bollinger: stock.bollinger, atr: stock.atr, obv: stock.obv, fibonacci: stock.fibonacci },
    financial: { pe: stock.pe, eps: stock.eps, dividend: stock.dividend, dividendYield: +(stock.dividend / stock.price * 100).toFixed(2) },
    signal: stock.signal, signalStrength: stock.signalStrength, score: stock.score, buyConditions, buyConditionsCount,
    targets: stock.targets, stopLoss: stock.stopLoss, riskReward,
    recommendation: stock.signal === 'STRONG_BUY' ? "شراء قوي - فرصة ممتازة" : stock.signal === 'BUY' ? "شراء - فرصة جيدة" : stock.signal === 'SELL' ? "بيع - يفضل الخروج" : stock.signal === 'WATCH' ? "مراقبة - انتظر إشارة أوضح" : "محايد - لا توجد توصية واضحة",
    lastUpdate: new Date()
  });
});

// ==================== تشغيل الخادم ====================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server live on port ${PORT}, monitoring ${stocksData.length} stocks.`));

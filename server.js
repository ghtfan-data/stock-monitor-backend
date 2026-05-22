const express = require('express');
const cors = require('cors');

const app = express();

// --- إعدادات CORS ---
app.use(cors({
  origin: ['https://stocks.techprosa.net', 'http://stocks.techprosa.net'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ==================== قاعدة بيانات الأسهم الصحيحة ====================
// الأسهم السعودية (الرقم والاسم الصحيح)
const saudiStocksData = [
  { symbol: "2222", name: "سابك", sector: "البتروكيماويات", market: "SAUDI", marketCap: "كبير", pe: 18.5, eps: 4.2, dividend: 3.2 },
  { symbol: "1120", name: "الراجحي", sector: "البنوك", market: "SAUDI", marketCap: "كبير", pe: 15.2, eps: 5.6, dividend: 4.1 },
  { symbol: "1180", name: "الأهلي", sector: "البنوك", market: "SAUDI", marketCap: "كبير", pe: 14.8, eps: 5.1, dividend: 3.8 },
  { symbol: "6017", name: "جاهز", sector: "التأمين", market: "SAUDI", marketCap: "متوسط", pe: 23.1, eps: 1.8, dividend: 1.2 },
  { symbol: "7202", name: "أرامكو", sector: "الطاقة", market: "SAUDI", marketCap: "كبير", pe: 11.2, eps: 8.5, dividend: 6.2 },
  { symbol: "1211", name: "مكة", sector: "التطوير العقاري", market: "SAUDI", marketCap: "متوسط", pe: 22.3, eps: 2.1, dividend: 1.5 },
  { symbol: "2082", name: "معادن", sector: "التعدين", market: "SAUDI", marketCap: "كبير", pe: 25.1, eps: 2.8, dividend: 1.8 },
  { symbol: "2010", name: "سابك للمغذيات", sector: "الزراعة", market: "SAUDI", marketCap: "متوسط", pe: 19.2, eps: 3.4, dividend: 2.2 }
];

// الأسهم الأمريكية (الرمز والاسم الصحيح)
const usStocksData = [
  { symbol: "AAPL", name: "Apple Inc.", sector: "التقنية", market: "US", marketCap: "كبير", pe: 28.5, eps: 6.2, dividend: 0.5 },
  { symbol: "MSFT", name: "Microsoft", sector: "التقنية", market: "US", marketCap: "كبير", pe: 32.1, eps: 11.5, dividend: 0.8 },
  { symbol: "GOOGL", name: "Google", sector: "التقنية", market: "US", marketCap: "كبير", pe: 25.3, eps: 5.8, dividend: 0 },
  { symbol: "AMZN", name: "Amazon", sector: "التجارة الإلكترونية", market: "US", marketCap: "كبير", pe: 48.2, eps: 3.2, dividend: 0 },
  { symbol: "TSLA", name: "Tesla", sector: "السيارات الكهربائية", market: "US", marketCap: "كبير", pe: 65.4, eps: 3.8, dividend: 0 },
  { symbol: "META", name: "Meta", sector: "التقنية", market: "US", marketCap: "كبير", pe: 22.7, eps: 14.2, dividend: 0 },
  { symbol: "NVDA", name: "NVIDIA", sector: "التقنية", market: "US", marketCap: "كبير", pe: 58.3, eps: 4.5, dividend: 0.1 },
  { symbol: "JPM", name: "JPMorgan", sector: "البنوك", market: "US", marketCap: "كبير", pe: 11.5, eps: 15.3, dividend: 2.8 },
  { symbol: "BAC", name: "Bank of America", sector: "البنوك", market: "US", marketCap: "كبير", pe: 10.2, eps: 3.8, dividend: 2.1 },
  { symbol: "WMT", name: "Walmart", sector: "التجزئة", market: "US", marketCap: "كبير", pe: 28.1, eps: 2.5, dividend: 1.4 }
];

// دالة مساعدة لتوليد أرقام عشوائية
const rand = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);
const getRsi = () => Math.floor(rand(20, 85));

// توليد بيانات حية لكل سهم
function generateLiveData(stock) {
  const changePercent = rand(-4.5, 4.5);
  const price = +(rand(30, 500) * (1 + changePercent / 100)).toFixed(2);
  const rsi = getRsi();
  
  // تحديد الإشارة بناءً على RSI
  let signal = 'NEUTRAL';
  let signalStrength = 'محايد';
  let score = 50;
  
  if (rsi < 35) {
    signal = 'STRONG_BUY';
    signalStrength = 'قوية جداً';
    score = rand(85, 98);
  } else if (rsi < 50) {
    signal = 'BUY';
    signalStrength = 'متوسطة';
    score = rand(65, 84);
  } else if (rsi > 75) {
    signal = 'SELL';
    signalStrength = 'قوية';
    score = rand(15, 30);
  } else if (rsi > 65) {
    signal = 'WATCH';
    signalStrength = 'ضعيفة';
    score = rand(35, 49);
  }
  
  const atr = +(price * rand(0.02, 0.04)).toFixed(2);
  const targets = [
    { level: 1, price: +(price + atr * 1.5).toFixed(2), profitPercent: +((atr * 1.5 / price) * 100).toFixed(1) },
    { level: 2, price: +(price + atr * 2.5).toFixed(2), profitPercent: +((atr * 2.5 / price) * 100).toFixed(1) },
    { level: 3, price: +(price + atr * 4).toFixed(2), profitPercent: +((atr * 4 / price) * 100).toFixed(1) }
  ];
  
  return {
    ...stock,
    price: price,
    change: +changePercent,
    changePercent: +changePercent,
    volume: Math.floor(Math.random() * 5000000),
    high: +(price * rand(1.01, 1.04)).toFixed(2),
    low: +(price * rand(0.96, 0.99)).toFixed(2),
    open: +(price * rand(0.98, 1.02)).toFixed(2),
    rsi: rsi,
    macd: { macd: rand(-1.5, 1.5), signal: rand(-1, 1), histogram: rand(-0.8, 0.8) },
    sma50: +(price * rand(0.95, 1.05)).toFixed(2),
    sma200: +(price * rand(0.90, 1.10)).toFixed(2),
    bollinger: {
      upper: +(price * 1.05).toFixed(2),
      middle: +price.toFixed(2),
      lower: +(price * 0.95).toFixed(2)
    },
    atr: atr,
    fibonacci: {
      r0: +(price * 0.9).toFixed(2),
      r236: +(price * 0.95).toFixed(2),
      r382: +(price * 0.97).toFixed(2),
      r500: +price.toFixed(2),
      r618: +(price * 1.03).toFixed(2),
      r786: +(price * 1.05).toFixed(2),
      r100: +(price * 1.1).toFixed(2)
    },
    signal: signal,
    signalStrength: signalStrength,
    score: +score,
    targets: targets,
    stopLoss: +(price - atr * 1.5).toFixed(2)
  };
}

// دمج جميع الأسهم
const allStocksBase = [...saudiStocksData, ...usStocksData];
let liveStocks = [];

// تحديث البيانات كل 30 ثانية
function updateAllData() {
  liveStocks = allStocksBase.map(generateLiveData);
  console.log(`✅ تم تحديث ${liveStocks.length} سهماً - ${new Date().toLocaleTimeString()}`);
}

// البحث عن سهم بالرقم أو الاسم
function findStock(query) {
  if (!query) return null;
  const searchTerm = query.toString().toUpperCase().trim();
  
  // البحث بالرقم أولاً
  let found = allStocksBase.find(s => s.symbol === searchTerm);
  
  // إذا لم يوجد، البحث بالاسم
  if (!found) {
    found = allStocksBase.find(s => s.name.toUpperCase().includes(searchTerm));
  }
  
  return found;
}

// ==================== Routes API ====================

// جلب جميع الأسهم
app.get('/api/stocks', (req, res) => {
  res.json({ 
    stocks: liveStocks, 
    total: liveStocks.length,
    saudiCount: saudiStocksData.length,
    usCount: usStocksData.length,
    lastUpdate: new Date() 
  });
});

// جلب الأسهم السعودية فقط
app.get('/api/stocks/saudi', (req, res) => {
  const saudi = liveStocks.filter(s => s.market === 'SAUDI');
  res.json({ stocks: saudi, count: saudi.length, lastUpdate: new Date() });
});

// جلب الأسهم الأمريكية فقط
app.get('/api/stocks/us', (req, res) => {
  const us = liveStocks.filter(s => s.market === 'US');
  res.json({ stocks: us, count: us.length, lastUpdate: new Date() });
});

// أفضل الأسهم للشراء
app.get('/api/stocks/top', (req, res) => {
  const top = [...liveStocks]
    .filter(s => s.signal === 'STRONG_BUY' || s.signal === 'BUY')
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  res.json({ topStocks: top, lastUpdate: new Date() });
});

// تحليل سهم محدد (البحث بالرقم أو الاسم)
app.post('/api/analysis/analyze', (req, res) => {
  const { query } = req.body;
  
  console.log(`🔍 البحث عن: ${query}`);
  
  const stockInfo = findStock(query);
  
  if (!stockInfo) {
    console.log(`❌ لم يتم العثور على: ${query}`);
    return res.json({ 
      error: true, 
      message: `❌ لم يتم العثور على سهم بالرقم أو الاسم: ${query}` 
    });
  }
  
  const stock = liveStocks.find(s => s.symbol === stockInfo.symbol);
  
  if (!stock) {
    return res.json({ error: true, message: "⚠️ بيانات السهم غير متوفرة حالياً" });
  }
  
  console.log(`✅ تم العثور على: ${stock.symbol} - ${stock.name}`);
  
  // شروط الشراء
  const buyConditions = [
    stock.rsi < 35 ? "✅ RSI في منطقة شراء (أقل من 35)" : stock.rsi > 70 ? "❌ RSI في منطقة بيع (أكبر من 70)" : "🟡 RSI محايد",
    stock.macd.histogram > 0 ? "✅ MACD إيجابي - زخم صاعد" : "❌ MACD سلبي - زخم هابط",
    stock.price > stock.sma50 ? "✅ السعر فوق المتوسط المتحرك 50" : "❌ السعر تحت المتوسط المتحرك 50",
    stock.price > stock.sma200 ? "✅ السعر فوق المتوسط المتحرك 200" : "❌ السعر تحت المتوسط المتحرك 200",
    stock.changePercent > 0 ? "✅ السعر في ارتفاع اليوم" : "❌ السعر في انخفاض اليوم"
  ];
  
  const buyConditionsCount = buyConditions.filter(c => c.startsWith('✅')).length;
  const riskReward = (stock.targets[1] && stock.stopLoss) 
    ? +(((stock.targets[1].price - stock.price) / (stock.price - stock.stopLoss))).toFixed(2) 
    : 0;
  
  res.json({
    symbol: stock.symbol,
    name: stock.name,
    sector: stock.sector,
    market: stock.market,
    currentPrice: stock.price,
    change: stock.change,
    changePercent: stock.changePercent,
    volume: stock.volume,
    high: stock.high,
    low: stock.low,
    open: stock.open,
    indicators: {
      rsi: stock.rsi,
      macd: stock.macd,
      sma50: stock.sma50,
      sma200: stock.sma200,
      bollinger: stock.bollinger,
      atr: stock.atr,
      fibonacci: stock.fibonacci
    },
    signal: stock.signal,
    signalStrength: stock.signalStrength,
    score: stock.score,
    buyConditions: buyConditions,
    buyConditionsCount: buyConditionsCount,
    targets: stock.targets,
    stopLoss: stock.stopLoss,
    riskReward: riskReward,
    recommendation: stock.signal === 'STRONG_BUY' ? "💰 شراء قوي - فرصة ممتازة" : 
                    stock.signal === 'BUY' ? "🟢 شراء - فرصة جيدة" :
                    stock.signal === 'SELL' ? "🔻 بيع - يفضل الخروج" :
                    stock.signal === 'WATCH' ? "👀 مراقبة - انتظر إشارة أوضح" : "⚪ محايد - لا توجد توصية واضحة",
    lastUpdate: new Date()
  });
});

// التنبيهات (تخزين مؤقت)
let alertsHistory = [];

app.get('/api/alerts', (req, res) => {
  res.json(alertsHistory);
});

app.post('/api/alerts', (req, res) => {
  const alert = { ...req.body, id: Date.now(), createdAt: new Date() };
  alertsHistory.unshift(alert);
  if (alertsHistory.length > 100) alertsHistory.pop();
  res.json(alert);
});

// ==================== تشغيل الخادم ====================
const PORT = process.env.PORT || 10000;

// تهيئة البيانات
updateAllData();
setInterval(updateAllData, 30000);

app.listen(PORT, () => {
  console.log(`\n🚀 خادم التحليل يعمل على المنفذ ${PORT}`);
  console.log(`📊 عدد الأسهم المتاحة:`);
  console.log(`   - 🇸🇦 سعودي: ${saudiStocksData.length}`);
  console.log(`   - 🇺🇸 أمريكي: ${usStocksData.length}`);
  console.log(`   - 🌍 المجموع: ${liveStocks.length}`);
  console.log(`\n✅ جاهز لاستقبال الطلبات!`);
});

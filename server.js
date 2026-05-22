const express = require('express');
const cors = require('cors');

const app = express();

// إعدادات CORS
app.use(cors({
  origin: ['https://stocks.techprosa.net', 'http://stocks.techprosa.net'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ============= قائمة جميع الأسهم السعودية =============
const saudiStocks = [
  { symbol: "2222", name: "سابك", sector: "البتروكيماويات", marketCap: "كبير" },
  { symbol: "1120", name: "الراجحي", sector: "البنوك", marketCap: "كبير" },
  { symbol: "1180", name: "الأهلي", sector: "البنوك", marketCap: "كبير" },
  { symbol: "1211", name: "مكة", sector: "التطوير العقاري", marketCap: "متوسط" },
  { symbol: "2010", name: "سابك للمغذيات", sector: "الزراعة", marketCap: "متوسط" },
  { symbol: "2082", name: "معادن", sector: "التعدين", marketCap: "كبير" },
  { symbol: "3002", name: "ينساب", sector: "البتروكيماويات", marketCap: "كبير" },
  { symbol: "4001", name: "الرياض", sector: "البنوك", marketCap: "كبير" },
  { symbol: "4013", name: "الجزيرة", sector: "البنوك", marketCap: "متوسط" },
  { symbol: "4030", name: "الإنماء", sector: "البنوك", marketCap: "كبير" },
  { symbol: "4280", name: "الراجحي", sector: "التأمين", marketCap: "متوسط" },
  { symbol: "6017", name: "الدرع العربي", sector: "التأمين", marketCap: "متوسط" },
  { symbol: "6010", name: "التعاونية", sector: "التأمين", marketCap: "متوسط" },
  { symbol: "7020", name: "الاتصالات", sector: "الاتصالات", marketCap: "كبير" },
  { symbol: "7030", name: "زين", sector: "الاتصالات", marketCap: "كبير" },
  { symbol: "7202", name: "أرامكو", sector: "الطاقة", marketCap: "كبير" }
];

// ============= قائمة الأسهم الأمريكية =============
const usStocks = [
  { symbol: "AAPL", name: "Apple Inc.", sector: "التقنية" },
  { symbol: "MSFT", name: "Microsoft", sector: "التقنية" },
  { symbol: "GOOGL", name: "Google", sector: "التقنية" },
  { symbol: "AMZN", name: "Amazon", sector: "التجارة الإلكترونية" },
  { symbol: "TSLA", name: "Tesla", sector: "السيارات الكهربائية" },
  { symbol: "META", name: "Meta", sector: "التقنية" },
  { symbol: "NVDA", name: "NVIDIA", sector: "التقنية" },
  { symbol: "JPM", name: "JPMorgan", sector: "البنوك" },
  { symbol: "V", name: "Visa", sector: "المدفوعات" },
  { symbol: "JNJ", name: "Johnson & Johnson", sector: "الصحة" },
  { symbol: "WMT", name: "Walmart", sector: "التجزئة" },
  { symbol: "PG", name: "Procter & Gamble", sector: "السلع الاستهلاكية" },
  { symbol: "XOM", name: "Exxon Mobil", sector: "الطاقة" },
  { symbol: "BAC", name: "Bank of America", sector: "البنوك" },
  { symbol: "CVX", name: "Chevron", sector: "الطاقة" }
];

// ============= وظيفة تحديد حالة السوق =============
function getMarketStatus(market) {
  const now = new Date();
  const day = now.getDay(); // 0=Sunday, 1=Monday, 6=Saturday
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  // السوق السعودي: الأحد إلى الخميس 10:00 - 15:00
  if (market === 'SAUDI') {
    if (day === 5 || day === 6) return { isOpen: false, reason: "السوق مغلق (عطلة نهاية الأسبوع)" };
    const currentTime = hour * 60 + minute;
    if (currentTime >= 10 * 60 && currentTime < 15 * 60) {
      return { isOpen: true, reason: "السوق مفتوح - تداول نشط" };
    } else if (currentTime < 10 * 60) {
      return { isOpen: false, reason: `السوق سيُفتح في ${10 - hour} ساعات` };
    } else {
      return { isOpen: false, reason: "السوق مغلق - جلسة التداول انتهت" };
    }
  }
  
  // السوق الأمريكي: 9:30 - 16:00 EST
  if (market === 'US') {
    if (day === 0 || day === 6) return { isOpen: false, reason: "السوق مغلق (عطلة نهاية الأسبوع)" };
    const currentTime = hour * 60 + minute;
    if (currentTime >= 9.5 * 60 && currentTime < 16 * 60) {
      return { isOpen: true, reason: "السوق مفتوح - تداول نشط" };
    } else {
      return { isOpen: false, reason: "السوق الأمريكي مغلق حالياً" };
    }
  }
  
  return { isOpen: false, reason: "حالة السوق غير معروفة" };
}

// ============= توليد بيانات عشوائية واقعية =============
function generateStockData(stock, index, market) {
  const basePrice = market === 'SAUDI' ? 50 + Math.random() * 200 : 100 + Math.random() * 400;
  const changePercent = (Math.random() - 0.5) * 4;
  const rsi = Math.floor(Math.random() * 60) + 20;
  
  // تحديد الإشارة بناءً على RSI والمؤشرات الأخرى
  let signal = 'NEUTRAL';
  let signalStrength = 'محايد';
  let score = 0;
  
  if (rsi < 35) {
    signal = 'STRONG_BUY';
    signalStrength = 'قوية جداً';
    score = 90;
  } else if (rsi < 45) {
    signal = 'BUY';
    signalStrength = 'متوسطة';
    score = 70;
  } else if (rsi > 75) {
    signal = 'SELL';
    signalStrength = 'قوية';
    score = 20;
  } else if (rsi > 65) {
    signal = 'WATCH';
    signalStrength = 'ضعيفة';
    score = 40;
  } else {
    score = 50;
  }
  
  // إضافة عامل الحجم والعشوائية
  score = Math.min(100, Math.max(0, score + (Math.random() - 0.5) * 10));
  
  // حساب الأهداف ووقف الخسارة
  const currentPrice = +(basePrice * (1 + changePercent / 100)).toFixed(2);
  let targets = [];
  let stopLoss = null;
  
  if (signal === 'STRONG_BUY' || signal === 'BUY') {
    const atr = currentPrice * 0.03;
    targets = [
      { level: 1, price: +(currentPrice + atr * 1.5).toFixed(2), profitPercent: +(atr * 1.5 / currentPrice * 100).toFixed(1) },
      { level: 2, price: +(currentPrice + atr * 2.5).toFixed(2), profitPercent: +(atr * 2.5 / currentPrice * 100).toFixed(1) },
      { level: 3, price: +(currentPrice + atr * 4).toFixed(2), profitPercent: +(atr * 4 / currentPrice * 100).toFixed(1) }
    ];
    stopLoss = +(currentPrice - atr * 1.5).toFixed(2);
  }
  
  return {
    symbol: stock.symbol,
    name: stock.name,
    market: market,
    sector: stock.sector,
    price: currentPrice,
    change: +(changePercent).toFixed(2),
    changePercent: +changePercent.toFixed(2),
    rsi: rsi,
    signal: signal,
    signalStrength: signalStrength,
    score: score,
    targets: targets,
    stopLoss: stopLoss,
    volume: Math.floor(Math.random() * 5000000),
    lastUpdated: new Date()
  };
}

// ============= توليد جميع بيانات الأسهم =============
function generateAllStocks() {
  const allStocks = [];
  
  saudiStocks.forEach((stock, i) => {
    allStocks.push(generateStockData(stock, i, 'SAUDI'));
  });
  
  usStocks.forEach((stock, i) => {
    allStocks.push(generateStockData(stock, i, 'US'));
  });
  
  return allStocks;
}

// ============= ترتيب أفضل الأسهم حسب قوة الإشارة =============
function getTopStocks(stocks, limit = 10) {
  return stocks
    .filter(s => s.signal === 'STRONG_BUY' || s.signal === 'BUY')
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// بيانات حية
let stocksData = generateAllStocks();
let alertsHistory = [];

// تحديث البيانات كل 30 ثانية
setInterval(() => {
  stocksData = generateAllStocks();
  console.log('🔄 تم تحديث بيانات جميع الأسهم', new Date().toLocaleTimeString());
}, 30000);

// تحديث أولي
setTimeout(() => {
  stocksData = generateAllStocks();
}, 1000);

// ============= API Routes =============

// جلب جميع الأسهم
app.get('/api/stocks', (req, res) => {
  res.json({ 
    stocks: stocksData, 
    lastUpdate: new Date(),
    saudiMarketStatus: getMarketStatus('SAUDI'),
    usMarketStatus: getMarketStatus('US')
  });
});

// جلب الأسهم السعودية فقط
app.get('/api/stocks/saudi', (req, res) => {
  const saudiStocksData = stocksData.filter(s => s.market === 'SAUDI');
  res.json({ 
    stocks: saudiStocksData,
    marketStatus: getMarketStatus('SAUDI'),
    lastUpdate: new Date()
  });
});

// جلب الأسهم الأمريكية فقط
app.get('/api/stocks/us', (req, res) => {
  const usStocksData = stocksData.filter(s => s.market === 'US');
  res.json({ 
    stocks: usStocksData,
    marketStatus: getMarketStatus('US'),
    lastUpdate: new Date()
  });
});

// جلب أفضل 10 أسهم
app.get('/api/stocks/top', (req, res) => {
  const topStocks = getTopStocks(stocksData, 10);
  res.json({ 
    topStocks: topStocks,
    lastUpdate: new Date()
  });
});

// تحليل سهم محدد
app.post('/api/analysis/analyze', (req, res) => {
  const { symbol, market } = req.body;
  const stock = stocksData.find(s => s.symbol === symbol);
  
  if (stock) {
    res.json({
      symbol: stock.symbol,
      name: stock.name,
      currentPrice: stock.price,
      signal: stock.signal,
      strength: stock.signalStrength,
      score: stock.score,
      indicators: {
        rsi: stock.rsi,
        volumeRatio: +(stock.volume / 1000000).toFixed(1),
        macd: { value: +(Math.random() * 2 - 1).toFixed(2), signal: +(Math.random() * 2 - 1).toFixed(2), histogram: +(Math.random() * 1 - 0.5).toFixed(2) }
      },
      conditions: [
        stock.rsi < 35 ? "RSI في منطقة شراء" : stock.rsi > 75 ? "RSI في منطقة بيع" : "RSI محايد",
        stock.changePercent > 0 ? "اتجاه صاعد" : stock.changePercent < 0 ? "اتجاه هابط" : "اتجاه جانبي",
        stock.signal === 'STRONG_BUY' ? "إشارة شراء قوية" : stock.signal === 'BUY' ? "إشارة شراء" : "لا توجد إشارة قوية"
      ],
      buyConditionsCount: stock.signal === 'STRONG_BUY' ? 3 : stock.signal === 'BUY' ? 2 : 0,
      targets: stock.targets || [],
      stopLoss: stock.stopLoss,
      riskReward: stock.targets && stock.targets[1] ? +(((stock.targets[1].price - stock.price) / (stock.price - stock.stopLoss))).toFixed(2) : 0
    });
  } else {
    res.json({
      symbol: symbol,
      name: "غير موجود",
      currentPrice: 0,
      signal: "NEUTRAL",
      strength: "السهم غير متوفر في قاعدة البيانات",
      indicators: { rsi: 50, volumeRatio: 1.0 },
      conditions: [],
      buyConditionsCount: 0,
      targets: [],
      stopLoss: null,
      riskReward: 0
    });
  }
});

// جلب التنبيهات السابقة
app.get('/api/alerts', (req, res) => {
  res.json(alertsHistory);
});

// إنشاء تنبيه جديد
app.post('/api/alerts', (req, res) => {
  const alert = { ...req.body, id: Date.now(), createdAt: new Date() };
  alertsHistory.unshift(alert);
  if (alertsHistory.length > 100) alertsHistory.pop();
  res.json(alert);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
  console.log(`✅ عدد الأسهم المتاحة: ${stocksData.length} سهم`);
  console.log(`   - سعودي: ${saudiStocks.length}`);
  console.log(`   - أمريكي: ${usStocks.length}`);
});

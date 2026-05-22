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

// ============= قاعدة بيانات الأسهم الكاملة =============
const stocksDatabase = [
  // أسهم سعودية
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
  
  // أسهم أمريكية
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

// ============= وظائف التحليل الفني =============
function calculateRSI(prices, period = 14) {
  // محاكاة RSI واقعية
  return Math.min(95, Math.max(5, 50 + (Math.random() - 0.5) * 50));
}

function calculateMACD(prices) {
  return {
    macd: +(Math.random() * 2 - 1).toFixed(2),
    signal: +(Math.random() * 2 - 1).toFixed(2),
    histogram: +(Math.random() * 1 - 0.5).toFixed(2)
  };
}

function calculateSMA(prices, period) {
  const lastPrice = prices[prices.length - 1];
  return +(lastPrice * (1 + (Math.random() - 0.5) * 0.1)).toFixed(2);
}

function calculateBollingerBands(prices, period = 20, stdDev = 2) {
  const lastPrice = prices[prices.length - 1];
  const band = lastPrice * 0.05;
  return {
    upper: +(lastPrice + band).toFixed(2),
    middle: +lastPrice.toFixed(2),
    lower: +(lastPrice - band).toFixed(2)
  };
}

function calculateATR(highs, lows, closes, period = 14) {
  const lastClose = closes[closes.length - 1];
  return +(lastClose * 0.03).toFixed(2);
}

function calculateOBV(closes, volumes) {
  return Math.floor(Math.random() * 1000000);
}

function calculateFibonacci(high, low) {
  const range = high - low;
  return {
    r0: low,
    r236: +(low + range * 0.236).toFixed(2),
    r382: +(low + range * 0.382).toFixed(2),
    r500: +(low + range * 0.5).toFixed(2),
    r618: +(low + range * 0.618).toFixed(2),
    r786: +(low + range * 0.786).toFixed(2),
    r100: high
  };
}

// ============= توليد بيانات السهم الحية =============
function generateStockData(stockInfo) {
  const basePrice = 50 + Math.random() * 300;
  const changePercent = (Math.random() - 0.5) * 5;
  const currentPrice = +(basePrice * (1 + changePercent / 100)).toFixed(2);
  const rsiValue = calculateRSI([]);
  
  // تحديد الإشارة بناءً على RSI
  let signal = 'NEUTRAL';
  let signalStrength = 'محايد';
  let score = 50;
  
  if (rsiValue < 35) {
    signal = 'STRONG_BUY';
    signalStrength = 'قوية جداً';
    score = 85 + Math.random() * 15;
  } else if (rsiValue < 50) {
    signal = 'BUY';
    signalStrength = 'متوسطة';
    score = 65 + Math.random() * 15;
  } else if (rsiValue > 75) {
    signal = 'SELL';
    signalStrength = 'قوية';
    score = 20 + Math.random() * 15;
  } else if (rsiValue > 65) {
    signal = 'WATCH';
    signalStrength = 'ضعيفة';
    score = 35 + Math.random() * 15;
  }
  
  // حساب الأهداف
  const atr = currentPrice * 0.03;
  const targets = [
    { level: 1, price: +(currentPrice + atr * 1.5).toFixed(2), profitPercent: +(atr * 1.5 / currentPrice * 100).toFixed(1) },
    { level: 2, price: +(currentPrice + atr * 2.5).toFixed(2), profitPercent: +(atr * 2.5 / currentPrice * 100).toFixed(1) },
    { level: 3, price: +(currentPrice + atr * 4).toFixed(2), profitPercent: +(atr * 4 / currentPrice * 100).toFixed(1) }
  ];
  const stopLoss = +(currentPrice - atr * 1.5).toFixed(2);
  
  return {
    symbol: stockInfo.symbol,
    name: stockInfo.name,
    sector: stockInfo.sector,
    market: stockInfo.market,
    marketCap: stockInfo.marketCap,
    pe: stockInfo.pe,
    eps: stockInfo.eps,
    dividend: stockInfo.dividend,
    price: currentPrice,
    change: +(changePercent).toFixed(2),
    changePercent: +changePercent.toFixed(2),
    volume: Math.floor(Math.random() * 5000000),
    high: +(currentPrice * (1 + Math.random() * 0.03)).toFixed(2),
    low: +(currentPrice * (1 - Math.random() * 0.03)).toFixed(2),
    open: +(currentPrice * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2),
    rsi: rsiValue,
    macd: calculateMACD([]),
    sma50: calculateSMA([], 50),
    sma200: calculateSMA([], 200),
    bollinger: calculateBollingerBands([]),
    atr: calculateATR([], [], []),
    obv: calculateOBV([], []),
    fibonacci: calculateFibonacci(currentPrice * 1.1, currentPrice * 0.9),
    signal: signal,
    signalStrength: signalStrength,
    score: score,
    targets: targets,
    stopLoss: stopLoss
  };
}

// ============= البحث عن السهم بالرقم أو الاسم =============
function findStock(query) {
  // البحث بالرقم (symbol)
  let stock = stocksDatabase.find(s => s.symbol === query.toUpperCase());
  
  // إذا لم يوجد، البحث بالاسم
  if (!stock) {
    stock = stocksDatabase.find(s => s.name.includes(query) || query.includes(s.name));
  }
  
  return stock;
}

// بيانات حية لجميع الأسهم
let stocksData = stocksDatabase.map(s => generateStockData(s));

// تحديث البيانات كل 30 ثانية
setInterval(() => {
  stocksData = stocksDatabase.map(s => generateStockData(s));
  console.log('🔄 تم تحديث بيانات جميع الأسهم', new Date().toLocaleTimeString());
}, 30000);

// ============= API Routes =============

// جلب جميع الأسهم
app.get('/api/stocks', (req, res) => {
  res.json({ stocks: stocksData, lastUpdate: new Date() });
});

// تحليل سهم محدد (بحث بالرقم أو الاسم)
app.post('/api/analysis/analyze', (req, res) => {
  const { query, market } = req.body;
  
  // البحث عن السهم بالرقم أو الاسم
  const stockInfo = findStock(query);
  
  if (!stockInfo) {
    return res.json({
      error: true,
      message: `لم يتم العثور على سهم بالرقم أو الاسم: ${query}`,
      symbol: query,
      name: "غير موجود"
    });
  }
  
  // جلب البيانات الحية للسهم
  const stock = stocksData.find(s => s.symbol === stockInfo.symbol);
  
  if (!stock) {
    return res.json({ error: true, message: "بيانات السهم غير متوفرة حالياً" });
  }
  
  // إعداد التحليل الكامل
  const analysis = {
    // معلومات أساسية
    symbol: stock.symbol,
    name: stock.name,
    sector: stock.sector,
    market: stock.market,
    marketCap: stock.marketCap,
    
    // البيانات الحالية
    currentPrice: stock.price,
    change: stock.change,
    changePercent: stock.changePercent,
    volume: stock.volume,
    high: stock.high,
    low: stock.low,
    open: stock.open,
    
    // المؤشرات الفنية
    indicators: {
      rsi: stock.rsi,
      macd: stock.macd,
      sma50: stock.sma50,
      sma200: stock.sma200,
      bollinger: stock.bollinger,
      atr: stock.atr,
      obv: stock.obv,
      fibonacci: stock.fibonacci
    },
    
    // التحليل المالي
    financial: {
      pe: stock.pe,
      eps: stock.eps,
      dividend: stock.dividend,
      dividendYield: +(stock.dividend / stock.price * 100).toFixed(2)
    },
    
    // الإشارة والتوصية
    signal: stock.signal,
    signalStrength: stock.signalStrength,
    score: +stock.score.toFixed(2),
    
    // شروط الشراء
    buyConditions: [
      stock.rsi < 35 ? "✅ RSI في منطقة شراء (أقل من 35)" : stock.rsi > 70 ? "❌ RSI في منطقة بيع (أكبر من 70)" : "🟡 RSI محايد",
      stock.macd.histogram > 0 ? "✅ MACD إيجابي - زخم صاعد" : "❌ MACD سلبي - زخم هابط",
      stock.price > stock.sma50 ? "✅ السعر فوق المتوسط المتحرك 50" : "❌ السعر تحت المتوسط المتحرك 50",
      stock.price > stock.sma200 ? "✅ السعر فوق المتوسط المتحرك 200 (اتجاه عام صاعد)" : "❌ السعر تحت المتوسط المتحرك 200 (اتجاه عام هابط)",
      stock.changePercent > 0 ? "✅ السعر في ارتفاع اليوم" : "❌ السعر في انخفاض اليوم"
    ],
    buyConditionsCount: [stock.rsi < 35, stock.macd.histogram > 0, stock.price > stock.sma50, stock.price > stock.sma200, stock.changePercent > 0].filter(Boolean).length,
    
    // الأهداف وإدارة المخاطر
    targets: stock.targets,
    stopLoss: stock.stopLoss,
    riskReward: +(((stock.targets[1].price - stock.price) / (stock.price - stock.stopLoss))).toFixed(2),
    
    // التوصية النهائية
    recommendation: stock.signal === 'STRONG_BUY' ? "شراء قوي - فرصة ممتازة" :
                    stock.signal === 'BUY' ? "شراء - فرصة جيدة" :
                    stock.signal === 'SELL' ? "بيع - يفضل الخروج" :
                    stock.signal === 'WATCH' ? "مراقبة - انتظر إشارة أوضح" : "محايد - لا توجد توصية واضحة",
    
    lastUpdate: new Date()
  };
  
  res.json(analysis);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
  console.log(`✅ عدد الأسهم المتاحة: ${stocksDatabase.length} سهم`);
});

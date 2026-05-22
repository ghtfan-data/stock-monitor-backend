const express = require('express');
const cors = require('cors');

const app = express();

// إعدادات CORS للسماح لموقعك بالاتصال
app.use(cors({
  origin: ['https://stocks.techprosa.net', 'http://stocks.techprosa.net'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// بيانات تجريبية للأسهم
let stocks = [
  { symbol: "2222", name: "سابك", market: "SAUDI", price: 82.50, change: 1.20, changePercent: 1.48, rsi: 45, signal: "NEUTRAL", signalStrength: "محايد", isMonitored: true },
  { symbol: "1120", name: "الراجحي", market: "SAUDI", price: 85.30, change: 0.50, changePercent: 0.59, rsi: 32, signal: "STRONG_BUY", signalStrength: "قوية جداً", isMonitored: true },
  { symbol: "AAPL", name: "Apple", market: "US", price: 175.34, change: 2.10, changePercent: 1.21, rsi: 38, signal: "BUY", signalStrength: "متوسطة", isMonitored: true },
  { symbol: "MSFT", name: "Microsoft", market: "US", price: 380.20, change: -1.50, changePercent: -0.39, rsi: 55, signal: "NEUTRAL", signalStrength: "محايد", isMonitored: true },
  { symbol: "TSLA", name: "Tesla", market: "US", price: 245.60, change: 5.20, changePercent: 2.16, rsi: 28, signal: "STRONG_BUY", signalStrength: "قوية جداً", isMonitored: true },
  { symbol: "AMZN", name: "Amazon", market: "US", price: 145.80, change: 1.30, changePercent: 0.90, rsi: 48, signal: "NEUTRAL", signalStrength: "محايد", isMonitored: true }
];

let alerts = [];

// ============= API Routes =============

// جلب جميع الأسهم
app.get('/api/stocks', (req, res) => {
  res.json({ stocks, lastUpdate: new Date() });
});

// جلب الأسهم المراقبة والإشارات النشطة
app.get('/api/stocks/monitored', (req, res) => {
  const monitored = stocks.filter(s => s.isMonitored);
  const activeSignals = alerts.filter(a => a.status === 'PENDING');
  res.json({ stocks: monitored, signals: activeSignals, lastUpdate: new Date() });
});

// تحليل سهم محدد
app.post('/api/analysis/analyze', (req, res) => {
  const { symbol, market } = req.body;
  const stock = stocks.find(s => s.symbol === symbol);
  
  if (stock) {
    // حساب الأهداف ووقف الخسارة بناءً على السعر
    const currentPrice = stock.price;
    const atr = currentPrice * 0.03; // 3% ATR تقريبي
    
    const targets = [];
    if (stock.signal === 'STRONG_BUY' || stock.signal === 'BUY') {
      targets.push(
        { level: 1, price: +(currentPrice * 1.05).toFixed(2), profitPercent: 5 },
        { level: 2, price: +(currentPrice * 1.10).toFixed(2), profitPercent: 10 },
        { level: 3, price: +(currentPrice * 1.15).toFixed(2), profitPercent: 15 }
      );
    }
    
    const stopLoss = (stock.signal === 'STRONG_BUY' || stock.signal === 'BUY') 
      ? +(currentPrice * 0.95).toFixed(2) 
      : null;
    
    // شروط الشراء المحققة
    let conditions = [];
    let buyConditionsCount = 0;
    
    if (stock.rsi < 35) {
      conditions.push('RSI في منطقة شراء');
      buyConditionsCount++;
    }
    if (stock.changePercent > 0.5) {
      conditions.push('السعر في اتجاه صاعد');
      buyConditionsCount++;
    }
    if (stock.signal === 'STRONG_BUY') {
      conditions.push('إشارة شراء قوية');
      buyConditionsCount += 2;
    } else if (stock.signal === 'BUY') {
      conditions.push('إشارة شراء');
      buyConditionsCount++;
    }
    
    res.json({
      symbol: stock.symbol,
      currentPrice: currentPrice,
      signal: stock.signal,
      strength: stock.signalStrength,
      indicators: {
        rsi: stock.rsi,
        volumeRatio: 1.5,
        macd: { value: 0.5, signal: 0.3, histogram: 0.2 }
      },
      conditions: conditions,
      buyConditionsCount: buyConditionsCount,
      targets: targets,
      stopLoss: stopLoss,
      riskReward: targets.length > 0 && stopLoss ? +(((targets[1].price - currentPrice) / (currentPrice - stopLoss))).toFixed(2) : 0
    });
  } else {
    res.json({
      symbol: symbol,
      currentPrice: 100,
      signal: "NEUTRAL",
      strength: "لا توجد إشارة",
      indicators: { rsi: 50, volumeRatio: 1.0, macd: { value: 0, signal: 0, histogram: 0 } },
      conditions: [],
      buyConditionsCount: 0,
      targets: [],
      stopLoss: null,
      riskReward: 0
    });
  }
});

// جلب التنبيهات
app.get('/api/alerts', (req, res) => {
  res.json(alerts);
});

// إنشاء تنبيه جديد (للاستخدام الداخلي)
app.post('/api/alerts', (req, res) => {
  const { symbol, price, indicators, targets, stopLoss, signalStrength } = req.body;
  const newAlert = {
    id: Date.now(),
    symbol: symbol,
    price: price,
    indicators: indicators,
    targets: targets,
    stopLoss: stopLoss,
    signalStrength: signalStrength,
    createdAt: new Date(),
    status: 'PENDING'
  };
  alerts.unshift(newAlert);
  if (alerts.length > 50) alerts.pop();
  res.json(newAlert);
});

// تحديث بيانات الأسهم (محاكاة)
function updateStockPrices() {
  stocks = stocks.map(stock => ({
    ...stock,
    price: +(stock.price * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2),
    change: +((Math.random() - 0.5) * 3).toFixed(2),
    changePercent: +((Math.random() - 0.5) * 2).toFixed(2),
    rsi: Math.floor(Math.random() * 60) + 20,
    signal: Math.random() > 0.8 ? 'STRONG_BUY' : Math.random() > 0.6 ? 'BUY' : 'NEUTRAL',
    signalStrength: Math.random() > 0.8 ? 'قوية جداً' : Math.random() > 0.6 ? 'متوسطة' : 'محايد'
  }));
  
  // إنشاء تنبيهات جديدة للإشارات القوية
  stocks.forEach(stock => {
    if ((stock.signal === 'STRONG_BUY' || stock.signal === 'BUY') && !alerts.find(a => a.symbol === stock.symbol && a.status === 'PENDING')) {
      const atr = stock.price * 0.03;
      alerts.unshift({
        id: Date.now(),
        symbol: stock.symbol,
        price: stock.price,
        indicators: { rsi: stock.rsi },
        targets: [
          { level: 1, price: +(stock.price * 1.05).toFixed(2), profitPercent: 5 },
          { level: 2, price: +(stock.price * 1.10).toFixed(2), profitPercent: 10 },
          { level: 3, price: +(stock.price * 1.15).toFixed(2), profitPercent: 15 }
        ],
        stopLoss: +(stock.price * 0.95).toFixed(2),
        signalStrength: stock.signalStrength,
        createdAt: new Date(),
        status: 'PENDING'
      });
    }
  });
  
  if (alerts.length > 50) alerts = alerts.slice(0, 50);
  console.log('🔄 تم تحديث بيانات الأسهم', new Date().toLocaleTimeString());
}

// تحديث الأسعار كل 5 دقائق
setInterval(updateStockPrices, 5 * 60 * 1000);

// تحديث أولي عند بدء التشغيل
updateStockPrices();

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
  console.log(`✅ CORS مفعل لـ: https://stocks.techprosa.net`);
});

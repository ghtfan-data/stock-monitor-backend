const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

// بيانات مؤقتة (بدون قاعدة بيانات حالياً)
let stocks = [];
let alerts = [];

// ============= Routes =============

// جلب جميع الأسهم
app.get('/api/stocks', (req, res) => {
  res.json({ stocks, lastUpdate: new Date() });
});

// جلب الأسهم المراقبة فقط
app.get('/api/stocks/monitored', (req, res) => {
  const monitored = stocks.filter(s => s.isMonitored);
  const activeSignals = alerts.filter(a => a.status === 'PENDING');
  res.json({ stocks: monitored, signals: activeSignals });
});

// تحليل سهم محدد
app.post('/api/analysis/analyze', async (req, res) => {
  const { symbol, market } = req.body;
  
  // بيانات تجريبية للاختبار
  const mockAnalysis = {
    symbol: symbol,
    currentPrice: market === 'SAUDI' ? 125.50 : 175.34,
    signal: 'STRONG_BUY',
    strength: 'قوية جداً',
    indicators: {
      rsi: 32.5,
      macd: { value: 1.2, signal: 0.8, histogram: 0.4 },
      sma50: 120.30,
      sma200: 115.20,
      volumeRatio: 1.8,
      atr: 3.50
    },
    conditions: ['RSI في منطقة شراء', 'MACD إيجابي', 'حجم تداول مرتفع'],
    buyConditionsCount: 3,
    targets: [
      { level: 1, price: 132.50, profitPercent: 5.6 },
      { level: 2, price: 140.00, profitPercent: 11.6 },
      { level: 3, price: 150.00, profitPercent: 19.6 }
    ],
    stopLoss: 118.50,
    riskReward: 2.5
  };
  
  res.json(mockAnalysis);
});

// جلب التنبيهات
app.get('/api/alerts', (req, res) => {
  res.json(alerts);
});

// ============= WebSocket =============
io.on('connection', (socket) => {
  console.log('✅ مستخدم متصل');
  socket.on('subscribe', (symbols) => {
    symbols.forEach(s => socket.join(s));
  });
});

// ============= المسح التلقائي =============
async function scanMarket() {
  console.log('🔍 جاري مسح السوق...', new Date().toLocaleTimeString());
  
  const symbolsToScan = [
    { symbol: '2222', name: 'سابك', market: 'SAUDI' },
    { symbol: '1120', name: 'الراجحي', market: 'SAUDI' },
    { symbol: 'AAPL', name: 'Apple', market: 'US' },
    { symbol: 'MSFT', name: 'Microsoft', market: 'US' }
  ];
  
  for (const item of symbolsToScan) {
    const stockInfo = {
      symbol: item.symbol,
      name: item.name,
      market: item.market,
      price: item.symbol === 'AAPL' ? 175.50 : item.symbol === 'MSFT' ? 380.20 : Math.random() * 100 + 50,
      change: (Math.random() * 4 - 2).toFixed(2),
      changePercent: (Math.random() * 3 - 1.5).toFixed(2),
      volume: Math.floor(Math.random() * 5000000),
      indicators: {
        rsi: Math.floor(Math.random() * 60) + 20,
        volumeRatio: (Math.random() * 2 + 0.5).toFixed(1)
      },
      signal: Math.random() > 0.8 ? 'STRONG_BUY' : 'NEUTRAL',
      signalStrength: Math.random() > 0.8 ? 'قوية جداً' : 'محايد',
      lastUpdated: new Date()
    };
    
    const existingStock = stocks.find(s => s.symbol === item.symbol);
    if (existingStock) {
      Object.assign(existingStock, stockInfo);
    } else {
      stocks.push(stockInfo);
    }
    
    // إذا كانت إشارة شراء قوية، أنشئ تنبيه
    if (stockInfo.signal === 'STRONG_BUY' && !alerts.find(a => a.symbol === item.symbol && a.status === 'PENDING')) {
      const newAlert = {
        id: Date.now(),
        symbol: item.symbol,
        name: item.name,
        type: 'BUY',
        price: stockInfo.price,
        indicators: stockInfo.indicators,
        targets: [
          { level: 1, price: (stockInfo.price * 1.05).toFixed(2), profitPercent: 5 },
          { level: 2, price: (stockInfo.price * 1.10).toFixed(2), profitPercent: 10 },
          { level: 3, price: (stockInfo.price * 1.15).toFixed(2), profitPercent: 15 }
        ],
        stopLoss: (stockInfo.price * 0.95).toFixed(2),
        signalStrength: stockInfo.signalStrength,
        createdAt: new Date(),
        status: 'PENDING'
      };
      alerts.unshift(newAlert);
      if (alerts.length > 50) alerts.pop();
      
      // إرسال تنبيه عبر WebSocket
      io.emit('new-signal', newAlert);
    }
  }
  
  console.log(`✅ اكتمل المسح. عدد الأسهم: ${stocks.length}`);
}

// تشغيل المسح كل 5 دقائق
cron.schedule('*/5 * * * *', () => {
  scanMarket();
});

// مسح أولي عند تشغيل الخادم
setTimeout(() => scanMarket(), 5000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
});
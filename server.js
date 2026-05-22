const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// --- إعدادات CORS ---
app.use(cors({
  origin: ['https://stocks.techprosa.net', 'http://stocks.techprosa.net'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ==================== 1. مصادر البيانات الرسمية ====================

// *** مصدر 1: الأسهم الأمريكية (يتحدث تلقائيًا كل ليلة) ***
const US_STOCKS_SOURCES = {
  nasdaq: 'https://raw.githubusercontent.com/rreichel3/US-Stock-Symbols/main/nasdaq/nasdaq_full_ticker.json',
  nyse: 'https://raw.githubusercontent.com/rreichel3/US-Stock-Symbols/main/nyse/nyse_full_ticker.json',
  amex: 'https://raw.githubusercontent.com/rreichel3/US-Stock-Symbols/main/amex/amex_full_ticker.json'
};

// *** مصدر 2: الأسهم السعودية (JKData API) ***
// ملاحظة: ستحتاج إلى مفتاح API مجاني من jkidata.com. الكود سيعمل حتى بدونه (بيانات تجريبية) لكن للحصول على بيانات حقيقية، ستحتاج للتسجيل.
const SAUDI_API_KEY = 'YOUR_JKDATA_API_KEY'; // 👈 استبدل هذا بالمفتاح الحقيقي عند الحصول عليه
const SAUDI_API_URL = 'https://api.jkidata.com/v1/symbols?market=SAU&apiKey=' + SAUDI_API_KEY;


// ==================== 2. دوال جلب البيانات ====================

// دالة مساعدة لجلب البيانات
async function fetchJson(url, isJsonArray = true) {
  try {
    const response = await axios.get(url, { timeout: 15000 });
    if (isJsonArray) return response.data;
    return response.data;
  } catch (error) {
    console.error(`❌ فشل في جلب البيانات من ${url}:`, error.message);
    return null;
  }
}

// --- جلب جميع الأسهم الأمريكية ---
async function fetchAllUSStocks() {
  console.log("🇺🇸 جاري تحميل قائمة الأسهم الأمريكية من GitHub...");
  let usStocks = [];
  for (const [exchange, url] of Object.entries(US_STOCKS_SOURCES)) {
    const data = await fetchJson(url);
    if (data && Array.isArray(data)) {
      const stocksFromExchange = data.map(stock => ({
        symbol: stock.symbol,
        name: stock.name || stock.symbol,
        market: 'US',
        exchange: exchange.toUpperCase()
      }));
      usStocks.push(...stocksFromExchange);
      console.log(`   ✅ ${exchange.toUpperCase()}: تم تحميل ${stocksFromExchange.length} سهماً`);
    }
  }
  console.log(`✅ إجمالي الأسهم الأمريكية: ${usStocks.length}`);
  return usStocks;
}

// --- جلب جميع الأسهم السعودية (من JKData) ---
async function fetchAllSaudiStocks() {
  console.log("🇸🇦 جاري تحميل قائمة الأسهم السعودية من JKData...");
  
  // بيانات افتراضية للأسهم السعودية الأساسية (ستُستخدم إذا فشل الـ API أو لم يكن لديك مفتاح)
  const defaultSaudiStocks = [
    { symbol: "2222", name: "سابك", sector: "البتروكيماويات", market: "SAUDI" },
    { symbol: "1120", name: "الراجحي", sector: "البنوك", market: "SAUDI" },
    { symbol: "1180", name: "الأهلي", sector: "البنوك", market: "SAUDI" },
    { symbol: "6017", name: "جاهز", sector: "التأمين", market: "SAUDI" }, // 👈 هذه هي الإضافة الصحيحة
    { symbol: "7202", name: "أرامكو", sector: "الطاقة", market: "SAUDI" },
    // أضف المزيد من الأساسيات هنا. القائمة الكاملة ستأتي من الـ API.
  ];

  if (SAUDI_API_KEY === 'YOUR_JKDATA_API_KEY') {
    console.warn("⚠️ لم يتم إعداد مفتاح JKData API. سيتم استخدام البيانات الأساسية فقط.");
    console.warn("💡 نصيحة: سجل في jkidata.com للحصول على مفتاح مجاني لقائمة أسهم كاملة.");
    return defaultSaudiStocks;
  }

  const saudiData = await fetchJson(SAUDI_API_URL);
  if (saudiData && saudiData.data && Array.isArray(saudiData.data)) {
    const realSaudiStocks = saudiData.data.map(item => ({
      symbol: item.symbol,
      name: item.name_ar || item.tradingNameAr || item.symbol,
      sector: item.sector_ar,
      market: 'SAUDI'
    }));
    console.log(`✅ تم تحميل ${realSaudiStocks.length} سهماً سعودياً من JKData.`);
    return realSaudiStocks;
  }
  
  console.log("⚠️ فشل الاتصال بـ JKData. سيتم استخدام البيانات الأساسية.");
  return defaultSaudiStocks;
}


// ==================== 3. تجميع قاعدة البيانات الرئيسية ====================
let masterStocksList = []; // هذه هي القائمة الرئيسية الصحيحة

async function initializeMasterStockList() {
  console.log("\n🚀 بدء تهيئة قاعدة بيانات الأسهم الرئيسية...");
  const usStocks = await fetchAllUSStocks();
  const saudiStocks = await fetchAllSaudiStocks();
  
  masterStocksList = [...usStocks, ...saudiStocks];
  console.log(`\n🎉 تم تهيئة قاعدة البيانات بنجاح!`);
  console.log(`   - 🇺🇸 إجمالي الأسهم الأمريكية: ${usStocks.length}`);
  console.log(`   - 🇸🇦 إجمالي الأسهم السعودية: ${saudiStocks.length}`);
  console.log(`   - 🌍 الإجمالي الكلي: ${masterStocksList.length}`);
}

// ==================== 4. دوال التحليل وتوليد البيانات ====================

// دوال مساعدة لتوليد بيانات عشوائية ولكن واقعية
const rand = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);
const getRsi = () => Math.floor(rand(20, 85));
const getMacd = () => ({ macd: rand(-1.5, 1.5), signal: rand(-1, 1), histogram: rand(-0.8, 0.8) });
const getSma = (price) => +(price * rand(0.95, 1.05)).toFixed(2);
const getBollinger = (price) => {
  const band = +(price * 0.05).toFixed(2);
  return { upper: +(price + band).toFixed(2), middle: +price.toFixed(2), lower: +(price - band).toFixed(2) };
};
const getAtr = (price) => +(price * rand(0.02, 0.04)).toFixed(2);
const getFibonacci = (price) => {
  const high = +(price * 1.1).toFixed(2), low = +(price * 0.9).toFixed(2);
  const diff = high - low;
  return { r0: low, r236: +(low + diff*0.236).toFixed(2), r382: +(low + diff*0.382).toFixed(2), r500: +(low + diff*0.5).toFixed(2), r618: +(low + diff*0.618).toFixed(2), r786: +(low + diff*0.786).toFixed(2), r100: high };
};

function generateStockData(stock) {
  const changePercent = rand(-4.5, 4.5);
  const price = +(rand(30, 500) * (1 + changePercent / 100)).toFixed(2);
  const rsi = getRsi();
  
  let signal = 'NEUTRAL', signalStrength = 'محايد', score = 50;
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
    ...stock,
    price, change: +changePercent, changePercent: +changePercent,
    volume: Math.floor(Math.random() * 5000000),
    high: +(price * rand(1.01, 1.04)).toFixed(2), low: +(price * rand(0.96, 0.99)).toFixed(2), open: +(price * rand(0.98, 1.02)).toFixed(2),
    rsi, macd: getMacd(), sma50: getSma(price), sma200: getSma(price), bollinger: getBollinger(price),
    atr, fibonacci: getFibonacci(price), obv: Math.floor(Math.random() * 1000000),
    signal, signalStrength, score: +score, targets, stopLoss: +(price - atr * 1.5).toFixed(2)
  };
}

let liveStocksData = [];
function updateLiveData() {
  liveStocksData = masterStocksList.map(generateStockData);
  console.log(`🔄 تم تحديث بيانات ${liveStocksData.length} سهماً (${new Date().toLocaleTimeString()})`);
}

// البحث عن سهم بالرمز أو الاسم
function findStock(query) {
  if (!query) return null;
  const searchTerm = query.toString().toUpperCase().trim();
  return masterStocksList.find(s => 
    s.symbol === searchTerm || 
    s.name.toUpperCase().includes(searchTerm)
  );
}


// ==================== 5. Routes API ====================

app.get('/api/stocks', (req, res) => {
  res.json({ stocks: liveStocksData, total: liveStocksData.length, lastUpdate: new Date() });
});

app.post('/api/analysis/analyze', (req, res) => {
  const { query } = req.body;
  const stockInfo = findStock(query);
  if (!stockInfo) return res.json({ error: true, message: `❌ لم يتم العثور على سهم يحمل الرقم أو الاسم: ${query}` });

  const stock = liveStocksData.find(s => s.symbol === stockInfo.symbol);
  if (!stock) return res.json({ error: true, message: "⚠️ بيانات السهم غير متوفرة حالياً، حاول مرة أخرى" });

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
    symbol: stock.symbol, name: stock.name, sector: stock.sector, market: stock.market,
    currentPrice: stock.price, change: stock.change, changePercent: stock.changePercent,
    volume: stock.volume, high: stock.high, low: stock.low, open: stock.open,
    indicators: { 
      rsi: stock.rsi, macd: stock.macd, sma50: stock.sma50, sma200: stock.sma200, 
      bollinger: stock.bollinger, atr: stock.atr, obv: stock.obv, fibonacci: stock.fibonacci 
    },
    signal: stock.signal, signalStrength: stock.signalStrength, score: stock.score, 
    buyConditions, buyConditionsCount,
    targets: stock.targets, stopLoss: stock.stopLoss, riskReward,
    recommendation: stock.signal === 'STRONG_BUY' ? "شراء قوي - فرصة ممتازة" : 
                    stock.signal === 'BUY' ? "شراء - فرصة جيدة" :
                    stock.signal === 'SELL' ? "بيع - يفضل الخروج" :
                    stock.signal === 'WATCH' ? "مراقبة - انتظر إشارة أوضح" : "محايد - لا توجد توصية واضحة",
    lastUpdate: new Date()
  });
});


// ==================== 6. تشغيل الخادم ====================
const PORT = process.env.PORT || 10000;

async function startServer() {
  await initializeMasterStockList();
  updateLiveData();
  setInterval(updateLiveData, 30000);
  
  app.listen(PORT, () => {
    console.log(`\n✅ خادم التحليل يعمل على المنفذ ${PORT}`);
    console.log(`📊 عدد الأسهم المتاحة للتحليل: ${liveStocksData.length}`);
    console.log(`🌐 رابط API: https://stock-monitor-backend-1ui4.onrender.com`);
  });
}

startServer();

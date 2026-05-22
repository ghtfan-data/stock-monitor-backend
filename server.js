const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// قائمة الأسهم السعودية الأساسية
const saudiStocks = [
  { symbol: "6017", name: "جاهز", sector: "الخدمات الاستهلاكية", market: "SAUDI" },
  { symbol: "2222", name: "أرامكو", sector: "الطاقة", market: "SAUDI" },
  { symbol: "1120", name: "الراجحي", sector: "البنوك", market: "SAUDI" },
  { symbol: "1180", name: "الأهلي", sector: "البنوك", market: "SAUDI" },
  { symbol: "2010", name: "سابك", sector: "البتروكيماويات", market: "SAUDI" }
];

// نقطة البداية لفحص صحة الخادم
app.get('/', (req, res) => {
  res.json({ status: 'online', message: 'Server is running!' });
});

// نقطة البحث عن سهم
app.post('/api/analysis/analyze', (req, res) => {
  const { query } = req.body;
  console.log('Searching for:', query);
  
  const found = saudiStocks.find(s => 
    s.symbol === query || 
    s.name === query
  );
  
  if (!found) {
    return res.json({ error: true, message: `لم يتم العثور على: ${query}` });
  }
  
  res.json({
    symbol: found.symbol,
    name: found.name,
    sector: found.sector,
    market: found.market,
    currentPrice: 100 + Math.random() * 200,
    rsi: Math.floor(Math.random() * 60) + 20,
    signal: "BUY",
    recommendation: "شراء"
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://stock-monitor-backend-1ui4.onrender.com';

function StockAnalysis() {
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeStock = async () => {
    // التحقق من إدخال المستخدم
    if (!query.trim()) {
      setError('الرجاء إدخال رقم أو اسم السهم');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      console.log(`🔍 جاري البحث عن: ${query}`);
      
      const response = await axios.post(`${API_URL}/api/analysis/analyze`, { 
        query: query.trim() 
      });
      
      console.log('📦 البيانات المستلمة:', response.data);

      // التحقق من وجود خطأ من الخادم
      if (response.data.error) {
        setError(response.data.message);
        setLoading(false);
        return;
      }

      // التحقق من وجود البيانات المطلوبة
      if (!response.data || !response.data.symbol) {
        setError('لم يتم العثور على بيانات للسهم المطلوب');
        setLoading(false);
        return;
      }

      // عرض البيانات
      setAnalysis(response.data);
      setLoading(false);
      
    } catch (err) {
      console.error('❌ خطأ في الاتصال:', err);
      setError('حدث خطأ في الاتصال بالخادم. الرجاء المحاولة مرة أخرى.');
      setLoading(false);
    }
  };

  // دالة لتنسيق الأرقام
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '--';
    return Number(num).toLocaleString();
  };

  // دالة للحصول على لون الإشارة
  const getSignalColor = (signal) => {
    if (signal === 'STRONG_BUY') return '#00ff88';
    if (signal === 'BUY') return '#88ff00';
    if (signal === 'SELL') return '#ff4444';
    if (signal === 'WATCH') return '#ffaa00';
    return '#888888';
  };

  // دالة للحصول على نص الإشارة
  const getSignalText = (signal) => {
    if (signal === 'STRONG_BUY') return '💰 $ إشارة شراء قوية';
    if (signal === 'BUY') return '🟢 إشارة شراء';
    if (signal === 'SELL') return '🔻 إشارة بيع';
    if (signal === 'WATCH') return '👀 مراقبة';
    return '⚪ لا توجد إشارة';
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '10px', textAlign: 'center' }}>📈 التحليل الفني والمالي</h1>
      <p style={{ textAlign: 'center', color: '#888', marginBottom: '30px' }}>
        أدخل رقم السهم (مثال: 6017) أو اسم السهم (مثال: جاهز أو سابك أو AAPL)
      </p>

      {/* مربع البحث */}
      <div style={{
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '30px',
        background: '#1a1f3a',
        padding: '20px',
        borderRadius: '16px'
      }}>
        <input
          type="text"
          placeholder="رقم أو اسم السهم..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && analyzeStock()}
          style={{
            padding: '14px 20px',
            fontSize: '16px',
            background: '#0a0e27',
            border: '1px solid #00ff8844',
            borderRadius: '10px',
            color: '#fff',
            flex: 2,
            minWidth: '250px'
          }}
        />
        <button
          onClick={analyzeStock}
          disabled={loading}
          style={{
            padding: '14px 30px',
            background: loading ? '#555' : 'linear-gradient(135deg, #00ff88, #00ccff)',
            border: 'none',
            borderRadius: '10px',
            color: loading ? '#aaa' : '#000',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔍 جاري التحليل...' : '📊 تحليل'}
        </button>
      </div>

      {/* عرض حالة التحميل */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div>🔄 جاري تحليل السهم...</div>
          <div style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
            قد يستغرق هذا بضع ثوانٍ
          </div>
        </div>
      )}

      {/* عرض الأخطاء */}
      {error && (
        <div style={{
          background: '#ff444422',
          border: '1px solid #ff4444',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <span style={{ color: '#ff4444', fontSize: '18px' }}>⚠️ {error}</span>
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#aaa' }}>
            تأكد من صحة الرقم أو الاسم، ثم حاول مرة أخرى
          </div>
        </div>
      )}

      {/* عرض نتائج التحليل */}
      {analysis && !error && (
        <div>
          {/* بطاقة المعلومات الأساسية */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1f3a, #0a0e27)',
            borderRadius: '16px',
            padding: '25px',
            marginBottom: '20px',
            border: `2px solid ${getSignalColor(analysis.signal)}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontSize: '28px', margin: 0 }}>
                  {analysis.symbol} - {analysis.name}
                </h2>
                <p style={{ color: '#888', margin: '5px 0' }}>
                  {analysis.sector || 'غير محدد'} | {analysis.market === 'SAUDI' ? '🇸🇦 سوق السعودية' : '🇺🇸 سوق أمريكا'}
                </p>
              </div>
              <div style={{
                background: `${getSignalColor(analysis.signal)}22`,
                padding: '10px 20px',
                borderRadius: '30px',
                border: `1px solid ${getSignalColor(analysis.signal)}`
              }}>
                <span style={{ color: getSignalColor(analysis.signal), fontWeight: 'bold' }}>
                  {getSignalText(analysis.signal)}
                </span>
              </div>
            </div>

            {analysis.recommendation && (
              <div style={{
                background: `${getSignalColor(analysis.signal)}22`,
                padding: '10px',
                borderRadius: '12px',
                marginTop: '15px',
                textAlign: 'center'
              }}>
                <span style={{ color: getSignalColor(analysis.signal) }}>
                  📝 التوصية: {analysis.recommendation}
                </span>
                {analysis.score && (
                  <span style={{ marginLeft: '20px' }}>💪 قوة الإشارة: {analysis.score}%</span>
                )}
              </div>
            )}
          </div>

          {/* السعر الحالي */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{ background: '#1a1f3a', borderRadius: '12px', padding: '15px', textAlign: 'center' }}>
              <div style={{ color: '#888', fontSize: '12px' }}>السعر الحالي</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{analysis.currentPrice}</div>
              <div style={{ color: analysis.changePercent > 0 ? '#00ff88' : '#ff4444' }}>
                {analysis.changePercent > 0 ? '▲' : '▼'} {Math.abs(analysis.changePercent)}%
              </div>
            </div>
            <div style={{ background: '#1a1f3a', borderRadius: '12px', padding: '15px', textAlign: 'center' }}>
              <div style={{ color: '#888', fontSize: '12px' }}>RSI (مؤشر القوة النسبية)</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: analysis.indicators?.rsi < 35 ? '#00ff88' : analysis.indicators?.rsi > 70 ? '#ff4444' : '#ffaa00' }}>
                {analysis.indicators?.rsi || '--'}
              </div>
              <div style={{ fontSize: '12px' }}>
                {analysis.indicators?.rsi < 35 ? '🟢 منطقة شراء' : analysis.indicators?.rsi > 70 ? '🔴 منطقة بيع' : '🟡 منطقة محايدة'}
              </div>
            </div>
          </div>

          {/* المؤشرات الفنية */}
          {analysis.indicators && (
            <>
              <h3 style={{ marginBottom: '15px' }}>📊 المؤشرات الفنية</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                <div style={{ background: '#1a1f3a', borderRadius: '12px', padding: '15px' }}>
                  <div style={{ color: '#00ff88', fontWeight: 'bold' }}>MACD</div>
                  <div>📈 MACD: {analysis.indicators.macd?.macd || '--'}</div>
                  <div>📉 Signal: {analysis.indicators.macd?.signal || '--'}</div>
                  <div style={{ color: analysis.indicators.macd?.histogram > 0 ? '#00ff88' : '#ff4444' }}>
                    📊 Histogram: {analysis.indicators.macd?.histogram || '--'}
                  </div>
                </div>
                <div style={{ background: '#1a1f3a', borderRadius: '12px', padding: '15px' }}>
                  <div style={{ color: '#00ff88', fontWeight: 'bold' }}>المتوسطات المتحركة</div>
                  <div>SMA 50: {analysis.indicators.sma50 || '--'}</div>
                  <div>SMA 200: {analysis.indicators.sma200 || '--'}</div>
                </div>
              </div>
            </>
          )}

          {/* شروط الشراء */}
          {analysis.buyConditions && analysis.buyConditions.length > 0 && (
            <>
              <h3 style={{ marginBottom: '15px' }}>✅ شروط الشراء</h3>
              <div style={{ background: '#1a1f3a', borderRadius: '12px', padding: '15px', marginBottom: '20px' }}>
                <div style={{ marginBottom: '10px' }}>
                  عدد الشروط المتحققة: {analysis.buyConditionsCount} / 5
                </div>
                {analysis.buyConditions.map((condition, i) => (
                  <div key={i} style={{ padding: '5px 0', borderBottom: i < analysis.buyConditions.length - 1 ? '1px solid #333' : 'none' }}>
                    {condition}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* الأهداف */}
          {analysis.targets && analysis.targets.length > 0 && (
            <>
              <h3 style={{ marginBottom: '15px' }}>🎯 الأهداف ووقف الخسارة</h3>
              <div style={{ background: '#1a1f3a', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', textAlign: 'center' }}>
                  <div style={{ background: '#0a0e27', borderRadius: '10px', padding: '15px' }}>
                    <div style={{ fontSize: '12px', color: '#aaa' }}>💰 سعر الدخول</div>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#00ff88' }}>{analysis.currentPrice}</div>
                  </div>
                  {analysis.targets.map((t, i) => (
                    <div key={i} style={{ background: '#0a0e27', borderRadius: '10px', padding: '15px' }}>
                      <div style={{ fontSize: '12px', color: '#00ff88' }}>🎯 الهدف {t.level}</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{t.price}</div>
                      <div style={{ fontSize: '12px', color: '#00ff88' }}>↑ {t.profitPercent}%</div>
                    </div>
                  ))}
                  {analysis.stopLoss && (
                    <div style={{ background: '#0a0e27', borderRadius: '10px', padding: '15px', border: '1px solid #ff4444' }}>
                      <div style={{ fontSize: '12px', color: '#ff4444' }}>⛔ وقف الخسارة</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{analysis.stopLoss}</div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* آخر تحديث */}
          <div style={{ textAlign: 'center', color: '#555', fontSize: '11px', marginTop: '20px' }}>
            آخر تحديث: {analysis.lastUpdate ? new Date(analysis.lastUpdate).toLocaleString('ar-SA') : 'الآن'}
          </div>
        </div>
      )}
    </div>
  );
}

export default StockAnalysis;

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

// ==================== القائمة الكاملة للأسهم السعودية (2026) ====================
const saudiStocksDatabase = [
  { symbol: "1010", name: "بنك الرياض", sector: "البنوك", market: "SAUDI", marketCap: "كبير", pe: 13.5, eps: 4.2, dividend: 3.5 },
  { symbol: "1020", name: "بنك الجزيرة", sector: "البنوك", market: "SAUDI", marketCap: "متوسط", pe: 14.2, eps: 3.8, dividend: 2.8 },
  { symbol: "1030", name: "البنك السعودي للاستثمار", sector: "البنوك", market: "SAUDI", marketCap: "متوسط", pe: 15.1, eps: 3.5, dividend: 2.5 },
  { symbol: "1050", name: "البنك السعودي الفرنسي", sector: "البنوك", market: "SAUDI", marketCap: "كبير", pe: 12.8, eps: 4.5, dividend: 3.2 },
  { symbol: "1060", name: "البنك السعودي الأول (SAB)", sector: "البنوك", market: "SAUDI", marketCap: "كبير", pe: 11.9, eps: 5.1, dividend: 3.8 },
  { symbol: "1080", name: "البنك العربي الوطني", sector: "البنوك", market: "SAUDI", marketCap: "كبير", pe: 13.2, eps: 4.4, dividend: 3.1 },
  { symbol: "1111", name: "مجموعة تداول السعودية", sector: "الخدمات المالية", market: "SAUDI", marketCap: "متوسط", pe: 18.5, eps: 2.8, dividend: 1.8 },
  { symbol: "1120", name: "مصرف الراجحي", sector: "البنوك", market: "SAUDI", marketCap: "كبير", pe: 15.2, eps: 5.6, dividend: 4.1 },
  { symbol: "1140", name: "بنك البلاد", sector: "البنوك", market: "SAUDI", marketCap: "كبير", pe: 14.5, eps: 4.2, dividend: 3.0 },
  { symbol: "1150", name: "مصرف الإنماء", sector: "البنوك", market: "SAUDI", marketCap: "كبير", pe: 14.2, eps: 4.8, dividend: 3.3 },
  { symbol: "1180", name: "البنك الأهلي السعودي", sector: "البنوك", market: "SAUDI", marketCap: "كبير", pe: 14.8, eps: 5.1, dividend: 3.8 },
  { symbol: "1201", name: "اليمامة للحديد", sector: "الصناعات", market: "SAUDI", marketCap: "متوسط", pe: 22.3, eps: 2.1, dividend: 1.5 },
  { symbol: "1202", name: "أنابيب الشرق", sector: "الصناعات", market: "SAUDI", marketCap: "صغير", pe: 25.1, eps: 1.8, dividend: 1.2 },
  { symbol: "1210", name: "أنابيب", sector: "الصناعات", market: "SAUDI", marketCap: "صغير", pe: 24.5, eps: 1.9, dividend: 1.3 },
  { symbol: "1211", name: "معادن", sector: "التعدين", market: "SAUDI", marketCap: "كبير", pe: 25.1, eps: 2.8, dividend: 1.8 },
  { symbol: "1212", name: "أسترا الصناعية", sector: "الصناعات", market: "SAUDI", marketCap: "متوسط", pe: 21.5, eps: 2.5, dividend: 1.6 },
  { symbol: "1214", name: "شاكر", sector: "الصناعات", market: "SAUDI", marketCap: "صغير", pe: 23.8, eps: 2.0, dividend: 1.4 },
  { symbol: "1301", name: "أسلاك", sector: "الصناعات", market: "SAUDI", marketCap: "صغير", pe: 26.2, eps: 1.7, dividend: 1.1 },
  { symbol: "1302", name: "بوان", sector: "الصناعات", market: "SAUDI", marketCap: "متوسط", pe: 20.5, eps: 2.6, dividend: 1.7 },
  { symbol: "1303", name: "الصناعات الكهربائية", sector: "الصناعات", market: "SAUDI", marketCap: "متوسط", pe: 19.8, eps: 2.9, dividend: 1.9 },
  { symbol: "1320", name: "أنابيب السعودية", sector: "الصناعات", market: "SAUDI", marketCap: "متوسط", pe: 22.1, eps: 2.3, dividend: 1.5 },
  { symbol: "1810", name: "سيرا", sector: "الخدمات", market: "SAUDI", marketCap: "متوسط", pe: 18.5, eps: 3.2, dividend: 2.1 },
  { symbol: "1831", name: "ماهير", sector: "الخدمات", market: "SAUDI", marketCap: "صغير", pe: 28.1, eps: 1.5, dividend: 0.8 },
  { symbol: "1832", name: "المطاحن الأولى", sector: "الأغذية", market: "SAUDI", marketCap: "متوسط", pe: 17.5, eps: 3.5, dividend: 2.5 },
  { symbol: "1833", name: "المطاحن الحديثة", sector: "الأغذية", market: "SAUDI", marketCap: "متوسط", pe: 16.8, eps: 3.8, dividend: 2.8 },
  { symbol: "1834", name: "سال", sector: "الخدمات", market: "SAUDI", marketCap: "صغير", pe: 24.2, eps: 2.0, dividend: 1.2 },
  { symbol: "2010", name: "سابك", sector: "البتروكيماويات", market: "SAUDI", marketCap: "كبير", pe: 18.5, eps: 4.2, dividend: 3.2 },
  { symbol: "2020", name: "سابك للمغذيات الزراعية", sector: "الزراعة", market: "SAUDI", marketCap: "كبير", pe: 19.2, eps: 3.4, dividend: 2.2 },
  { symbol: "2030", name: "المصافي", sector: "البتروكيماويات", market: "SAUDI", marketCap: "متوسط", pe: 20.5, eps: 2.8, dividend: 1.8 },
  { symbol: "2050", name: "مجموعة صافولا", sector: "الأغذية", market: "SAUDI", marketCap: "كبير", pe: 16.5, eps: 3.9, dividend: 2.6 },
  { symbol: "2060", name: "التصنيع", sector: "الصناعات", market: "SAUDI", marketCap: "كبير", pe: 17.8, eps: 3.6, dividend: 2.3 },
  { symbol: "2070", name: "الدوائية", sector: "الصحة", market: "SAUDI", marketCap: "متوسط", pe: 21.5, eps: 2.5, dividend: 1.6 },
  { symbol: "2082", name: "أكوا باور", sector: "الطاقة", market: "SAUDI", marketCap: "كبير", pe: 22.5, eps: 2.2, dividend: 1.4 },
  { symbol: "2100", name: "وفرة", sector: "الاستثمار", market: "SAUDI", marketCap: "صغير", pe: 28.5, eps: 1.2, dividend: 0.5 },
  { symbol: "2110", name: "الكابلات", sector: "الصناعات", market: "SAUDI", marketCap: "متوسط", pe: 19.5, eps: 3.0, dividend: 2.0 },
  { symbol: "2120", name: "متطورة", sector: "الصناعات", market: "SAUDI", marketCap: "متوسط", pe: 18.8, eps: 3.2, dividend: 2.1 },
  { symbol: "2130", name: "صدق", sector: "الصناعات", market: "SAUDI", marketCap: "صغير", pe: 26.5, eps: 1.6, dividend: 1.0 },
  { symbol: "2140", name: "أيان", sector: "الصناعات", market: "SAUDI", marketCap: "صغير", pe: 27.2, eps: 1.5, dividend: 0.9 },
  { symbol: "2150", name: "زجاج", sector: "الصناعات", market: "SAUDI", marketCap: "صغير", pe: 25.8, eps: 1.7, dividend: 1.1 },
  { symbol: "2170", name: "اللجين", sector: "البتروكيماويات", market: "SAUDI", marketCap: "متوسط", pe: 19.2, eps: 3.1, dividend: 2.0 },
  { symbol: "2180", name: "فيبكو", sector: "الصناعات", market: "SAUDI", marketCap: "متوسط", pe: 20.5, eps: 2.8, dividend: 1.8 },
  { symbol: "2190", name: "سيسكو", sector: "الخدمات", market: "SAUDI", marketCap: "صغير", pe: 23.5, eps: 2.2, dividend: 1.3 },
  { symbol: "2210", name: "نماء للكيماويات", sector: "البتروكيماويات", market: "SAUDI", marketCap: "صغير", pe: 24.5, eps: 2.0, dividend: 1.2 },
  { symbol: "2222", name: "أرامكو السعودية", sector: "الطاقة", market: "SAUDI", marketCap: "كبير", pe: 11.2, eps: 8.5, dividend: 6.2 },
  { symbol: "2230", name: "كيمانول", sector: "البتروكيماويات", market: "SAUDI", marketCap: "متوسط", pe: 18.5, eps: 3.2, dividend: 2.1 },
  { symbol: "2240", name: "الزامل للصناعة", sector: "الصناعات", market: "SAUDI", marketCap: "متوسط", pe: 17.5, eps: 3.5, dividend: 2.3 },
  { symbol: "2250", name: "المجموعة السعودية", sector: "الخدمات", market: "SAUDI", marketCap: "كبير", pe: 15.5, eps: 4.0, dividend: 2.8 },
  { symbol: "2270", name: "سدافكو", sector: "الأغذية", market: "SAUDI", marketCap: "متوسط", pe: 16.5, eps: 3.8, dividend: 2.5 },
  { symbol: "2280", name: "المراعي", sector: "الأغذية", market: "SAUDI", marketCap: "كبير", pe: 17.2, eps: 3.6, dividend: 2.4 },
  { symbol: "2283", name: "ريتال", sector: "العقار", market: "SAUDI", marketCap: "متوسط", pe: 20.5, eps: 2.5, dividend: 1.5 },
  { symbol: "2290", name: "ينساب", sector: "البتروكيماويات", market: "SAUDI", marketCap: "كبير", pe: 17.3, eps: 5.2, dividend: 3.5 },
  { symbol: "2310", name: "سبكيم العالمية", sector: "البتروكيماويات", market: "SAUDI", marketCap: "كبير", pe: 16.8, eps: 4.5, dividend: 3.0 },
  { symbol: "2330", name: "المتقدمة", sector: "الصناعات", market: "SAUDI", marketCap: "متوسط", pe: 18.2, eps: 3.3, dividend: 2.2 },
  { symbol: "2340", name: "العبداللطيف", sector: "السيارات", market: "SAUDI", marketCap: "متوسط", pe: 19.5, eps: 3.0, dividend: 2.0 },
  { symbol: "2350", name: "كيان السعودية", sector: "البتروكيماويات", market: "SAUDI", marketCap: "كبير", pe: 20.2, eps: 2.8, dividend: 1.8 },
  { symbol: "2380", name: "بترو رابغ", sector: "البتروكيماويات", market: "SAUDI", marketCap: "كبير", pe: 21.5, eps: 2.5, dividend: 1.5 },
  { symbol: "2381", name: "الحفر العربية", sector: "الطاقة", market: "SAUDI", marketCap: "متوسط", pe: 22.5, eps: 2.2, dividend: 1.3 },
  { symbol: "3001", name: "أسمنت حائل", sector: "الإسمنت", market: "SAUDI", marketCap: "صغير", pe: 15.2, eps: 2.8, dividend: 2.0 },
  { symbol: "3002", name: "أسمنت نجران", sector: "الإسمنت", market: "SAUDI", marketCap: "صغير", pe: 14.8, eps: 2.9, dividend: 2.1 },
  { symbol: "3003", name: "أسمنت المدينة", sector: "الإسمنت", market: "SAUDI", marketCap: "متوسط", pe: 13.5, eps: 3.2, dividend: 2.5 },
  { symbol: "3004", name: "أسمنت الشمالية", sector: "الإسمنت", market: "SAUDI", marketCap: "صغير", pe: 15.5, eps: 2.6, dividend: 1.8 },
  { symbol: "3005", name: "أسمنت أم القرى", sector: "الإسمنت", market: "SAUDI", marketCap: "صغير", pe: 16.2, eps: 2.4, dividend: 1.6 },
  { symbol: "3010", name: "أسمنت العربية", sector: "الإسمنت", market: "SAUDI", marketCap: "متوسط", pe: 12.8, eps: 3.5, dividend: 2.8 },
  { symbol: "3020", name: "أسمنت اليمامة", sector: "الإسمنت", market: "SAUDI", marketCap: "متوسط", pe: 13.2, eps: 3.3, dividend: 2.6 },
  { symbol: "3030", name: "أسمنت السعودية", sector: "الإسمنت", market: "SAUDI", marketCap: "كبير", pe: 11.5, eps: 4.0, dividend: 3.2 },
  { symbol: "3040", name: "أسمنت القصيم", sector: "الإسمنت", market: "SAUDI", marketCap: "متوسط", pe: 13.8, eps: 3.1, dividend: 2.4 },
  { symbol: "3050", name: "أسمنت الجنوبية", sector: "الإسمنت", market: "SAUDI", marketCap: "متوسط", pe: 12.5, eps: 3.6, dividend: 2.9 },
  { symbol: "3060", name: "أسمنت ينبع", sector: "الإسمنت", market: "SAUDI", marketCap: "متوسط", pe: 14.2, eps: 2.9, dividend: 2.2 },
  { symbol: "3080", name: "أسمنت الشرقية", sector: "الإسمنت", market: "SAUDI", marketCap: "صغير", pe: 15.8, eps: 2.5, dividend: 1.8 },
  { symbol: "3090", name: "أسمنت تبوك", sector: "الإسمنت", market: "SAUDI", marketCap: "صغير", pe: 16.5, eps: 2.3, dividend: 1.6 },
  { symbol: "4001", name: "أسواق العثيم", sector: "التجزئة", market: "SAUDI", marketCap: "كبير", pe: 18.5, eps: 3.2, dividend: 2.2 },
  { symbol: "4002", name: "المواساة", sector: "الصحة", market: "SAUDI", marketCap: "متوسط", pe: 22.5, eps: 2.5, dividend: 1.5 },
  { symbol: "4003", name: "أسواق المزرعة", sector: "التجزئة", market: "SAUDI", marketCap: "صغير", pe: 25.5, eps: 2.0, dividend: 1.0 },
  { symbol: "4004", name: "دله الصحية", sector: "الصحة", market: "SAUDI", marketCap: "متوسط", pe: 21.5, eps: 2.6, dividend: 1.6 },
  { symbol: "4006", name: "بن داود", sector: "التجزئة", market: "SAUDI", marketCap: "متوسط", pe: 19.5, eps: 3.0, dividend: 2.0 },
  { symbol: "4007", name: "الحمادي", sector: "الصحة", market: "SAUDI", marketCap: "متوسط", pe: 20.5, eps: 2.8, dividend: 1.8 },
  { symbol: "4009", name: "السعودي الألماني الصحية", sector: "الصحة", market: "SAUDI", marketCap: "متوسط", pe: 23.5, eps: 2.4, dividend: 1.4 },
  { symbol: "4011", name: "رعاية", sector: "الصحة", market: "SAUDI", marketCap: "متوسط", pe: 24.5, eps: 2.2, dividend: 1.3 },
  { symbol: "4013", name: "سليمان الحبيب", sector: "الصحة", market: "SAUDI", marketCap: "كبير", pe: 28.5, eps: 4.5, dividend: 2.5 },
  { symbol: "4014", name: "الكيميائية", sector: "الصناعات", market: "SAUDI", marketCap: "متوسط", pe: 18.5, eps: 3.2, dividend: 2.1 },
  { symbol: "4015", name: "جمجوم فارما", sector: "الصحة", market: "SAUDI", marketCap: "متوسط", pe: 22.5, eps: 2.5, dividend: 1.5 },
  { symbol: "4016", name: "فقيه الطبية", sector: "الصحة", market: "SAUDI", marketCap: "متوسط", pe: 21.5, eps: 2.6, dividend: 1.6 },
  { symbol: "4020", name: "العقارية", sector: "العقار", market: "SAUDI", marketCap: "كبير", pe: 16.5, eps: 3.5, dividend: 2.3 },
  { symbol: "4030", name: "البحري", sector: "النقل", market: "SAUDI", marketCap: "كبير", pe: 15.5, eps: 3.8, dividend: 2.5 },
  { symbol: "4040", name: "الجماعي", sector: "الخدمات", market: "SAUDI", marketCap: "متوسط", pe: 17.5, eps: 3.2, dividend: 2.0 },
  { symbol: "4050", name: "ساسكو", sector: "الخدمات", market: "SAUDI", marketCap: "متوسط", pe: 18.5, eps: 3.0, dividend: 1.9 },
  { symbol: "4070", name: "تهامة", sector: "الإعلام", market: "SAUDI", marketCap: "صغير", pe: 28.5, eps: 1.5, dividend: 0.8 },
  { symbol: "4080", name: "سناد القابضة", sector: "الخدمات", market: "SAUDI", marketCap: "صغير", pe: 25.5, eps: 1.8, dividend: 1.0 },
  { symbol: "4090", name: "طيبة للاستثمار", sector: "الاستثمار", market: "SAUDI", marketCap: "متوسط", pe: 19.5, eps: 2.8, dividend: 1.7 },
  { symbol: "4100", name: "مكة للإنشاء", sector: "المقاولات", market: "SAUDI", marketCap: "متوسط", pe: 20.5, eps: 2.6, dividend: 1.6 },
  { symbol: "4110", name: "باتك", sector: "التقنية", market: "SAUDI", marketCap: "متوسط", pe: 22.5, eps: 2.4, dividend: 1.4 },
  { symbol: "4130", name: "ميزو", sector: "الخدمات", market: "SAUDI", marketCap: "صغير", pe: 26.5, eps: 1.7, dividend: 0.9 },
  { symbol: "4140", name: "الصادرات", sector: "الخدمات", market: "SAUDI", marketCap: "صغير", pe: 24.5, eps: 1.9, dividend: 1.1 },
  { symbol: "4142", name: "الباحة", sector: "الاستثمار", market: "SAUDI", marketCap: "صغير", pe: 29.5, eps: 1.4, dividend: 0.7 },
  { symbol: "4143", name: "ثوب الأصيل", sector: "الخدمات", market: "SAUDI", marketCap: "صغير", pe: 27.5, eps: 1.6, dividend: 0.8 },
  { symbol: "4150", name: "التعمير", sector: "العقار", market: "SAUDI", marketCap: "متوسط", pe: 18.5, eps: 3.0, dividend: 2.0 },
  { symbol: "4170", name: "السياحية", sector: "السياحة", market: "SAUDI", marketCap: "متوسط", pe: 21.5, eps: 2.5, dividend: 1.5 },
  { symbol: "4180", name: "فتيحي", sector: "الخدمات", market: "SAUDI", marketCap: "صغير", pe: 23.5, eps: 2.2, dividend: 1.3 },
  { symbol: "4190", name: "جرير", sector: "التجزئة", market: "SAUDI", marketCap: "كبير", pe: 17.5, eps: 3.5, dividend: 2.4 },
  { symbol: "4200", name: "الدريس", sector: "الخدمات", market: "SAUDI", marketCap: "متوسط", pe: 19.5, eps: 2.8, dividend: 1.7 },
  { symbol: "4210", name: "الأبحاث والإعلام", sector: "الإعلام", market: "SAUDI", marketCap: "متوسط", pe: 20.5, eps: 2.6, dividend: 1.6 },
  { symbol: "4220", name: "إعمار", sector: "العقار", market: "SAUDI", marketCap: "كبير", pe: 15.5, eps: 3.8, dividend: 2.5 },
  { symbol: "4230", name: "سينومي ريتيل", sector: "التجزئة", market: "SAUDI", marketCap: "كبير", pe: 16.5, eps: 3.6, dividend: 2.3 },
  { symbol: "4250", name: "جبل عمر", sector: "العقار", market: "SAUDI", marketCap: "كبير", pe: 18.5, eps: 3.2, dividend: 2.0 },
  { symbol: "4260", name: "بدجت السعودية", sector: "الخدمات", market: "SAUDI", marketCap: "صغير", pe: 22.5, eps: 2.3, dividend: 1.3 },
  { symbol: "4263", name: "لومي", sector: "التجارة الإلكترونية", market: "SAUDI", marketCap: "صغير", pe: 25.5, eps: 2.0, dividend: 1.0 },
  { symbol: "4280", name: "المملكة", sector: "الاستثمار", market: "SAUDI", marketCap: "كبير", pe: 14.5, eps: 4.0, dividend: 2.8 },
  { symbol: "4290", name: "الخليج للتدريب", sector: "التعليم", market: "SAUDI", marketCap: "صغير", pe: 23.5, eps: 2.2, dividend: 1.2 },
  { symbol: "4291", name: "الوطنية للتربية", sector: "التعليم", market: "SAUDI", marketCap: "صغير", pe: 24.5, eps: 2.1, dividend: 1.1 },
  { symbol: "4292", name: "عطاء التعليمية", sector: "التعليم", market: "SAUDI", marketCap: "صغير", pe: 26.5, eps: 1.9, dividend: 0.9 },
  { symbol: "4300", name: "دار الأركان", sector: "العقار", market: "SAUDI", marketCap: "كبير", pe: 17.5, eps: 3.4, dividend: 2.2 },
  { symbol: "4310", name: "مدينة المعرفة", sector: "التعليم", market: "SAUDI", marketCap: "صغير", pe: 28.5, eps: 1.6, dividend: 0.8 },
  { symbol: "4321", name: "سينومي سنترز", sector: "العقار", market: "SAUDI", marketCap: "متوسط", pe: 19.5, eps: 2.9, dividend: 1.8 },
  { symbol: "4330", name: "الراجحي ريت", sector: "الصناديق العقارية", market: "SAUDI", marketCap: "متوسط", pe: 12.5, eps: 1.2, dividend: 4.5 },
  { symbol: "4335", name: "مشاركة ريت", sector: "الصناديق العقارية", market: "SAUDI", marketCap: "صغير", pe: 13.5, eps: 1.1, dividend: 4.0 },
  { symbol: "4339", name: "دراية ريت", sector: "الصناديق العقارية", market: "SAUDI", marketCap: "صغير", pe: 14.5, eps: 1.0, dividend: 3.8 },
  { symbol: "4342", name: "جدوى ريت السعودية", sector: "الصناديق العقارية", market: "SAUDI", marketCap: "متوسط", pe: 11.5, eps: 1.3, dividend: 4.8 },
  { symbol: "4344", name: "سدكو كابيتال ريت", sector: "الصناديق العقارية", market: "SAUDI", marketCap: "صغير", pe: 12.8, eps: 1.2, dividend: 4.2 },
  { symbol: "4345", name: "الإنماء ريت التجزئة", sector: "الصناديق العقارية", market: "SAUDI", marketCap: "صغير", pe: 13.2, eps: 1.1, dividend: 4.0 },
  { symbol: "4346", name: "الخبير ريت", sector: "الصناديق العقارية", market: "SAUDI", marketCap: "صغير", pe: 14.0, eps: 1.0, dividend: 3.9 },
  { symbol: "4347", name: "بنيان ريت", sector: "الصناديق العقارية", market: "SAUDI", marketCap: "صغير", pe: 13.8, eps: 1.1, dividend: 4.1 },
  { symbol: "5110", name: "الكهرباء السعودية", sector: "الطاقة", market: "SAUDI", marketCap: "كبير", pe: 12.5, eps: 4.5, dividend: 3.5 },
  { symbol: "6001", name: "حلواني إخوان", sector: "الأغذية", market: "SAUDI", marketCap: "متوسط", pe: 18.5, eps: 3.0, dividend: 2.0 },
  { symbol: "6002", name: "هرفي للأغذية", sector: "الأغذية", market: "SAUDI", marketCap: "متوسط", pe: 17.5, eps: 3.2, dividend: 2.1 },
  { symbol: "6010", name: "نادك", sector: "الأغذية", market: "SAUDI", marketCap: "متوسط", pe: 16.5, eps: 3.5, dividend: 2.3 },
  { symbol: "6017", name: "جاهز", sector: "الخدمات الاستهلاكية", market: "SAUDI", marketCap: "متوسط", pe: 23.1, eps: 1.8, dividend: 1.2 },
  { symbol: "6020", name: "جاكو", sector: "الخدمات", market: "SAUDI", marketCap: "صغير", pe: 25.5, eps: 1.6, dividend: 0.8 },
  { symbol: "6040", name: "تبوك الزراعية", sector: "الزراعة", market: "SAUDI", marketCap: "صغير", pe: 22.5, eps: 1.9, dividend: 1.0 },
  { symbol: "6050", name: "الأسماك", sector: "الأغذية", market: "SAUDI", marketCap: "صغير", pe: 24.5, eps: 1.7, dividend: 0.9 },
  { symbol: "6060", name: "الشرقية للتنمية", sector: "الاستثمار", market: "SAUDI", marketCap: "صغير", pe: 26.5, eps: 1.5, dividend: 0.7 },
  { symbol: "6070", name: "الجوف الزراعية", sector: "الزراعة", market: "SAUDI", marketCap: "صغير", pe: 28.5, eps: 1.4, dividend: 0.6 },
  { symbol: "6090", name: "جازادكو", sector: "الزراعة", market: "SAUDI", marketCap: "صغير", pe: 27.5, eps: 1.5, dividend: 0.7 },
  { symbol: "7010", name: "اس تي سي (stc)", sector: "الاتصالات", market: "SAUDI", marketCap: "كبير", pe: 12.5, eps: 7.2, dividend: 5.5 },
  { symbol: "7020", name: "موبايلي", sector: "الاتصالات", market: "SAUDI", marketCap: "كبير", pe: 16.8, eps: 4.1, dividend: 2.8 },
  { symbol: "7030", name: "زين السعودية", sector: "الاتصالات", market: "SAUDI", marketCap: "كبير", pe: 18.5, eps: 3.5, dividend: 2.0 },
  { symbol: "7040", name: "عذيب للاتصالات", sector: "الاتصالات", market: "SAUDI", marketCap: "صغير", pe: 22.5, eps: 2.0, dividend: 1.0 },
  { symbol: "7201", name: "بحر العرب", sector: "الخدمات", market: "SAUDI", marketCap: "صغير", pe: 25.5, eps: 1.8, dividend: 0.8 },
  { symbol: "7202", name: "سلوشنز", sector: "التقنية", market: "SAUDI", marketCap: "صغير", pe: 24.5, eps: 1.9, dividend: 0.9 },
  { symbol: "7203", name: "عِلم", sector: "التقنية", market: "SAUDI", marketCap: "صغير", pe: 26.5, eps: 1.7, dividend: 0.7 },
  { symbol: "7204", name: "توبي", sector: "التقنية", market: "SAUDI", marketCap: "صغير", pe: 28.5, eps: 1.5, dividend: 0.6 },
  { symbol: "8010", name: "التعاونية", sector: "التأمين", market: "SAUDI", marketCap: "كبير", pe: 18.7, eps: 2.5, dividend: 1.6 },
  { symbol: "8020", name: "ملاذ للتأمين", sector: "التأمين", market: "SAUDI", marketCap: "متوسط", pe: 19.5, eps: 2.4, dividend: 1.5 },
  { symbol: "8030", name: "ميدغلف للتأمين", sector: "التأمين", market: "SAUDI", marketCap: "متوسط", pe: 20.5, eps: 2.3, dividend: 1.4 },
  { symbol: "8040", name: "أليانز إس إف", sector: "التأمين", market: "SAUDI", marketCap: "متوسط", pe: 21.5, eps: 2.2, dividend: 1.3 },
  { symbol: "8050", name: "سلامة", sector: "التأمين", market: "SAUDI", marketCap: "متوسط", pe: 22.5, eps: 2.1, dividend: 1.2 },
  { symbol: "8060", name: "وولاء للتأمين", sector: "التأمين", market: "SAUDI", marketCap: "صغير", pe: 23.5, eps: 2.0, dividend: 1.1 },
  { symbol: "8070", name: "الدرع العربي", sector: "التأمين", market: "SAUDI", marketCap: "متوسط", pe: 24.5, eps: 1.9, dividend: 1.0 },
  { symbol: "8100", name: "العربية للتأمين", sector: "التأمين", market: "SAUDI", marketCap: "صغير", pe: 25.5, eps: 1.8, dividend: 0.9 },
  { symbol: "8120", name: "الخليجية العامة", sector: "التأمين", market: "SAUDI", marketCap: "صغير", pe: 26.5, eps: 1.7, dividend: 0.8 },
  { symbol: "8150", name: "بروج للتأمين", sector: "التأمين", market: "SAUDI", marketCap: "صغير", pe: 27.5, eps: 1.6, dividend: 0.7 },
  { symbol: "8160", name: "العالمية", sector: "التأمين", market: "SAUDI", marketCap: "صغير", pe: 28.5, eps: 1.5, dividend: 0.6 },
  { symbol: "8170", name: "أمانة للتأمين", sector: "التأمين", market: "SAUDI", marketCap: "صغير", pe: 22.5, eps: 2.0, dividend: 1.2 },
  { symbol: "8180", name: "عناية", sector: "التأمين", market: "SAUDI", marketCap: "صغير", pe: 23.5, eps: 1.9, dividend: 1.1 },
  { symbol: "8190", name: "المتحدة للتأمين", sector: "التأمين", market: "SAUDI", marketCap: "صغير", pe: 24.5, eps: 1.8, dividend: 1.0 },
  { symbol: "8200", name: "إعادة", sector: "التأمين", market: "SAUDI", marketCap: "صغير", pe: 25.5, eps: 1.7, dividend: 0.9 },
  { symbol: "8210", name: "بُوبا العربية", sector: "التأمين", market: "SAUDI", marketCap: "كبير", pe: 16.5, eps: 3.5, dividend: 2.0 },
  { symbol: "8230", name: "تكافل الراجحي", sector: "التأمين", market: "SAUDI", marketCap: "متوسط", pe: 17.5, eps: 3.0, dividend: 1.8 },
  { symbol: "8240", name: "تشب", sector: "التأمين", market: "SAUDI", marketCap: "صغير", pe: 21.5, eps: 2.2, dividend: 1.3 },
  { symbol: "8312", name: "الإنماء طوكيو مارين", sector: "التأمين", market: "SAUDI", marketCap: "صغير", pe: 22.5, eps: 2.1, dividend: 1.2 }
];

// ==================== القائمة الكاملة للأسهم الأمريكية ====================
const usStocksDatabase = [
  { symbol: "AAPL", name: "Apple Inc.", sector: "التقنية", market: "US", marketCap: "كبير", pe: 28.5, eps: 6.2, dividend: 0.5 },
  { symbol: "MSFT", name: "Microsoft Corp.", sector: "التقنية", market: "US", marketCap: "كبير", pe: 32.1, eps: 11.5, dividend: 0.8 },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "التقنية", market: "US", marketCap: "كبير", pe: 25.3, eps: 5.8, dividend: 0 },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "التجارة الإلكترونية", market: "US", marketCap: "كبير", pe: 48.2, eps: 3.2, dividend: 0 },
  { symbol: "NVDA", name: "NVIDIA Corp.", sector: "التقنية", market: "US", marketCap: "كبير", pe: 58.3, eps: 4.5, dividend: 0.1 },
  { symbol: "META", name: "Meta Platforms Inc.", sector: "التقنية", market: "US", marketCap: "كبير", pe: 22.7, eps: 14.2, dividend: 0 },
  { symbol: "TSLA", name: "Tesla Inc.", sector: "السيارات", market: "US", marketCap: "كبير", pe: 65.4, eps: 3.8, dividend: 0 },
  { symbol: "UNH", name: "UnitedHealth Group", sector: "الصحة", market: "US", marketCap: "كبير", pe: 24.5, eps: 22.5, dividend: 1.5 },
  { symbol: "JNJ", name: "Johnson & Johnson", sector: "الصحة", market: "US", marketCap: "كبير", pe: 23.4, eps: 7.2, dividend: 2.5 },
  { symbol: "JPM", name: "JPMorgan Chase", sector: "البنوك", market: "US", marketCap: "كبير", pe: 11.5, eps: 15.3, dividend: 2.8 },
  { symbol: "V", name: "Visa Inc.", sector: "المدفوعات", market: "US", marketCap: "كبير", pe: 31.2, eps: 8.5, dividend: 0.7 },
  { symbol: "PG", name: "Procter & Gamble", sector: "السلع", market: "US", marketCap: "كبير", pe: 24.6, eps: 6.1, dividend: 2.3 },
  { symbol: "HD", name: "Home Depot Inc.", sector: "التجزئة", market: "US", marketCap: "كبير", pe: 25.1, eps: 16.5, dividend: 2.2 },
  { symbol: "MA", name: "Mastercard Inc.", sector: "المدفوعات", market: "US", marketCap: "كبير", pe: 35.2, eps: 10.2, dividend: 0.5 },
  { symbol: "BAC", name: "Bank of America", sector: "البنوك", market: "US", marketCap: "كبير", pe: 10.2, eps: 3.8, dividend: 2.1 },
  { symbol: "KO", name: "Coca-Cola Co.", sector: "المشروبات", market: "US", marketCap: "كبير", pe: 26.5, eps: 2.5, dividend: 2.8 },
  { symbol: "PEP", name: "PepsiCo Inc.", sector: "المشروبات", market: "US", marketCap: "كبير", pe: 27.8, eps: 6.7, dividend: 2.5 },
  { symbol: "COST", name: "Costco Wholesale", sector: "التجزئة", market: "US", marketCap: "كبير", pe: 38.5, eps: 13.2, dividend: 0.7 },
  { symbol: "DIS", name: "Walt Disney Co.", sector: "الترفيه", market: "US", marketCap: "كبير", pe: 35.2, eps: 4.2, dividend: 0 },
  { symbol: "NFLX", name: "Netflix Inc.", sector: "الترفيه", market: "US", marketCap: "كبير", pe: 42.5, eps: 12.5, dividend: 0 },
  { symbol: "ADBE", name: "Adobe Inc.", sector: "التقنية", market: "US", marketCap: "كبير", pe: 45.2, eps: 10.5, dividend: 0 },
  { symbol: "CRM", name: "Salesforce Inc.", sector: "التقنية", market: "US", marketCap: "كبير", pe: 55.1, eps: 6.2, dividend: 0 },
  { symbol: "ORCL", name: "Oracle Corp.", sector: "التقنية", market: "US", marketCap: "كبير", pe: 28.5, eps: 4.5, dividend: 1.4 },
  { symbol: "IBM", name: "IBM Corp.", sector: "التقنية", market: "US", marketCap: "كبير", pe: 22.5, eps: 9.5, dividend: 4.2 },
  { symbol: "INTC", name: "Intel Corp.", sector: "التقنية", market: "US", marketCap: "كبير", pe: 25.2, eps: 1.8, dividend: 1.5 },
  { symbol: "AMD", name: "AMD Inc.", sector: "التقنية", market: "US", marketCap: "كبير", pe: 85.2, eps: 0.9, dividend: 0 },
  { symbol: "QCOM", name: "Qualcomm Inc.", sector: "التقنية", market: "US", marketCap: "كبير", pe: 18.5, eps: 7.5, dividend: 2.1 },
  { symbol: "TXN", name: "Texas Instruments", sector: "التقنية", market: "US", marketCap: "كبير", pe: 22.5, eps: 8.2, dividend: 2.5 },
  { symbol: "AVGO", name: "Broadcom Inc.", sector: "التقنية", market: "US", marketCap: "كبير", pe: 28.5, eps: 30.2, dividend: 2.8 },
  { symbol: "WMT", name: "Walmart Inc.", sector: "التجزئة", market: "US", marketCap: "كبير", pe: 28.1, eps: 2.5, dividend: 1.4 },
  { symbol: "XOM", name: "Exxon Mobil Corp.", sector: "الطاقة", market: "US", marketCap: "كبير", pe: 9.8, eps: 12.5, dividend: 3.4 },
  { symbol: "CVX", name: "Chevron Corp.", sector: "الطاقة", market: "US", marketCap: "كبير", pe: 10.5, eps: 11.2, dividend: 3.5 },
  { symbol: "LLY", name: "Eli Lilly & Co.", sector: "الصحة", market: "US", marketCap: "كبير", pe: 65.2, eps: 8.5, dividend: 1.0 },
  { symbol: "MRK", name: "Merck & Co.", sector: "الصحة", market: "US", marketCap: "كبير", pe: 22.5, eps: 5.8, dividend: 2.8 },
  { symbol: "ABBV", name: "AbbVie Inc.", sector: "الصحة", market: "US", marketCap: "كبير", pe: 24.5, eps: 10.5, dividend: 3.5 },
  { symbol: "PFE", name: "Pfizer Inc.", sector: "الصحة", market: "US", marketCap: "كبير", pe: 18.5, eps: 3.8, dividend: 4.2 },
  { symbol: "TMO", name: "Thermo Fisher", sector: "الصحة", market: "US", marketCap: "كبير", pe: 28.5, eps: 18.5, dividend: 0.2 },
  { symbol: "ACN", name: "Accenture plc", sector: "الخدمات", market: "US", marketCap: "كبير", pe: 30.2, eps: 11.5, dividend: 1.5 },
  { symbol: "CSCO", name: "Cisco Systems", sector: "التقنية", market: "US", marketCap: "كبير", pe: 18.5, eps: 3.5, dividend: 3.2 },
  { symbol: "CMCSA", name: "Comcast Corp.", sector: "الاتصالات", market: "US", marketCap: "كبير", pe: 15.2, eps: 3.8, dividend: 2.5 },
  { symbol: "VZ", name: "Verizon Communications", sector: "الاتصالات", market: "US", marketCap: "كبير", pe: 12.5, eps: 5.2, dividend: 5.5 },
  { symbol: "T", name: "AT&T Inc.", sector: "الاتصالات", market: "US", marketCap: "كبير", pe: 8.5, eps: 2.2, dividend: 6.5 },
  { symbol: "NKE", name: "Nike Inc.", sector: "الملابس", market: "US", marketCap: "كبير", pe: 32.5, eps: 3.2, dividend: 1.2 },
  { symbol: "SBUX", name: "Starbucks Corp.", sector: "المشروبات", market: "US", marketCap: "كبير", pe: 28.5, eps: 3.5, dividend: 2.0 },
  { symbol: "MCD", name: "McDonald's Corp.", sector: "الوجبات", market: "US", marketCap: "كبير", pe: 26.5, eps: 9.5, dividend: 2.2 },
  { symbol: "LOW", name: "Lowe's Companies", sector: "التجزئة", market: "US", marketCap: "كبير", pe: 22.5, eps: 12.5, dividend: 1.8 },
  { symbol: "GS", name: "Goldman Sachs", sector: "البنوك", market: "US", marketCap: "كبير", pe: 12.5, eps: 30.2, dividend: 2.5 },
  { symbol: "MS", name: "Morgan Stanley", sector: "البنوك", market: "US", marketCap: "كبير", pe: 13.5, eps: 7.5, dividend: 3.2 },
  { symbol: "C", name: "Citigroup Inc.", sector: "البنوك", market: "US", marketCap: "كبير", pe: 9.5, eps: 6.2, dividend: 4.2 },
  { symbol: "WFC", name: "Wells Fargo & Co.", sector: "البنوك", market: "US", marketCap: "كبير", pe: 11.5, eps: 4.5, dividend: 2.8 },
  { symbol: "SCHW", name: "Charles Schwab", sector: "الخدمات المالية", market: "US", marketCap: "كبير", pe: 18.5, eps: 4.2, dividend: 1.2 },
  { symbol: "BLK", name: "BlackRock Inc.", sector: "الخدمات المالية", market: "US", marketCap: "كبير", pe: 22.5, eps: 38.5, dividend: 2.8 },
  { symbol: "BX", name: "Blackstone Inc.", sector: "الخدمات المالية", market: "US", marketCap: "كبير", pe: 28.5, eps: 5.5, dividend: 4.5 },
  { symbol: "BA", name: "Boeing Co.", sector: "الطيران", market: "US", marketCap: "كبير", pe: -12.5, eps: -5.2, dividend: 0 },
  { symbol: "CAT", name: "Caterpillar Inc.", sector: "المعدات", market: "US", marketCap: "كبير", pe: 18.5, eps: 12.5, dividend: 2.2 },
  { symbol: "GE", name: "General Electric", sector: "الصناعات", market: "US", marketCap: "كبير", pe: 22.5, eps: 4.2, dividend: 0.5 },
  { symbol: "HON", name: "Honeywell", sector: "الصناعات", market: "US", marketCap: "كبير", pe: 25.5, eps: 8.5, dividend: 2.1 },
  { symbol: "RTX", name: "RTX Corp.", sector: "الدفاع", market: "US", marketCap: "كبير", pe: 20.5, eps: 5.2, dividend: 2.5 },
  { symbol: "LMT", name: "Lockheed Martin", sector: "الدفاع", market: "US", marketCap: "كبير", pe: 18.5, eps: 25.5, dividend: 2.8 },
  { symbol: "GD", name: "General Dynamics", sector: "الدفاع", market: "US", marketCap: "كبير", pe: 16.5, eps: 12.5, dividend: 2.2 },
  { symbol: "NOC", name: "Northrop Grumman", sector: "الدفاع", market: "US", marketCap: "كبير", pe: 17.5, eps: 24.5, dividend: 1.8 },
  { symbol: "SPGI", name: "S&P Global Inc.", sector: "الخدمات المالية", market: "US", marketCap: "كبير", pe: 32.5, eps: 12.5, dividend: 1.0 },
  { symbol: "INTU", name: "Intuit Inc.", sector: "التقنية", market: "US", marketCap: "كبير", pe: 55.2, eps: 7.5, dividend: 0.6 },
  { symbol: "NOW", name: "ServiceNow Inc.", sector: "التقنية", market: "US", marketCap: "كبير", pe: 75.2, eps: 5.2, dividend: 0 },
  { symbol: "PANW", name: "Palo Alto Networks", sector: "الأمن السيبراني", market: "US", marketCap: "كبير", pe: 85.2, eps: 3.5, dividend: 0 },
  { symbol: "SNOW", name: "Snowflake Inc.", sector: "التقنية", market: "US", marketCap: "كبير", pe: -45.2, eps: -2.5, dividend: 0 },
  { symbol: "PLTR", name: "Palantir Technologies", sector: "التقنية", market: "US", marketCap: "كبير", pe: 65.2, eps: 0.3, dividend: 0 },
  { symbol: "UBER", name: "Uber Technologies", sector: "النقل", market: "US", marketCap: "كبير", pe: 85.2, eps: 0.8, dividend: 0 },
  { symbol: "ABNB", name: "Airbnb Inc.", sector: "السياحة", market: "US", marketCap: "كبير", pe: 35.2, eps: 4.5, dividend: 0 },
  { symbol: "BKNG", name: "Booking Holdings", sector: "السياحة", market: "US", marketCap: "كبير", pe: 22.5, eps: 105.2, dividend: 0 },
  { symbol: "MAR", name: "Marriott International", sector: "السياحة", market: "US", marketCap: "كبير", pe: 25.2, eps: 8.5, dividend: 0.8 },
  { symbol: "HLT", name: "Hilton Worldwide", sector: "السياحة", market: "US", marketCap: "كبير", pe: 28.5, eps: 5.2, dividend: 0.6 },
  { symbol: "DAL", name: "Delta Air Lines", sector: "الطيران", market: "US", marketCap: "كبير", pe: 8.5, eps: 6.2, dividend: 1.2 },
  { symbol: "AAL", name: "American Airlines", sector: "الطيران", market: "US", marketCap: "كبير", pe: 12.5, eps: 2.5, dividend: 0 },
  { symbol: "UPS", name: "United Parcel Service", sector: "النقل", market: "US", marketCap: "كبير", pe: 18.5, eps: 12.5, dividend: 3.5 },
  { symbol: "FDX", name: "FedEx Corp.", sector: "النقل", market: "US", marketCap: "كبير", pe: 15.5, eps: 18.5, dividend: 2.2 },
  { symbol: "DE", name: "Deere & Co.", sector: "المعدات", market: "US", marketCap: "كبير", pe: 14.5, eps: 28.5, dividend: 1.8 },
  { symbol: "MMM", name: "3M Company", sector: "الصناعات", market: "US", marketCap: "كبير", pe: 12.5, eps: 8.5, dividend: 4.5 },
  { symbol: "EMR", name: "Emerson Electric", sector: "الصناعات", market: "US", marketCap: "كبير", pe: 22.5, eps: 5.2, dividend: 2.2 },
  { symbol: "ETN", name: "Eaton Corporation", sector: "الصناعات", market: "US", marketCap: "كبير", pe: 28.5, eps: 7.5, dividend: 1.8 },
  { symbol: "ITW", name: "Illinois Tool Works", sector: "الصناعات", market: "US", marketCap: "كبير", pe: 25.2, eps: 9.5, dividend: 2.2 },
  { symbol: "PH", name: "Parker-Hannifin", sector: "الصناعات", market: "US", marketCap: "كبير", pe: 22.5, eps: 18.5, dividend: 1.5 },
  { symbol: "CMI", name: "Cummins Inc.", sector: "المعدات", market: "US", marketCap: "كبير", pe: 18.5, eps: 16.5, dividend: 2.5 },
  { symbol: "PCAR", name: "PACCAR Inc.", sector: "المعدات", market: "US", marketCap: "كبير", pe: 14.5, eps: 8.5, dividend: 3.2 },
  { symbol: "F", name: "Ford Motor Co.", sector: "السيارات", market: "US", marketCap: "كبير", pe: 8.5, eps: 2.2, dividend: 4.5 },
  { symbol: "GM", name: "General Motors", sector: "السيارات", market: "US", marketCap: "كبير", pe: 6.5, eps: 7.5, dividend: 1.2 },
  { symbol: "TM", name: "Toyota Motor Corp.", sector: "السيارات", market: "US", marketCap: "كبير", pe: 10.5, eps: 22.5, dividend: 2.2 },
  { symbol: "HMC", name: "Honda Motor Co.", sector: "السيارات", market: "US", marketCap: "كبير", pe: 9.5, eps: 12.5, dividend: 3.2 }
];

// دمج جميع الأسهم
const stocksDatabase = [...saudiStocksDatabase, ...usStocksDatabase];

// ==================== دوال التحليل الفني ====================

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
  return { r0: low, r236: +(low + diff * 0.236).toFixed(2), r382: +(low + diff * 0.382).toFixed(2), r500: +(low + diff * 0.5).toFixed(2), r618: +(low + diff * 0.618).toFixed(2), r786: +(low + diff * 0.786).toFixed(2), r100: high };
};

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

function findStock(query) {
  if (!query) return null;
  const searchTerm = query.toString().toUpperCase().trim();
  return stocksDatabase.find(s => s.symbol === searchTerm || s.name.toUpperCase().includes(searchTerm));
}

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

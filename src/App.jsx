import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Train, 
  Clock, 
  Utensils, 
  Camera, 
  Ticket, 
  Bus, 
  Plane, 
  Sun,
  Navigation,
  Landmark,
  Feather,
  Map as MapIcon,
  X,
  BookOpen,
  History,
  Star,
  Sparkles
} from 'lucide-react';

// --- 資料來源 ---
const TRIP_DATA = {
  title: "Grand Tour of Italia",
  subtitle: "XV Days Journey",
  days: [
    {
      id: 1,
      date: "12/24",
      dayName: "Wed",
      city: "米蘭 → 佛羅倫斯",
      title: "平安夜抵達",
      weather: "8°C",
      events: [
        { 
          time: "11:30", type: "transport", title: "米蘭中央車站", desc: "MXP 機場接駁抵達", sub: "巴士下車點", icon: <Bus />, 
          lat: 45.4859, lng: 9.2035, query: "Milano Centrale",
          details: {
            history: "米蘭中央車站建於 1931 年，受墨索里尼要求，融合了新藝術運動 (Art Nouveau) 與裝飾藝術 (Art Deco) 風格，旨在展現法西斯政權的力量與威嚴。",
            highlights: ["巨大的鋼鐵與玻璃拱頂", "21號月台 (Binario 21，猶太人大屠殺紀念地)", "華麗的馬賽克與石雕"],
            tips: "車站非常大且人流混雜，請隨時注意扒手。廁所需付費。"
          }
        },
        { time: "13:00", type: "food", title: "Mercato Centrale", desc: "中央市場午餐", sub: "寄放行李", icon: <Utensils />, lat: 45.4865, lng: 9.2016, query: "Mercato Centrale Milano" },
        { time: "15:40", type: "transport", title: "搭乘高鐵", desc: "前往佛羅倫斯", sub: "Frecciarossa", icon: <Train />, lat: 45.4859, lng: 9.2035, query: "Milano Centrale" },
        { time: "17:35", type: "transport", title: "抵達佛羅倫斯", desc: "S.M.N. 車站", sub: "Firenze S.M.N.", icon: <MapPin />, lat: 43.7764, lng: 11.2479, query: "Florence Santa Maria Novella" },
        { 
          time: "23:00", type: "activity", title: "聖母百花大教堂", desc: "午夜彌撒", sub: "需提早排隊", icon: <Clock />, 
          lat: 43.7731, lng: 11.2560, query: "Cathedral of Santa Maria del Fiore",
          details: {
            history: "這座教堂耗時 140 年才建成。最著名的是布魯內萊斯基 (Brunelleschi) 設計的巨大紅色穹頂，在沒有鷹架的情況下建成，是建築史上的奇蹟。",
            highlights: ["布魯內萊斯基的穹頂", "喬托鐘樓 (Giotto's Campanile)", "天堂之門 (洗禮堂)"],
            tips: "午夜彌撒人潮眾多，建議 21:30 前往排隊。進入教堂需穿著端莊（不露肩膝）。"
          }
        }
      ]
    },
    {
      id: 2,
      date: "12/25",
      dayName: "Thu",
      city: "威尼斯一日遊",
      title: "水都威尼斯",
      weather: "6°C",
      events: [
        { 
          time: "11:00", type: "transport", title: "S. Lucia 車站", desc: "抵達威尼斯", icon: <Train />, 
          lat: 45.4411, lng: 12.3210, query: "Venezia Santa Lucia",
          details: {
            history: "威尼斯共和國曾是地中海最強大的海權國家。這座城市完全建立在木樁之上，運用潟湖作為天然防禦。",
            highlights: ["大運河 (Grand Canal)", "里亞托橋 (Rialto Bridge)", "貢多拉船"],
            tips: "聖誕節當天許多店家可能休息，建議預先確認餐廳。"
          }
        },
        { 
          time: "11:40", type: "activity", title: "安康聖母聖殿", desc: "免費參觀", icon: <Landmark />, 
          lat: 45.4308, lng: 12.3343, query: "Basilica di Santa Maria della Salute",
          details: {
            history: "1630 年威尼斯爆發黑死病，奪走三分之一人口。倖存者為感謝聖母庇佑而建此教堂，它是威尼斯巴洛克建築的傑作。",
            highlights: ["巨大的八角形圓頂", "提香 (Titian) 的畫作", "大運河口的絕佳視角"],
            tips: "進入參觀免費，但若要進入祭衣間看名畫需購票。"
          }
        },
        { time: "16:00", type: "highlight", title: "學院橋", desc: "絕美夕陽 (16:30落)", icon: <Sun />, lat: 45.4316, lng: 12.3286, query: "Ponte dell'Accademia" }
      ]
    },
    {
      id: 3,
      date: "12/26",
      dayName: "Fri",
      city: "比薩",
      title: "比薩斜塔",
      weather: "7°C",
      events: [
        { time: "09:54", type: "transport", title: "Pisa S. Rossore", desc: "抵達車站", sub: "離斜塔最近", icon: <Train />, lat: 43.7215, lng: 10.3920, query: "Pisa San Rossore" },
        { 
          time: "10:00", type: "activity", title: "比薩斜塔", desc: "奇蹟廣場拍照", icon: <Camera />, 
          lat: 43.7230, lng: 10.3966, query: "Leaning Tower of Pisa",
          details: {
            history: "始建於 1173 年，因地基土層鬆軟，蓋到第三層就開始傾斜。伽利略曾在此做過著名的自由落體實驗（傳說）。",
            highlights: ["傾斜的鐘塔 (目前傾斜約 4 度)", "主教堂 (Duomo)", "洗禮堂 (音效極佳)"],
            tips: "拍攝「推塔」照片的最佳位置在草坪外圍的護欄石墩上。登塔需提前寄放包包。"
          }
        }
      ]
    },
    {
      id: 4,
      date: "12/27",
      dayName: "Sat",
      city: "佛羅倫斯",
      title: "文藝復興",
      events: [
        { time: "10:00", type: "activity", title: "聖母百花大教堂", desc: "參觀內部", icon: <Landmark />, lat: 43.7731, lng: 11.2560, query: "Cathedral of Santa Maria del Fiore" },
        { time: "12:00", type: "food", title: "Trattoria Garga", desc: "丁骨牛排", icon: <Utensils />, lat: 43.7744, lng: 11.2505, query: "Trattoria Garga Florence" },
        { 
          time: "16:00", type: "highlight", title: "米開朗基羅廣場", desc: "俯瞰全城日落", icon: <Sun />, 
          lat: 43.7629, lng: 11.2651, query: "Piazzale Michelangelo",
          details: {
            history: "建於 1869 年，當時佛羅倫斯是義大利的臨時首都。廣場中央有一座青銅製的大衛像複製品。",
            highlights: ["佛羅倫斯全景", "阿諾河日落", "大衛像複製品"],
            tips: "這裡是免費的，帶上一瓶酒和一些小吃，坐在階梯上等待日落是最道地的體驗。"
          }
        }
      ]
    },
    {
      id: 5,
      date: "12/28",
      dayName: "Sun",
      city: "羅馬",
      title: "永恆之城",
      events: [
        { time: "11:22", type: "transport", title: "Roma Termini", desc: "抵達羅馬", sub: "中央車站", icon: <Train />, lat: 41.9009, lng: 12.5020, query: "Roma Termini" },
        { 
          time: "16:00", type: "activity", title: "西班牙階梯", desc: "漫步起點", icon: <MapPin />, 
          lat: 41.9057, lng: 12.4823, query: "Spanish Steps",
          details: {
            history: "全歐洲最寬的階梯，建於 1723 年，為了連接下方的西班牙大使館和上方的山上天主聖三教堂。",
            highlights: ["破船噴泉 (貝尼尼之父設計)", "濟慈-雪萊故居", "時尚精品街 (Via Condotti)"],
            tips: "注意！羅馬法律禁止在階梯上坐下或是吃東西，警察會巡邏開罰單。"
          }
        },
        { 
          time: "17:00", type: "activity", title: "特雷維噴泉", desc: "許願池", icon: <Camera />, 
          lat: 41.9009, lng: 12.4833, query: "Trevi Fountain",
          details: {
            history: "羅馬最大的巴洛克風格噴泉，水源來自公元前 19 年的維爾戈水道。海神尼普頓是雕塑的主角。",
            highlights: ["海神雕像", "投擲硬幣許願", "夜間燈光秀"],
            tips: "傳說：背對噴泉右手拿硬幣從左肩丟入，第一枚代表重回羅馬，第二枚代表遇到真愛，第三枚代表結婚。"
          }
        }
      ]
    },
    {
      id: 6,
      date: "12/29",
      dayName: "Mon",
      city: "Orvieto",
      title: "天空之城",
      events: [
        { time: "10:26", type: "transport", title: "Orvieto Stazione", desc: "抵達火車站", sub: "轉巴士處", icon: <Bus />, lat: 42.7243, lng: 12.1274, query: "Orvieto Station" },
        { 
          time: "15:10", type: "highlight", title: "Civita di Bagnoregio", desc: "天空之城橋頭", sub: "步行上橋", icon: <Camera />, 
          lat: 42.6277, lng: 12.1136, query: "Civita di Bagnoregio Ticket Office",
          details: {
            history: "這是一座建立在凝灰岩上的中世紀古城，因地質脆弱不斷崩塌，被稱為「垂死之城」。據說是宮崎駿《天空之城》的靈感來源。",
            highlights: ["唯一的聯外長橋", "中世紀石屋", "貓咪居民"],
            tips: "橋樑坡度較陡，風大時需注意保暖。進城需支付門票費用以維護古蹟。"
          }
        }
      ]
    },
    {
      id: 7,
      date: "12/30",
      dayName: "Tue",
      city: "梵蒂岡",
      title: "教廷巡禮",
      events: [
        { 
          time: "12:00", type: "ticket", title: "聖伯多祿大殿", desc: "圓頂入口", sub: "Code: 84068", icon: <Ticket />, 
          lat: 41.9022, lng: 12.4533, query: "St. Peter's Basilica",
          details: {
            history: "天主教最神聖的地點之一，建於使徒聖彼得的墓地上。目前的教堂重建於文藝復興時期，由米開朗基羅設計穹頂。",
            highlights: ["米開朗基羅《聖殤》", "貝尼尼《青銅華蓋》", "聖彼得銅像"],
            tips: "登頂可以俯瞰聖彼得廣場的鑰匙形狀，非常壯觀。記得穿著符合規定的服裝。"
          }
        },
        { 
          time: "15:00", type: "ticket", title: "梵蒂岡博物館", desc: "入口處", sub: "Code: 21333DD", icon: <Ticket />, 
          lat: 41.9065, lng: 12.4536, query: "Vatican Museums Entrance",
          details: {
            history: "世界上最偉大的博物館之一，收藏了歷代教宗累積的藝術珍品。最著名的是西斯汀禮拜堂。",
            highlights: ["地圖廊 (Gallery of Maps)", "拉斐爾畫室", "西斯汀禮拜堂 (最後的審判)"],
            tips: "西斯汀禮拜堂內嚴禁拍照和說話。建議租借語音導覽以了解《創世紀》壁畫細節。"
          }
        }
      ]
    },
    {
      id: 8,
      date: "12/31",
      dayName: "Wed",
      city: "羅馬",
      title: "競技場跨年",
      events: [
        { 
          time: "09:00", type: "ticket", title: "羅馬競技場", desc: "Full Experience", sub: "遊客入口", icon: <Ticket />, 
          lat: 41.8902, lng: 12.4922, query: "Colosseum",
          details: {
            history: "公元 80 年完工，可容納 5-8 萬名觀眾。這裡是角鬥士與猛獸搏鬥的場所，展示了羅馬帝國的娛樂與工程技術。",
            highlights: ["地下層 (Hypogeum)", "第三環頂層景觀", "君士坦丁凱旋門 (旁邊)"],
            tips: "您購買的是 Full Experience 票，包含地下層和頂層，請務必按照預約時間提早 15 分鐘抵達安檢。"
          }
        },
        { time: "16:20", type: "highlight", title: "賈尼科洛山", desc: "最後一道夕陽", icon: <Sun />, lat: 41.8913, lng: 12.4614, query: "Terrazza del Gianicolo" },
        { time: "23:50", type: "activity", title: "聖天使城堡", desc: "跨年煙火", icon: <Clock />, lat: 41.9031, lng: 12.4663, query: "Castel Sant'Angelo" }
      ]
    },
    {
      id: 9,
      date: "01/01",
      dayName: "Thu",
      city: "巴里",
      title: "前往南義",
      events: [
        { time: "14:23", type: "transport", title: "Bari Centrale", desc: "抵達巴里", sub: "南義樞紐", icon: <Train />, lat: 41.1171, lng: 16.8705, query: "Bari Centrale" }
      ]
    },
    {
      id: 10,
      date: "01/02",
      dayName: "Fri",
      city: "馬泰拉",
      title: "石頭城",
      events: [
        { time: "09:00", type: "transport", title: "FAL 火車站", desc: "Bari FAL 站", sub: "搭私鐵", icon: <Train />, lat: 41.1176, lng: 16.8680, query: "Stazione Bari Centrale FAL" },
        { 
          time: "10:30", type: "activity", title: "馬泰拉 Sassi", desc: "觀景台", sub: "必看夜景", icon: <Camera />, 
          lat: 40.6664, lng: 16.6111, query: "Belvedere di Piazza Giovanni Pascoli",
          details: {
            history: "世界上最古老的人類居住地之一，舊石器時代就有人居住。這裡的 Sassi (石窟民居) 曾被視為貧窮的象徵，現在則是世界文化遺產，也是電影《007：生死交戰》拍攝地。",
            highlights: ["石窟教堂 (Rupestrian Churches)", "洞穴屋博物館", "夜晚的燈火"],
            tips: "這裡階梯非常多，建議穿著最好走的鞋子。日落後的藍調時刻 (Blue Hour) 是拍照的黃金時間。"
          }
        }
      ]
    },
    {
      id: 11,
      date: "01/03",
      dayName: "Sat",
      city: "普利亞",
      title: "蘑菇村",
      events: [
        { 
          time: "10:30", type: "activity", title: "Alberobello", desc: "Trulli 建築群", icon: <MapPin />, 
          lat: 40.7836, lng: 17.2367, query: "Trulli di Alberobello",
          details: {
            history: "這些圓錐頂的白色小屋 (Trulli) 起源於 14 世紀。傳說是當地伯爵為了逃稅，命令居民用乾石堆砌房子，以便在稅務官來查時能迅速拆除屋頂，假裝這裡無人居住。",
            highlights: ["蒙蒂區 (Rione Monti - 商業區)", "阿亞小區 (Rione Aia Piccola - 住宅區)", "Trullo Sovrano (唯一的雙層圓頂屋)"],
            tips: "屋頂上的白色符號通常具有宗教或神秘意義，可以找找看不同的圖案。"
          }
        },
        { time: "15:40", type: "activity", title: "Polignano a Mare", desc: "濱海懸崖", icon: <Sun />, lat: 40.9961, lng: 17.2195, query: "Lama Monachile" }
      ]
    },
    {
      id: 12,
      date: "01/04",
      dayName: "Sun",
      city: "米蘭",
      title: "返回北義",
      events: [
        { time: "11:00", type: "transport", title: "Bari Airport", desc: "飛往米蘭", icon: <Plane />, lat: 41.1381, lng: 16.7606, query: "Bari Karol Wojtyła Airport" },
        { time: "19:00", type: "food", title: "Navigli 運河", desc: "Happy Hour", icon: <Utensils />, lat: 45.4513, lng: 9.1722, query: "Navigli Grande" }
      ]
    },
    {
      id: 13,
      date: "01/05",
      dayName: "Mon",
      city: "Sirmione",
      title: "加達湖",
      events: [
        { 
          time: "11:30", type: "activity", title: "水上城堡", desc: "Scaligero Castle", icon: <Landmark />, 
          lat: 45.4925, lng: 10.6081, query: "Scaligero Castle",
          details: {
            history: "這座城堡建於 13 世紀，是斯卡拉家族為了防禦和展示權力而建。它是義大利保存最完好的湖上城堡之一，三面環水。",
            highlights: ["城堡塔樓登頂", "護城河與吊橋", "卡圖盧斯石窟 (Grotte di Catullo - 羅馬別墅遺跡)"],
            tips: "登塔可以看到加達湖與阿爾卑斯山的絕美景色。"
          }
        }
      ]
    },
    {
      id: 14,
      date: "01/06",
      dayName: "Tue",
      city: "米蘭",
      title: "時尚之都",
      events: [
        { 
          time: "09:30", type: "activity", title: "米蘭大教堂", desc: "登頂與內部", icon: <Ticket />, 
          lat: 45.4641, lng: 9.1919, query: "Duomo di Milano",
          details: {
            history: "歷經五個世紀才完工的哥德式建築傑作。拿破崙曾在此加冕為義大利國王。它是世界第三大教堂。",
            highlights: ["金色聖母像 (Madonnina)", "3000 多座雕像", "精美的彩繪玻璃窗"],
            tips: "一定要登頂！走樓梯比較便宜，搭電梯比較輕鬆。頂樓可以近距離看到飛扶壁的細節。"
          }
        },
        { time: "14:00", type: "food", title: "星巴克烘焙工坊", desc: "Piazza Cordusio", icon: <Clock />, lat: 45.4651, lng: 9.1859, query: "Starbucks Reserve Roastery Milano" }
      ]
    },
    {
      id: 15,
      date: "01/07",
      dayName: "Wed",
      city: "米蘭",
      title: "賦歸",
      events: [
        { time: "11:00", type: "transport", title: "MXP 機場", desc: "搭機返台", icon: <Plane />, lat: 45.6281, lng: 8.7118, query: "Malpensa Airport" }
      ]
    }
  ]
};

// --- 景點解說彈窗組件 (Guide Modal) ---
const GuideModal = ({ attraction, onClose }) => {
  if (!attraction || !attraction.details) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* 羊皮紙風格容器 */}
      <div className="bg-[#Fdfbf7] w-full max-w-sm max-h-[85vh] overflow-y-auto rounded-xl border-2 border-[#D2B48C] shadow-2xl relative">
        
        {/* 頂部裝飾 */}
        <div className="sticky top-0 bg-[#F4F1EA] border-b border-[#D7CDC1] p-4 flex justify-between items-start z-10">
          <div>
            <div className="flex items-center gap-2 text-[#8B5E3C] text-xs font-bold uppercase tracking-widest mb-1">
              <Landmark size={14} />
              Sightseeing Guide
            </div>
            <h3 className="text-2xl font-serif font-black text-[#5D4037] leading-tight pr-8">
              {attraction.title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="bg-[#EAE4DC] p-2 rounded-full hover:bg-[#D7CDC1] transition-colors text-[#5D4037]"
          >
            <X size={20} />
          </button>
        </div>

        {/* 內容區域 */}
        <div className="p-6 space-y-6">
          
          {/* Section: History */}
          <div>
            <h4 className="flex items-center gap-2 font-bold text-[#A0522D] mb-2 font-serif text-lg">
              <History size={18} />
              歷史起源
            </h4>
            <p className="text-[#6D5D50] text-sm leading-relaxed bg-[#F9F7F4] p-3 rounded-lg border border-[#E5E0D8]">
              {attraction.details.history}
            </p>
          </div>

          {/* Section: Highlights */}
          <div>
            <h4 className="flex items-center gap-2 font-bold text-[#DAA520] mb-2 font-serif text-lg">
              <Star size={18} />
              必看重點
            </h4>
            <ul className="space-y-2">
              {attraction.details.highlights.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-[#5D4037]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520] mt-1.5 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Section: Tips */}
          <div>
            <h4 className="flex items-center gap-2 font-bold text-[#8B4513] mb-2 font-serif text-lg">
              <Sparkles size={18} />
              嚮導小撇步
            </h4>
            <p className="text-[#6D5D50] text-sm leading-relaxed italic">
              "{attraction.details.tips}"
            </p>
          </div>

          {/* Decorative Divider */}
          <div className="flex justify-center opacity-30 pt-2">
            <Feather className="text-[#8B5E3C]" />
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [activeDayId, setActiveDayId] = useState(1);
  const [mapCenter, setMapCenter] = useState(null);
  const [selectedAttraction, setSelectedAttraction] = useState(null); // 控制彈窗
  const scrollRef = useRef(null);
  
  const currentDay = TRIP_DATA.days.find(d => d.id === activeDayId);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      const selectedEl = scrollRef.current.children[activeDayId - 1];
      if (selectedEl) {
        selectedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
    setMapCenter(null);
  }, [activeDayId]);

  // Google Maps Helpers
  const getMapUrl = (lat, lng, query) => {
    const encodedQuery = encodeURIComponent(query);
    return `https://maps.google.com/maps?q=${encodedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  const openGoogleMapApp = (query) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#Fdfbf7] text-[#4a4036] font-sans relative overflow-hidden">
      
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      {/* Header */}
      <div className="relative z-20 bg-[#F4F1EA] pt-12 pb-2 px-6 shadow-sm border-b border-[#D7Cdc1]">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase mb-1">
              {TRIP_DATA.subtitle}
            </h2>
            <h1 className="text-3xl font-serif font-black text-[#5D4037] leading-none">
              {TRIP_DATA.title}
            </h1>
          </div>
          <Landmark className="text-[#8B5E3C] opacity-80" size={32} strokeWidth={1.5} />
        </div>

        {/* Date Selector */}
        <div className="mt-6 -mx-6 px-6">
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-3 pb-4 snap-x no-scrollbar"
          >
            {TRIP_DATA.days.map((day) => {
              const isActive = activeDayId === day.id;
              return (
                <button
                  key={day.id}
                  onClick={() => setActiveDayId(day.id)}
                  className={`flex-shrink-0 snap-center w-[4.5rem] h-20 rounded-xl flex flex-col items-center justify-center transition-all duration-300 border-2
                    ${isActive 
                      ? 'bg-[#A0522D] border-[#A0522D] text-[#FDFBF7] shadow-lg transform scale-105' 
                      : 'bg-white border-[#E5E0D8] text-[#8C7B70] hover:border-[#C0B2A6]'
                    }
                  `}
                >
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-[#E6D0B3]' : 'text-[#A89F91]'}`}>
                    {day.dayName}
                  </span>
                  <span className={`text-xl font-serif font-bold ${isActive ? 'text-white' : 'text-[#5D4037]'}`}>
                    {day.date.split('/')[1]}
                  </span>
                  <span className="text-[9px] mt-1 opacity-80">Day {day.id}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto z-10 scroll-smooth pb-24">
        
        {/* --- ITINERARY TAB --- */}
        {activeTab === 'itinerary' && (
          <div className="px-5 pt-6 animate-fadeIn">
            
            {/* Daily Header */}
            <div className="mb-6 flex items-end justify-between border-b-2 border-[#D7CDC1] pb-2">
              <div>
                <div className="flex items-center gap-2 text-[#8B5E3C] mb-1">
                  <MapPin size={14} />
                  <span className="text-xs font-bold tracking-widest uppercase">{currentDay.city}</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#4A4036]">{currentDay.title}</h2>
              </div>
              {currentDay.weather && (
                <div className="text-right">
                  <Sun className="inline-block text-[#DAA520] mb-1" size={20} />
                  <div className="text-sm font-medium text-[#8C7B70]">{currentDay.weather}</div>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="relative pl-14 pr-2 space-y-8">
              <div className="absolute left-[3.5rem] top-2 bottom-0 w-[2px] bg-[#D7CDC1] opacity-60"></div>

              {currentDay.events.map((event, idx) => (
                <div key={idx} className="relative flex items-start group">
                  
                  {/* Time Bubble */}
                  <div className="absolute left-[-3.5rem] w-14 text-right pr-4 pt-3">
                    <span className="text-xs font-bold text-[#8B5E3C] font-mono block">
                      {event.time}
                    </span>
                  </div>

                  {/* Dot */}
                  <div className={`
                    absolute left-[-5px] top-[14px] w-3 h-3 rounded-full border-2 border-[#FDFBF7] z-10
                    ${event.type === 'transport' ? 'bg-[#D2B48C]' : 
                      event.type === 'food' ? 'bg-[#8F9779]' : 
                      event.type === 'highlight' ? 'bg-[#DAA520]' : 
                      'bg-[#8B4513]'}
                  `}></div>

                  {/* Card */}
                  <div className="flex-1 bg-white rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,0.05)] border border-[#E5E0D8] overflow-hidden ml-4">
                     <div className="p-3 flex gap-3 items-start">
                        <div className={`
                          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1
                          ${event.type === 'transport' ? 'bg-[#D2B48C]/20 text-[#A0522D]' : 
                            event.type === 'food' ? 'bg-[#8F9779]/20 text-[#556B2F]' : 
                            event.type === 'highlight' ? 'bg-[#DAA520]/20 text-[#B8860B]' : 
                            'bg-[#8B4513]/20 text-[#8B4513]'}
                        `}>
                          {React.cloneElement(event.icon, { size: 16 })}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#4A4036] text-base leading-tight">{event.title}</h4>
                          <p className="text-[#6D5D50] text-xs leading-relaxed mt-1">{event.desc}</p>
                          {event.sub && (
                            <span className="inline-block mt-1.5 px-2 py-0.5 bg-[#F4F1EA] text-[#8C7B70] text-[10px] rounded font-medium border border-[#E0DCD5]">
                              {event.sub}
                            </span>
                          )}
                        </div>
                     </div>
                     
                     {/* Actions Bar */}
                     <div className="bg-[#F9F7F4] border-t border-[#E5E0D8] flex">
                       {/* Guide Button (Only if details exist) */}
                       {event.details && (
                         <button 
                            onClick={() => setSelectedAttraction(event)}
                            className="flex-1 py-2 flex justify-center items-center gap-1.5 border-r border-[#E5E0D8] hover:bg-[#EAE4DC] transition-colors"
                         >
                            <BookOpen size={12} className="text-[#8B4513]" />
                            <span className="text-[10px] font-bold text-[#8B4513] uppercase tracking-wide">景點解說</span>
                         </button>
                       )}
                       
                       {/* Map Button */}
                       <button 
                          onClick={() => openGoogleMapApp(event.query)}
                          className="flex-1 py-2 flex justify-center items-center gap-1.5 hover:bg-[#EAE4DC] transition-colors"
                       >
                          <Navigation size={12} className="text-[#A0522D]" />
                          <span className="text-[10px] font-bold text-[#A0522D] uppercase tracking-wide">導航</span>
                       </button>
                     </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 mb-6 flex justify-center opacity-30">
              <Feather className="text-[#8B5E3C]" />
            </div>
          </div>
        )}

        {/* --- MAP TAB --- */}
        {activeTab === 'map' && (
          <div className="h-full flex flex-col relative">
            <div className="flex-1 bg-[#E0E0E0] relative z-0">
               <iframe 
                 width="100%" 
                 height="100%" 
                 frameBorder="0" 
                 style={{ border: 0 }} 
                 src={getMapUrl(
                   mapCenter ? mapCenter.lat : currentDay.events[0].lat, 
                   mapCenter ? mapCenter.lng : currentDay.events[0].lng,
                   mapCenter ? mapCenter.query : (currentDay.events[0].query + " " + currentDay.city)
                 )}
                 allowFullScreen
               ></iframe>
            </div>

            <div className="h-1/3 bg-[#Fdfbf7] border-t-4 border-[#D2B48C] shadow-[0_-5px_15px_rgba(0,0,0,0.1)] z-10 flex flex-col">
              <div className="px-4 py-3 bg-[#F4F1EA] border-b border-[#E5E0D8] flex justify-between items-center">
                <h3 className="text-sm font-bold text-[#5D4037] font-serif uppercase tracking-wider">
                  Day {currentDay.id} : {currentDay.city}
                </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                 {currentDay.events.map((event, idx) => (
                   <div 
                     key={idx} 
                     onClick={() => setMapCenter(event)}
                     className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                       ${mapCenter === event 
                         ? 'bg-[#EAE4DC] border-[#A0522D]' 
                         : 'bg-white border-[#E5E0D8] hover:border-[#C0B2A6]'}
                     `}
                   >
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0
                        ${idx === 0 ? 'bg-[#DAA520]' : 'bg-[#A0522D]'}
                      `}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#4A4036] text-sm truncate">{event.title}</h4>
                        <p className="text-[10px] text-[#8C7B70] truncate">{event.query}</p>
                      </div>
                      {event.details && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedAttraction(event); }}
                          className="p-1.5 rounded-full bg-[#F4F1EA] text-[#8B4513] border border-[#D7CDC1]"
                        >
                          <BookOpen size={14} />
                        </button>
                      )}
                   </div>
                 ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 彈窗渲染 */}
      <GuideModal 
        attraction={selectedAttraction} 
        onClose={() => setSelectedAttraction(null)} 
      />

      {/* Bottom Navigation */}
      <div className="bg-[#3E3228] pb-6 pt-3 px-6 fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 rounded-t-2xl shadow-[0_-5px_15px_rgba(0,0,0,0.1)]">
        <div className="flex justify-around items-center text-[#A89F91]">
          <button 
            onClick={() => setActiveTab('itinerary')}
            className={`flex flex-col items-center gap-1 transition-colors px-6 ${activeTab === 'itinerary' ? 'text-[#D2B48C]' : 'hover:text-[#C0B2A6]'}`}
          >
            <Calendar size={24} strokeWidth={activeTab === 'itinerary' ? 2.5 : 2} />
            <span className="text-[10px] uppercase tracking-wider font-bold">行程 Journey</span>
          </button>
          
          <div className="w-[1px] h-8 bg-[#5D4037]"></div>
          
          <button 
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center gap-1 transition-colors px-6 ${activeTab === 'map' ? 'text-[#D2B48C]' : 'hover:text-[#C0B2A6]'}`}
          >
            <MapIcon size={24} strokeWidth={activeTab === 'map' ? 2.5 : 2} />
            <span className="text-[10px] uppercase tracking-wider font-bold">地圖 Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;

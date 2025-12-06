import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Calendar, MapPin, Train, Clock, Utensils, Camera, Ticket, Bus, Plane, Sun, 
  Navigation, Landmark, Feather, Map as MapIcon, X, BookOpen, History, Star, 
  Sparkles, Plus, Save, Trash2, Edit3, MoreHorizontal
} from 'lucide-react';

// --- 初始資料來源 (現在作為 State 的初始值) ---
const INITIAL_TRIP_DATA = {
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
          id: 'e1-1', time: "11:30", type: "transport", title: "米蘭中央車站", desc: "MXP 機場接駁抵達", sub: "巴士下車點", iconType: 'bus', 
          lat: 45.4859, lng: 9.2035, query: "Milano Centrale",
          details: {
            history: "米蘭中央車站建於 1931 年，受墨索里尼要求，融合了新藝術運動與裝飾藝術風格。",
            highlights: ["巨大的鋼鐵與玻璃拱頂", "21號月台", "華麗的馬賽克"],
            tips: "車站非常大且人流混雜，請隨時注意扒手。"
          }
        },
        { id: 'e1-2', time: "13:00", type: "food", title: "Mercato Centrale", desc: "中央市場午餐", sub: "寄放行李", iconType: 'utensils', lat: 45.4865, lng: 9.2016, query: "Mercato Centrale Milano" },
        { id: 'e1-3', time: "15:40", type: "transport", title: "搭乘高鐵", desc: "前往佛羅倫斯", sub: "Frecciarossa", iconType: 'train', lat: 45.4859, lng: 9.2035, query: "Milano Centrale" },
        { id: 'e1-4', time: "17:35", type: "transport", title: "抵達佛羅倫斯", desc: "S.M.N. 車站", sub: "Firenze S.M.N.", iconType: 'mapPin', lat: 43.7764, lng: 11.2479, query: "Florence Santa Maria Novella" },
        { 
          id: 'e1-5', time: "23:00", type: "activity", title: "聖母百花大教堂", desc: "午夜彌撒", sub: "需提早排隊", iconType: 'clock', 
          lat: 43.7731, lng: 11.2560, query: "Cathedral of Santa Maria del Fiore",
          details: {
            history: "這座教堂耗時 140 年才建成。最著名的是布魯內萊斯基設計的巨大紅色穹頂。",
            highlights: ["紅色穹頂", "喬托鐘樓", "天堂之門"],
            tips: "午夜彌撒人潮眾多，建議 21:30 前往排隊。"
          }
        }
      ]
    },
    // ... 為節省長度，保留 Day 1 作為範例，實際應用可包含所有天數 ... 
    {
      id: 2,
      date: "12/25",
      dayName: "Thu",
      city: "威尼斯一日遊",
      title: "水都威尼斯",
      weather: "6°C",
      events: [
        { id: 'e2-1', time: "11:00", type: "transport", title: "S. Lucia 車站", desc: "抵達威尼斯", iconType: 'train', lat: 45.4411, lng: 12.3210, query: "Venezia Santa Lucia" },
        { id: 'e2-2', time: "11:40", type: "activity", title: "安康聖母聖殿", desc: "免費參觀", iconType: 'landmark', lat: 45.4308, lng: 12.3343, query: "Basilica di Santa Maria della Salute" },
        { id: 'e2-3', time: "16:00", type: "highlight", title: "學院橋", desc: "絕美夕陽", iconType: 'sun', lat: 45.4316, lng: 12.3286, query: "Ponte dell'Accademia" }
      ]
    },
    {
        id: 3,
        date: "12/26",
        dayName: "Fri",
        city: "比薩",
        title: "比薩斜塔",
        weather: "7°C",
        events: []
    }
  ]
};

const TICKETS = [
  { type: "train", from: "Milan", to: "Florence", time: "12/24 15:40", code: "Frecciarossa" },
  { type: "entry", title: "St. Peter's Basilica", time: "12/30 12:00", code: "84068" },
];

// --- 輔助圖示映射 ---
const getIconComponent = (iconType) => {
  switch (iconType) {
    case 'bus': return <Bus />;
    case 'train': return <Train />;
    case 'plane': return <Plane />;
    case 'utensils': return <Utensils />;
    case 'clock': return <Clock />;
    case 'camera': return <Camera />;
    case 'ticket': return <Ticket />;
    case 'sun': return <Sun />;
    case 'landmark': return <Landmark />;
    case 'mapPin': return <MapPin />;
    default: return <MapPin />;
  }
};

// --- 長按 Hook (Long Press Hook) ---
const useLongPress = (callback = () => {}, ms = 800) => {
  const [startLongPress, setStartLongPress] = useState(false);
  const timerIdRef = useRef(null);

  useEffect(() => {
    if (startLongPress) {
      timerIdRef.current = setTimeout(() => {
        callback();
        // Vibrate if supported (mobile feedback)
        if (navigator.vibrate) navigator.vibrate(50);
      }, ms);
    } else {
      clearTimeout(timerIdRef.current);
    }
    return () => clearTimeout(timerIdRef.current);
  }, [startLongPress, callback, ms]);

  return {
    onMouseDown: () => setStartLongPress(true),
    onMouseUp: () => setStartLongPress(false),
    onMouseLeave: () => setStartLongPress(false),
    onTouchStart: () => setStartLongPress(true),
    onTouchEnd: () => setStartLongPress(false),
  };
};

// --- 編輯/新增 彈窗組件 (Editor Modal) ---
const EditorModal = ({ isOpen, mode, initialData, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    time: '', title: '', desc: '', sub: '', query: '', type: 'activity'
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({ ...initialData });
      } else {
        setFormData({ time: '', title: '', desc: '', sub: '', query: '', type: 'activity' });
      }
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#Fdfbf7] w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-xl border-t-4 sm:border-4 border-[#D2B48C] shadow-2xl relative">
        
        {/* Header */}
        <div className="bg-[#F4F1EA] border-b border-[#D7CDC1] p-4 flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-xl font-serif font-black text-[#5D4037]">
            {mode === 'add' ? '新增行程' : '編輯行程'}
          </h3>
          <button onClick={onClose} className="p-2 text-[#8B5E3C] hover:bg-[#EAE4DC] rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Type Selector */}
          <div>
            <label className="block text-xs font-bold text-[#8B5E3C] uppercase mb-2">行程種類</label>
            <div className="flex gap-2">
              {[
                { id: 'activity', label: '景點', icon: <Camera size={16} />, color: 'bg-[#DAA520]' },
                { id: 'transport', label: '交通', icon: <Train size={16} />, color: 'bg-[#D2B48C]' },
                { id: 'food', label: '餐飲', icon: <Utensils size={16} />, color: 'bg-[#8F9779]' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFormData({...formData, type: t.id})}
                  className={`flex-1 py-3 rounded-lg flex flex-col items-center justify-center gap-1 border-2 transition-all
                    ${formData.type === t.id 
                      ? `${t.color} text-white border-transparent shadow-md` 
                      : 'bg-white border-[#E5E0D8] text-[#8C7B70] hover:border-[#D2B48C]'
                    }
                  `}
                >
                  {t.icon}
                  <span className="text-xs font-bold">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time & Title */}
          <div className="flex gap-3">
            <div className="w-1/3">
              <label className="block text-xs font-bold text-[#8B5E3C] uppercase mb-1">時間</label>
              <input 
                type="time" 
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full bg-[#F9F7F4] border border-[#D7CDC1] rounded-lg p-2.5 text-[#5D4037] font-mono focus:outline-none focus:border-[#A0522D]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-[#8B5E3C] uppercase mb-1">標題</label>
              <input 
                type="text" 
                placeholder="例如: 羅馬競技場"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-[#F9F7F4] border border-[#D7CDC1] rounded-lg p-2.5 text-[#5D4037] font-bold focus:outline-none focus:border-[#A0522D]"
              />
            </div>
          </div>

          {/* Subtitle / Location */}
          <div>
            <label className="block text-xs font-bold text-[#8B5E3C] uppercase mb-1">地點 / 副標題</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-[#A89F91]" size={16} />
              <input 
                type="text" 
                placeholder="例如: 集合點 or 必吃冰淇淋"
                value={formData.sub || ''}
                onChange={(e) => setFormData({...formData, sub: e.target.value})}
                className="w-full bg-[#F9F7F4] border border-[#D7CDC1] rounded-lg p-2.5 pl-9 text-[#5D4037] focus:outline-none focus:border-[#A0522D]"
              />
            </div>
          </div>
          
          {/* Google Maps Query */}
          <div>
             <label className="block text-xs font-bold text-[#8B5E3C] uppercase mb-1">Google Maps 搜尋關鍵字</label>
             <input 
               type="text" 
               placeholder="用於地圖定位 (例如: Colosseum Rome)"
               value={formData.query || ''}
               onChange={(e) => setFormData({...formData, query: e.target.value})}
               className="w-full bg-[#F9F7F4] border border-[#D7CDC1] rounded-lg p-2.5 text-[#5D4037] text-sm focus:outline-none focus:border-[#A0522D]"
             />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#8B5E3C] uppercase mb-1">備註 / 描述</label>
            <textarea 
              rows="3"
              placeholder="詳細行程說明..."
              value={formData.desc || ''}
              onChange={(e) => setFormData({...formData, desc: e.target.value})}
              className="w-full bg-[#F9F7F4] border border-[#D7CDC1] rounded-lg p-2.5 text-[#5D4037] text-sm focus:outline-none focus:border-[#A0522D]"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {mode === 'edit' && (
              <button 
                onClick={() => onDelete(formData.id)}
                className="px-4 py-3 bg-[#EAE4DC] text-[#8B4513] rounded-lg font-bold flex items-center gap-2 hover:bg-[#D7CDC1]"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button 
              onClick={() => onSave(formData)}
              className="flex-1 py-3 bg-[#A0522D] text-white rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
            >
              <Save size={18} />
              {mode === 'add' ? '新增行程' : '儲存修改'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 主程式 ---
const App = () => {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [activeDayId, setActiveDayId] = useState(1);
  const [tripData, setTripData] = useState(INITIAL_TRIP_DATA);
  const [mapCenter, setMapCenter] = useState(null);
  
  // Modal States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState('add'); // 'add' or 'edit'
  const [editingItem, setEditingItem] = useState(null);

  const scrollRef = useRef(null);
  
  const currentDay = tripData.days.find(d => d.id === activeDayId);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      const selectedEl = scrollRef.current.children[activeDayId - 1];
      if (selectedEl) {
        selectedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
    setMapCenter(null);
  }, [activeDayId]);

  // --- CRUD Handlers ---

  const handleAddEvent = (newEvent) => {
    const eventWithId = {
      ...newEvent,
      id: Date.now().toString(), // Generate simple ID
      iconType: newEvent.type === 'food' ? 'utensils' : newEvent.type === 'transport' ? 'train' : 'camera',
      icon: getIconComponent(newEvent.type === 'food' ? 'utensils' : newEvent.type === 'transport' ? 'train' : 'camera')
    };

    setTripData(prev => {
      const newDays = prev.days.map(day => {
        if (day.id === activeDayId) {
          // Add and sort by time
          const updatedEvents = [...day.events, eventWithId].sort((a, b) => a.time.localeCompare(b.time));
          return { ...day, events: updatedEvents };
        }
        return day;
      });
      return { ...prev, days: newDays };
    });
    setIsEditorOpen(false);
  };

  const handleUpdateEvent = (updatedEvent) => {
    setTripData(prev => {
      const newDays = prev.days.map(day => {
        if (day.id === activeDayId) {
           const updatedEvents = day.events.map(ev => ev.id === updatedEvent.id ? {
             ...updatedEvent,
             iconType: updatedEvent.type === 'food' ? 'utensils' : updatedEvent.type === 'transport' ? 'train' : 'camera',
             icon: getIconComponent(updatedEvent.type === 'food' ? 'utensils' : updatedEvent.type === 'transport' ? 'train' : 'camera')
           } : ev).sort((a, b) => a.time.localeCompare(b.time));
           return { ...day, events: updatedEvents };
        }
        return day;
      });
      return { ...prev, days: newDays };
    });
    setIsEditorOpen(false);
  };

  const handleDeleteEvent = (eventId) => {
    if(!window.confirm("確定要刪除此行程嗎？")) return;
    
    setTripData(prev => {
      const newDays = prev.days.map(day => {
        if (day.id === activeDayId) {
          return { ...day, events: day.events.filter(e => e.id !== eventId) };
        }
        return day;
      });
      return { ...prev, days: newDays };
    });
    setIsEditorOpen(false);
  };

  const openAddModal = () => {
    setEditorMode('add');
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  const openEditModal = (event) => {
    setEditorMode('edit');
    setEditingItem(event);
    setIsEditorOpen(true);
  };

  // Google Maps Helpers
  const getMapUrl = (lat, lng, query) => {
    const encodedQuery = encodeURIComponent(query || "Italy");
    return `https://maps.google.com/maps?q=${encodedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  const openGoogleMapApp = (query) => {
    if (!query) return;
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
              {tripData.subtitle}
            </h2>
            <h1 className="text-3xl font-serif font-black text-[#5D4037] leading-none">
              {tripData.title}
            </h1>
          </div>
          <Landmark className="text-[#8B5E3C] opacity-80" size={32} strokeWidth={1.5} />
        </div>

        {/* Horizontal Date Selector */}
        {(activeTab === 'itinerary' || activeTab === 'map') && (
          <div className="mt-6 -mx-6 px-6">
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto gap-3 pb-4 snap-x no-scrollbar"
            >
              {tripData.days.map((day) => {
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
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto z-10 scroll-smooth pb-24">
        
        {/* --- ITINERARY TAB --- */}
        {activeTab === 'itinerary' && (
          <div className="px-5 pt-6 animate-fadeIn pb-24">
            
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
              
              {currentDay.events.length === 0 && (
                 <div className="text-center py-10 opacity-50 text-[#8B5E3C] italic">
                   點擊右下角 + 新增行程
                 </div>
              )}

              {currentDay.events.map((event, idx) => {
                 // Using Long Press Hook
                 const longPressProps = useLongPress(() => openEditModal(event), 800);

                 return (
                  <div key={event.id} className="relative flex items-start group select-none" {...longPressProps}>
                    
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
                    <div className="flex-1 bg-white rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,0.05)] border border-[#E5E0D8] overflow-hidden ml-4 active:scale-[0.98] transition-transform duration-200">
                      <div className="p-3 flex gap-3 items-start">
                          <div className={`
                            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1
                            ${event.type === 'transport' ? 'bg-[#D2B48C]/20 text-[#A0522D]' : 
                              event.type === 'food' ? 'bg-[#8F9779]/20 text-[#556B2F]' : 
                              event.type === 'highlight' ? 'bg-[#DAA520]/20 text-[#B8860B]' : 
                              'bg-[#8B4513]/20 text-[#8B4513]'}
                          `}>
                            {getIconComponent(event.iconType || 'mapPin')}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-[#4A4036] text-base leading-tight flex items-center justify-between">
                              {event.title}
                              {/* Edit hint icon (visible only when needed or confusing) */}
                              {/* <Edit3 size={12} className="text-[#D7CDC1]" /> */}
                            </h4>
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
                        {event.details && (
                          <button 
                              className="flex-1 py-2 flex justify-center items-center gap-1.5 border-r border-[#E5E0D8] hover:bg-[#EAE4DC] transition-colors"
                          >
                              <BookOpen size={12} className="text-[#8B4513]" />
                              <span className="text-[10px] font-bold text-[#8B4513] uppercase tracking-wide">解說</span>
                          </button>
                        )}
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
                 );
              })}
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
               {currentDay.events.length > 0 ? (
                 <iframe 
                   width="100%" 
                   height="100%" 
                   frameBorder="0" 
                   style={{ border: 0 }} 
                   src={getMapUrl(
                     mapCenter ? mapCenter.lat : (currentDay.events[0]?.lat || 41.9028), 
                     mapCenter ? mapCenter.lng : (currentDay.events[0]?.lng || 12.4964),
                     mapCenter ? mapCenter.query : ((currentDay.events[0]?.query || "Italy") + " " + currentDay.city)
                   )}
                   allowFullScreen
                 ></iframe>
               ) : (
                 <div className="flex items-center justify-center h-full text-[#8B5E3C]">尚無行程定位</div>
               )}
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
                     key={event.id} 
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
                      </div>
                      <Navigation size={16} className="text-[#8B5E3C]" />
                   </div>
                 ))}
              </div>
            </div>
          </div>
        )}

        {/* --- WALLET TAB --- */}
        {activeTab === 'wallet' && (
          <div className="px-5 pt-6 space-y-6">
            <h2 className="text-xl font-serif font-bold text-[#4A4036] mb-4 flex items-center gap-2">
              <Ticket className="text-[#8B5E3C]" />
              通行證與票券
            </h2>
            {TICKETS.map((ticket, index) => (
              <div key={index} className="relative bg-[#Fdfbf7] border-2 border-[#D2B48C] rounded-lg p-5 shadow-sm overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#8B5E3C] mb-1">
                      {ticket.type}
                    </div>
                    <h3 className="text-lg font-bold text-[#4A4036] mb-1">
                      {ticket.title || `${ticket.from} ➝ ${ticket.to}`}
                    </h3>
                    <div className="text-sm text-[#6D5D50]">{ticket.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="bg-[#EAE4DC] px-3 py-2 rounded border border-[#D7CDC1]">
                      <div className="text-[10px] text-[#8C7B70] uppercase">Booking Ref</div>
                      <div className="font-mono font-bold text-[#4A4036]">{ticket.code}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 編輯器彈窗 */}
      <EditorModal 
        isOpen={isEditorOpen}
        mode={editorMode}
        initialData={editingItem}
        onClose={() => setIsEditorOpen(false)}
        onSave={editorMode === 'add' ? handleAddEvent : handleUpdateEvent}
        onDelete={handleDeleteEvent}
      />

      {/* FAB (Floating Action Button) - Add Event */}
      <button 
        onClick={openAddModal}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#DAA520] text-white rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] flex items-center justify-center border-2 border-[#FDFBF7] active:scale-95 transition-transform z-50 hover:bg-[#B8860B]"
        aria-label="Add Event"
      >
        <Plus size={32} strokeWidth={2.5} />
      </button>

      {/* Bottom Navigation */}
      <div className="bg-[#3E3228] pb-6 pt-3 px-6 fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 rounded-t-2xl shadow-[0_-5px_15px_rgba(0,0,0,0.1)]">
        <div className="flex justify-around items-center text-[#A89F91]">
          <button 
            onClick={() => setActiveTab('itinerary')}
            className={`flex flex-col items-center gap-1 transition-colors px-4 ${activeTab === 'itinerary' ? 'text-[#D2B48C]' : 'hover:text-[#C0B2A6]'}`}
          >
            <Calendar size={24} strokeWidth={activeTab === 'itinerary' ? 2.5 : 2} />
            <span className="text-[10px] uppercase tracking-wider font-bold">行程</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center gap-1 transition-colors px-4 ${activeTab === 'map' ? 'text-[#D2B48C]' : 'hover:text-[#C0B2A6]'}`}
          >
            <MapIcon size={24} strokeWidth={activeTab === 'map' ? 2.5 : 2} />
            <span className="text-[10px] uppercase tracking-wider font-bold">地圖</span>
          </button>

          <button 
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center gap-1 transition-colors px-4 ${activeTab === 'wallet' ? 'text-[#D2B48C]' : 'hover:text-[#C0B2A6]'}`}
          >
            <Ticket size={24} strokeWidth={activeTab === 'wallet' ? 2.5 : 2} />
            <span className="text-[10px] uppercase tracking-wider font-bold">票券</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;



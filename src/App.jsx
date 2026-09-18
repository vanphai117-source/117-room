import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { 
  getFirestore, collection, onSnapshot, 
  addDoc, updateDoc, deleteDoc, doc 
} from "firebase/firestore";
import { 
  Phone, MessageSquare, MapPin, Search, Plus, 
  Trash2, Edit, ChevronLeft, ChevronRight, 
  LogIn, LogOut, Calendar, Check, X,
  Eye, EyeOff, Zap, Droplets, ShieldCheck, Bike,
  Sparkles, Filter, RefreshCw, ArrowUpRight
} from 'lucide-react';

// Cấu hình Firebase thực tế của dự án room-117
const firebaseConfig = {
  apiKey: "AIzaSyCEYpWfK2AvsqP5lpFqOcRPafjBZWNw9x0",
  authDomain: "room-117.firebaseapp.com",
  projectId: "room-117",
  storageBucket: "room-117.firebasestorage.app",
  messagingSenderId: "599030480038",
  appId: "1:599030480038:web:92b43625833ee3aed48867",
  measurementId: "G-YWSL7EX75S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Danh sách chuẩn các quận và thành phố tại TP.HCM (16 Quận + 1 Thành phố Thủ Đức)
const DISTRICTS = [
  'Quận 1',
  'Quận 3',
  'Quận 4',
  'Quận 5',
  'Quận 6',
  'Quận 7',
  'Quận 8',
  'Quận 10',
  'Quận 11',
  'Quận 12',
  'Quận Bình Tân',
  'Quận Bình Thạnh',
  'Quận Gò Vấp',
  'Quận Phú Nhuận',
  'Quận Tân Bình',
  'Quận Tân Phú',
  'Thành phố Thủ Đức'
];

const DEFAULT_ROOMS = [
  {
    id: 'demo-1',
    title: 'Phòng Studio Ban Công Thoáng Mát Ngay Landmark 81',
    district: 'Quận Bình Thạnh',
    address: '117/12 Điện Biên Phủ, Phường 15, Quận Bình Thạnh',
    price: 4500000,
    area: 28,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    electricity: '4.000đ/kWh',
    water: '100.000đ/người',
    serviceFee: '150.000đ/phòng',
    parkingFee: '100.000đ/xe',
    amenities: ['Máy lạnh', 'Gác xép', 'Khóa vân tay', 'Giờ giấc tự do'],
    contactName: 'Bon',
    phone: '0559655085',
    description: 'Phòng mới sơn sửa sạch đẹp, ban công thoáng mát, cổng khóa vân tay an toàn tuyệt đối.'
  },
  {
    id: 'demo-2',
    title: 'Phòng Cao Cấp Đầy Đủ Nội Thất Trung Tâm An Dương Vương Q5',
    district: 'Quận 5',
    address: '280 An Dương Vương, Phường 4, Quận 5',
    price: 5200000,
    area: 32,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
    ],
    electricity: '4.000đ/kWh',
    water: '100.000đ/người',
    serviceFee: '120.000đ/phòng',
    parkingFee: '120.000đ/xe',
    amenities: ['Máy giặt riêng', 'Tủ lạnh', 'Máy lạnh Inverter', 'Camera an ninh'],
    contactName: 'Bon',
    phone: '0559655085',
    description: 'Vị trí đắc địa trung tâm Quận 5 giáp Quận 1, khu dân trí cao yên tĩnh, ra vào khóa vân tay riêng biệt.'
  }
];

export default function App() {
  const [rooms, setRooms] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quản trị viên Bon
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminTab, setAdminTab] = useState('rooms');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  // Bộ lọc
  const [selectedDistrict, setSelectedDistrict] = useState('Tất cả');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [maxPrice, setMaxPrice] = useState(10000000);

  // Xem chi tiết & Slider
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Đặt lịch hẹn
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerPhone: '',
    visitDate: '',
    visitTime: '',
    note: ''
  });

  // Modal Thêm/Sửa phòng
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [roomFormData, setRoomFormData] = useState({
    id: '',
    title: '',
    district: 'Quận Bình Thạnh',
    address: '',
    price: 3500000,
    area: 25,
    status: 'available',
    images: [],
    electricity: '4.000đ/kWh',
    water: '100.000đ/người',
    serviceFee: '150.000đ/phòng',
    parkingFee: '100.000đ/xe',
    amenitiesText: 'Máy lạnh, Khóa vân tay, Giờ giấc tự do',
    contactName: 'Bon',
    phone: '0559655085',
    description: ''
  });

  const triggerToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  useEffect(() => {
    const unsubscribeRooms = onSnapshot(collection(db, 'rooms'), (snapshot) => {
      const roomList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setRooms(roomList.length === 0 ? DEFAULT_ROOMS : roomList);
      setLoading(false);
    }, (error) => {
      console.warn("Dùng fallback rooms:", error);
      setRooms(DEFAULT_ROOMS);
      setLoading(false);
    });

    const unsubscribeLeads = onSnapshot(collection(db, 'leads'), (snapshot) => {
      const leadList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setLeads(leadList);
    }, (error) => {
      console.warn("Lỗi đọc leads:", error);
    });

    return () => {
      unsubscribeRooms();
      unsubscribeLeads();
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username.trim().toLowerCase() === 'bon' && loginForm.password === 'bon117admin') {
      setIsAdmin(true);
      setShowLoginModal(false);
      setLoginError('');
      setLoginForm({ username: '', password: '' });
      setShowPassword(false);
      triggerToast('Đăng nhập quản trị thành công!');
    } else {
      setLoginError('Tài khoản hoặc mật khẩu không chính xác!');
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.68);
          resolve(compressedBase64);
        };
      };
    });
  };

  const handleMultipleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const compressedImages = await Promise.all(files.map(file => compressImage(file)));
      setRoomFormData(prev => ({
        ...prev,
        images: [...prev.images, ...compressedImages]
      }));
      triggerToast(`Đã thêm ${files.length} ảnh phòng!`);
    } catch (err) {
      console.error("Lỗi nén ảnh:", err);
      triggerToast('Lỗi khi nén ảnh, vui lòng thử lại', 'error');
    }
  };

  const removeImageAtIndex = (idx) => {
    setRoomFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
  };

  const setAsCover = (idx) => {
    setRoomFormData(prev => {
      const target = prev.images[idx];
      const rest = prev.images.filter((_, i) => i !== idx);
      return { ...prev, images: [target, ...rest] };
    });
    triggerToast('Đã đặt làm ảnh bìa chính!');
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const amenities = roomFormData.amenitiesText.split(',').map(s => s.trim()).filter(Boolean);
      const finalImages = roomFormData.images.length > 0 
        ? roomFormData.images 
        : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'];

      const payload = {
        title: roomFormData.title,
        district: roomFormData.district,
        address: roomFormData.address,
        price: Number(roomFormData.price),
        area: Number(roomFormData.area),
        status: roomFormData.status || 'available',
        images: finalImages,
        electricity: roomFormData.electricity || '4.000đ/kWh',
        water: roomFormData.water || '100.000đ/người',
        serviceFee: roomFormData.serviceFee || '150.000đ/phòng',
        parkingFee: roomFormData.parkingFee || '100.000đ/xe',
        amenities,
        contactName: 'Bon',
        phone: '0559655085',
        description: roomFormData.description,
        updatedAt: new Date().toISOString()
      };

      if (isEditing && roomFormData.id && !roomFormData.id.startsWith('demo-')) {
        await updateDoc(doc(db, 'rooms', roomFormData.id), payload);
        triggerToast('Cập nhật phòng thành công!');
      } else {
        await addDoc(collection(db, 'rooms'), {
          ...payload,
          createdAt: new Date().toISOString()
        });
        triggerToast('Đăng phòng mới thành công!');
      }
      setShowRoomModal(false);
    } catch (err) {
      console.error("Lỗi lưu Firebase:", err);
      triggerToast('Lỗi lưu Firebase!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (room) => {
    try {
      const newStatus = room.status === 'available' ? 'rented' : 'available';
      if (room.id && !room.id.startsWith('demo-')) {
        await updateDoc(doc(db, 'rooms', room.id), { status: newStatus });
      } else {
        setRooms(prev => prev.map(r => r.id === room.id ? { ...r, status: newStatus } : r));
      }
      triggerToast(`Trạng thái: ${newStatus === 'available' ? 'Còn phòng' : 'Đã thuê'}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      if (roomId && !roomId.startsWith('demo-')) {
        await deleteDoc(doc(db, 'rooms', roomId));
      } else {
        setRooms(prev => prev.filter(r => r.id !== roomId));
      }
      triggerToast('Đã xóa thông tin phòng!');
    } catch (err) {
      console.error("Lỗi xóa phòng:", err);
    }
  };

  const handleDeleteLead = async (leadId) => {
    try {
      await deleteDoc(doc(db, 'leads', leadId));
      triggerToast('Đã xóa lịch hẹn của khách!');
    } catch (err) {
      console.error("Lỗi khi xóa khách hẹn:", err);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        customerName: bookingForm.customerName,
        customerPhone: bookingForm.customerPhone,
        visitDate: bookingForm.visitDate,
        visitTime: bookingForm.visitTime,
        note: bookingForm.note,
        roomTitle: bookingRoom.title,
        roomId: bookingRoom.id,
        district: bookingRoom.district,
        createdAt: new Date().toLocaleString('vi-VN')
      };

      await addDoc(collection(db, 'leads'), payload);
      setBookingSuccess(true);
      triggerToast('Đã lưu lịch hẹn xem phòng!');
    } catch (err) {
      console.error("Lỗi gửi lịch hẹn:", err);
      triggerToast('Lỗi gửi lịch hẹn, hãy gọi trực tiếp!', 'error');
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchDistrict = selectedDistrict === 'Tất cả' || room.district === selectedDistrict;
    const kw = searchKeyword.toLowerCase();
    const matchKeyword = !searchKeyword.trim() || 
      room.title?.toLowerCase().includes(kw) ||
      room.address?.toLowerCase().includes(kw);

    const matchPrice = Number(room.price) <= maxPrice;
    return matchDistrict && matchKeyword && matchPrice;
  });

  return (
    <div className="min-h-screen bg-slate-50/85 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white relative">
      {/* Optimized Styles with Smooth Micro-interactions */}
      <style>{`
        * {
          -webkit-tap-highlight-color: transparent;
        }
        button, a, input, select, textarea {
          touch-action: manipulation;
        }

        /* Micro-interaction Keyframes */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translate3d(0, 16px, 0); 
          }
          to { 
            opacity: 1; 
            transform: translate3d(0, 0, 0); 
          }
        }
        @keyframes slideUpMobile {
          from { 
            opacity: 0; 
            transform: translate3d(0, 100%, 0); 
          }
          to { 
            opacity: 1; 
            transform: translate3d(0, 0, 0); 
          }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale3d(0.95, 0.95, 1); 
          }
          to { 
            opacity: 1; 
            transform: scale3d(1, 1, 1); 
          }
        }
        @keyframes shimmerLoading {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes lightSweep {
          0% { transform: translate3d(-150%, 0, 0) skewX(-20deg); }
          100% { transform: translate3d(250%, 0, 0) skewX(-20deg); }
        }
        @keyframes softWiggle {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-10deg); }
          40% { transform: rotate(10deg); }
          60% { transform: rotate(-6deg); }
          80% { transform: rotate(6deg); }
        }
        @keyframes breatheGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45); }
          50% { box-shadow: 0 0 0 7px rgba(16, 185, 129, 0); }
        }

        .animate-fade-in { 
          animation: fadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        .animate-fade-in-up { 
          animation: fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        .animate-scale-in { 
          animation: scaleIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        .animate-sheet-mobile {
          animation: slideUpMobile 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform;
        }
        .animate-soft-wiggle {
          animation: softWiggle 2.5s infinite ease-in-out;
        }
        .animate-breathe-glow {
          animation: breatheGlow 2.2s infinite cubic-bezier(0.4, 0, 0.6, 1);
        }

        /* Button Sheen & Micro-Interaction Classes */
        .btn-sheen {
          position: relative;
          overflow: hidden;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-sheen::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg, 
            rgba(255, 255, 255, 0) 0%, 
            rgba(255, 255, 255, 0.22) 50%, 
            rgba(255, 255, 255, 0) 100%
          );
          transform: translate3d(-150%, 0, 0) skewX(-20deg);
          pointer-events: none;
        }
        .btn-sheen:hover::after {
          animation: lightSweep 0.85s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Interactive Physics */
        .btn-spring {
          transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease, background-color 0.18s ease, border-color 0.18s ease;
        }
        .btn-spring:hover {
          transform: translate3d(0, -1.5px, 0);
        }
        .btn-spring:active {
          transform: translate3d(0, 1px, 0) scale3d(0.965, 0.965, 1) !important;
        }

        /* Room Card Interaction */
        .room-card-hover {
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease;
        }
        @media (hover: hover) {
          .room-card-hover:hover {
            transform: translate3d(0, -5px, 0);
            box-shadow: 0 20px 30px -10px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04);
            border-color: rgba(99, 102, 241, 0.35);
          }
        }

        .shimmer-box {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmerLoading 1.4s infinite linear;
          will-change: background-position;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @media (max-width: 640px) {
          .modal-mobile-sheet {
            align-items: flex-end !important;
            padding: 0 !important;
          }
          .modal-mobile-sheet > div {
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
            max-height: 90vh;
          }
        }
      `}</style>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-50 animate-fade-in-up pointer-events-none">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-bold border ${
            toastMessage.type === 'error' 
              ? 'bg-rose-900/95 text-white border-rose-700/80 shadow-rose-900/30' 
              : 'bg-slate-900/95 text-emerald-400 border-slate-700/80 shadow-slate-900/40'
          }`}>
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group" 
            onClick={() => { setSelectedDistrict('Tất cả'); setSearchKeyword(''); }}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/25 text-base sm:text-lg group-hover:scale-105 group-active:scale-95 transition-transform">
              117
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent flex items-center gap-1.5 leading-tight">
                <span>117 ROOM</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 font-bold tracking-wider">TP. HỒ CHÍ MINH • REALTIME</div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a 
              href="tel:0559655085" 
              className="btn-spring btn-sheen flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-full bg-blue-50/90 text-blue-700 font-bold text-xs border border-blue-200/70 hover:bg-blue-100 hover:shadow-md hover:shadow-blue-500/10"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600 animate-soft-wiggle" />
              <span className="max-sm:hidden">0559.655.085</span>
              <span className="sm:hidden">Gọi Bon</span>
            </a>

            {isAdmin ? (
              <div className="flex items-center gap-2 animate-scale-in">
                <span className="hidden sm:inline-block px-3 py-1 bg-amber-100/90 text-amber-900 text-xs font-bold rounded-xl border border-amber-300 shadow-xs">
                  👑 Quản trị Bon
                </span>
                <button 
                  onClick={() => { setIsAdmin(false); triggerToast('Đã đăng xuất quản trị!'); }}
                  className="btn-spring p-2 text-slate-500 hover:text-red-600 rounded-xl hover:bg-red-50 hover:shadow-sm"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setShowLoginModal(true);
                  setShowPassword(false);
                }}
                className="btn-spring flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl border border-slate-300/80 bg-white hover:border-slate-400 text-xs font-semibold text-slate-700 hover:shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {}
      {isAdmin && (
        <section className="bg-slate-900 text-white py-6 border-b border-slate-800 animate-fade-in-up">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>Trang Quản Trị Hệ Thống 117 ROOM</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online Realtime
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Dữ liệu được cập nhật tức thời qua Cloud Firestore.</p>
              </div>

              <button
                onClick={() => {
                  setIsEditing(false);
                  setRoomFormData({
                    id: '',
                    title: '',
                    district: 'Quận Bình Thạnh',
                    address: '',
                    price: 3500000,
                    area: 25,
                    status: 'available',
                    images: [],
                    electricity: '4.000đ/kWh',
                    water: '100.000đ/người',
                    serviceFee: '150.000đ/phòng',
                    parkingFee: '100.000đ/xe',
                    amenitiesText: 'Máy lạnh, Khóa vân tay, Giờ giấc tự do',
                    contactName: 'Bon',
                    phone: '0559655085',
                    description: ''
                  });
                  setShowRoomModal(true);
                }}
                className="btn-sheen btn-spring flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/30 self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Đăng Thêm Phòng Mới</span>
              </button>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setAdminTab('rooms')}
                className={`btn-spring px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  adminTab === 'rooms' 
                    ? 'bg-white text-slate-900 shadow-md shadow-white/10' 
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/70'
                }`}
              >
                Danh Sách Phòng ({rooms.length})
              </button>
              <button
                onClick={() => setAdminTab('leads')}
                className={`btn-spring px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  adminTab === 'leads' 
                    ? 'bg-white text-slate-900 shadow-md shadow-white/10' 
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/70'
                }`}
              >
                <span>Khách Đặt Hẹn Xem Phòng</span>
                {leads.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold animate-pulse">
                    {leads.length}
                  </span>
                )}
              </button>
            </div>

            {/* TAB PHÒNG */}
            {adminTab === 'rooms' && (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-sm text-slate-300 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs uppercase text-slate-400 bg-slate-800/60">
                      <th className="py-3 px-4">Ảnh bìa</th>
                      <th className="py-3 px-4">Tiêu đề & Địa chỉ</th>
                      <th className="py-3 px-4">Quận</th>
                      <th className="py-3 px-4">Chi phí</th>
                      <th className="py-3 px-4">Giá thuê</th>
                      <th className="py-3 px-4">Trạng thái</th>
                      <th className="py-3 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                    {rooms.map(room => (
                      <tr key={room.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <img 
                            src={room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'} 
                            alt="" 
                            className="w-16 h-12 object-cover rounded-xl border border-slate-700 shadow-xs" 
                          />
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate">
                          <div className="font-bold text-white truncate">{room.title}</div>
                          <div className="text-xs text-slate-400 truncate">{room.address}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-blue-300">{room.district}</td>
                        <td className="py-3 px-4 text-xs text-slate-400">
                          <div>⚡ {room.electricity || '4.000đ/kWh'} | 💧 {room.water || '100k/ng'}</div>
                          <div>🛠️ {room.serviceFee || '150k/ph'} | 🛵 {room.parkingFee || '100k/xe'}</div>
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-400">
                          {Number(room.price).toLocaleString('vi-VN')} đ
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleStatus(room)}
                            className={`btn-spring px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                              room.status === 'available' 
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800 hover:bg-emerald-900/60' 
                                : 'bg-rose-950/80 text-rose-400 border border-rose-800 hover:bg-rose-900/60'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${room.status === 'available' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                            {room.status === 'available' ? 'Còn phòng' : 'Đã thuê'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setIsEditing(true);
                                setRoomFormData({
                                  ...room,
                                  electricity: room.electricity || '4.000đ/kWh',
                                  serviceFee: room.serviceFee || '150.000đ/phòng',
                                  parkingFee: room.parkingFee || '100.000đ/xe',
                                  amenitiesText: room.amenities?.join(', ') || '',
                                  images: room.images || []
                                });
                                setShowRoomModal(true);
                              }}
                              className="btn-spring p-2 bg-slate-800 hover:bg-blue-600 rounded-xl text-slate-300 hover:text-white hover:shadow-md hover:shadow-blue-500/20"
                              title="Sửa"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="btn-spring p-2 bg-slate-800 hover:bg-rose-600 rounded-xl text-slate-300 hover:text-white hover:shadow-md hover:shadow-rose-500/20"
                              title="Xóa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB LỊCH HẸN */}
            {adminTab === 'leads' && (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-800">
                {leads.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">Chưa có khách đặt lịch xem phòng.</div>
                ) : (
                  <table className="w-full text-left text-sm text-slate-300 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs uppercase text-slate-400 bg-slate-800/60">
                        <th className="py-3 px-4">Tên khách</th>
                        <th className="py-3 px-4">SĐT / Zalo</th>
                        <th className="py-3 px-4">Phòng quan tâm</th>
                        <th className="py-3 px-4">Ngày giờ hẹn</th>
                        <th className="py-3 px-4">Ghi chú</th>
                        <th className="py-3 px-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                      {leads.map(lead => (
                        <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-white">{lead.customerName}</td>
                          <td className="py-3 px-4 text-amber-300 font-bold">{lead.customerPhone}</td>
                          <td className="py-3 px-4 max-w-xs truncate">{lead.roomTitle}</td>
                          <td className="py-3 px-4 text-blue-300">{lead.visitDate} ({lead.visitTime})</td>
                          <td className="py-3 px-4 text-xs text-slate-400">{lead.note || 'Không có'}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a 
                                href={`tel:${lead.customerPhone}`} 
                                className="btn-spring p-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-600 hover:text-white hover:shadow-md hover:shadow-emerald-500/25"
                                title="Gọi cho khách"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a 
                                href={`https://zalo.me/${lead.customerPhone}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="btn-spring p-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-500/25"
                                title="Nhắn Zalo"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="btn-spring p-2 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-xl hover:bg-rose-600 hover:text-white hover:shadow-md hover:shadow-rose-500/25"
                                title="Xóa lịch hẹn này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-12 md:py-18 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/30 text-xs font-bold mb-3 backdrop-blur-xs shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>PHÒNG TRỌ SINH VIÊN & NGƯỜI ĐI LÀM SÀI GÒN</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            117 ROOM • Tìm Trọ Nhanh & Chuẩn Nhất TP.HCM
          </h1>
          <p className="mt-2.5 text-slate-300/90 text-xs sm:text-base max-w-xl mx-auto font-normal">
            Quản lý trực tiếp bởi Bon (0559.655.085) — Xem phòng miễn phí, chi phí minh bạch, phòng thật 100%.
          </p>
        </div>
      </section>

      {}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="relative md:col-span-5">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Tìm tên phòng, đường, địa điểm..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 sm:py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
              {searchKeyword && (
                <button 
                  onClick={() => setSearchKeyword('')} 
                  className="btn-spring absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* District Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full py-2.5 sm:py-3 px-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="Tất cả">📍 Tất cả Quận/Thành phố</option>
                {DISTRICTS.map((dist, idx) => (
                  <option key={idx} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            {/* Price Slider */}
            <div className="md:col-span-4 bg-slate-50 hover:bg-slate-100/60 transition-colors p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200">
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Mức giá tối đa:</span>
                <span className="text-blue-600 font-bold">{(maxPrice / 1000000).toFixed(1)} tr/tháng</span>
              </div>
              <input 
                type="range" 
                min="2000000" 
                max="10000000" 
                step="500000" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              Danh Sách Phòng Trọ ({filteredRooms.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Giá chuẩn, xem phòng trực tiếp với Bon.</p>
          </div>

          {(selectedDistrict !== 'Tất cả' || searchKeyword || maxPrice < 10000000) && (
            <button 
              onClick={() => { 
                setSelectedDistrict('Tất cả'); 
                setSearchKeyword('');
                setMaxPrice(10000000);
                triggerToast('Đã đặt lại bộ lọc');
              }}
              className="btn-spring flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-blue-600 font-bold border border-slate-200/80"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Đặt lại</span>
            </button>
          )}
        </div>

        {/* LOADING SKELETON */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((sk) => (
              <div key={sk} className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-3 flex flex-col gap-3 shadow-xs">
                <div className="w-full aspect-[4/3] rounded-xl sm:rounded-2xl shimmer-box"></div>
                <div className="p-2 space-y-2.5">
                  <div className="h-5 w-3/4 rounded-md shimmer-box"></div>
                  <div className="h-4 w-1/2 rounded-md shimmer-box"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-14 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs animate-fade-in-up">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-2.5">
              <Filter className="w-7 h-7 opacity-70" />
            </div>
            <p className="text-slate-700 font-bold text-base">Không tìm thấy phòng phù hợp</p>
            <p className="text-slate-400 text-xs mt-1">Hãy thử nới lỏng mức giá hoặc chọn quận khác.</p>
            <button
              onClick={() => { setSelectedDistrict('Tất cả'); setSearchKeyword(''); setMaxPrice(10000000); }}
              className="btn-sheen btn-spring mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25"
            >
              Xem tất cả phòng
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredRooms.map((room, idx) => (
              <div 
                key={room.id}
                style={{ animationDelay: `${Math.min(idx * 0.05, 0.3)}s` }}
                className="room-card-hover bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col group animate-fade-in-up"
              >
                {/* Image Container with Touch Friendly Layout */}
                <div 
                  className="relative aspect-[4/3] overflow-hidden bg-slate-100 cursor-pointer select-none" 
                  onClick={() => { setSelectedRoom(room); setActiveImageIndex(0); }}
                >
                  <img 
                    src={room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'} 
                    alt={room.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                  />
                  
                  <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-800 shadow-sm border border-slate-100 transition-transform group-hover:scale-105">
                    📍 {room.district}
                  </span>

                  <span className="absolute bottom-2.5 right-2.5 bg-black/65 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-semibold text-white">
                    📸 {room.images?.length || 1} ảnh
                  </span>

                  {room.status === 'rented' ? (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-3.5 py-1.5 bg-rose-600 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider shadow-lg">
                        ĐÃ CHO THUÊ
                      </span>
                    </div>
                  ) : (
                    <span className="absolute top-2.5 right-2.5 bg-emerald-600/95 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      CÒN PHÒNG
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <div className="text-lg sm:text-xl font-black text-blue-600 tracking-tight">
                        {Number(room.price).toLocaleString('vi-VN')} <span className="text-xs font-medium text-slate-500">đ/tháng</span>
                      </div>
                      <div className="text-xs font-bold text-slate-600 bg-slate-100/90 px-2 py-0.5 rounded-md border border-slate-200/60">{room.area} m²</div>
                    </div>

                    <h3 
                      onClick={() => { setSelectedRoom(room); setActiveImageIndex(0); }}
                      className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 cursor-pointer mb-2 leading-snug group-hover:text-blue-600 transition-colors"
                    >
                      {room.title}
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{room.address}</span>
                    </p>

                    {/* Amenities Badges */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {room.amenities?.slice(0, 3).map((item, aIdx) => (
                        <span key={aIdx} className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-[10px] sm:text-[11px] font-medium transition-colors">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => { setSelectedRoom(room); setActiveImageIndex(0); }}
                      className="btn-spring flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/90 hover:text-slate-900 text-slate-700 font-bold text-xs border border-slate-200/50"
                    >
                      Xem chi tiết
                    </button>

                    {room.status === 'available' ? (
                      <button
                        onClick={() => {
                          setBookingRoom(room);
                          setShowBookingModal(true);
                          setBookingSuccess(false);
                        }}
                        className="btn-sheen btn-spring flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-1"
                      >
                        <span>Đặt lịch xem</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                      </button>
                    ) : (
                      <button disabled className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs cursor-not-allowed">
                        Đã thuê
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto modal-mobile-sheet animate-fade-in">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl my-auto animate-scale-in max-sm:animate-sheet-mobile">
            <div className="relative aspect-[16/10] bg-black">
              <img 
                src={selectedRoom.images?.[activeImageIndex] || selectedRoom.images?.[0]} 
                alt="" 
                className="w-full h-full object-contain"
              />

              {selectedRoom.images?.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImageIndex(prev => prev > 0 ? prev - 1 : selectedRoom.images.length - 1)}
                    className="btn-spring absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center shadow-md"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setActiveImageIndex(prev => prev < selectedRoom.images.length - 1 ? prev + 1 : 0)}
                    className="btn-spring absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center shadow-md"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <button 
                onClick={() => setSelectedRoom(null)}
                className="btn-spring absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center shadow-md"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-mono shadow-xs">
                {activeImageIndex + 1} / {selectedRoom.images?.length || 1}
              </div>
            </div>

            {selectedRoom.images?.length > 1 && (
              <div className="p-2.5 bg-slate-950 flex gap-2 overflow-x-auto hide-scrollbar">
                {selectedRoom.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`btn-spring w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      idx === activeImageIndex ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/30' : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="p-4 sm:p-6 overflow-y-auto max-h-[55vh] sm:max-h-none">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">{selectedRoom.title}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{selectedRoom.address}</span>
              </p>

              {/* 4 Chi phí chi tiết */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3.5 p-3 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl text-xs">
                <div className="flex flex-col">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]"><Zap className="w-3 h-3 text-amber-500" /> Tiền điện</span>
                  <span className="font-bold text-slate-800">{selectedRoom.electricity || '4.000đ/kWh'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]"><Droplets className="w-3 h-3 text-blue-500" /> Tiền nước</span>
                  <span className="font-bold text-slate-800">{selectedRoom.water || '100.000đ/người'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]"><ShieldCheck className="w-3 h-3 text-emerald-500" /> Phí dịch vụ</span>
                  <span className="font-bold text-slate-800">{selectedRoom.serviceFee || '150.000đ/phòng'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]"><Bike className="w-3 h-3 text-violet-500" /> Phí gửi xe</span>
                  <span className="font-bold text-slate-800">{selectedRoom.parkingFee || '100.000đ/xe'}</span>
                </div>
              </div>

              <div className="mt-3.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tiện nghi phòng</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRoom.amenities?.map((amenity, idx) => (
                    <span key={idx} className="btn-spring px-2.5 py-1 bg-blue-50 border border-blue-100 hover:bg-blue-100/70 text-blue-700 rounded-lg sm:rounded-xl text-xs font-medium">
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mô tả chi tiết</h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{selectedRoom.description}</p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex gap-2 sm:gap-3">
                <a 
                  href="tel:0559655085"
                  className="btn-spring flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/25"
                >
                  <Phone className="w-4 h-4 animate-soft-wiggle" />
                  <span>Gọi Bon</span>
                </a>
                <button
                  onClick={() => {
                    const r = selectedRoom;
                    setSelectedRoom(null);
                    setBookingRoom(r);
                    setShowBookingModal(true);
                    setBookingSuccess(false);
                  }}
                  className="btn-sheen btn-spring flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/30"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Đặt Lịch Hẹn</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {showBookingModal && bookingRoom && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 modal-mobile-sheet animate-fade-in">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative my-auto animate-scale-in max-sm:animate-sheet-mobile">
            <button onClick={() => setShowBookingModal(false)} className="btn-spring absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1">
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-5 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Đặt Lịch Hẹn Thành Công!</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Dữ liệu đã tự động chuyển đến bảng quản lý của Bon. Bon sẽ sớm liên hệ xác nhận cho bạn.
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  <a 
                    href={`https://zalo.me/0559655085?text=${encodeURIComponent(`Chào Bon, mình vừa đặt hẹn xem phòng: ${bookingRoom.title} lúc ${bookingForm.visitTime} ngày ${bookingForm.visitDate}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-sheen btn-spring w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-xs sm:text-sm text-center shadow-md shadow-blue-500/25"
                  >
                    Nhắn Zalo xác nhận ngay cho Bon
                  </a>
                  <button onClick={() => setShowBookingModal(false)} className="btn-spring w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs border border-slate-200">
                    Đóng
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mb-0.5">Đặt Lịch Xem Phòng Miễn Phí</h3>
                <p className="text-xs text-blue-600 font-semibold mb-3 truncate">{bookingRoom.title}</p>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Họ tên của bạn</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={bookingForm.customerName}
                      onChange={(e) => setBookingForm({...bookingForm, customerName: e.target.value})}
                      className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-slate-50 hover:bg-white focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số điện thoại / Zalo</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="Ví dụ: 0901234567"
                      value={bookingForm.customerPhone}
                      onChange={(e) => setBookingForm({...bookingForm, customerPhone: e.target.value})}
                      className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-slate-50 hover:bg-white focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Ngày muốn xem</label>
                      <input 
                        type="date" 
                        required
                        value={bookingForm.visitDate}
                        onChange={(e) => setBookingForm({...bookingForm, visitDate: e.target.value})}
                        className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-slate-50 hover:bg-white focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Giờ muốn xem</label>
                      <input 
                        type="time" 
                        required
                        value={bookingForm.visitTime}
                        onChange={(e) => setBookingForm({...bookingForm, visitTime: e.target.value})}
                        className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-slate-50 hover:bg-white focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ghi chú (nếu có)</label>
                    <textarea 
                      rows={2}
                      placeholder="Ví dụ: Cần chuyển vào ở đầu tháng..."
                      value={bookingForm.note}
                      onChange={(e) => setBookingForm({...bookingForm, note: e.target.value})}
                      className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-slate-50 hover:bg-white focus:bg-white"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="btn-sheen btn-spring w-full mt-3.5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-blue-500/25"
                >
                  Xác Nhận Đặt Lịch Hẹn
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {}
      {showRoomModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto modal-mobile-sheet animate-fade-in">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl my-auto animate-scale-in max-sm:animate-sheet-mobile max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {isEditing ? 'Chỉnh Sửa Thông Tin Phòng' : 'Đăng Tin Phòng Trọ Mới'}
              </h3>
              <button onClick={() => setShowRoomModal(false)} className="btn-spring text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="mt-3.5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề phòng</label>
                <input 
                  type="text" 
                  required
                  value={roomFormData.title}
                  onChange={(e) => setRoomFormData({...roomFormData, title: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  placeholder="Ví dụ: Phòng Gác Ban Công Ngay Landmark 81"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quận / Khu vực (TP.HCM)</label>
                  <select 
                    value={roomFormData.district}
                    onChange={(e) => setRoomFormData({...roomFormData, district: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none font-medium cursor-pointer focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  >
                    {DISTRICTS.map((dist, idx) => (
                      <option key={idx} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá thuê (VNĐ/tháng)</label>
                  <input 
                    type="number" 
                    required
                    value={roomFormData.price}
                    onChange={(e) => setRoomFormData({...roomFormData, price: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Địa chỉ chi tiết</label>
                <input 
                  type="text" 
                  required
                  value={roomFormData.address}
                  onChange={(e) => setRoomFormData({...roomFormData, address: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Tải nhiều ảnh */}
              <div className="p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl">
                <label className="block font-bold text-slate-800 mb-2 flex items-center justify-between">
                  <span>Tải ảnh phòng (Chọn nhiều ảnh)</span>
                  <span className="text-[11px] text-blue-600 font-semibold">{roomFormData.images.length} ảnh</span>
                </label>
                
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleMultipleImageUpload}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs cursor-pointer"
                />

                {roomFormData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2.5">
                    {roomFormData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-300 group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                            Bìa
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 sm:transition-opacity flex items-center justify-center gap-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => setAsCover(idx)}
                              className="btn-spring p-1.5 bg-amber-500 hover:bg-amber-400 text-white rounded-lg text-xs"
                              title="Đặt làm ảnh bìa"
                            >
                              ⭐
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImageAtIndex(idx)}
                            className="btn-spring p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs"
                            title="Xóa ảnh"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4 Chi phí */}
              <div className="grid grid-cols-2 gap-2.5 p-3 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">⚡ Điện (Mặc định 4k)</label>
                  <input 
                    type="text" 
                    value={roomFormData.electricity}
                    onChange={(e) => setRoomFormData({...roomFormData, electricity: e.target.value})}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                    placeholder="4.000đ/kWh"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">💧 Nước</label>
                  <input 
                    type="text" 
                    value={roomFormData.water}
                    onChange={(e) => setRoomFormData({...roomFormData, water: e.target.value})}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                    placeholder="100.000đ/người"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">🛠️ Phí dịch vụ</label>
                  <input 
                    type="text" 
                    value={roomFormData.serviceFee}
                    onChange={(e) => setRoomFormData({...roomFormData, serviceFee: e.target.value})}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                    placeholder="150.000đ/phòng"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">🛵 Phí gửi xe</label>
                  <input 
                    type="text" 
                    value={roomFormData.parkingFee}
                    onChange={(e) => setRoomFormData({...roomFormData, parkingFee: e.target.value})}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                    placeholder="100.000đ/xe"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiện nghi (cách nhau dấu phẩy)</label>
                <input 
                  type="text" 
                  value={roomFormData.amenitiesText}
                  onChange={(e) => setRoomFormData({...roomFormData, amenitiesText: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả phòng</label>
                <textarea 
                  rows={3}
                  value={roomFormData.description}
                  onChange={(e) => setRoomFormData({...roomFormData, description: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="btn-spring px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-sheen btn-spring px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30"
                >
                  {submitting ? 'Đang lưu...' : 'Lưu Dữ Liệu Ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 modal-mobile-sheet animate-fade-in">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl relative my-auto animate-scale-in max-sm:animate-sheet-mobile">
            <button onClick={() => setShowLoginModal(false)} className="btn-spring absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-2 font-black text-lg shadow-md shadow-blue-500/25">
                117
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">Đăng Nhập Quản Trị</h3>
              <p className="text-xs text-slate-400">Hệ thống quản trị nội bộ Bon</p>
            </div>

            {loginError && (
              <div className="p-2 mb-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold text-center border border-red-200 animate-fade-in">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tài khoản</label>
                <input 
                  type="text" 
                  required
                  placeholder="Nhập tài khoản"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-slate-50 hover:bg-white focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mật khẩu</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="Nhập mật khẩu"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full p-2.5 pr-10 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-slate-50 hover:bg-white focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn-spring absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                className="btn-sheen btn-spring w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/30 mt-2"
              >
                Đăng Nhập
              </button>
            </form>
          </div>
        </div>
      )}

      {}
      <div className="fixed bottom-5 left-4 sm:left-6 z-40">
        <a 
          href="tel:0559655085"
          className="btn-sheen btn-spring animate-breathe-glow flex items-center gap-2 px-3.5 sm:px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-xs shadow-xl shadow-emerald-600/35 border border-emerald-400/40"
          title="Gọi Bon ngay"
        >
          <Phone className="w-4 h-4 animate-soft-wiggle text-emerald-100" />
          <span>Gọi Bon 0559.655.085</span>
        </a>
      </div>

      {}
      <footer className="bg-slate-900 text-slate-400 py-8 sm:py-10 border-t border-slate-800 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-200 text-sm">117 ROOM • Phòng Trọ TP. Hồ Chí Minh</p>
          <p className="mt-1 text-slate-400">Quản lý: Bon — 0559.655.085</p>
          <p className="mt-3 text-[11px] text-slate-600">Đồng bộ Cloud Firestore realtime • Micro-interactions mượt mà trên cả di động & máy tính</p>
        </div>
      </footer>
    </div>
  );
}

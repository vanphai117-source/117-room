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
  Sparkles, Filter, RefreshCw
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

// Danh sách chuẩn các quận và thành phố tại TP.HCM
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
      triggerToast(`Đã thêm ${files.length} ảnh chất lượng cao!`);
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
      triggerToast(`Đã chuyển trạng thái: ${newStatus === 'available' ? 'Còn phòng' : 'Đã thuê'}`);
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
    
    // Keyword match
    const kw = searchKeyword.toLowerCase();
    const matchKeyword = !searchKeyword.trim() || 
      room.title?.toLowerCase().includes(kw) ||
      room.address?.toLowerCase().includes(kw);

    const matchPrice = Number(room.price) <= maxPrice;
    return matchDistrict && matchKeyword && matchPrice;
  });

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white relative">
      {/* Optimized Hardware-Accelerated CSS Styles for Mobile */}
      <style>{`
        * {
          -webkit-tap-highlight-color: transparent;
        }
        button, a, input, select {
          touch-action: manipulation;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translate3d(0, 14px, 0); 
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
            transform: scale3d(0.96, 0.96, 1); 
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

        .animate-fade-in { 
          animation: fadeIn 0.2s cubic-bezier(0.2, 0, 0, 1) forwards; 
          will-change: opacity;
        }
        .animate-fade-in-up { 
          animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        .animate-scale-in { 
          animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        .animate-sheet-mobile {
          animation: slideUpMobile 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform;
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
        <div className="fixed bottom-5 right-4 left-4 sm:left-auto sm:right-6 z-50 animate-fade-in-up pointer-events-none">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md text-xs font-bold border transition-all ${
            toastMessage.type === 'error' 
              ? 'bg-rose-900/95 text-white border-rose-700' 
              : 'bg-slate-900/95 text-emerald-400 border-slate-700'
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
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none active:opacity-80 transition-opacity" 
            onClick={() => { setSelectedDistrict('Tất cả'); setSearchKeyword(''); }}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20 text-base sm:text-lg">
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
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-xs active:scale-95 transition-transform"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span className="max-sm:hidden">0559.655.085</span>
              <span className="sm:hidden">Gọi Bon</span>
            </a>

            {isAdmin ? (
              <div className="flex items-center gap-2 animate-scale-in">
                <span className="hidden sm:inline-block px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-300/80 shadow-xs">
                  👑 Quản trị Bon
                </span>
                <button 
                  onClick={() => { setIsAdmin(false); triggerToast('Đã đăng xuất quản trị!'); }}
                  className="p-2 text-slate-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors active:scale-90"
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
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 active:scale-95 transition-transform"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ADMIN DASHBOARD */}
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
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-transform self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Đăng Thêm Phòng Mới</span>
              </button>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setAdminTab('rooms')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  adminTab === 'rooms' 
                    ? 'bg-white text-slate-900 shadow-md' 
                    : 'bg-slate-800/80 text-slate-400'
                }`}
              >
                Danh Sách Phòng ({rooms.length})
              </button>
              <button
                onClick={() => setAdminTab('leads')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  adminTab === 'leads' 
                    ? 'bg-white text-slate-900 shadow-md' 
                    : 'bg-slate-800/80 text-slate-400'
                }`}
              >
                <span>Khách Đặt Hẹn Xem Phòng</span>
                {leads.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
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
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-transform active:scale-95 flex items-center gap-1.5 ${
                              room.status === 'available' 
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' 
                                : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${room.status === 'available' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
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
                              className="p-2 bg-slate-800 hover:bg-blue-600 rounded-xl text-slate-300 hover:text-white active:scale-90 transition-transform"
                              title="Sửa"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="p-2 bg-slate-800 hover:bg-rose-600 rounded-xl text-slate-300 hover:text-white active:scale-90 transition-transform"
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
                                className="p-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl active:scale-90 transition-transform"
                                title="Gọi cho khách"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a 
                                href={`https://zalo.me/${lead.customerPhone}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl active:scale-90 transition-transform"
                                title="Nhắn Zalo"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-2 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-xl active:scale-90 transition-transform"
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

      {/* HERO BANNER - LIGHTWEIGHT ON MOBILE GPU */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-12 md:py-18 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/30 text-xs font-bold mb-3 backdrop-blur-xs">
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

      {/* FILTER PANEL - OPTIMIZED TOUCH TARGETS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200/80 flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="relative md:col-span-5">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Tìm tên phòng, đường, địa điểm..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 sm:py-3 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
              />
              {searchKeyword && (
                <button 
                  onClick={() => setSearchKeyword('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
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
                className="w-full py-2.5 sm:py-3 px-3 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="Tất cả">📍 Tất cả Quận/Thành phố</option>
                {DISTRICTS.map((dist, idx) => (
                  <option key={idx} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            {/* Price Slider */}
            <div className="md:col-span-4 bg-slate-50 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs text-blue-600 font-bold active:scale-95 transition-transform"
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
              <div key={sk} className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-3 flex flex-col gap-3">
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
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold active:scale-95 transition-transform"
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
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl active:scale-[0.99] transition-all duration-200 flex flex-col group animate-fade-in-up"
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
                    className="w-full h-full object-cover sm:group-hover:scale-105 transition-transform duration-500" 
                  />
                  
                  <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-800 shadow-sm">
                    📍 {room.district}
                  </span>

                  <span className="absolute bottom-2.5 right-2.5 bg-black/65 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-semibold text-white">
                    📸 {room.images?.length || 1} ảnh
                  </span>

                  {room.status === 'rented' ? (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-3.5 py-1.5 bg-rose-600 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider shadow">
                        ĐÃ CHO THUÊ
                      </span>
                    </div>
                  ) : (
                    <span className="absolute top-2.5 right-2.5 bg-emerald-600/95 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1">
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
                      <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{room.area} m²</div>
                    </div>

                    <h3 
                      onClick={() => { setSelectedRoom(room); setActiveImageIndex(0); }}
                      className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 cursor-pointer mb-2 leading-snug"
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
                        <span key={aIdx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] sm:text-[11px] font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => { setSelectedRoom(room); setActiveImageIndex(0); }}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-700 font-bold text-xs active:scale-95 transition-transform"
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
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-sm active:scale-95 transition-transform"
                      >
                        Đặt lịch xem
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

      {/* MODAL CHI TIẾT PHÒNG - MOBILE BOTTOM SHEET */}
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
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 text-white flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setActiveImageIndex(prev => prev < selectedRoom.images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 text-white flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <button 
                onClick={() => setSelectedRoom(null)}
                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center active:scale-90 transition-transform"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-mono">
                {activeImageIndex + 1} / {selectedRoom.images?.length || 1}
              </div>
            </div>

            {selectedRoom.images?.length > 1 && (
              <div className="p-2.5 bg-slate-950 flex gap-2 overflow-x-auto hide-scrollbar">
                {selectedRoom.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      idx === activeImageIndex ? 'border-blue-500 scale-105' : 'border-transparent opacity-50'
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
                    <span key={idx} className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg sm:rounded-xl text-xs font-medium">
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
                  className="flex-1 py-3 bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <Phone className="w-4 h-4" />
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
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Đặt Lịch Hẹn</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ĐẶT LỊCH HẸN */}
      {showBookingModal && bookingRoom && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 modal-mobile-sheet animate-fade-in">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative my-auto animate-scale-in max-sm:animate-sheet-mobile">
            <button onClick={() => setShowBookingModal(false)} className="absolute top-4 right-4 text-slate-400 active:scale-90 transition-transform">
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-5 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
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
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl text-xs sm:text-sm text-center active:scale-95 transition-transform"
                  >
                    Nhắn Zalo xác nhận ngay cho Bon
                  </a>
                  <button onClick={() => setShowBookingModal(false)} className="w-full py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs active:scale-95 transition-transform">
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
                      className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 transition-colors"
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
                      className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 transition-colors"
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
                        className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Giờ muốn xem</label>
                      <input 
                        type="time" 
                        required
                        value={bookingForm.visitTime}
                        onChange={(e) => setBookingForm({...bookingForm, visitTime: e.target.value})}
                        className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 transition-colors"
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
                      className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full mt-3.5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-xs sm:text-sm active:scale-95 transition-transform"
                >
                  Xác Nhận Đặt Lịch Hẹn
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL THÊM / SỬA PHÒNG */}
      {showRoomModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto modal-mobile-sheet animate-fade-in">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl my-auto animate-scale-in max-sm:animate-sheet-mobile max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {isEditing ? 'Chỉnh Sửa Thông Tin Phòng' : 'Đăng Tin Phòng Trọ Mới'}
              </h3>
              <button onClick={() => setShowRoomModal(false)} className="text-slate-400 active:scale-90 transition-transform">
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
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 transition-colors"
                  placeholder="Ví dụ: Phòng Gác Ban Công Ngay Landmark 81"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quận / Khu vực (TP.HCM)</label>
                  <select 
                    value={roomFormData.district}
                    onChange={(e) => setRoomFormData({...roomFormData, district: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none font-medium cursor-pointer"
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
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 transition-colors"
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
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 transition-colors"
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
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                />

                {roomFormData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2.5">
                    {roomFormData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-300 group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            Bìa
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 sm:transition-opacity flex items-center justify-center gap-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => setAsCover(idx)}
                              className="p-1.5 bg-amber-500 text-white rounded-lg text-xs active:scale-90"
                              title="Đặt làm ảnh bìa"
                            >
                              ⭐
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImageAtIndex(idx)}
                            className="p-1.5 bg-rose-600 text-white rounded-lg text-xs active:scale-90"
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
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl outline-none"
                    placeholder="4.000đ/kWh"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">💧 Nước</label>
                  <input 
                    type="text" 
                    value={roomFormData.water}
                    onChange={(e) => setRoomFormData({...roomFormData, water: e.target.value})}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl outline-none"
                    placeholder="100.000đ/người"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">🛠️ Phí dịch vụ</label>
                  <input 
                    type="text" 
                    value={roomFormData.serviceFee}
                    onChange={(e) => setRoomFormData({...roomFormData, serviceFee: e.target.value})}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl outline-none"
                    placeholder="150.000đ/phòng"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">🛵 Phí gửi xe</label>
                  <input 
                    type="text" 
                    value={roomFormData.parkingFee}
                    onChange={(e) => setRoomFormData({...roomFormData, parkingFee: e.target.value})}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl outline-none"
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
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả phòng</label>
                <textarea 
                  rows={3}
                  value={roomFormData.description}
                  onChange={(e) => setRoomFormData({...roomFormData, description: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="px-4 py-2.5 bg-slate-100 active:bg-slate-200 text-slate-600 font-bold rounded-xl active:scale-95 transition-transform"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl active:scale-95 transition-transform"
                >
                  {submitting ? 'Đang lưu...' : 'Lưu Dữ Liệu Ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ĐĂNG NHẬP ADMIN BON */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 modal-mobile-sheet animate-fade-in">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl relative my-auto animate-scale-in max-sm:animate-sheet-mobile">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400 active:scale-90 transition-transform">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-2 font-black text-lg shadow-md">
                117
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">Đăng Nhập Quản Trị</h3>
              <p className="text-xs text-slate-400">Hệ thống quản trị nội bộ Bon</p>
            </div>

            {loginError && (
              <div className="p-2 mb-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold text-center border border-red-200">
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
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 transition-colors"
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
                    className="w-full p-2.5 pr-10 border border-slate-300 rounded-xl outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-xs sm:text-sm active:scale-95 transition-transform mt-2"
              >
                Đăng Nhập
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTON (CALL / ZALO) */}
      <div className="fixed bottom-5 left-4 sm:left-6 z-40">
        <a 
          href="tel:0559655085"
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 bg-emerald-600 text-white rounded-full font-bold text-xs shadow-lg active:scale-95 transition-transform"
          title="Gọi Bon ngay"
        >
          <Phone className="w-4 h-4" />
          <span>Gọi Bon 0559.655.085</span>
        </a>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-8 sm:py-10 border-t border-slate-800 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-200 text-sm">117 ROOM • Phòng Trọ TP. Hồ Chí Minh</p>
          <p className="mt-1 text-slate-400">Quản lý: Bon — 0559.655.085</p>
          <p className="mt-3 text-[11px] text-slate-600">Đồng bộ Cloud Firestore realtime • Tối ưu 60fps mượt mà trên di động</p>
        </div>
      </footer>
    </div>
  );
}

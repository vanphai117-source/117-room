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
  GraduationCap, Sparkles, Filter, RefreshCw
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

// Danh sách các trường Đại học & Học viện tại TP.HCM
const UNIVERSITY_GROUPS = [
  {
    group: '1. Khối ĐH Quốc gia TP.HCM (ĐHQG-HCM)',
    schools: [
      'Trường ĐH Bách khoa (HCMUT)',
      'Trường ĐH Khoa học Tự nhiên (HCMUS)',
      'Trường ĐH Khoa học Xã hội và Nhân văn (HCMUSSH)',
      'Trường ĐH Công nghệ Thông tin (UIT)',
      'Trường ĐH Kinh tế – Luật (UEL)',
      'Trường ĐH Quốc tế (HCMIU)',
      'Trường ĐH An Giang',
      'Trường ĐH Khoa học Sức khỏe'
    ]
  },
  {
    group: '2. ĐH & Học viện Công lập (Kinh tế - Luật - Hành chính)',
    schools: [
      'ĐH Kinh tế TP.HCM (UEH)',
      'ĐH Ngoại thương – Cơ sở 2 (FTU2)',
      'ĐH Ngân hàng TP.HCM (HUB)',
      'ĐH Tài chính – Marketing (UFM)',
      'ĐH Luật TP.HCM (ULAW)',
      'ĐH Mở TP.HCM (OU)',
      'Học viện Cán bộ TP.HCM',
      'Trường ĐH Lao động – Xã hội (Cơ sở 2)'
    ]
  },
  {
    group: '2. ĐH & Học viện Công lập (Kỹ thuật - Công nghệ - Giao thông)',
    schools: [
      'ĐH Sư phạm Kỹ thuật TP.HCM (HCMUTE)',
      'ĐH Công nghiệp TP.HCM (IUH)',
      'ĐH Công Thương TP.HCM (HUIT)',
      'ĐH Giao thông Vận tải TP.HCM (UTH)',
      'Phân hiệu ĐH Giao thông Vận tải tại TP.HCM (UTC2)',
      'Học viện Công nghệ Bưu chính Viễn thông (PTIT)',
      'Học viện Hàng không Việt Nam (VAA)'
    ]
  },
  {
    group: '2. ĐH Công lập (Y Dược - Sức khỏe)',
    schools: [
      'ĐH Y Dược TP.HCM (UMP)',
      'ĐH Y khoa Phạm Ngọc Thạch (PNTU)'
    ]
  },
  {
    group: '2. ĐH Công lập (Sư phạm - Tổng hợp - Đa ngành)',
    schools: [
      'ĐH Sư phạm TP.HCM (HCMUE)',
      'ĐH Sài Gòn (SGU)',
      'ĐH Nông Lâm TP.HCM (NLU)',
      'ĐH Tôn Đức Thắng (TDTU)',
      'ĐH Tài nguyên và Môi trường TP.HCM (HCMUNRE)',
      'ĐH Sư phạm Thể dục Thể thao TP.HCM',
      'ĐH Thể dục Thể thao TP.HCM'
    ]
  },
  {
    group: '2. ĐH Công lập (Nghệ thuật - Kiến trúc - Văn hóa)',
    schools: [
      'ĐH Kiến trúc TP.HCM (UAH)',
      'ĐH Mỹ thuật TP.HCM',
      'Nhạc viện TP.HCM',
      'ĐH Sân khấu – Điện ảnh TP.HCM',
      'ĐH Văn hóa TP.HCM'
    ]
  },
  {
    group: '2. ĐH Khối Quân sự & Công an',
    schools: [
      'ĐH An ninh Nhân dân',
      'ĐH Cảnh sát Nhân dân',
      'ĐH Trần Đại Nghĩa',
      'Trường Sĩ quan Lục quân 2'
    ]
  },
  {
    group: '3. Các trường Đại học Tư thục (Ngoài công lập)',
    schools: [
      'ĐH FPT TP.HCM',
      'ĐH Công nghệ TP.HCM (HUTECH)',
      'ĐH Văn Lang (VLU)',
      'ĐH Hoa Sen (HSU)',
      'ĐH Ngoại ngữ – Tin học TP.HCM (HUFLIT)',
      'ĐH Kinh tế – Tài chính TP.HCM (UEF)',
      'ĐH Nguyễn Tất Thành (NTTU)',
      'ĐH Quốc tế Hồng Bàng (HIU)',
      'ĐH Quốc tế Sài Gòn (SIU)',
      'ĐH Công nghệ Sài Gòn (STU)',
      'ĐH Văn Hiến (VHU)',
      'ĐH Gia Định (GDU)',
      'ĐH Hùng Vương TP.HCM (HVU)',
      'ĐH Quản lý và Công nghệ TP.HCM (UMT)',
      'ĐH Thái Bình Dương',
      'ĐH Quốc tế Bắc Hà'
    ]
  },
  {
    group: '4. ĐH Quốc tế & Vốn đầu tư nước ngoài',
    schools: [
      'ĐH RMIT Việt Nam (Quận 7)',
      'ĐH Fulbright Việt Nam (FUV)',
      'ĐH Việt Đức (VGU)',
      'ĐH Anh Quốc Việt Nam (BUV)',
      'Viện Công nghệ Châu Á tại Việt Nam (AITCV)'
    ]
  }
];

// Nút gợi ý nhanh các trường phổ biến
const POPULAR_UNIVERSITIES = [
  'HUTECH', 'Bách khoa', 'UEH', 'Văn Lang', 'Sư phạm Kỹ thuật', 
  'UIT', 'UEL', 'RMIT', 'Y Dược', 'Tôn Đức Thắng'
];

const DEFAULT_ROOMS = [
  {
    id: 'demo-1',
    title: 'Phòng Studio Ban Công Thoáng Mát Ngay HUTECH & Landmark 81',
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
    nearbySchools: ['ĐH Công nghệ TP.HCM (HUTECH)', 'ĐH Kinh tế – Tài chính TP.HCM (UEF)', 'ĐH Giao thông Vận tải TP.HCM (UTH)'],
    description: 'Phòng mới sơn sửa sạch đẹp, ban công thoáng mát, cổng khóa vân tay an toàn tuyệt đối.'
  },
  {
    id: 'demo-2',
    title: 'Phòng Cao Cấp Đầy Đủ Nội Thất Cạnh ĐH Sư Phạm & Sài Gòn Q5',
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
    nearbySchools: ['ĐH Sư phạm TP.HCM (HCMUE)', 'ĐH Sài Gòn (SGU)', 'ĐH Khoa học Tự nhiên (HCMUS)'],
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
  const [selectedUniversity, setSelectedUniversity] = useState('Tất cả');
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
    nearbySchoolsText: '',
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
      const nearbySchools = roomFormData.nearbySchoolsText.split(',').map(s => s.trim()).filter(Boolean);
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
        nearbySchools,
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
      room.address?.toLowerCase().includes(kw) ||
      room.nearbySchools?.some(s => s.toLowerCase().includes(kw));

    // University match
    const matchUniversity = selectedUniversity === 'Tất cả' || (() => {
      const uLower = selectedUniversity.toLowerCase();
      const bracketMatch = selectedUniversity.match(/\(([^)]+)\)/);
      const acronym = bracketMatch ? bracketMatch[1].toLowerCase() : '';
      const cleanSchoolName = selectedUniversity
        .replace(/\([^)]*\)/g, '')
        .replace(/^(Trường\s+)?(ĐH|Học viện)\s+/i, '')
        .trim().toLowerCase();

      return (
        room.nearbySchools?.some(s => {
          const sLower = s.toLowerCase();
          return sLower.includes(uLower) || 
                 (acronym && sLower.includes(acronym)) || 
                 (cleanSchoolName && sLower.includes(cleanSchoolName));
        }) ||
        room.title?.toLowerCase().includes(uLower) ||
        (acronym && room.title?.toLowerCase().includes(acronym)) ||
        room.description?.toLowerCase().includes(uLower) ||
        (acronym && room.description?.toLowerCase().includes(acronym)) ||
        room.address?.toLowerCase().includes(uLower)
      );
    })();

    const matchPrice = Number(room.price) <= maxPrice;
    return matchDistrict && matchKeyword && matchUniversity && matchPrice;
  });

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white relative">
      {/* CSS Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes shimmerLoading {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes softPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.04); opacity: 0.92; }
        }
        .animate-fade-in { animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-float { animation: floatSlow 3.5s ease-in-out infinite; }
        .animate-pulse-soft { animation: softPulse 2.2s ease-in-out infinite; }
        .shimmer-box {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmerLoading 1.5s infinite;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md text-xs font-bold border transition-all ${
            toastMessage.type === 'error' 
              ? 'bg-rose-900/90 text-white border-rose-700' 
              : 'bg-slate-900/90 text-emerald-400 border-slate-700'
          }`}>
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => { setSelectedDistrict('Tất cả'); setSelectedUniversity('Tất cả'); setSearchKeyword(''); }}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20 text-lg transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
              117
            </div>
            <div>
              <div className="text-xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent flex items-center gap-1.5">
                <span>117 ROOM</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <div className="text-[10px] text-slate-400 font-bold tracking-wider">TP. HỒ CHÍ MINH • REALTIME</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <a 
              href="tel:0559655085" 
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-blue-50/80 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-all duration-200 hover:shadow-xs active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
              <span>0559.655.085 (Bon)</span>
            </a>

            {isAdmin ? (
              <div className="flex items-center gap-2 animate-scale-in">
                <span className="hidden sm:inline-block px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-300/80 shadow-xs">
                  👑 Quản trị Bon
                </span>
                <button 
                  onClick={() => { setIsAdmin(false); triggerToast('Đã đăng xuất quản trị!'); }}
                  className="p-2 text-slate-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 active:scale-90"
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
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100/80 hover:border-slate-400 transition-all duration-200 active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Admin Bon</span>
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
                    nearbySchoolsText: '',
                    description: ''
                  });
                  setShowRoomModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all duration-300 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-95 self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Đăng Thêm Phòng Mới</span>
              </button>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setAdminTab('rooms')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  adminTab === 'rooms' 
                    ? 'bg-white text-slate-900 shadow-md scale-100' 
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                Danh Sách Phòng ({rooms.length})
              </button>
              <button
                onClick={() => setAdminTab('leads')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                  adminTab === 'leads' 
                    ? 'bg-white text-slate-900 shadow-md scale-100' 
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
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
                          <div className="font-bold text-white truncate hover:text-blue-300 transition-colors">{room.title}</div>
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
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                              room.status === 'available' 
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800 hover:bg-emerald-900' 
                                : 'bg-rose-950/80 text-rose-400 border border-rose-800 hover:bg-rose-900'
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
                                  nearbySchoolsText: room.nearbySchools?.join(', ') || '',
                                  images: room.images || []
                                });
                                setShowRoomModal(true);
                              }}
                              className="p-2 bg-slate-800 hover:bg-blue-600 rounded-xl text-slate-300 hover:text-white transition-all active:scale-90"
                              title="Sửa"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="p-2 bg-slate-800 hover:bg-rose-600 rounded-xl text-slate-300 hover:text-white transition-all active:scale-90"
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
                                className="p-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-600 hover:text-white transition-all active:scale-90"
                                title="Gọi cho khách"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a 
                                href={`https://zalo.me/${lead.customerPhone}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                                title="Nhắn Zalo"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-2 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-xl hover:bg-rose-600 hover:text-white transition-all active:scale-90"
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

      {/* HERO BANNER WITH GRADIENT ANIMATIONS */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-14 md:py-20 px-4 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-float"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '1.8s' }}></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/30 text-xs font-bold mb-4 backdrop-blur-md shadow-xs animate-pulse-soft">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>PHÒNG TRỌ SINH VIÊN & NGƯỜI ĐI LÀM SÀI GÒN</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            117 ROOM • Tìm Trọ Nhanh & Chuẩn Nhất TP.HCM
          </h1>
          <p className="mt-3 text-slate-300/90 text-sm sm:text-base max-w-xl mx-auto font-normal">
            Quản lý trực tiếp bởi Bon (0559.655.085) — Xem phòng miễn phí, chi phí minh bạch, hỗ trợ sinh viên các trường Đại học.
          </p>
        </div>
      </section>

      {/* FILTER PANEL */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white/95 backdrop-blur-md p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/70 flex flex-col gap-4 transition-all duration-300 hover:shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="relative md:col-span-4 group">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Tìm đường, tên phòng, địa điểm..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50/90 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
              />
              {searchKeyword && (
                <button 
                  onClick={() => setSearchKeyword('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* University Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="w-full py-3 px-3.5 bg-slate-50/90 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 truncate cursor-pointer"
              >
                <option value="Tất cả">🎓 Tất cả Trường Đại học</option>
                {UNIVERSITY_GROUPS.map((group, gIdx) => (
                  <optgroup key={gIdx} label={group.group} className="font-bold text-slate-900 bg-slate-100">
                    {group.schools.map((school, sIdx) => (
                      <option key={sIdx} value={school} className="font-normal text-slate-700 bg-white">
                        {school}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* District Dropdown */}
            <div className="md:col-span-2">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full py-3 px-3 bg-slate-50/90 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 truncate cursor-pointer"
              >
                <option value="Tất cả">📍 Tất cả Quận/Thành phố</option>
                {DISTRICTS.map((dist, idx) => (
                  <option key={idx} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            {/* Price Slider */}
            <div className="md:col-span-3 bg-slate-50/90 p-3 rounded-2xl border border-slate-200">
              <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
                <span>Giá tối đa:</span>
                <span className="text-blue-600 font-black">{(maxPrice / 1000000).toFixed(1)} tr/tháng</span>
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

          {/* Quick University Selection Badges with Smooth Scroll */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs pb-1 hide-scrollbar">
            <span className="font-bold text-slate-400 whitespace-nowrap text-[11px] uppercase tracking-wider flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>Gợi ý ĐH:</span>
            </span>
            <button
              onClick={() => setSelectedUniversity('Tất cả')}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all duration-200 active:scale-95 ${
                selectedUniversity === 'Tất cả' 
                  ? 'bg-blue-600 text-white font-bold shadow-xs shadow-blue-500/40 scale-100' 
                  : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              Tất cả
            </button>
            {POPULAR_UNIVERSITIES.map((uni, idx) => {
              const fullUni = UNIVERSITY_GROUPS.flatMap(g => g.schools).find(s => s.toLowerCase().includes(uni.toLowerCase())) || uni;
              const isSelected = selectedUniversity === fullUni;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedUniversity(isSelected ? 'Tất cả' : fullUni)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all duration-200 border active:scale-95 ${
                    isSelected 
                      ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs shadow-blue-500/40 scale-100' 
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50'
                  }`}
                >
                  {uni}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA WITH SKELETON & ANIMATED CARDS */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Danh Sách Phòng Trọ Cho Thuê ({filteredRooms.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Giá chuẩn, không tăng giá ảo, xem phòng trực tiếp với Bon.</p>
          </div>

          {(selectedDistrict !== 'Tất cả' || selectedUniversity !== 'Tất cả' || searchKeyword || maxPrice < 10000000) && (
            <button 
              onClick={() => { 
                setSelectedDistrict('Tất cả'); 
                setSelectedUniversity('Tất cả'); 
                setSearchKeyword('');
                setMaxPrice(10000000);
                triggerToast('Đã đặt lại bộ lọc');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-blue-600 font-bold transition-all active:scale-95"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Đặt lại bộ lọc</span>
            </button>
          )}
        </div>

        {/* LOADING SKELETON */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((sk) => (
              <div key={sk} className="bg-white rounded-3xl border border-slate-200/70 overflow-hidden shadow-xs p-3 flex flex-col gap-3">
                <div className="w-full aspect-[4/3] rounded-2xl shimmer-box"></div>
                <div className="p-2 space-y-2.5">
                  <div className="h-5 w-3/4 rounded-md shimmer-box"></div>
                  <div className="h-4 w-1/2 rounded-md shimmer-box"></div>
                  <div className="h-4 w-full rounded-md shimmer-box"></div>
                  <div className="pt-2 flex gap-2">
                    <div className="h-8 flex-1 rounded-xl shimmer-box"></div>
                    <div className="h-8 flex-1 rounded-xl shimmer-box"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-xs animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-3">
              <Filter className="w-8 h-8 opacity-70" />
            </div>
            <p className="text-slate-700 font-bold text-base">Không tìm thấy phòng phù hợp</p>
            <p className="text-slate-400 text-xs mt-1">Hãy thử nới lỏng mức giá hoặc chọn quận/trường khác.</p>
            <button
              onClick={() => { setSelectedDistrict('Tất cả'); setSelectedUniversity('Tất cả'); setSearchKeyword(''); setMaxPrice(10000000); }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
            >
              Xem tất cả phòng
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room, idx) => (
              <div 
                key={room.id}
                style={{ animationDelay: `${idx * 0.06}s` }}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-2xl hover:border-blue-300/80 hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col group animate-fade-in-up"
              >
                {/* Image Container with Zoom Effect */}
                <div 
                  className="relative aspect-[4/3] overflow-hidden bg-slate-100 cursor-pointer" 
                  onClick={() => { setSelectedRoom(room); setActiveImageIndex(0); }}
                >
                  <img 
                    src={room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'} 
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out" 
                  />
                  
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-md">
                    📍 {room.district}
                  </span>

                  <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white">
                    📸 {room.images?.length || 1} ảnh
                  </span>

                  {room.status === 'rented' ? (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center transition-opacity">
                      <span className="px-4 py-1.5 bg-rose-600 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider shadow-lg">
                        ĐÃ CHO THUÊ
                      </span>
                    </div>
                  ) : (
                    <span className="absolute top-3 right-3 bg-emerald-600/95 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1 backdrop-blur-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      CÒN PHÒNG
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <div className="text-xl font-black text-blue-600 tracking-tight">
                        {Number(room.price).toLocaleString('vi-VN')} <span className="text-xs font-medium text-slate-500">đ/tháng</span>
                      </div>
                      <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{room.area} m²</div>
                    </div>

                    <h3 
                      onClick={() => { setSelectedRoom(room); setActiveImageIndex(0); }}
                      className="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 cursor-pointer mb-2 leading-snug"
                    >
                      {room.title}
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{room.address}</span>
                    </p>

                    {/* Nearby schools badges */}
                    {room.nearbySchools && room.nearbySchools.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {room.nearbySchools.slice(0, 2).map((sch, sIdx) => (
                          <span key={sIdx} className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-[10px] font-semibold truncate max-w-[170px]">
                            🎓 {sch}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Amenities Badges */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {room.amenities?.slice(0, 3).map((item, aIdx) => (
                        <span key={aIdx} className="px-2.5 py-0.5 bg-slate-100/90 text-slate-600 rounded-md text-[11px] font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => { setSelectedRoom(room); setActiveImageIndex(0); }}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all active:scale-95"
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
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs transition-all duration-200 shadow-md shadow-blue-600/20 active:scale-95"
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

      {/* MODAL CHI TIẾT PHÒNG */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl my-8 animate-scale-in">
            <div className="relative aspect-[16/10] bg-black">
              <img 
                src={selectedRoom.images?.[activeImageIndex] || selectedRoom.images?.[0]} 
                alt="" 
                className="w-full h-full object-contain transition-all duration-300"
              />

              {selectedRoom.images?.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImageIndex(prev => prev > 0 ? prev - 1 : selectedRoom.images.length - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition active:scale-90"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setActiveImageIndex(prev => prev < selectedRoom.images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition active:scale-90"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <button 
                onClick={() => setSelectedRoom(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-mono">
                {activeImageIndex + 1} / {selectedRoom.images?.length || 1}
              </div>
            </div>

            {selectedRoom.images?.length > 1 && (
              <div className="p-3 bg-slate-950 flex gap-2 overflow-x-auto hide-scrollbar">
                {selectedRoom.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      idx === activeImageIndex ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/50' : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="p-6">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{selectedRoom.title}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {selectedRoom.address}
              </p>

              {/* 4 Chi phí chi tiết */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs">
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

              {/* Gần các trường ĐH */}
              {selectedRoom.nearbySchools && selectedRoom.nearbySchools.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gần các trường Đại học</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRoom.nearbySchools.map((sch, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl text-xs font-medium">
                        🎓 {sch}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tiện nghi phòng</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRoom.amenities?.map((amenity, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl text-xs font-medium">
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mô tả chi tiết</h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{selectedRoom.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
                <a 
                  href="tel:0559655085"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>Gọi Bon 0559.655.085</span>
                </a>
                <button
                  onClick={() => {
                    const r = selectedRoom;
                    setSelectedRoom(null);
                    setBookingRoom(r);
                    setShowBookingModal(true);
                    setBookingSuccess(false);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Đặt Lịch Hẹn Xem</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ĐẶT LỊCH HẸN */}
      {showBookingModal && bookingRoom && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-scale-in">
            <button onClick={() => setShowBookingModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition">
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6 animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Đặt Lịch Hẹn Thành Công!</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Dữ liệu đã tự động chuyển đến bảng quản lý của Bon. Bon sẽ sớm liên hệ xác nhận cho bạn.
                </p>
                <div className="mt-6 flex flex-col gap-2">
                  <a 
                    href={`https://zalo.me/0559655085?text=${encodeURIComponent(`Chào Bon, mình vừa đặt hẹn xem phòng: ${bookingRoom.title} lúc ${bookingForm.visitTime} ngày ${bookingForm.visitDate}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm text-center shadow-md shadow-blue-600/20 transition active:scale-95"
                  >
                    Nhắn Zalo xác nhận ngay cho Bon
                  </a>
                  <button onClick={() => setShowBookingModal(false)} className="w-full py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-200 transition">
                    Đóng
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <h3 className="text-lg font-black text-slate-900 mb-1">Đặt Lịch Xem Phòng Miễn Phí</h3>
                <p className="text-xs text-blue-600 font-semibold mb-4 truncate">{bookingRoom.title}</p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Họ tên của bạn</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={bookingForm.customerName}
                      onChange={(e) => setBookingForm({...bookingForm, customerName: e.target.value})}
                      className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
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
                      className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
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
                        className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Giờ muốn xem</label>
                      <input 
                        type="time" 
                        required
                        value={bookingForm.visitTime}
                        onChange={(e) => setBookingForm({...bookingForm, visitTime: e.target.value})}
                        className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
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
                      className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-md shadow-blue-600/20 active:scale-95"
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
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-8 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {isEditing ? 'Chỉnh Sửa Thông Tin Phòng' : 'Đăng Tin Phòng Trọ Mới (Realtime)'}
              </h3>
              <button onClick={() => setShowRoomModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề phòng</label>
                <input 
                  type="text" 
                  required
                  value={roomFormData.title}
                  onChange={(e) => setRoomFormData({...roomFormData, title: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  placeholder="Ví dụ: Phòng Gác Ban Công Ngay Landmark 81"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
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
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              {/* Tải nhiều ảnh */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <label className="block font-bold text-slate-800 mb-2 flex items-center justify-between">
                  <span>Tải ảnh phòng (Chọn cùng lúc nhiều ảnh)</span>
                  <span className="text-[11px] text-blue-600 font-semibold">{roomFormData.images.length} ảnh đã chọn</span>
                </label>
                
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleMultipleImageUpload}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs cursor-pointer"
                />

                {roomFormData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {roomFormData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-300 group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                            Ảnh bìa
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => setAsCover(idx)}
                              className="p-1.5 bg-amber-500 text-white rounded-lg text-xs hover:bg-amber-600 transition"
                              title="Đặt làm ảnh bìa"
                            >
                              ⭐
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImageAtIndex(idx)}
                            className="p-1.5 bg-rose-600 text-white rounded-lg text-xs hover:bg-rose-700 transition"
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
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">⚡ Tiền điện (Mặc định 4k)</label>
                  <input 
                    type="text" 
                    value={roomFormData.electricity}
                    onChange={(e) => setRoomFormData({...roomFormData, electricity: e.target.value})}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl outline-none"
                    placeholder="4.000đ/kWh"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">💧 Tiền nước</label>
                  <input 
                    type="text" 
                    value={roomFormData.water}
                    onChange={(e) => setRoomFormData({...roomFormData, water: e.target.value})}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl outline-none"
                    placeholder="100.000đ/người"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">🛠️ Phí dịch vụ</label>
                  <input 
                    type="text" 
                    value={roomFormData.serviceFee}
                    onChange={(e) => setRoomFormData({...roomFormData, serviceFee: e.target.value})}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl outline-none"
                    placeholder="150.000đ/phòng"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">🛵 Phí gửi xe</label>
                  <input 
                    type="text" 
                    value={roomFormData.parkingFee}
                    onChange={(e) => setRoomFormData({...roomFormData, parkingFee: e.target.value})}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl outline-none"
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
                <label className="block font-bold text-slate-700 mb-1">Gần các trường ĐH</label>
                <input 
                  type="text" 
                  value={roomFormData.nearbySchoolsText}
                  onChange={(e) => setRoomFormData({...roomFormData, nearbySchoolsText: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none mb-2"
                  placeholder="HUTECH, UEF, Bách Khoa..."
                />
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200 hide-scrollbar">
                  {UNIVERSITY_GROUPS.flatMap(g => g.schools).map((school, sIdx) => {
                    const shortName = school.match(/\(([^)]+)\)/)?.[1] || school.replace(/^(Trường\s+)?(ĐH|Học viện)\s+/i, '');
                    return (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => {
                          const current = roomFormData.nearbySchoolsText 
                            ? roomFormData.nearbySchoolsText.split(',').map(s => s.trim()).filter(Boolean) 
                            : [];
                          if (!current.includes(school)) {
                            setRoomFormData({
                              ...roomFormData,
                              nearbySchoolsText: [...current, school].join(', ')
                            });
                          }
                        }}
                        className="px-2 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-slate-600 hover:text-blue-600 text-[10px] font-medium transition active:scale-95"
                      >
                        + {shortName}
                      </button>
                    );
                  })}
                </div>
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

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition active:scale-95"
                >
                  {submitting ? 'Đang lưu lên Cloud...' : 'Lưu Dữ Liệu Ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ĐĂNG NHẬP ADMIN BON */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-scale-in">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-2 font-black text-xl shadow-md shadow-blue-500/30">
                117
              </div>
              <h3 className="text-lg font-black text-slate-900">Đăng Nhập Quản Trị</h3>
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
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
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
                    className="w-full p-2.5 pr-10 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-md shadow-blue-600/30 active:scale-95 mt-2"
              >
                Đăng Nhập
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTON (CALL / ZALO) */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
        <a 
          href="tel:0559655085"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-xs shadow-xl shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all duration-300"
          title="Gọi Bon ngay"
        >
          <Phone className="w-4 h-4 animate-bounce" />
          <span className="hidden sm:inline">Gọi Bon 0559.655.085</span>
        </a>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-200 text-sm">117 ROOM • Phòng Trọ TP. Hồ Chí Minh</p>
          <p className="mt-1 text-slate-400">Quản lý: Bon — 0559.655.085</p>
          <p className="mt-4 text-[11px] text-slate-600">Đồng bộ dữ liệu thời gian thực qua Cloud Firestore • Tối ưu chuyển động mượt mà</p>
        </div>
      </footer>
    </div>
  );
}

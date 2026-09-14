import React, { useState, useEffect } from 'react';
// ==========================================
// 1. KẾT NỐI CHÍNH THỨC VỚI GOOGLE FIREBASE
// ==========================================
import { initializeApp } from "firebase/app";
import { 
  getFirestore, collection, onSnapshot, 
  addDoc, updateDoc, deleteDoc, doc 
} from "firebase/firestore";
import { 
  Phone, MessageSquare, MapPin, Search, Plus, 
  Trash2, Edit, ChevronLeft, ChevronRight, 
  LogIn, LogOut, Calendar, Check, X
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

// Dữ liệu mẫu khởi đầu
const DEFAULT_ROOMS = [
  {
    id: 'demo-1',
    title: 'Phòng Studio Ban Công Thoáng Mát Ngay HUTECH & Landmark 81',
    district: 'Bình Thạnh',
    address: '117/12 Điện Biên Phủ, Phường 15, Bình Thạnh',
    price: 4500000,
    area: 28,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    electricity: '3.800đ/kWh',
    water: '100.000đ/người',
    amenities: ['Máy lạnh', 'Gác xép', 'Khóa vân tay', 'Giờ giấc tự do'],
    contactName: 'Bon',
    phone: '0559655085',
    nearbySchools: ['HUTECH Điện Biên Phủ', 'UEF', 'GTVT'],
    description: 'Phòng mới sơn sửa sạch đẹp, ban công thoáng mát, cổng khóa vân tay an toàn tuyệt đối.'
  }
];

export default function App() {
  const [rooms, setRooms] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quản trị Bon
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminTab, setAdminTab] = useState('rooms');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Bộ lọc
  const [selectedDistrict, setSelectedDistrict] = useState('Tất cả');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [maxPrice, setMaxPrice] = useState(10000000);

  // Chi tiết & Slider ảnh
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
    district: 'Bình Thạnh',
    address: '',
    price: 3500000,
    area: 25,
    status: 'available',
    images: [],
    electricity: '3.800đ/kWh',
    water: '100.000đ/người',
    amenitiesText: 'Máy lạnh, Khóa vân tay, Giờ giấc tự do',
    contactName: 'Bon',
    phone: '0559655085',
    nearbySchoolsText: '',
    description: ''
  });

  // Đồng bộ thời gian thực từ Cloud Firestore
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
    if (loginForm.username.toLowerCase() === 'bon' && loginForm.password === 'bon117admin') {
      setIsAdmin(true);
      setShowLoginModal(false);
      setLoginError('');
      setLoginForm({ username: '', password: '' });
    } else {
      setLoginError('Sai tài khoản hoặc mật khẩu (bon / bon117admin)');
    }
  };

  // =========================================================================
  // HÀM NÉN ẢNH TỰ ĐỘNG (GIẢI QUYẾT TRIỆT ĐỂ LỖI DUNG LƯỢNG 1MB CỦA FIRESTORE)
  // =========================================================================
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

          // Nén file sang định dạng JPEG chất lượng tối ưu (chỉ còn khoảng 40KB - 60KB/ảnh)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.65);
          resolve(compressedBase64);
        };
      };
    });
  };

  // Xử lý chọn nhiều ảnh và nén đồng loạt
  const handleMultipleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const compressedImages = await Promise.all(files.map(file => compressImage(file)));
      setRoomFormData(prev => ({
        ...prev,
        images: [...prev.images, ...compressedImages]
      }));
    } catch (err) {
      console.error("Lỗi nén ảnh:", err);
      alert("Có lỗi khi xử lý ảnh, vui lòng thử lại!");
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
        electricity: roomFormData.electricity,
        water: roomFormData.water,
        amenities,
        nearbySchools,
        contactName: 'Bon',
        phone: '0559655085',
        description: roomFormData.description,
        updatedAt: new Date().toISOString()
      };

      if (isEditing && roomFormData.id && !roomFormData.id.startsWith('demo-')) {
        await updateDoc(doc(db, 'rooms', roomFormData.id), payload);
      } else {
        await addDoc(collection(db, 'rooms'), {
          ...payload,
          createdAt: new Date().toISOString()
        });
      }
      setShowRoomModal(false);
    } catch (err) {
      alert("Lỗi lưu Firebase: " + err.message);
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phòng này không?')) return;
    try {
      if (roomId && !roomId.startsWith('demo-')) {
        await deleteDoc(doc(db, 'rooms', roomId));
      } else {
        setRooms(prev => prev.filter(r => r.id !== roomId));
      }
    } catch (err) {
      alert("Lỗi xóa: " + err.message);
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
    } catch (err) {
      alert("Lỗi gửi lịch hẹn: " + err.message);
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchDistrict = selectedDistrict === 'Tất cả' || room.district === selectedDistrict;
    const matchKeyword = room.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                         room.address.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                         room.nearbySchools?.some(s => s.toLowerCase().includes(searchKeyword.toLowerCase()));
    const matchPrice = room.price <= maxPrice;
    return matchDistrict && matchKeyword && matchPrice;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedDistrict('Tất cả')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-md text-lg">
              117
            </div>
            <div>
              <div className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                117 ROOM
              </div>
              <div className="text-[10px] text-slate-400 font-bold tracking-wide">TP. HỒ CHÍ MINH • REALTIME</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="tel:0559655085" 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>0559.655.085 (Bon)</span>
            </a>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg border border-amber-300">
                  👑 Quản trị Bon
                </span>
                <button 
                  onClick={() => setIsAdmin(false)}
                  className="p-2 text-slate-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Admin Bon</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ADMIN DASHBOARD */}
      {isAdmin && (
        <section className="bg-slate-900 text-white py-6 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>Trang Quản Trị Hệ Thống 117 ROOM</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    Online Realtime
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Dữ liệu được lưu vĩnh viễn và tự động hiển thị cho mọi khách hàng.</p>
              </div>

              <button
                onClick={() => {
                  setIsEditing(false);
                  setRoomFormData({
                    id: '',
                    title: '',
                    district: 'Bình Thạnh',
                    address: '',
                    price: 3500000,
                    area: 25,
                    status: 'available',
                    images: [],
                    electricity: '3.800đ/kWh',
                    water: '100.000đ/người',
                    amenitiesText: 'Máy lạnh, Khóa vân tay, Giờ giấc tự do',
                    contactName: 'Bon',
                    phone: '0559655085',
                    nearbySchoolsText: '',
                    description: ''
                  });
                  setShowRoomModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 transition self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Đăng Thêm Phòng Mới</span>
              </button>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setAdminTab('rooms')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${adminTab === 'rooms' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-300'}`}
              >
                Danh Sách Phòng ({rooms.length})
              </button>
              <button
                onClick={() => setAdminTab('leads')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${adminTab === 'leads' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-300'}`}
              >
                <span>Khách Đặt Hẹn Xem Phòng</span>
                {leads.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {leads.length}
                  </span>
                )}
              </button>
            </div>

            {/* TAB DANH SÁCH PHÒNG */}
            {adminTab === 'rooms' && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs uppercase text-slate-400 bg-slate-800/50">
                      <th className="py-3 px-4">Ảnh bìa</th>
                      <th className="py-3 px-4">Tiêu đề & Địa chỉ</th>
                      <th className="py-3 px-4">Quận</th>
                      <th className="py-3 px-4">Giá thuê</th>
                      <th className="py-3 px-4">Trạng thái (Bấm đổi)</th>
                      <th className="py-3 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {rooms.map(room => (
                      <tr key={room.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4">
                          <img 
                            src={room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'} 
                            alt="" 
                            className="w-16 h-12 object-cover rounded-lg border border-slate-700" 
                          />
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate">
                          <div className="font-bold text-white truncate">{room.title}</div>
                          <div className="text-xs text-slate-400 truncate">{room.address}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-blue-300">{room.district}</td>
                        <td className="py-3 px-4 font-bold text-emerald-400">
                          {Number(room.price).toLocaleString('vi-VN')} đ
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleStatus(room)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                              room.status === 'available' 
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                                : 'bg-rose-950 text-rose-400 border border-rose-800'
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
                                  amenitiesText: room.amenities?.join(', ') || '',
                                  nearbySchoolsText: room.nearbySchools?.join(', ') || '',
                                  images: room.images || []
                                });
                                setShowRoomModal(true);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-blue-600 rounded-lg text-slate-300 hover:text-white transition"
                              title="Sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="p-1.5 bg-slate-800 hover:bg-rose-600 rounded-lg text-slate-300 hover:text-white transition"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
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
              <div className="mt-4 overflow-x-auto">
                {leads.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">Chưa có khách đặt lịch xem phòng.</div>
                ) : (
                  <table className="w-full text-left text-sm text-slate-300 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs uppercase text-slate-400 bg-slate-800/50">
                        <th className="py-3 px-4">Tên khách</th>
                        <th className="py-3 px-4">SĐT / Zalo</th>
                        <th className="py-3 px-4">Phòng quan tâm</th>
                        <th className="py-3 px-4">Ngày giờ hẹn</th>
                        <th className="py-3 px-4">Ghi chú</th>
                        <th className="py-3 px-4 text-right">Liên hệ nhanh</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {leads.map(lead => (
                        <tr key={lead.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4 font-bold text-white">{lead.customerName}</td>
                          <td className="py-3 px-4 text-amber-300 font-bold">{lead.customerPhone}</td>
                          <td className="py-3 px-4 max-w-xs truncate">{lead.roomTitle}</td>
                          <td className="py-3 px-4 text-blue-300">{lead.visitDate} ({lead.visitTime})</td>
                          <td className="py-3 px-4 text-xs text-slate-400">{lead.note || 'Không có'}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a 
                                href={`tel:${lead.customerPhone}`} 
                                className="p-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-600 hover:text-white"
                              >
                                <Phone className="w-4 h-4" />
                              </a>
                              <a 
                                href={`https://zalo.me/${lead.customerPhone}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600 hover:text-white"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </a>
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

      {/* HERO BANNER */}
      <section className="bg-gradient-to-b from-blue-900 to-indigo-950 text-white py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold mb-4">
            PHÒNG TRỌ SINH VIÊN & NGƯỜI ĐI LÀM SÀI GÒN
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            117 ROOM • Tìm Trọ Nhanh & Chuẩn Nhất TP.HCM
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Hệ thống quản lý trực tiếp bởi Bon (0559.655.085) — Xem phòng miễn phí, hình ảnh thật 100%.
          </p>
        </div>
      </section>

      {/* BỘ LỌC */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white p-5 rounded-3xl shadow-xl border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Tìm theo đường, trường ĐH (Bách Khoa, HUTECH, RMIT...)"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="w-full md:w-56">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Tất cả">Tất cả Quận / Huyện</option>
              <option value="Bình Thạnh">Bình Thạnh</option>
              <option value="Quận 10">Quận 10</option>
              <option value="Quận 7">Quận 7</option>
              <option value="Quận 1">Quận 1</option>
              <option value="TP. Thủ Đức">TP. Thủ Đức</option>
              <option value="Tân Bình">Tân Bình</option>
              <option value="Gò Vấp">Gò Vấp</option>
            </select>
          </div>

          <div className="w-full md:w-60">
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
              <span>Giá tối đa:</span>
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
      </section>

      {/* DANH SÁCH PHÒNG TRỌ */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-6">
          Danh Sách Phòng Trọ Đang Cho Thuê ({filteredRooms.length})
        </h2>

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-bold">Đang kết nối Cloud Firestore...</div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500 font-medium">Không tìm thấy phòng phù hợp với bộ lọc.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map(room => (
              <div 
                key={room.id}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col group"
              >
                <div 
                  className="relative aspect-[4/3] overflow-hidden bg-slate-100 cursor-pointer" 
                  onClick={() => { setSelectedRoom(room); setActiveImageIndex(0); }}
                >
                  <img 
                    src={room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'} 
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                  />
                  
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow">
                    📍 {room.district}
                  </span>

                  <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white">
                    📸 {room.images?.length || 1} ảnh
                  </span>

                  {room.status === 'rented' ? (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-4 py-1.5 bg-rose-600 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider shadow">
                        ĐÃ CHO THUÊ
                      </span>
                    </div>
                  ) : (
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                      CÒN PHÒNG
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <div className="text-xl font-black text-blue-600">
                        {Number(room.price).toLocaleString('vi-VN')} <span className="text-xs font-medium text-slate-500">đ/tháng</span>
                      </div>
                      <div className="text-xs font-bold text-slate-500">{room.area} m²</div>
                    </div>

                    <h3 
                      onClick={() => { setSelectedRoom(room); setActiveImageIndex(0); }}
                      className="font-bold text-slate-900 text-base line-clamp-2 hover:text-blue-600 transition cursor-pointer mb-2"
                    >
                      {room.title}
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{room.address}</span>
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {room.amenities?.slice(0, 3).map((item, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px] font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => { setSelectedRoom(room); setActiveImageIndex(0); }}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
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
                        className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-600/20"
                      >
                        Đặt lịch xem
                      </button>
                    ) : (
                      <button disabled className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs cursor-not-allowed">
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

      {/* MODAL XEM CHI TIẾT & SLIDER ẢNH */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl my-8">
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setActiveImageIndex(prev => prev < selectedRoom.images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <button 
                onClick={() => setSelectedRoom(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                {activeImageIndex + 1} / {selectedRoom.images?.length || 1}
              </div>
            </div>

            {selectedRoom.images?.length > 1 && (
              <div className="p-3 bg-slate-900 flex gap-2 overflow-x-auto">
                {selectedRoom.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition ${idx === activeImageIndex ? 'border-blue-500 scale-105' : 'border-transparent opacity-60'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="p-6">
              <h3 className="text-xl font-black text-slate-900">{selectedRoom.title}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {selectedRoom.address}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4 p-3 bg-slate-50 rounded-2xl text-xs">
                <div>⚡ Điện: <span className="font-bold">{selectedRoom.electricity}</span></div>
                <div>💧 Nước: <span className="font-bold">{selectedRoom.water}</span></div>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tiện nghi phòng</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRoom.amenities?.map((amenity, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mô tả chi tiết</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedRoom.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
                <a 
                  href="tel:0559655085"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2"
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
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Đặt Lịch Hẹn Xem</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KHÁCH ĐẶT LỊCH */}
      {showBookingModal && bookingRoom && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setShowBookingModal(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Đặt Lịch Hẹn Thành Công!</h3>
                <p className="text-xs text-slate-500 mt-2">
                  Dữ liệu đã tự động chuyển đến bảng quản lý của Bon. Bon sẽ sớm liên hệ xác nhận.
                </p>
                <div className="mt-6 flex flex-col gap-2">
                  <a 
                    href={`https://zalo.me/0559655085?text=${encodeURIComponent(`Chào Bon, mình vừa đặt hẹn xem phòng: ${bookingRoom.title} lúc ${bookingForm.visitTime} ngày ${bookingForm.visitDate}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl text-sm text-center"
                  >
                    Nhắn Zalo xác nhận ngay cho Bon
                  </a>
                  <button onClick={() => setShowBookingModal(false)} className="w-full py-2 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs">
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
                      className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
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
                      className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
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
                        className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Giờ muốn xem</label>
                      <input 
                        type="time" 
                        required
                        value={bookingForm.visitTime}
                        onChange={(e) => setBookingForm({...bookingForm, visitTime: e.target.value})}
                        className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
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
                      className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition"
                >
                  Xác Nhận Đặt Lịch Hẹn
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL ADMIN THÊM / SỬA PHÒNG */}
      {showRoomModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {isEditing ? 'Chỉnh Sửa Thông Tin Phòng' : 'Đăng Tin Phòng Trọ Mới (Realtime)'}
              </h3>
              <button onClick={() => setShowRoomModal(false)} className="text-slate-400">
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
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                  placeholder="Ví dụ: Phòng Gác Ban Công Ngay Landmark 81"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quận / Khu vực</label>
                  <select 
                    value={roomFormData.district}
                    onChange={(e) => setRoomFormData({...roomFormData, district: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none font-medium"
                  >
                    <option value="Bình Thạnh">Bình Thạnh</option>
                    <option value="Quận 10">Quận 10</option>
                    <option value="Quận 7">Quận 7</option>
                    <option value="Quận 1">Quận 1</option>
                    <option value="TP. Thủ Đức">TP. Thủ Đức</option>
                    <option value="Tân Bình">Tân Bình</option>
                    <option value="Gò Vấp">Gò Vấp</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá thuê (VNĐ/tháng)</label>
                  <input 
                    type="number" 
                    required
                    value={roomFormData.price}
                    onChange={(e) => setRoomFormData({...roomFormData, price: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
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
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              {/* TẢI NHIỀU ẢNH CÙNG LÚC */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <label className="block font-bold text-slate-800 mb-2 flex items-center justify-between">
                  <span>Tải ảnh phòng (Chọn cùng lúc nhiều ảnh từ điện thoại/máy tính)</span>
                  <span className="text-[11px] text-blue-600 font-semibold">{roomFormData.images.length} ảnh đã chọn</span>
                </label>
                
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleMultipleImageUpload}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                />

                {roomFormData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {roomFormData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-300 group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-bold px-1 rounded">
                            Ảnh bìa
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => setAsCover(idx)}
                              className="p-1 bg-amber-500 text-white rounded text-[10px]"
                            >
                              ⭐
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImageAtIndex(idx)}
                            className="p-1 bg-rose-600 text-white rounded text-[10px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tiền điện</label>
                  <input 
                    type="text" 
                    value={roomFormData.electricity}
                    onChange={(e) => setRoomFormData({...roomFormData, electricity: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tiền nước</label>
                  <input 
                    type="text" 
                    value={roomFormData.water}
                    onChange={(e) => setRoomFormData({...roomFormData, water: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
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
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                  placeholder="HUTECH, UEF, Bách Khoa..."
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

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30"
                >
                  {submitting ? 'Đang nén & lưu lên Cloud...' : 'Lưu Dữ Liệu Ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ĐĂNG NHẬP ADMIN BON */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 font-black text-xl">
                117
              </div>
              <h3 className="text-lg font-black text-slate-900">Đăng Nhập Quản Trị</h3>
              <p className="text-xs text-slate-400">Dành riêng cho Admin Bon</p>
            </div>

            {loginError && (
              <div className="p-2 mb-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tài khoản</label>
                <input 
                  type="text" 
                  required
                  placeholder="bon"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mật khẩu</label>
                <input 
                  type="password" 
                  required
                  placeholder="bon117admin"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition mt-2"
              >
                Đăng Nhập
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs text-center">
        <p className="font-semibold text-slate-300">117 ROOM • Phòng Trọ TP. Hồ Chí Minh</p>
        <p className="mt-1">Quản lý: Bon — 0559.655.085</p>
      </footer>

    </div>
  );
}

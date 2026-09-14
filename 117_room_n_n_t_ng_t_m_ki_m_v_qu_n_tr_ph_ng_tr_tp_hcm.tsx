import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Home,
  MapPin,
  Heart,
  PlusCircle,
  Phone,
  MessageCircle,
  DollarSign,
  Filter,
  CheckCircle2,
  X,
  SlidersHorizontal,
  Wifi,
  Wind,
  Layers,
  ShieldCheck,
  Zap,
  Droplets,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Calculator,
  Compass,
  ArrowUpDown,
  Building,
  KeyRound,
  Users,
  Edit3,
  Trash2,
  Eye,
  AlertCircle,
  XCircle,
  GraduationCap,
  Calendar,
  Clock,
  Lock,
  LogIn,
  LogOut,
  Send,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  PhoneCall,
  Star,
  Check,
  Share2
} from 'lucide-react';

const ADMIN_INFO = {
  name: "Bon",
  phone: "0559655085",
  zalo: "0559655085",
  defaultPassword: "bon117admin"
};

const HCM_DISTRICTS = [
  "Tất cả quận / khu vực",
  "Quận 1",
  "Quận 3",
  "Quận 7",
  "Quận 10",
  "Bình Thạnh",
  "Phú Nhuận",
  "Tân Bình",
  "Gò Vấp",
  "TP. Thủ Đức"
];

const ROOM_TYPES = [
  "Tất cả loại phòng",
  "Phòng trọ khép kín",
  "Chung cư mini",
  "Ký túc xá / Sleepbox",
  "Căn hộ dịch vụ (CHDV)",
  "Nhà nguyên căn"
];

const INITIAL_ROOMS = [
  {
    id: 1,
    title: "Căn hộ dịch vụ Studio 1PN tách bếp ngắm Landmark 81 - Gần HUTECH & ĐH GTVT",
    type: "Căn hộ dịch vụ (CHDV)",
    city: "TP. Hồ Chí Minh",
    district: "Bình Thạnh",
    address: "117 Điện Biên Phủ, Phường 15, Bình Thạnh, TP.HCM",
    price: 5800000,
    area: 32,
    deposit: 5800000,
    electricPrice: 3900,
    waterPrice: 100000,
    internetPrice: 100000,
    serviceFee: 150000,
    status: "available",
    views: 1850,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80"
    ],
    verified: true,
    badge: "View Landmark 81",
    nearBy: ["ĐH HUTECH (350m)", "ĐH Ngoại Thương CS2 (650m)", "Ngã tư Hàng Xanh (200m)", "Landmark 81 (800m)"],
    amenities: ["Máy lạnh/Điều hòa", "Máy giặt riêng", "Thang máy", "Cho nuôi thú cưng", "Giờ giấc tự do 24/7", "Không chung chủ", "Ban công thoáng mát", "Hầm giữ xe vân tay"],
    hostName: "Bon (Quản lý 117 ROOM)",
    hostPhone: ADMIN_INFO.phone,
    hostZalo: ADMIN_INFO.zalo,
    description: "Căn hộ dịch vụ cao cấp vừa hoàn thiện nội thất 100% tại khu vực Hàng Xanh sầm uất. Cửa sổ view hướng Landmark 81 lộng gió, bếp tách biệt chống bám mùi, tủ lạnh inverter 2 ngăn, nệm lò xo túi chuẩn khách sạn. Khóa vân tay bảo mật 3 lớp, hầm xe rộng rãi.",
    createdAt: "2026-03-12"
  },
  {
    id: 2,
    title: "Phòng trọ gác cao đúc không đụng đầu - Liền kề ĐH Bách Khoa CS1 & Vạn Hạnh Mall",
    type: "Phòng trọ khép kín",
    city: "TP. Hồ Chí Minh",
    district: "Quận 10",
    address: "117/28 Lý Thường Kiệt, Phường 14, Quận 10, TP.HCM",
    price: 3600000,
    area: 24,
    deposit: 3600000,
    electricPrice: 3800,
    waterPrice: 80000,
    internetPrice: 80000,
    serviceFee: 100000,
    status: "available",
    views: 2420,
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80"
    ],
    verified: true,
    badge: "Sát Bách Khoa CS1",
    nearBy: ["ĐH Bách Khoa CS1 (300m)", "ĐH Kinh Tế UEH CS B (1.1km)", "Vạn Hạnh Mall (700m)", "Bệnh viện 115 (500m)"],
    amenities: ["Máy lạnh/Điều hòa", "Có gác xép cao", "Giờ giấc tự do 24/7", "Không chung chủ", "Hầm giữ xe vân tay"],
    hostName: "Bon (Quản lý 117 ROOM)",
    hostPhone: ADMIN_INFO.phone,
    hostZalo: ADMIN_INFO.zalo,
    description: "Phòng trọ sinh viên tiện nghi cao cấp, gác đúc cao 2m đứng thoải mái. WC riêng ốp đá hoa cương sạch bong, có kệ bếp bồn rửa inox, camera an ninh 24/7. Khu vực ẩm thực Tô Hiến Thành - Sư Vạn Hạnh tấp nập.",
    createdAt: "2026-03-10"
  },
  {
    id: 3,
    title: "Sleepbox SmartBox cao cấp chuẩn Hàn Quốc - Gần ĐH RMIT & Tôn Đức Thắng",
    type: "Ký túc xá / Sleepbox",
    city: "TP. Hồ Chí Minh",
    district: "Quận 7",
    address: "117 Đường số 17, Phường Tân Quy, Quận 7, TP.HCM",
    price: 1900000,
    area: 14,
    deposit: 1900000,
    electricPrice: 0,
    waterPrice: 0,
    internetPrice: 0,
    serviceFee: 0,
    status: "available",
    views: 3100,
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80"
    ],
    verified: true,
    badge: "Bao Trọn Gói 100%",
    nearBy: ["ĐH Tôn Đức Thắng (900m)", "ĐH RMIT (1.4km)", "Lotte Mart Q7 (800m)", "Cầu Kênh Tẻ qua Q4 (1km)"],
    amenities: ["Máy lạnh/Điều hòa", "Thang máy", "Giờ giấc tự do 24/7", "Không chung chủ", "Hầm giữ xe vân tay"],
    hostName: "Bon (Quản lý 117 ROOM)",
    hostPhone: ADMIN_INFO.phone,
    hostZalo: ADMIN_INFO.zalo,
    description: "Mô hình Sleepbox riêng tư hiện đại bậc nhất Quận 7. ĐÃ BAO GỒM TOÀN BỘ TIỀN ĐIỆN LẠNH 24/24, nước nóng lạnh, internet wifi 6 và dịch vụ lau dọn vệ sinh 3 lần/tuần. Hộp ngủ riêng tư có rèm cuốn, khóa smartlock, bàn học gấp gọn.",
    createdAt: "2026-03-13"
  },
  {
    id: 4,
    title: "Phòng Studio ban công nắng chill trung tâm Quận 1 - Đi bộ ra Nhà Thờ Đức Bà",
    type: "Căn hộ dịch vụ (CHDV)",
    city: "TP. Hồ Chí Minh",
    district: "Quận 1",
    address: "Hẻm 117 Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP.HCM",
    price: 7200000,
    area: 30,
    deposit: 7200000,
    electricPrice: 4000,
    waterPrice: 120000,
    internetPrice: 100000,
    serviceFee: 200000,
    status: "rented",
    views: 1680,
    images: [
      "https://images.unsplash.com/photo-1502005229762-ee1c9b634863?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80"
    ],
    verified: true,
    badge: "Lõi Trung Tâm Q1",
    nearBy: ["Nhà Thờ Đức Bà (400m)", "ĐH KHXH&NV CS1 (700m)", "Hồ Con Rùa (350m)", "Đường sách Nguyễn Văn Bình (450m)"],
    amenities: ["Máy lạnh/Điều hòa", "Máy giặt riêng", "Thang máy", "Giờ giấc tự do 24/7", "Không chung chủ", "Ban công thoáng mát", "Hầm giữ xe vân tay"],
    hostName: "Bon (Quản lý 117 ROOM)",
    hostPhone: ADMIN_INFO.phone,
    hostZalo: ADMIN_INFO.zalo,
    description: "Vị trí kim cương ngay lõi Quận 1, đi bộ vài bước chân ra Hồ Con Rùa và Nhà Thờ Đức Bà. Phòng ngập tràn ánh sáng với ban công xanh ngát, đầy đủ sofa, smart TV, máy giặt sấy cao cấp.",
    createdAt: "2026-03-01"
  }
];

const INITIAL_BOOKINGS = [
  {
    id: "BK-101",
    roomId: 1,
    roomTitle: "Căn hộ dịch vụ Studio 1PN tách bếp ngắm Landmark 81",
    clientName: "Nguyễn Minh Khang",
    clientPhone: "0912 345 678",
    visitDate: "2026-09-18",
    visitTime: "15:30",
    note: "2 người ở (sinh viên HUTECH), muốn xem phòng buổi chiều",
    status: "pending",
    createdAt: "10:20 - 14/09/2026"
  },
  {
    id: "BK-102",
    roomId: 2,
    roomTitle: "Phòng trọ gác cao đúc không đụng đầu - Liền kề ĐH Bách Khoa CS1",
    clientName: "Trần Mai Anh",
    clientPhone: "0978 999 123",
    visitDate: "2026-09-19",
    visitTime: "18:00",
    note: "Hẹn xem cùng bạn sau giờ tan học Bách Khoa",
    status: "confirmed",
    createdAt: "14:45 - 13/09/2026"
  }
];

export default function App() {
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [favorites, setFavorites] = useState([1, 2]);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);

  // Authentication State for Admin "Bon"
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginInputUser, setLoginInputUser] = useState("");
  const [loginInputPass, setLoginInputPass] = useState("");
  const [loginError, setLoginError] = useState("");

  // Views & Navigation
  const [currentMode, setCurrentMode] = useState('client'); // 'client' | 'admin'
  const [clientTab, setClientTab] = useState('home'); // 'home' | 'rooms' | 'wishlist'
  const [adminTab, setAdminTab] = useState('rooms'); // 'rooms' | 'bookings'

  // Client Search & Filter States
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("Tất cả quận / khu vực");
  const [selectedType, setSelectedType] = useState("Tất cả loại phòng");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // Admin Management States
  const [adminSearch, setAdminSearch] = useState("");
  const [adminDistrictFilter, setAdminDistrictFilter] = useState("Tất cả quận / khu vực");
  const [adminStatusFilter, setAdminStatusFilter] = useState("all");
  const [roomToEdit, setRoomToEdit] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Modals & Active Selections
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [galleryActiveIndex, setGalleryActiveIndex] = useState(0);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [bookingSuccessData, setBookingSuccessData] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calculatorRoom, setCalculatorRoom] = useState(null);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "10:00",
    note: ""
  });

  // MULTI-IMAGE STATE FOR ADD ROOM
  const [postImages, setPostImages] = useState([]);
  const [postUrlInput, setPostUrlInput] = useState("");
  const postFilesInputRef = useRef(null);

  // MULTI-IMAGE STATE FOR EDIT ROOM
  const [editImages, setEditImages] = useState([]);
  const [editUrlInput, setEditUrlInput] = useState("");
  const editFilesInputRef = useRef(null);

  // Add Room Form Values
  const [newRoomForm, setNewRoomForm] = useState({
    title: "",
    type: "Phòng trọ khép kín",
    district: "Bình Thạnh",
    address: "",
    price: "",
    deposit: "",
    area: "",
    electricPrice: "3800",
    waterPrice: "80000",
    internetPrice: "100000",
    serviceFee: "100000",
    hostName: "Bon (Quản lý 117 ROOM)",
    hostPhone: ADMIN_INFO.phone,
    nearBy: "",
    description: "",
    badge: "Phòng mới Sài Gòn"
  });

  const handleSelectMultipleFiles = (e, target) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (target === 'post') {
            setPostImages(prev => [...prev, reader.result]);
          } else if (target === 'edit') {
            setEditImages(prev => [...prev, reader.result]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
    // Reset file input so same file can be re-selected if needed
    e.target.value = '';
  };

  const handleAddUrlImage = (target) => {
    if (target === 'post' && postUrlInput.trim()) {
      setPostImages(prev => [...prev, postUrlInput.trim()]);
      setPostUrlInput('');
    } else if (target === 'edit' && editUrlInput.trim()) {
      setEditImages(prev => [...prev, editUrlInput.trim()]);
      setEditUrlInput('');
    }
  };

  const handleRemoveImage = (index, target) => {
    if (target === 'post') {
      setPostImages(prev => prev.filter((_, i) => i !== index));
    } else if (target === 'edit') {
      setEditImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSetAsCover = (index, target) => {
    if (target === 'post') {
      setPostImages(prev => {
        const item = prev[index];
        const remaining = prev.filter((_, i) => i !== index);
        return [item, ...remaining];
      });
    } else if (target === 'edit') {
      setEditImages(prev => {
        const item = prev[index];
        const remaining = prev.filter((_, i) => i !== index);
        return [item, ...remaining];
      });
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const userClean = loginInputUser.trim().toLowerCase();
    if ((userClean === "bon" || userClean === "admin") && loginInputPass === ADMIN_INFO.defaultPassword) {
      setIsAdminLoggedIn(true);
      setCurrentMode('admin');
      setIsLoginModalOpen(false);
      setLoginError("");
      setLoginInputPass("");
    } else {
      setLoginError("Tên đăng nhập hoặc mật khẩu quản trị không chính xác!");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentMode('client');
  };

  const openAdminView = () => {
    if (isAdminLoggedIn) {
      setCurrentMode('admin');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleCreateBooking = (e) => {
    e.preventDefault();
    if (!bookingForm.name.trim() || !bookingForm.phone.trim() || !bookingRoom) return;

    const newBooking = {
      id: `BK-${Date.now().toString().slice(-4)}`,
      roomId: bookingRoom.id,
      roomTitle: bookingRoom.title,
      clientName: bookingForm.name,
      clientPhone: bookingForm.phone,
      visitDate: bookingForm.date || "Trong ngày",
      visitTime: bookingForm.time,
      note: bookingForm.note || "Khách đăng ký trực tiếp trên 117 ROOM",
      status: "pending",
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + " - " + new Date().toLocaleDateString('vi-VN')
    };

    setBookings(prev => [newBooking, ...prev]);
    setBookingSuccessData(newBooking);
    setBookingForm({ name: "", phone: "", date: "", time: "10:00", note: "" });
  };

  const handleUpdateBookingStatus = (bookingId, newStatus) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
  };

  const handleDeleteBooking = (bookingId) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  const toggleFavorite = (id, e) => {
    e?.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleResetFilters = () => {
    setSearchKeyword("");
    setSelectedDistrict("Tất cả quận / khu vực");
    setSelectedType("Tất cả loại phòng");
    setPriceRange("all");
    setSortBy("default");
  };

  const toggleRoomStatus = (roomId) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: r.status === 'available' ? 'rented' : 'available' } : r));
  };

  const handleDeleteRoom = (roomId) => {
    setRooms(prev => prev.filter(r => r.id !== roomId));
    setFavorites(prev => prev.filter(id => id !== roomId));
    setDeleteConfirmId(null);
  };

  const openEditModal = (room) => {
    setRoomToEdit({ ...room });
    setEditImages([...(room.images || [])]);
    setEditUrlInput("");
  };

  const handleSaveEditRoom = (e) => {
    e.preventDefault();
    if (!roomToEdit) return;

    const fallbackImg = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80";
    const finalImages = editImages.length > 0 ? editImages : [fallbackImg];

    setRooms(prev => prev.map(r => r.id === roomToEdit.id ? { ...roomToEdit, images: finalImages } : r));
    setRoomToEdit(null);
    setEditImages([]);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!newRoomForm.title || !newRoomForm.price) return;

    const fallbackImg = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80";
    const finalImages = postImages.length > 0 ? postImages : [fallbackImg];

    const createdRoom = {
      id: Date.now(),
      title: newRoomForm.title,
      type: newRoomForm.type,
      city: "TP. Hồ Chí Minh",
      district: newRoomForm.district,
      address: newRoomForm.address || `${newRoomForm.district}, TP. Hồ Chí Minh`,
      price: Number(newRoomForm.price) || 3500000,
      area: Number(newRoomForm.area) || 25,
      deposit: Number(newRoomForm.deposit) || Number(newRoomForm.price) || 3500000,
      electricPrice: Number(newRoomForm.electricPrice) || 3800,
      waterPrice: Number(newRoomForm.waterPrice) || 80000,
      internetPrice: Number(newRoomForm.internetPrice) || 100000,
      serviceFee: Number(newRoomForm.serviceFee) || 100000,
      status: "available",
      views: 1,
      images: finalImages,
      verified: true,
      badge: newRoomForm.badge || "Mới lên sàn HCM",
      nearBy: newRoomForm.nearBy ? newRoomForm.nearBy.split(',').map(s => s.trim()) : ["Gần trạm xe buýt", "Chợ dân sinh Sài Gòn"],
      amenities: ["Giờ giấc tự do 24/7", "Không chung chủ", "Hầm giữ xe vân tay", "Máy lạnh/Điều hòa"],
      hostName: "Bon (Quản lý 117 ROOM)",
      hostPhone: ADMIN_INFO.phone,
      hostZalo: ADMIN_INFO.zalo,
      description: newRoomForm.description || "Phòng trọ đẹp, sạch sẽ, an ninh tốt tại TP.HCM, vào ở ngay.",
      createdAt: "Vừa xong"
    };

    setRooms(prev => [createdRoom, ...prev]);
    setIsPostModalOpen(false);
    setPostImages([]);
    setPostUrlInput("");
    setNewRoomForm({
      title: "",
      type: "Phòng trọ khép kín",
      district: "Bình Thạnh",
      address: "",
      price: "",
      deposit: "",
      area: "",
      electricPrice: "3800",
      waterPrice: "80000",
      internetPrice: "100000",
      serviceFee: "100000",
      hostName: "Bon (Quản lý 117 ROOM)",
      hostPhone: ADMIN_INFO.phone,
      nearBy: "",
      description: "",
      badge: "Phòng mới Sài Gòn"
    });
  };

  const formatPrice = (amount) => {
    if (!amount && amount !== 0) return "Thoả thuận";
    return new Intl.NumberFormat('vi-VN').format(amount) + " đ/tháng";
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      if (searchKeyword.trim()) {
        const query = searchKeyword.toLowerCase();
        const matchTitle = room.title.toLowerCase().includes(query);
        const matchAddress = room.address.toLowerCase().includes(query);
        const matchDistrict = room.district.toLowerCase().includes(query);
        const matchNearby = room.nearBy?.some(n => n.toLowerCase().includes(query));
        if (!matchTitle && !matchAddress && !matchDistrict && !matchNearby) return false;
      }
      if (selectedDistrict !== "Tất cả quận / khu vực" && room.district !== selectedDistrict) return false;
      if (selectedType !== "Tất cả loại phòng" && room.type !== selectedType) return false;
      if (priceRange === "under2" && room.price >= 2000000) return false;
      if (priceRange === "2to4" && (room.price < 2000000 || room.price > 4000000)) return false;
      if (priceRange === "4to7" && (room.price < 4000000 || room.price > 7000000)) return false;
      if (priceRange === "over7" && room.price <= 7000000) return false;
      if (clientTab === 'wishlist' && !favorites.includes(room.id)) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "area-desc") return b.area - a.area;
      return b.id - a.id;
    });
  }, [rooms, searchKeyword, selectedDistrict, selectedType, priceRange, sortBy, clientTab, favorites]);

  const filteredAdminRooms = useMemo(() => {
    return rooms.filter(room => {
      if (adminSearch.trim()) {
        const query = adminSearch.toLowerCase();
        const matchTitle = room.title.toLowerCase().includes(query);
        const matchAddr = room.address.toLowerCase().includes(query);
        if (!matchTitle && !matchAddr) return false;
      }
      if (adminDistrictFilter !== "Tất cả quận / khu vực" && room.district !== adminDistrictFilter) return false;
      if (adminStatusFilter !== "all" && room.status !== adminStatusFilter) return false;
      return true;
    });
  }, [rooms, adminSearch, adminDistrictFilter, adminStatusFilter]);

  const pendingBookingsCount = useMemo(() => {
    return bookings.filter(b => b.status === 'pending').length;
  }, [bookings]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Top Banner Dedicated to HCM and Admin Hotline */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-600 text-white tracking-wider">
              117 ROOM SÀI GÒN
            </span>
            <span className="hidden sm:inline font-medium">Hệ thống phòng trọ TP.HCM</span>
            <span className="text-orange-400 font-bold hidden md:inline">| Phụ trách: Admin {ADMIN_INFO.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${ADMIN_INFO.phone}`}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-orange-400 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hotline/Zalo: {ADMIN_INFO.phone}</span>
            </a>

            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2 bg-slate-900 border border-amber-500/40 px-2.5 py-1 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] font-bold text-amber-400">Admin {ADMIN_INFO.name}</span>
                <button
                  onClick={handleAdminLogout}
                  className="text-slate-400 hover:text-rose-400 ml-1 p-0.5 transition-colors"
                  title="Đăng xuất quyền Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-xl text-xs font-medium border border-slate-800 transition-all"
              >
                <Lock className="w-3 h-3 text-orange-400" />
                <span>Đăng nhập Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            onClick={() => { setCurrentMode('client'); setClientTab('home'); handleResetFilters(); }}
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <KeyRound className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  117<span className="text-orange-600">ROOM</span>
                </span>
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-orange-800">
                  TP.HCM
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {currentMode === 'admin' ? `Trang Quản Trị • Admin ${ADMIN_INFO.name}` : 'Trọ chất Sài Gòn • Đặt lịch xem phòng ngay'}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          {currentMode === 'client' ? (
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <button
                onClick={() => setClientTab('home')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  clientTab === 'home' ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Trang chủ
              </button>
              <button
                onClick={() => setClientTab('rooms')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  clientTab === 'rooms' ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Danh sách phòng ({rooms.length})
              </button>
              <button
                onClick={() => {
                  setCalculatorRoom(rooms[0]);
                  setIsCalculatorOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
              >
                <Calculator className="w-4 h-4 text-orange-500" />
                Tính chi phí
              </button>
              <button
                onClick={() => setClientTab('wishlist')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  clientTab === 'wishlist' ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                Đã lưu
                {favorites.length > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 text-xs font-bold rounded-full bg-rose-500 text-white">
                    {favorites.length}
                  </span>
                )}
              </button>
            </nav>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentMode('client')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                Xem giao diện khách
              </button>
            </div>
          )}

          {/* Quick Header CTA */}
          <div className="flex items-center gap-2.5">
            {isAdminLoggedIn ? (
              <button
                onClick={() => setCurrentMode(currentMode === 'admin' ? 'client' : 'admin')}
                className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl border transition-all ${
                  currentMode === 'admin'
                    ? 'bg-slate-900 text-amber-400 border-slate-800'
                    : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                }`}
              >
                <Building className="w-4 h-4 text-amber-500" />
                <span>{currentMode === 'admin' ? 'Về xem phòng' : 'Bảng Quản Trị'}</span>
                {pendingBookingsCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {pendingBookingsCount}
                  </span>
                )}
              </button>
            ) : (
              <a
                href={`https://zalo.me/${ADMIN_INFO.zalo}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/25 active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Zalo Admin Bon</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {}
      {currentMode === 'admin' && isAdminLoggedIn ? (
        <div className="flex-1 bg-slate-100/70 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Top Admin Greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-amber-500/20">
                  B
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                      Bảng Điều Phối • Admin {ADMIN_INFO.name}
                    </h1>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Đã xác thực
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    SĐT / Zalo tiếp nhận đặt phòng: <span className="font-bold text-slate-800">{ADMIN_INFO.phone}</span> • Khu vực hoạt động: Toàn bộ TP.HCM
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <PlusCircle className="w-4 h-4" /> Đăng phòng có nhiều ảnh
                </button>
              </div>
            </div>

            {/* Admin Tabs Switcher */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <button
                onClick={() => setAdminTab('rooms')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  adminTab === 'rooms'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Building className="w-4 h-4 text-orange-400" />
                <span>Danh sách phòng ({rooms.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('bookings')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  adminTab === 'bookings'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Khách hẹn xem phòng & Đặt chỗ ({bookings.length})</span>
                {pendingBookingsCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                    {pendingBookingsCount} mới
                  </span>
                )}
              </button>
            </div>

            {/* TAB 1: BOOKING LEADS MANAGEMENT */}
            {adminTab === 'bookings' ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-amber-50/50">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <Users className="w-5 h-5 text-amber-600" />
                      <span>Danh sách khách đăng ký xem phòng từ Website</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Khách gửi thông tin sẽ cập nhật tức thì tại đây. Admin Bon bấm gọi điện hoặc mở Zalo để liên hệ lại ngay.
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                    Tổng cộng: <span className="font-bold text-orange-600">{bookings.length} yêu cầu</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">Mã & Thời gian</th>
                        <th className="py-3.5 px-3">Họ tên & Số điện thoại</th>
                        <th className="py-3.5 px-3">Phòng quan tâm</th>
                        <th className="py-3.5 px-3">Lịch hẹn xem</th>
                        <th className="py-3.5 px-3">Ghi chú từ khách</th>
                        <th className="py-3.5 px-3">Trạng thái</th>
                        <th className="py-3.5 px-4 text-center">Xử lý</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/80">
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-12 text-center text-slate-400">
                            Chưa có lịch hẹn nào từ khách.
                          </td>
                        </tr>
                      ) : (
                        bookings.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3.5 px-4 font-mono">
                              <span className="font-bold text-slate-800">{item.id}</span>
                              <div className="text-[10px] text-slate-400 mt-0.5">{item.createdAt}</div>
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="font-bold text-slate-900">{item.clientName}</div>
                              <div className="text-orange-600 font-bold font-mono mt-0.5">{item.clientPhone}</div>
                            </td>

                            <td className="py-3.5 px-3 max-w-xs">
                              <div className="font-semibold text-slate-800 line-clamp-1">{item.roomTitle}</div>
                              <div className="text-[10px] text-slate-400">Mã phòng: #{item.roomId}</div>
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="font-bold text-slate-900 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-orange-500" /> {item.visitDate}
                              </div>
                              <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-slate-400" /> {item.visitTime}
                              </div>
                            </td>

                            <td className="py-3.5 px-3 max-w-xs">
                              <p className="text-slate-600 italic line-clamp-2">"{item.note}"</p>
                            </td>

                            <td className="py-3.5 px-3">
                              <select
                                value={item.status}
                                onChange={(e) => handleUpdateBookingStatus(item.id, e.target.value)}
                                className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                                  item.status === 'pending'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : item.status === 'confirmed'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : item.status === 'completed'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-slate-100 text-slate-600 border-slate-300'
                                }`}
                              >
                                <option value="pending">Chờ xác nhận</option>
                                <option value="confirmed">Đã hẹn lịch</option>
                                <option value="completed">Đã chốt thuê</option>
                                <option value="cancelled">Hủy hẹn</option>
                              </select>
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <a
                                  href={`tel:${item.clientPhone}`}
                                  title="Gọi khách ngay"
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={`https://zalo.me/${item.clientPhone.replace(/\s+/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Chat Zalo với khách"
                                  className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  onClick={() => handleDeleteBooking(item.id)}
                                  title="Xóa yêu cầu"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* TAB 2: ROOM INVENTORY MANAGEMENT */
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <span>Quản lý phòng trọ Sài Gòn</span>
                      <span className="px-2.5 py-0.5 text-xs bg-orange-100 text-orange-800 rounded-full font-bold">
                        {filteredAdminRooms.length} phòng
                      </span>
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                    <div className="flex items-center bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs focus-within:border-orange-500 flex-1 sm:flex-initial">
                      <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        placeholder="Tìm tên phòng, đường..."
                        value={adminSearch}
                        onChange={(e) => setAdminSearch(e.target.value)}
                        className="bg-transparent focus:outline-none w-full sm:w-44 text-xs font-medium"
                      />
                    </div>

                    <select
                      value={adminDistrictFilter}
                      onChange={(e) => setAdminDistrictFilter(e.target.value)}
                      className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
                    >
                      {HCM_DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>

                    <select
                      value={adminStatusFilter}
                      onChange={(e) => setAdminStatusFilter(e.target.value)}
                      className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="available">Còn phòng</option>
                      <option value="rented">Đã cho thuê</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">Ảnh & Tên phòng</th>
                        <th className="py-3.5 px-3">Quận</th>
                        <th className="py-3.5 px-3">Giá niêm yết</th>
                        <th className="py-3.5 px-3">Trạng thái</th>
                        <th className="py-3.5 px-3">Phụ trách</th>
                        <th className="py-3.5 px-4 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/80">
                      {filteredAdminRooms.map((room) => {
                        const isAvailable = room.status === 'available';
                        const coverImg = room.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80";
                        const imageCount = room.images?.length || 1;

                        return (
                          <tr key={room.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative shrink-0">
                                  <img
                                    src={coverImg}
                                    alt={room.title}
                                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm"
                                  />
                                  {imageCount > 1 && (
                                    <span className="absolute -bottom-1 -right-1 bg-slate-900/90 text-white font-bold text-[9px] px-1.5 py-0.2 rounded-md shadow">
                                      📸 {imageCount}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <div
                                    className="font-bold text-slate-900 line-clamp-1 max-w-xs hover:text-orange-600 transition-colors cursor-pointer"
                                    onClick={() => { setSelectedRoom(room); setGalleryActiveIndex(0); }}
                                  >
                                    {room.title}
                                  </div>
                                  <div className="text-[11px] text-slate-500 line-clamp-1 flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                                    <span>{room.address}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <span className="px-2 py-1 rounded-lg bg-orange-50 text-orange-800 font-bold inline-block border border-orange-200/60">
                                {room.district}
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              <div className="font-bold text-orange-600 text-sm">
                                {formatPrice(room.price)}
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <button
                                onClick={() => toggleRoomStatus(room.id)}
                                title="Bấm để đổi trạng thái"
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                  isAvailable
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                }`}
                              >
                                <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                                {isAvailable ? 'Còn phòng' : 'Đã cho thuê'}
                              </button>
                            </td>

                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-800">Admin {ADMIN_INFO.name}</div>
                              <div className="text-slate-500 font-mono text-[11px]">{ADMIN_INFO.phone}</div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => { setSelectedRoom(room); setGalleryActiveIndex(0); }}
                                  title="Xem trước phòng"
                                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openEditModal(room)}
                                  title="Sửa thông tin và ảnh"
                                  className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(room.id)}
                                  title="Xóa phòng"
                                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-12 pb-20 px-4 overflow-hidden">
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-orange-500 blur-3xl"></div>
              <div className="absolute top-1/2 left-10 w-80 h-80 rounded-full bg-amber-500 blur-3xl"></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-orange-400 text-xs font-bold mb-4 backdrop-blur shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Hệ thống phòng trọ TP.HCM • Đặt lịch xem phòng miễn phí cùng Admin Bon
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
                Tìm Phòng Trọ Sài Gòn Nhanh Chóng Cùng <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">117 ROOM</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 font-light">
                Phòng trọ khép kín, chung cư mini, sleepbox tại Quận 1, 3, 7, 10, Bình Thạnh, Thủ Đức... Quản lý trực tiếp bởi Admin Bon ({ADMIN_INFO.phone}).
              </p>

              {/* Master Search Filter */}
              <div className="bg-white text-slate-800 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 max-w-4xl mx-auto text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1 flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-orange-500" /> ĐH / Tên Đường HCM
                    </label>
                    <div className="flex items-center bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-orange-500 transition-all">
                      <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="HUTECH, Bách Khoa, RMIT..."
                        className="bg-transparent text-sm w-full focus:outline-none placeholder:text-slate-400 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-orange-500" /> Quận / Khu vực HCM
                    </label>
                    <div className="flex items-center bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-orange-500 transition-all">
                      <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="bg-transparent text-sm w-full focus:outline-none font-medium cursor-pointer"
                      >
                        {HCM_DISTRICTS.map(d => (
                          <option key={d} value={d} className="text-slate-900">{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1 flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" /> Loại hình phòng
                    </label>
                    <div className="flex items-center bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-orange-500 transition-all">
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="bg-transparent text-sm w-full focus:outline-none font-medium cursor-pointer"
                      >
                        {ROOM_TYPES.map(t => (
                          <option key={t} value={t} className="text-slate-900">{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1 flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-600" /> Mức giá thuê
                    </label>
                    <div className="flex items-center bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-orange-500 transition-all">
                      <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="bg-transparent text-sm w-full focus:outline-none font-medium cursor-pointer"
                      >
                        <option value="all">Tất cả mức giá</option>
                        <option value="under2">Dưới 2 triệu</option>
                        <option value="2to4">Từ 2 - 4 triệu</option>
                        <option value="4to7">Từ 4 - 7 triệu</option>
                        <option value="over7">Trên 7 triệu</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-orange-500" /> Trường ĐH hot:
                    </span>
                    {["HUTECH", "Bách Khoa CS1", "ĐH Kinh Tế UEH", "RMIT", "HCMUTE Thủ Đức"].map((uni) => (
                      <button
                        key={uni}
                        onClick={() => setSearchKeyword(uni)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold border border-orange-200 transition-all"
                      >
                        {uni}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPostModalOpen(true)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-1 shadow-sm transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" /> Đăng phòng nhiều ảnh
                    </button>
                    {(searchKeyword || selectedDistrict !== "Tất cả quận / khu vực" || priceRange !== "all") && (
                      <button
                        onClick={handleResetFilters}
                        className="text-xs text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 underline"
                      >
                        <X className="w-3 h-3" /> Đặt lại
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  {clientTab === 'wishlist' ? (
                    <>
                      <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                      Phòng bạn đã lưu ({filteredRooms.length})
                    </>
                  ) : (
                    <>
                      <span>Phòng trọ đang mở tại TP. Hồ Chí Minh</span>
                      <span className="text-sm font-bold bg-orange-100 text-orange-700 px-3 py-0.5 rounded-full">
                        {filteredRooms.length} kết quả
                      </span>
                    </>
                  )}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Chọn phòng và điền thông tin để đặt lịch xem phòng trực tiếp cùng Admin Bon
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm text-xs font-medium text-slate-600">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 mr-2" />
                  <span className="text-slate-400 mr-1.5">Sắp xếp:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent focus:outline-none cursor-pointer font-bold text-slate-800"
                  >
                    <option value="default">Mới nhất tại HCM</option>
                    <option value="price-asc">Giá thấp đến cao</option>
                    <option value="price-desc">Giá cao đến thấp</option>
                    <option value="area-desc">Diện tích rộng nhất</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Room Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {filteredRooms.map((room) => {
                const isFav = favorites.includes(room.id);
                const isRented = room.status === 'rented';
                const coverImage = room.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80";
                const totalImages = room.images?.length || 1;

                return (
                  <div
                    key={room.id}
                    className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 group flex flex-col justify-between ${
                      isRented ? 'opacity-85 border-slate-300' : 'border-slate-200 hover:border-orange-300 shadow-sm hover:shadow-xl'
                    }`}
                  >
                    <div>
                      <div
                        className="relative aspect-[16/10] overflow-hidden bg-slate-100 cursor-pointer"
                        onClick={() => { setSelectedRoom(room); setGalleryActiveIndex(0); }}
                      >
                        <img
                          src={coverImage}
                          alt={room.title}
                          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                            isRented ? 'grayscale-[20%]' : ''
                          }`}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20 pointer-events-none"></div>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                          {isRented ? (
                            <span className="bg-slate-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow backdrop-blur flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-rose-400" /> ĐÃ THUÊ
                            </span>
                          ) : (
                            <span className="bg-orange-500/95 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm backdrop-blur">
                              {room.badge}
                            </span>
                          )}
                          <span className="bg-emerald-600/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm backdrop-blur">
                            <ShieldCheck className="w-3 h-3" /> Xác thực
                          </span>
                        </div>

                        {/* Top Right Heart & Image Counter */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          {totalImages > 1 && (
                            <div className="bg-black/60 backdrop-blur text-white text-[10px] font-extrabold px-2 py-1 rounded-full flex items-center gap-1 shadow">
                              <ImageIcon className="w-3 h-3 text-amber-400" />
                              <span>{totalImages} ảnh</span>
                            </div>
                          )}
                          <button
                            onClick={(e) => toggleFavorite(room.id, e)}
                            aria-label="Lưu vào yêu thích"
                            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur hover:bg-white text-slate-700 flex items-center justify-center shadow-md active:scale-90 transition-all"
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : 'text-slate-600'}`} />
                          </button>
                        </div>

                        {/* Bottom Info on Cover */}
                        <div className="absolute bottom-3 left-3 text-white">
                          <div className="text-xl font-black drop-shadow">
                            {formatPrice(room.price)}
                          </div>
                          <div className="text-xs text-slate-200 flex items-center gap-2 font-medium">
                            <span>{room.type}</span>
                            <span>•</span>
                            <span>{room.area} m²</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5">
                        <div className="flex items-center text-xs font-bold text-orange-600 mb-1.5 gap-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{room.district}, TP. Hồ Chí Minh</span>
                        </div>

                        <h3
                          onClick={() => { setSelectedRoom(room); setGalleryActiveIndex(0); }}
                          className="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-orange-600 transition-colors mb-2 leading-snug cursor-pointer"
                        >
                          {room.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-1 mb-3">
                          {room.address}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {room.nearBy.slice(0, 2).map((item, idx) => (
                            <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                              📍 {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Booking Action on Card */}
                    <div className="p-4 pt-0 border-t border-slate-100 flex items-center gap-2 mt-2">
                      <button
                        onClick={() => { setSelectedRoom(room); setGalleryActiveIndex(0); }}
                        className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all"
                      >
                        Chi tiết ({totalImages} ảnh)
                      </button>
                      <button
                        disabled={isRented}
                        onClick={() => {
                          setBookingRoom(room);
                          setBookingForm({ name: "", phone: "", date: "", time: "10:00", note: "" });
                        }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                          isRented
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/20 active:scale-95'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Đặt lịch xem</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </>
      )}

      {}
      {bookingRoom && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-7 relative animate-in fade-in zoom-in-95 duration-200 text-left">
            <button
              onClick={() => { setBookingRoom(null); setBookingSuccessData(null); }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccessData ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Đặt lịch xem phòng thành công!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Mã hẹn: <span className="font-mono font-bold text-slate-800">{bookingSuccessData.id}</span>
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-2">
                  <div><strong>Phòng:</strong> {bookingSuccessData.roomTitle}</div>
                  <div><strong>Khách hẹn:</strong> {bookingSuccessData.clientName} - {bookingSuccessData.clientPhone}</div>
                  <div><strong>Thời gian:</strong> {bookingSuccessData.visitTime} ngày {bookingSuccessData.visitDate}</div>
                  <div className="text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                    ✓ Yêu cầu đã được gửi trực tiếp đến Admin Bon ({ADMIN_INFO.phone}).
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <a
                    href={`https://zalo.me/${ADMIN_INFO.zalo}?text=${encodeURIComponent(`Chào Admin Bon, mình vừa đặt lịch xem phòng [${bookingSuccessData.roomTitle}] lúc ${bookingSuccessData.visitTime} ngày ${bookingSuccessData.visitDate}. SĐT mình là ${bookingSuccessData.clientPhone}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Nhắn Zalo xác nhận ngay cho Bon
                  </a>
                  <button
                    onClick={() => { setBookingRoom(null); setBookingSuccessData(null); }}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Đăng ký xem phòng miễn phí</h3>
                    <p className="text-xs text-slate-500">Thông tin sẽ chuyển thẳng đến Admin Bon phụ trách phòng</p>
                  </div>
                </div>

                <div className="bg-orange-50/70 border border-orange-200 p-3 rounded-2xl mb-5 flex items-center gap-3">
                  <img
                    src={bookingRoom.images?.[0]}
                    alt={bookingRoom.title}
                    className="w-14 h-14 rounded-xl object-cover border border-orange-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{bookingRoom.title}</h4>
                    <div className="text-orange-600 font-bold text-xs mt-0.5">{formatPrice(bookingRoom.price)}</div>
                    <div className="text-[11px] text-slate-500">{bookingRoom.district}, TP.HCM</div>
                  </div>
                </div>

                <form onSubmit={handleCreateBooking} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Họ và tên của bạn <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Nguyễn Văn A"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Số điện thoại / Zalo để nhận hẹn <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="09xx xxx xxx"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Ngày muốn xem</label>
                      <input
                        type="date"
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Khung giờ dự kiến</label>
                      <select
                        value={bookingForm.time}
                        onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none"
                      >
                        <option value="09:00">09:00 Sáng</option>
                        <option value="10:30">10:30 Sáng</option>
                        <option value="14:00">14:00 Chiều</option>
                        <option value="16:30">16:30 Chiều</option>
                        <option value="18:30">18:30 Tối</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ghi chú (Số người ở, phương tiện, ngày dọn vào)</label>
                    <textarea
                      rows="2"
                      placeholder="VD: 2 người ở, có 1 xe máy, muốn dọn vào đầu tháng tới..."
                      value={bookingForm.note}
                      onChange={(e) => setBookingForm({ ...bookingForm, note: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Gửi thông tin cho Admin Bon
                    </button>
                    <p className="text-[11px] text-center text-slate-400 mt-2">
                      Admin Bon ({ADMIN_INFO.phone}) sẽ gọi hoặc nhắn Zalo xác nhận trong vòng 15-30 phút.
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 relative animate-in fade-in zoom-in-95 duration-200 text-left">
            <button
              onClick={() => { setIsLoginModalOpen(false); setLoginError(""); }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Đăng nhập Admin 117 ROOM</h3>
              <p className="text-xs text-slate-500 mt-0.5">Khu vực dành riêng cho Quản trị viên (Bon)</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              {loginError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tài khoản</label>
                <input
                  type="text"
                  required
                  placeholder="bon hoặc admin"
                  value={loginInputUser}
                  onChange={(e) => setLoginInputUser(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mật khẩu bảo mật</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu..."
                  value={loginInputPass}
                  onChange={(e) => setLoginInputPass(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Đăng nhập Quản trị
                </button>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-500 text-center">
                <span>Tài khoản: <strong>bon</strong> • Mật khẩu mặc định: <strong>bon117admin</strong></span>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[94vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200 text-left">
            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-4 right-4 z-30 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full shadow-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* MULTI-IMAGE CAROUSEL VIEWER */}
            <div className="relative bg-slate-950 rounded-t-3xl overflow-hidden select-none">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full flex items-center justify-center bg-black">
                <img
                  src={selectedRoom.images?.[galleryActiveIndex] || selectedRoom.images?.[0]}
                  alt={`Phòng ảnh ${galleryActiveIndex + 1}`}
                  className="w-full h-full object-contain sm:object-cover transition-opacity duration-300"
                />

                {/* Left/Right Carousel Controls */}
                {selectedRoom.images?.length > 1 && (
                  <>
                    <button
                      onClick={() => setGalleryActiveIndex(prev => (prev === 0 ? selectedRoom.images.length - 1 : prev - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur transition-all"
                      title="Ảnh trước"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setGalleryActiveIndex(prev => (prev === selectedRoom.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur transition-all"
                      title="Ảnh tiếp"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Counter Tag */}
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur text-white text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{galleryActiveIndex + 1} / {selectedRoom.images?.length || 1}</span>
                </div>
              </div>

              {/* Thumbnails list */}
              {selectedRoom.images?.length > 1 && (
                <div className="flex items-center gap-2 p-3 bg-slate-900 overflow-x-auto">
                  {selectedRoom.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setGalleryActiveIndex(idx)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        galleryActiveIndex === idx ? 'border-orange-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-orange-600 text-[8px] font-bold text-white text-center py-0.2">
                          Ảnh bìa
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                    {selectedRoom.district}
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                    {selectedRoom.type}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                    selectedRoom.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {selectedRoom.status === 'available' ? 'Còn trống' : 'Đã cho thuê'}
                  </span>
                </div>
                <div className="text-2xl font-black text-orange-600">
                  {formatPrice(selectedRoom.price)}
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-snug">
                {selectedRoom.title}
              </h2>

              <p className="text-sm text-slate-600 flex items-start gap-1.5 mb-6">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>{selectedRoom.address}</span>
              </p>

              {/* Fixed Utilities Grid */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Bảng chi phí niêm yết
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <div className="text-slate-400 text-xs flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> Điện</div>
                    <div className="font-bold text-slate-800 mt-1">{selectedRoom.electricPrice ? `${selectedRoom.electricPrice.toLocaleString()} đ/kWh` : "Bao trọn gói"}</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <div className="text-slate-400 text-xs flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-500" /> Nước</div>
                    <div className="font-bold text-slate-800 mt-1">{selectedRoom.waterPrice ? `${selectedRoom.waterPrice.toLocaleString()} đ/người` : "Miễn phí"}</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <div className="text-slate-400 text-xs flex items-center gap-1"><Wifi className="w-3 h-3 text-indigo-500" /> Wifi</div>
                    <div className="font-bold text-slate-800 mt-1">{selectedRoom.internetPrice ? `${selectedRoom.internetPrice.toLocaleString()} đ/phòng` : "Miễn phí"}</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <div className="text-slate-400 text-xs flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /> Tiền cọc</div>
                    <div className="font-bold text-slate-800 mt-1">{selectedRoom.deposit ? `${selectedRoom.deposit.toLocaleString()} đ` : "1 tháng"}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-900 mb-2">Mô tả chi tiết</h4>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedRoom.description}
                </p>
              </div>

              {/* Host & Actions */}
              <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-black flex items-center justify-center text-base shadow-sm">
                    B
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Admin phụ trách phòng:</div>
                    <div className="font-bold text-slate-900 text-sm">Bon ({ADMIN_INFO.phone})</div>
                    <div className="text-xs text-emerald-600 font-medium">Hỗ trợ mở cửa xem phòng 24/7</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    disabled={selectedRoom.status === 'rented'}
                    onClick={() => {
                      setBookingRoom(selectedRoom);
                      setBookingSuccessData(null);
                    }}
                    className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all ${
                      selectedRoom.status === 'rented'
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/20 active:scale-95'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Đặt lịch xem phòng
                  </button>

                  <a
                    href={`tel:${ADMIN_INFO.phone}`}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    Gọi ngay
                  </a>

                  <a
                    href={`https://zalo.me/${ADMIN_INFO.zalo}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Zalo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 text-left">
            <button
              onClick={() => setIsPostModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Đăng phòng trọ mới tại TP.HCM</h3>
                <p className="text-xs text-slate-500">Người phụ trách: Admin Bon ({ADMIN_INFO.phone})</p>
              </div>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề tin đăng <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Căn hộ studio có gác xép cao sát ĐH Bách Khoa..."
                  value={newRoomForm.title}
                  onChange={(e) => setNewRoomForm({ ...newRoomForm, title: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* MULTIPLE IMAGES UPLOAD SECTION */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-orange-600" />
                    <span>Bộ sưu tập ảnh phòng ({postImages.length} ảnh đã chọn)</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">Ảnh đầu tiên sẽ làm ảnh bìa</span>
                </div>

                {/* Hidden Multi-file input */}
                <input
                  type="file"
                  multiple
                  ref={postFilesInputRef}
                  accept="image/*"
                  onChange={(e) => handleSelectMultipleFiles(e, 'post')}
                  className="hidden"
                />

                {/* Dropzone button */}
                <div
                  onClick={() => postFilesInputRef.current?.click()}
                  className="border-2 border-dashed border-orange-300 hover:border-orange-500 bg-orange-50/40 hover:bg-orange-50/80 rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    Bấm vào đây để chọn cùng lúc nhiều ảnh từ máy/điện thoại
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Có thể giữ phím Ctrl/Shift để chọn nhiều ảnh hoặc chọn từng đợt
                  </span>
                </div>

                {/* Dán thêm URL nếu muốn */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Hoặc dán thêm đường link ảnh trực tiếp (https://...)"
                    value={postUrlInput}
                    onChange={(e) => setPostUrlInput(e.target.value)}
                    className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddUrlImage('post')}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                  >
                    Thêm ảnh
                  </button>
                </div>

                {/* Image Gallery Preview Grid */}
                {postImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-2">
                    {postImages.map((img, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-300 bg-white aspect-square shadow-sm">
                        <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        
                        {/* Cover badge */}
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-orange-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                            Ảnh bìa
                          </span>
                        )}

                        {/* Overlay tools */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetAsCover(idx, 'post')}
                              title="Đặt làm ảnh bìa"
                              className="p-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600 text-[10px]"
                            >
                              <Star className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx, 'post')}
                            title="Xóa ảnh này"
                            className="p-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Loại phòng</label>
                  <select
                    value={newRoomForm.type}
                    onChange={(e) => setNewRoomForm({ ...newRoomForm, type: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none bg-white"
                  >
                    {ROOM_TYPES.filter(t => t !== "Tất cả loại phòng").map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thành phố</label>
                  <input
                    type="text"
                    disabled
                    value="TP. Hồ Chí Minh"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quận / Khu vực</label>
                  <select
                    value={newRoomForm.district}
                    onChange={(e) => setNewRoomForm({ ...newRoomForm, district: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none bg-white font-medium"
                  >
                    {HCM_DISTRICTS.filter(d => d !== "Tất cả quận / khu vực").map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ chi tiết</label>
                <input
                  type="text"
                  placeholder="Số nhà, hẻm, tên đường, phường tại TP.HCM..."
                  value={newRoomForm.address}
                  onChange={(e) => setNewRoomForm({ ...newRoomForm, address: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Giá thuê (đ/tháng) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="3800000"
                    value={newRoomForm.price}
                    onChange={(e) => setNewRoomForm({ ...newRoomForm, price: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-orange-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Diện tích (m²)</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={newRoomForm.area}
                    onChange={(e) => setNewRoomForm({ ...newRoomForm, area: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả phòng</label>
                <textarea
                  rows="3"
                  placeholder="Tiện ích phòng, nội thất, giờ giấc, an ninh..."
                  value={newRoomForm.description}
                  onChange={(e) => setNewRoomForm({ ...newRoomForm, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all"
                >
                  Đăng phòng lên sàn ({postImages.length} ảnh)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {roomToEdit && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 relative max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 text-left">
            <button
              onClick={() => setRoomToEdit(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Sửa thông tin phòng #{roomToEdit.id}</h3>
                <p className="text-xs text-slate-500">Cập nhật danh sách ảnh, giá niêm yết và quận huyện</p>
              </div>
            </div>

            <form onSubmit={handleSaveEditRoom} className="space-y-4 text-xs">
              {/* EDIT MULTI-IMAGE UPLOAD SECTION */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Bộ ảnh phòng hiện tại ({editImages.length} ảnh)</span>
                  </label>
                  <span className="text-[10px] text-slate-500">Bấm ⭐ để chọn làm ảnh bìa</span>
                </div>

                <input
                  type="file"
                  multiple
                  ref={editFilesInputRef}
                  accept="image/*"
                  onChange={(e) => handleSelectMultipleFiles(e, 'edit')}
                  className="hidden"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => editFilesInputRef.current?.click()}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" /> Tải thêm ảnh từ máy
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Dán link ảnh cần thêm..."
                    value={editUrlInput}
                    onChange={(e) => setEditUrlInput(e.target.value)}
                    className="flex-1 text-xs p-2 rounded-lg border border-slate-300 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddUrlImage('edit')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-white font-bold"
                  >
                    Thêm
                  </button>
                </div>

                {/* Edit Gallery List */}
                {editImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {editImages.map((img, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-300 aspect-square bg-white shadow-sm">
                        <img src={img} alt={`Edit preview ${idx}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-blue-600 text-white text-[8px] font-bold px-1 rounded shadow">
                            Bìa
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetAsCover(idx, 'edit')}
                              title="Đặt làm ảnh bìa"
                              className="p-1 rounded bg-amber-500 text-white"
                            >
                              <Star className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx, 'edit')}
                            title="Xóa ảnh"
                            className="p-1 rounded bg-rose-600 text-white"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên phòng trọ</label>
                <input
                  type="text"
                  required
                  value={roomToEdit.title}
                  onChange={(e) => setRoomToEdit({ ...roomToEdit, title: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quận tại TP.HCM</label>
                  <select
                    value={roomToEdit.district}
                    onChange={(e) => setRoomToEdit({ ...roomToEdit, district: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800"
                  >
                    {HCM_DISTRICTS.filter(d => d !== "Tất cả quận / khu vực").map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trạng thái phòng</label>
                  <select
                    value={roomToEdit.status}
                    onChange={(e) => setRoomToEdit({ ...roomToEdit, status: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
                  >
                    <option value="available">Còn trống (Mở cho thuê)</option>
                    <option value="rented">Đã cho thuê (Khóa phòng)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Giá thuê (đ/tháng)</label>
                <input
                  type="number"
                  required
                  value={roomToEdit.price}
                  onChange={(e) => setRoomToEdit({ ...roomToEdit, price: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-bold text-orange-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRoomToEdit(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Lưu thay đổi ({editImages.length} ảnh)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Xác nhận xóa phòng #{deleteConfirmId}?</h3>
            <p className="text-xs text-slate-500 mb-6">
              Hành động này sẽ gỡ bỏ hoàn toàn phòng trọ khỏi hệ thống 117 ROOM Sài Gòn.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Giữ lại
              </button>
              <button
                onClick={() => handleDeleteRoom(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-sm"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {isCalculatorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsCalculatorOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Bảng tính chi phí ở trọ Sài Gòn</h3>
                <p className="text-xs text-slate-500">Ước tính ngân sách điện nước, internet sinh hoạt hàng tháng</p>
              </div>
            </div>

            <CalculatorTool room={calculatorRoom || rooms[0]} />
          </div>
        </div>
      )}

      {}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-sm">
                  117
                </div>
                <span className="text-xl font-bold text-white tracking-tight">117 ROOM TP.HCM</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Nền tảng tìm kiếm và đặt lịch xem phòng trọ số 1 tại TP. Hồ Chí Minh. Phụ trách quản lý và vận hành trực tiếp bởi Admin Bon.
              </p>
              <div className="text-slate-500 text-[11px]">
                © 2026 117 ROOM TP.HCM • Quản lý: Bon
              </div>
            </div>

            <div>
              <h5 className="text-slate-200 font-bold mb-3 text-sm">Khu vực TP.HCM</h5>
              <ul className="space-y-2">
                <li className="hover:text-orange-400 cursor-pointer" onClick={() => { setSelectedDistrict("Bình Thạnh"); setClientTab('rooms'); setCurrentMode('client'); }}>Phòng trọ Bình Thạnh (Hàng Xanh)</li>
                <li className="hover:text-orange-400 cursor-pointer" onClick={() => { setSelectedDistrict("Quận 10"); setClientTab('rooms'); setCurrentMode('client'); }}>Phòng trọ Quận 10 (Sư Vạn Hạnh)</li>
                <li className="hover:text-orange-400 cursor-pointer" onClick={() => { setSelectedDistrict("Quận 7"); setClientTab('rooms'); setCurrentMode('client'); }}>Phòng trọ Quận 7 (RMIT, Tôn Đức Thắng)</li>
                <li className="hover:text-orange-400 cursor-pointer" onClick={() => { setSelectedDistrict("TP. Thủ Đức"); setClientTab('rooms'); setCurrentMode('client'); }}>Phòng trọ TP. Thủ Đức (Làng Đại Học)</li>
              </ul>
            </div>

            <div>
              <h5 className="text-slate-200 font-bold mb-3 text-sm">Quản trị & Hỗ trợ</h5>
              <ul className="space-y-2">
                <li className="hover:text-orange-400 cursor-pointer" onClick={openAdminView}>
                  {isAdminLoggedIn ? `Bảng Quản trị (Admin ${ADMIN_INFO.name})` : 'Đăng nhập Quản trị viên'}
                </li>
                <li className="hover:text-orange-400 cursor-pointer" onClick={() => setIsCalculatorOpen(true)}>Tính toán chi phí hàng tháng</li>
                <li className="hover:text-orange-400 cursor-pointer" onClick={() => { setCurrentMode('client'); setClientTab('wishlist'); }}>Phòng trọ bạn đã lưu</li>
              </ul>
            </div>

            <div>
              <h5 className="text-slate-200 font-bold mb-3 text-sm">Thông tin liên hệ Admin Bon</h5>
              <p className="mb-2">Người đại diện: <span className="text-white font-bold">{ADMIN_INFO.name}</span></p>
              <p className="mb-2">Hotline / Zalo: <span className="text-orange-400 font-bold">{ADMIN_INFO.phone}</span></p>
              <p className="mb-2">Khu vực: TP. Hồ Chí Minh</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 text-[11px] mt-2 border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Nhận hẹn xem phòng 24/7
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CalculatorTool({ room }) {
  const [rent, setRent] = useState(room?.price || 4000000);
  const [kwh, setKwh] = useState(130);
  const [elecRate, setElecRate] = useState(room?.electricPrice || 3800);
  const [people, setPeople] = useState(2);
  const [waterRate, setWaterRate] = useState(room?.waterPrice || 80000);
  const [wifi, setWifi] = useState(room?.internetPrice || 100000);
  const [bikes, setBikes] = useState(1);
  const [bikeFee, setBikeFee] = useState(120000);

  const electricTotal = kwh * elecRate;
  const waterTotal = people * waterRate;
  const bikeTotal = bikes * bikeFee;
  const grandTotal = Number(rent) + electricTotal + waterTotal + Number(wifi) + bikeTotal;

  return (
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-200 p-3 rounded-2xl flex items-center justify-between">
        <div>
          <div className="text-[11px] text-orange-700 font-bold uppercase tracking-wider">Ước tính chi phí tại:</div>
          <div className="text-xs font-bold text-slate-800 line-clamp-1">{room.title}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Giá phòng gốc</div>
          <div className="text-sm font-black text-orange-600">{(rent || 0).toLocaleString()} đ</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Tiền phòng (đ/tháng)</label>
          <input
            type="number"
            value={rent}
            onChange={(e) => setRent(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Số điện ước tính ({kwh} kWh x {elecRate}đ)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="20"
              max="400"
              step="10"
              value={kwh}
              onChange={(e) => setKwh(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <span className="font-bold text-slate-700 w-12 text-right">{kwh} số</span>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Số người ở ({people} người)
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => setPeople(num)}
                className={`flex-1 py-1.5 rounded-lg border font-bold text-xs transition-all ${
                  people === num
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {num} người
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Số lượng xe máy gửi ({bikes} xe)
          </label>
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => setBikes(num)}
                className={`flex-1 py-1.5 rounded-lg border font-bold text-xs transition-all ${
                  bikes === num
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {num} xe
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-950 text-white p-4 rounded-2xl space-y-2 mt-2">
        <div className="flex justify-between text-xs text-slate-300">
          <span>Tiền điện ({kwh} số x {elecRate.toLocaleString()}đ):</span>
          <span className="font-semibold text-white">{electricTotal.toLocaleString()} đ</span>
        </div>
        <div className="flex justify-between text-xs text-slate-300">
          <span>Tiền nước ({people} người x {waterRate.toLocaleString()}đ):</span>
          <span className="font-semibold text-white">{waterTotal.toLocaleString()} đ</span>
        </div>
        <div className="flex justify-between text-xs text-slate-300">
          <span>Internet & Phí giữ xe ({bikes} xe):</span>
          <span className="font-semibold text-white">{(Number(wifi) + bikeTotal).toLocaleString()} đ</span>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between">
          <div>
            <div className="text-xs text-orange-400 font-bold uppercase">Tổng ngân sách mỗi tháng:</div>
            <div className="text-[11px] text-slate-400">Chia bình quân: ~ {(Math.round(grandTotal / people)).toLocaleString()} đ / người</div>
          </div>
          <div className="text-2xl font-black text-amber-400">
            {grandTotal.toLocaleString()} đ
          </div>
        </div>
      </div>
    </div>
  );
}
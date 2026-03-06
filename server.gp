<gp>
// server.gp - WebApp Mẫu Chạy Trang Tài Liệu
// -----------------------------------------------------------------------------

// Bước 1: Nạp cấu hình từ .env nếu có, nếu không lấy Port mặc định là 8000
env_load(".env");
$port = env("HTTP_PORT", "8000");

// Bước 2: Bật tính năng Serve thư mục /public/ để load file tĩnh (CSS/JS/Ảnh)
http_static("/static/", "public/");

// Bước 3: Đón người dùng truy cập trang chủ và Render file HTML giao diện chính
http_handle("/", function($req) {
    
    // Do file html này là một file tài liệu thô có chứa rất nhiều dấu ngoặc nhọn
    // Nếu dùng hàm `render`, Engine sẽ tưởng là biến và cố parse gây lỗi Panic
    // Giải pháp bảo vệ file chuẩn xác nhất là đọc file RAW và trả về dạng HTML Text
    $htmlContent = file_get_contents("templates/index.html");
    return $htmlContent;
});

// Chạy ứng dụng
echo "\n=======================================\n";
echo "🚀 Docs Site đang chạy tại http://localhost:$port\n";
echo "=======================================\n";
http_serve(":$port");

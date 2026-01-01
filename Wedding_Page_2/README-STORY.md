# Wedding Story - Thiệp cưới kiểu Instagram Story

Giao diện thiệp cưới online theo phong cách Instagram Story với các tính năng:

## ✨ Tính năng

- 📱 **Giao diện Story fullscreen**: Trải nghiệm như Instagram Story
- 🎵 **Nút phát nhạc**: Phát nhạc nền (cần thêm file `bgm.mp3`)
- ⏱️ **Đếm ngược**: Countdown đến ngày cưới
- 💬 **Comments overlay**: Hiển thị lời chúc từ bạn bè
- 📅 **Calendar**: Hiển thị ngày cưới trên lịch
- 📝 **Form RSVP**: Xác nhận tham dự
- 👆 **Navigation**: Swipe, click, hoặc scroll để chuyển story
- 🎨 **Animations**: Hiệu ứng mượt mà và đẹp mắt

## 📁 Cấu trúc File

```
Wedding_Page_2/
├── story.html                 # File HTML chính (MỚI)
├── assets/
│   ├── story-styles.css      # CSS cho giao diện story (MỚI)
│   ├── story-app.js          # JavaScript (MỚI)
│   ├── bgm.mp3               # Nhạc nền (CẦN THÊM)
│   └── img/                  # Thư mục ảnh
│       ├── story1.jpg        # Ảnh nền story 1
│       ├── story2.jpg        # Ảnh nền story 2
│       ├── story3.jpg        # Ảnh nền story 3
│       ├── story4.jpg        # Ảnh nền story 4
│       ├── story5.jpg        # Ảnh nền story 5
│       ├── story6.jpg        # Ảnh nền story 6
│       ├── story7.jpg        # Ảnh nền story 7
│       ├── couple1.jpg       # Ảnh cặp đôi 1
│       ├── couple2.jpg       # Ảnh cặp đôi 2
│       ├── couple3.jpg       # Ảnh cặp đôi 3
│       ├── couple4.jpg       # Ảnh cặp đôi 4
│       ├── couple5.jpg       # Ảnh cặp đôi 5
│       ├── hug.jpg           # Ảnh ôm nhau
│       ├── photo1.jpg        # Ảnh phụ 1
│       └── photo2.jpg        # Ảnh phụ 2
```

## 🖼️ Cần chuẩn bị ảnh

Bạn cần thêm các ảnh vào thư mục `assets/img/`:

### Ảnh nền cho từng story (16:9 hoặc 9:16):
1. `story1.jpg` - Ảnh cặp đôi cho màn Welcome
2. `story2.jpg` - Ảnh nền cho Our Love Story
3. `story3.jpg` - Ảnh nền cho story 3
4. `story4.jpg` - Ảnh nền cho story ôm nhau
5. `story5.jpg` - Ảnh nền cho calendar
6. `story6.jpg` - Ảnh nền cho photo layout
7. `story7.jpg` - Ảnh nền cho RSVP

### Ảnh cặp đôi:
- `couple1.jpg` đến `couple5.jpg` - Các ảnh cặp đôi
- `hug.jpg` - Ảnh ôm nhau
- `photo1.jpg`, `photo2.jpg` - Ảnh phụ

### Nhạc nền:
- `assets/bgm.mp3` - File nhạc nền (định dạng MP3)

## 🚀 Cách sử dụng

1. **Thêm ảnh**: Copy tất cả ảnh của bạn vào thư mục `assets/img/`
2. **Thêm nhạc**: Thêm file nhạc `bgm.mp3` vào thư mục `assets/`
3. **Tùy chỉnh nội dung**: Mở `story.html` và chỉnh sửa:
   - Tên cô dâu chú rể
   - Ngày cưới
   - Lời mời, thơ ca
   - Thông tin sự kiện
4. **Mở file**: Mở `story.html` bằng trình duyệt

## 🎮 Cách điều khiển

- **Swipe lên/xuống**: Chuyển story tiếp theo/trước
- **Click bên phải**: Story tiếp theo
- **Click bên trái**: Story trước đó
- **Scroll**: Cuộn qua các story
- **Nút ▲**: Mũi tên lên - Story trước
- **Nút ▼**: Mũi tên xuống - Story tiếp
- **ESC**: Đóng thiệp

## 📝 Tùy chỉnh

### Thay đổi ngày cưới:
Mở `assets/story-app.js`, tìm dòng:
```javascript
const WEDDING_DATE = new Date('2050-05-20T12:00:00').getTime();
```
Đổi thành ngày cưới của bạn.

### Thay đổi màu sắc:
Mở `assets/story-styles.css`, tìm phần `:root` và thay đổi:
```css
:root {
  --red: #dc143c;        /* Màu đỏ chủ đạo */
  --gold: #d4af37;       /* Màu vàng */
  --pink: rgba(255, 182, 193, 0.8);  /* Màu hồng */
}
```

### Thêm/bớt story:
- Thêm section `.story` mới trong `story.html`
- Thêm progress bar tương ứng
- Cập nhật JavaScript nếu cần

## 📱 Responsive

- Tối ưu cho mobile (320px - 480px)
- Hiển thị tốt trên tablet (768px+)
- Desktop sẽ hiển thị ở giữa màn hình với khung story

## 🎨 Fonts sử dụng

- **Playfair Display**: Tiêu đề sang trọng
- **Great Vibes**: Chữ viết tay
- **Cormorant**: Body text thanh lịch
- **Montserrat**: UI elements

## 🔧 Troubleshooting

**Nhạc không tự động phát?**
- Trình duyệt ngăn autoplay. Nhấn nút nhạc ở góc trên bên phải.

**Ảnh không hiển thị?**
- Kiểm tra tên file ảnh có đúng không
- Đảm bảo ảnh nằm đúng thư mục `assets/img/`

**Countdown không đúng?**
- Kiểm tra lại ngày cưới trong file `story-app.js`
- Đảm bảo múi giờ đúng

## 📦 Deploy

Có thể host trên:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

Chỉ cần upload toàn bộ thư mục lên là dùng được!

## 💡 Tips

- Sử dụng ảnh có độ phân giải cao (ít nhất 1080px)
- Ảnh story nên tỷ lệ 9:16 (dọc) hoặc 16:9 (ngang)
- File nhạc nên dưới 5MB để load nhanh
- Test trên nhiều thiết bị trước khi gửi khách mời

---

Made with ❤️ for your special day!

# 🧪 Test Comments Animation

## Files để test:

### 1. **test-comments.html** - Test đơn giản nhất
- Chỉ có comments với nút bấm
- Dễ debug
- URL: http://localhost:8080/test-comments.html

### 2. **test-story.html** - Test với story layout
- Có background image
- Có comments overlay
- Có debug info
- URL: http://localhost:8080/test-story.html

### 3. **demo-comments.html** - Demo đầy đủ
- Gần giống với design cuối
- Có tất cả elements
- URL: http://localhost:8080/demo-comments.html

### 4. **story.html** - File chính (đầy đủ 7 stories)
- URL: http://localhost:8080/story.html

## 🔍 Cách test:

1. **Chạy web server** (đã chạy rồi):
```bash
cd /workspaces/xuantoan234.github.io/Wedding_Page_2
python3 -m http.server 8080
```

2. **Mở browser** và vào một trong các URL trên

3. **Kiểm tra**:
   - Comments có ẩn ban đầu không? (opacity: 0)
   - Sau 1 giây, comments có xuất hiện từng cái một không?
   - Khoảng cách giữa các comments là 800ms

## 🐛 Debug:

### Nếu comments KHÔNG ẩn ban đầu:
- Mở DevTools (F12)
- Chọn một comment element
- Kiểm tra Computed styles
- opacity phải = 0
- transform phải = translateY(20px)

### Nếu animation KHÔNG chạy:
- Mở Console (F12)
- Xem có lỗi JavaScript không
- Kiểm tra file story-app.js có load không

## ✅ Expected behavior:

**Story đầu tiên (index 0):**
1. Comments ban đầu ẩn (opacity: 0, translateY: 20px)
2. Sau 1 giây, comment 1 xuất hiện
3. Sau 800ms, comment 2 xuất hiện
4. Sau 800ms, comment 3 xuất hiện
5. ...và cứ thế tiếp tục

**Các story khác (index 1-6):**
- Comments xuất hiện ngay lập tức (không animation)

## 📝 Code changes:

### story-styles.css:
```css
.comment {
  opacity: 0;  /* Ẩn ban đầu */
  transform: translateY(20px);  /* Dịch xuống */
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}
```

### story-app.js:
```javascript
function animateComments(storyIndex) {
  // Chỉ animate ở story đầu tiên (index = 0)
  if (storyIndex === 0 && !commentAnimationRunning) {
    // Hiển thị từng comment với delay 800ms
    comments.forEach((comment, index) => {
      setTimeout(() => {
        comment.style.opacity = '1';
        comment.style.transform = 'translateY(0)';
      }, index * 800);
    });
  }
}
```

## 🎯 Test checklist:

- [ ] Comments ẩn ban đầu
- [ ] Animation chạy sau 1 giây
- [ ] Mỗi comment cách nhau 800ms
- [ ] Hiệu ứng smooth (cubic-bezier)
- [ ] Chỉ chạy ở story đầu tiên
- [ ] Các story khác hiển thị ngay

---

**Lưu ý**: Server đang chạy ở port 8080. Mở browser và test!

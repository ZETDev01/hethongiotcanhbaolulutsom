document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Kiểm tra tài khoản và mật khẩu
    if (username === 'hethonggiamsatnhakinhhaui' && password === 'haui') {
        // Đăng nhập thành công, lưu trạng thái đăng nhập
        localStorage.setItem('loggedIn', 'true');
        // Chuyển sang trang index.html
        window.location.href = 'index.html';
    } else {
        // Hiển thị thông báo đăng nhập sai
        alert('Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại!');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const desktopArea = document.querySelector('.desktop-area');
    const menuItems = document.querySelectorAll('.top-menu-bar .menu-item');
    const taskbarWindowsList = document.querySelector('.taskbar-windows-list');
    const systemTimeSpan = document.querySelector('.system-time');

    let zIndexCounter = 100; // Để quản lý thứ tự lớp của cửa sổ

    // --- HIỆU ỨNG ĐƯỜNG MÒN CHUỘT (MOUSE TRAIL EFFECT) ---
    const trailContainer = document.body;
    const maxTrailDots = 15;
    const dotSize = 8;
    const dots = [];

    for (let i = 0; i < maxTrailDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('trail-dot');
        dot.style.width = `${dotSize}px`;
        dot.style.height = `${dotSize}px`;
        dot.style.zIndex = 9999 - i;
        trailContainer.appendChild(dot);
        dots.push(dot);
    }

    let currentIndex = 0;

    trailContainer.addEventListener('mousemove', (e) => {
        const dot = dots[currentIndex];
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
        dot.style.animation = 'none';
        void dot.offsetWidth;
        dot.style.opacity = 1;
        dot.style.animation = `fadeOutTrail 0.7s forwards ease-out`;
        currentIndex = (currentIndex + 1) % maxTrailDots;
    });

    // --- CẬP NHẬT THỜI GIAN TRÊN TASKBAR ---
    function updateSystemTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        systemTimeSpan.textContent = `${hours}:${minutes}`;
    }
    updateSystemTime();
    setInterval(updateSystemTime, 1000); // Cập nhật mỗi giây

    // --- QUẢN LÝ CỬA SỔ ---
    // Mảng để theo dõi các cửa sổ đang mở
    const openWindows = {}; // key: data-section, value: window element

    // Đối tượng lưu trữ tiêu đề mặc định và tiêu đề thay đổi khi mở
    const windowTitlesMap = {
        'home': { default: 'Khắc Bảo - CV Digital.exe', onOpen: 'Welcome to KB\'s CV!' },
        'info': { default: 'Thông tin cá nhân', onOpen: 'MaboutMe.info' },
        'objective': { default: 'Mục tiêu nghề nghiệp', onOpen: 'Objectives.doc' },
        'hobbies': { default: 'Sở thích', onOpen: 'hobbies.me' },
        'skills': { default: 'Ngôn ngữ-Kỹ năng', onOpen: 'lang&skill.txt' },
        'certificates': { default: 'Chứng chỉ-Giải thưởng', onOpen: 'awardsCertificates.jpg' },
        'projects': { default: 'Dự án', onOpen: 'myProject.rar' },
        'contact': { default: 'Liên hệ', onOpen: 'contactMe.eml' },
    };


    function bringWindowToFront(windowElement) {
        zIndexCounter++;
        windowElement.style.zIndex = zIndexCounter;
        // Bỏ active của các nút taskbar khác và kích hoạt nút taskbar này
        document.querySelectorAll('.taskbar-window-button').forEach(btn => btn.classList.remove('active'));
        const taskbarBtn = document.querySelector(`.taskbar-window-button[data-window-id="${windowElement.dataset.windowId}"]`);
        if (taskbarBtn) taskbarBtn.classList.add('active');

        // Khi cửa sổ được đưa lên trước, thay đổi tiêu đề
        const sectionId = windowElement.dataset.windowId;
        const windowTitleEl = windowElement.querySelector('.window-title');
        if (windowTitleEl && windowTitlesMap[sectionId]) {
            windowTitleEl.textContent = windowTitlesMap[sectionId].onOpen;
        }
    }

    function createWindow(sectionId, initialTitle, contentHTML) {
        // Kiểm tra nếu cửa sổ đã tồn tại và đang mở, chỉ cần hiển thị và đưa lên trước
        if (openWindows[sectionId] && !openWindows[sectionId].classList.contains('minimized')) {
            bringWindowToFront(openWindows[sectionId]);
            return;
        }

        // Nếu cửa sổ đang thu nhỏ, hiển thị lại
        if (openWindows[sectionId] && openWindows[sectionId].classList.contains('minimized')) {
            openWindows[sectionId].classList.remove('minimized');
            openWindows[sectionId].classList.add('active'); // Thêm active để chạy animation hiện ra
            openWindows[sectionId].style.display = 'flex'; // Đảm bảo hiển thị
            bringWindowToFront(openWindows[sectionId]);
            return;
        }

        const windowFrame = document.createElement('div');
        windowFrame.id = `${sectionId}-window`;
        windowFrame.classList.add('window-frame');
        windowFrame.setAttribute('data-window-id', sectionId);

        // Lấy tiêu đề mặc định từ map, hoặc dùng initialTitle nếu không có trong map
        const defaultTitleForWindow = windowTitlesMap[sectionId] ? windowTitlesMap[sectionId].default : initialTitle;

        windowFrame.innerHTML = `
            <div class="window-header">
                <div class="window-title">${defaultTitleForWindow}</div>
                <div class="window-controls">
                    <button class="minimize-btn" data-action="minimize"></button>
                    <button class="maximize-btn" data-action="maximize"></button>
                    <button class="close-btn" data-action="close"></button>
                </div>
            </div>
            <div class="window-content">${contentHTML}</div>
        `;

        desktopArea.appendChild(windowFrame);
        openWindows[sectionId] = windowFrame; // Lưu trữ cửa sổ

        // Đặt vị trí ban đầu ngẫu nhiên và kích thước mặc định
        const desktopWidth = desktopArea.offsetWidth;
        const desktopHeight = desktopArea.offsetHeight;

        const defaultWidth = Math.min(1200, desktopWidth * 0.95);
        const defaultHeight = Math.min(800, desktopHeight * 0.9);

        const randomX = Math.random() * (desktopWidth - defaultWidth - 100) + 50;
        const randomY = Math.random() * (desktopHeight - defaultHeight - 100) + 50;

        windowFrame.style.width = `${defaultWidth}px`;
        windowFrame.style.height = `${defaultHeight}px`;
        windowFrame.style.left = `${randomX}px`;
        windowFrame.style.top = `${randomY}px`;
        windowFrame.style.display = 'flex'; // Quan trọng: hiển thị ngay để lấy kích thước cho animation

        // Kích hoạt animation hiện ra
        setTimeout(() => {
            windowFrame.classList.add('active');
            bringWindowToFront(windowFrame); // Gọi bringWindowToFront để đặt tiêu đề onOpen
        }, 10); // Ngăn chặn animation không chạy nếu thêm ngay lập tức

        // Xử lý kéo thả cửa sổ
        let isDragging = false;
        let offsetX, offsetY;

        const header = windowFrame.querySelector('.window-header');
        header.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Chỉ kéo bằng nút chuột trái
            bringWindowToFront(windowFrame); // Đưa cửa sổ lên trước khi kéo
            isDragging = true;
            offsetX = e.clientX - windowFrame.getBoundingClientRect().left;
            offsetY = e.clientY - windowFrame.getBoundingClientRect().top;
            windowFrame.style.cursor = 'grabbing';
        });

        const onMouseMove = (e) => {
            if (!isDragging) return;
            // Tính toán vị trí mới dựa trên clientX/Y và offset ban đầu
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            // Giới hạn trong desktop area
            newX = Math.max(0, Math.min(newX, desktopArea.offsetWidth - windowFrame.offsetWidth));
            newY = Math.max(0, Math.min(newY, desktopArea.offsetHeight - windowFrame.offsetHeight));

            windowFrame.style.left = `${newX}px`;
            windowFrame.style.top = `${newY}px`;
        };

        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                windowFrame.style.cursor = 'grab';
            }
        };

        // Gắn sự kiện mousemove và mouseup lên toàn bộ document
        // để vẫn kéo được nếu chuột đi ra ngoài cửa sổ
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        // Đảm bảo loại bỏ event listener khi cửa sổ đóng
        windowFrame.addEventListener('beforeunload', () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        });


        // Xử lý các nút điều khiển (Minimize, Maximize, Close)
        windowFrame.querySelectorAll('.window-controls button').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                const windowTitleEl = windowFrame.querySelector('.window-title');
                switch (action) {
                    case 'minimize':
                        windowFrame.classList.remove('active'); // Bắt đầu animation thu nhỏ
                        windowFrame.classList.add('minimized');
                        // Khi minimize, đặt lại tiêu đề về mặc định
                        if (windowTitleEl && windowTitlesMap[sectionId]) {
                            windowTitleEl.textContent = windowTitlesMap[sectionId].default;
                        }
                        setTimeout(() => {
                            windowFrame.style.display = 'none'; // Ẩn hẳn sau khi animation
                        }, 200); // Thời gian của transition
                        break;
                    case 'maximize':
                        // Chuyển đổi trạng thái phóng to
                        if (windowFrame.style.width === '100%' && windowFrame.style.height === '100%') {
                            // Quay về kích thước ban đầu (cần lưu trữ)
                            windowFrame.style.width = windowFrame._originalWidth || `${defaultWidth}px`;
                            windowFrame.style.height = windowFrame._originalHeight || `${defaultHeight}px`;
                            windowFrame.style.top = windowFrame._originalTop || `${randomY}px`;
                            windowFrame.style.left = windowFrame._originalLeft || `${randomX}px`;
                        } else {
                            // Lưu trữ kích thước và vị trí hiện tại trước khi phóng to
                            windowFrame._originalWidth = windowFrame.style.width;
                            windowFrame._originalHeight = windowFrame.style.height;
                            windowFrame._originalTop = windowFrame.style.top;
                            windowFrame._originalLeft = windowFrame.style.left;

                            windowFrame.style.width = '100%';
                            windowFrame.style.height = '100%';
                            windowFrame.style.top = '0';
                            windowFrame.style.left = '0';
                        }
                        break;
                    case 'close':
                        windowFrame.classList.remove('active');
                        windowFrame.classList.add('closing'); // Thêm class để animation đóng
                        // Xóa các event listener kéo thả
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);

                        setTimeout(() => {
                            windowFrame.remove();
                            delete openWindows[sectionId]; // Xóa khỏi danh sách cửa sổ đang mở
                            // Xóa nút trên taskbar
                            const taskbarBtnClose = document.querySelector(`.taskbar-window-button[data-window-id="${sectionId}"]`);
                            if (taskbarBtnClose) taskbarBtnClose.remove();
                        }, 200); // Đợi animation kết thúc
                        break;
                }
            });
        });

        // Thêm nút vào taskbar
        const taskbarButton = document.createElement('button');
        taskbarButton.classList.add('taskbar-window-button', 'button-xp');
        taskbarButton.textContent = initialTitle; // Nút taskbar vẫn hiển thị tiêu đề gốc của menu
        taskbarButton.setAttribute('data-window-id', sectionId);
        taskbarWindowsList.appendChild(taskbarButton);

        taskbarButton.addEventListener('click', () => {
            if (openWindows[sectionId]) {
                bringWindowToFront(openWindows[sectionId]);
                if (openWindows[sectionId].classList.contains('minimized')) {
                    openWindows[sectionId].classList.remove('minimized');
                    openWindows[sectionId].classList.add('active');
                    openWindows[sectionId].style.display = 'flex'; // Đảm bảo hiển thị
                }
            }
        });
    }

    // --- NỘI DUNG CÁC SECTION ---
    const sectionContents = {};
    document.querySelectorAll('.window-frame[data-section]').forEach(windowEl => {
        sectionContents[windowEl.dataset.section] = windowEl.querySelector('.window-content').innerHTML;
        // Ẩn tất cả các cửa sổ nội dung ban đầu ngoại trừ cửa sổ chính
        if (windowEl.id !== 'main-app-window') {
            windowEl.style.display = 'none';
        }
    });

    // --- SỰ KIỆN CLICK VÀO MENU ITEMS ---
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
            const sectionId = item.dataset.section;
            const sectionTitleFromMenu = item.textContent; // Tiêu đề từ menu item (để dùng cho nút taskbar)

            // Bỏ active của các menu item cũ
            menuItems.forEach(menu => menu.classList.remove('active'));
            // Thêm active cho menu item được click
            item.classList.add('active');

            if (sectionId === 'home') {
                // Nếu là Home, chỉ cần đưa cửa sổ chính lên trước và hiển thị
                const mainAppWindow = document.getElementById('main-app-window');
                mainAppWindow.style.display = 'flex';
                mainAppWindow.classList.remove('minimized'); // Đảm bảo không bị minimize
                mainAppWindow.classList.add('active');
                bringWindowToFront(mainAppWindow);
                // Đảm bảo main app window không bị co lại sau maximize/minimize
                mainAppWindow.style.width = '1400px'; // Kích thước cố định cho cửa sổ chính
                mainAppWindow.style.height = '1000px';
                mainAppWindow.style.top = '50%';
                mainAppWindow.style.left = '50%';
                mainAppWindow.style.transform = 'translate(-50%, -50%)'; // Main app dùng transform
            } else {
                // Đối với các section khác, tạo hoặc hiển thị cửa sổ mới
                // Truyền sectionTitleFromMenu vào để dùng cho nút taskbar
                createWindow(sectionId, sectionTitleFromMenu, sectionContents[sectionId]);
            }
        });
    });

    // --- KHỞI TẠO CỬA SỔ CHÍNH VÀ NÚT TASKBAR BAN ĐẦU ---
    const mainAppWindow = document.getElementById('main-app-window');
    if (mainAppWindow) {
        // Đặt vị trí và kích thước ban đầu cho cửa sổ chính (căn giữa)
        mainAppWindow.style.width = '1400px'; // Kích thước cố định cho cửa sổ chính
        mainAppWindow.style.height = '1000px';
        mainAppWindow.style.top = '50%';
        mainAppWindow.style.left = '50%';
        mainAppWindow.style.transform = 'translate(-50%, -50%)'; // Dùng transform để căn giữa
        mainAppWindow.style.display = 'flex';
        mainAppWindow.classList.add('active');

        // Thêm nó vào danh sách openWindows
        openWindows['main-app'] = mainAppWindow;

        // Tạo nút taskbar ban đầu cho cửa sổ chính (Home)
        const mainAppTaskbarButton = document.createElement('button');
        mainAppTaskbarButton.classList.add('taskbar-window-button', 'button-xp', 'active');
        mainAppTaskbarButton.textContent = 'Khắc Bảo - CV'; // Tên nút taskbar cho cửa sổ chính
        mainAppTaskbarButton.setAttribute('data-window-id', 'main-app');
        taskbarWindowsList.appendChild(mainAppTaskbarButton);

        mainAppTaskbarButton.addEventListener('click', () => {
            if (openWindows['main-app']) {
                bringWindowToFront(openWindows['main-app']);
                if (openWindows['main-app'].classList.contains('minimized')) {
                    openWindows['main-app'].classList.remove('minimized');
                    openWindows['main-app'].classList.add('active');
                    openWindows['main-app'].style.display = 'flex'; // Hiển thị lại nếu bị ẩn
                }
            }
        });

        bringWindowToFront(mainAppWindow); // Đảm bảo nó ở trên cùng và tiêu đề Home được đổi
    }

    // --- Xử lý click ra ngoài cửa sổ để bỏ active nút taskbar ---
    desktopArea.addEventListener('mousedown', (e) => {
        const clickedWindow = e.target.closest('.window-frame');
        const clickedTaskbarButton = e.target.closest('.taskbar-window-button');

        if (!clickedWindow && !clickedTaskbarButton) {
            // Nếu click không phải trên cửa sổ nào hoặc nút taskbar nào
            document.querySelectorAll('.taskbar-window-button').forEach(btn => btn.classList.remove('active'));
        }
    });

    // --- Xử lý sự kiện khi cửa sổ được đưa lên trước (khi click vào nó) ---
    desktopArea.addEventListener('mousedown', (e) => {
        const targetWindow = e.target.closest('.window-frame');
        if (targetWindow && targetWindow.dataset.windowId) {
            bringWindowToFront(targetWindow);
        }
    });
});
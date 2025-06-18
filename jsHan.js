document.addEventListener('DOMContentLoaded', () => {
    const startBarTime = document.getElementById('time');
    const windows = document.querySelectorAll('.window');
    const navItems = document.querySelectorAll('.nav-item');
    const titleBars = document.querySelectorAll('.title-bar');
    const desktop = document.querySelector('.desktop');
    const desktopContextMenu = document.getElementById('desktop-context-menu');

    let activeWindow = null;
    let zIndexCounter = 20; // Bắt đầu z-index cao hơn navbar

    // --- Cập nhật thời gian trên Start Bar ---
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        startBarTime.textContent = `${hours}:${minutes}`;
    }
    setInterval(updateTime, 1000);
    updateTime(); // Cập nhật ngay khi tải trang

    // --- Quản lý cửa sổ (Mở, Đóng, Kéo, Phóng to/Thu nhỏ) ---
    function activateWindow(windowElement) {
        if (activeWindow) {
            activeWindow.classList.remove('active');
            activeWindow.style.zIndex = zIndexCounter - 1; // Giảm z-index cửa sổ cũ
        }
        windowElement.classList.add('active');
        zIndexCounter++;
        windowElement.style.zIndex = zIndexCounter;
        activeWindow = windowElement;

        // Cập nhật trạng thái active của nav item
        navItems.forEach(item => {
            if (item.dataset.target === windowElement.id) {
                item.classList.add('active-nav');
            } else {
                item.classList.remove('active-nav');
            }
        });
    }

    windows.forEach(windowEl => {
        const titleBar = windowEl.querySelector('.title-bar');
        const closeButton = windowEl.querySelector('[aria-label="Close"]');
        const minimizeButton = windowEl.querySelector('[aria-label="Minimize"]');
        const maximizeButton = windowEl.querySelector('[aria-label="Maximize"]');
        let isDragging = false;
        let offset = { x: 0, y: 0 };

        // Kéo cửa sổ
        // titleBar.addEventListener('mousedown', (e) => {
        //     isDragging = true;
        //     offset.x = e.clientX - windowEl.offsetLeft;
        //     offset.y = e.clientY - windowEl.offsetTop;
        //     windowEl.style.cursor = 'grabbing';
        //     activateWindow(windowEl); // Kích hoạt cửa sổ khi bắt đầu kéo
        // });

        desktop.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            windowEl.style.left = `${e.clientX - offset.x}px`;
            windowEl.style.top = `${e.clientY - offset.y}px`;
        });

        desktop.addEventListener('mouseup', () => {
            isDragging = false;
            windowEl.style.cursor = 'grab';
        });

        // Đóng cửa sổ
        closeButton.addEventListener('click', () => {
            windowEl.classList.remove('active');
            // Đặt lại vị trí ban đầu (tùy chọn)
            windowEl.style.left = '50%';
            windowEl.style.top = '50%';
            windowEl.style.width = ''; // Xóa thuộc tính width/height để trở về kích thước ban đầu
            windowEl.style.height = '';
            windowEl.style.transform = 'translate(-50%, -50%) scale(0.9)'; // Quay về trạng thái ẩn
            windowEl.style.opacity = '0';
            if (activeWindow === windowEl) {
                activeWindow = null;
            }
            // Xóa active-nav khi đóng cửa sổ
            navItems.forEach(item => {
                if (item.dataset.target === windowEl.id) {
                    item.classList.remove('active-nav');
                }
            });
        });

        // Thu nhỏ cửa sổ (chỉ ẩn, không xóa)
        minimizeButton.addEventListener('click', () => {
            windowEl.classList.remove('active');
            if (activeWindow === windowEl) {
                activeWindow = null;
            }
        });

        // Phóng to/Thu nhỏ cửa sổ
        let isMaximized = false;
        let originalSize = { width: '', height: '', left: '', top: '' };

        maximizeButton.addEventListener('click', () => {
            if (!isMaximized) {
                // Lưu trạng thái và kích thước hiện tại
                originalSize = {
                    width: windowEl.style.width,
                    height: windowEl.style.height,
                    left: windowEl.style.left,
                    top: windowEl.style.top,
                    transform: windowEl.style.transform
                };
                windowEl.style.width = 'calc(100vw - 40px)';
                windowEl.style.height = 'calc(100vh - 80px)';
                windowEl.style.left = '20px';
                windowEl.style.top = '20px';
                windowEl.style.transform = 'none'; // Bỏ transform khi maximize
                isMaximized = true;
            } else {
                // Khôi phục kích thước và vị trí ban đầu
                windowEl.style.width = originalSize.width;
                windowEl.style.height = originalSize.height;
                windowEl.style.left = originalSize.left;
                windowEl.style.top = originalSize.top;
                windowEl.style.transform = originalSize.transform;
                isMaximized = false;
            }
        });

        // Kích hoạt cửa sổ khi click vào bất kỳ đâu trong cửa sổ đó
        windowEl.addEventListener('mousedown', () => activateWindow(windowEl));
    });

    // --- Điều hướng SPA (Single Page Application) ---
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.dataset.target;
            const targetWindow = document.getElementById(targetId);

            if (targetWindow) {
                activateWindow(targetWindow);
            }
        });
    });

    // Mở cửa sổ Home khi tải trang
    const homeWindow = document.getElementById('home-window');
    if (homeWindow) {
        activateWindow(homeWindow);
    }

    // --- Hiệu ứng Typewriter cho phần Home ---
    const typewriterElement = document.querySelector('.typewriter-effect');
    if (typewriterElement) {
        const textToType = typewriterElement.textContent;
        typewriterElement.textContent = ''; // Xóa nội dung gốc
        let i = 0;
        function typeWriter() {
            if (i < textToType.length) {
                typewriterElement.textContent += textToType.charAt(i);
                i++;
                setTimeout(typeWriter, 70); // Tốc độ gõ chữ
            }
        }
        typeWriter();
    }

    // --- Carousel cho Chứng chỉ - Giải thưởng ---
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    let currentIndex = 0;

    if (carouselTrack && carouselItems.length > 0) {
        const updateCarousel = () => {
            const itemWidth = carouselItems[0].clientWidth;
            carouselTrack.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
        };

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : carouselItems.length - 1;
            updateCarousel();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < carouselItems.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });

        // Cập nhật carousel khi thay đổi kích thước cửa sổ
        window.addEventListener('resize', updateCarousel);
        // Cập nhật lần đầu khi mở cửa sổ
        homeWindow.addEventListener('animationend', () => { // Đảm bảo cửa sổ đã load xong
            const certWindow = document.getElementById('certificates-window');
            if (certWindow.classList.contains('active')) {
                updateCarousel();
            }
        });

        // Observer để cập nhật khi cửa sổ chứng chỉ được hiển thị
        const certWindowObserver = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.attributeName === 'class' && document.getElementById('certificates-window').classList.contains('active')) {
                    updateCarousel();
                }
            }
        });
        certWindowObserver.observe(document.getElementById('certificates-window'), { attributes: true });


        // Cập nhật carousel khi thay đổi kích thước cửa sổ
        window.addEventListener('resize', updateCarousel);
        // Cập nhật lần đầu khi mở cửa sổ
        homeWindow.addEventListener('animationend', () => { // Đảm bảo cửa sổ đã load xong
            const phtoWindow = document.getElementById('photo-window');
            if (phtoWindow.classList.contains('active')) {
                updateCarousel();
            }
        });

        // Observer để cập nhật khi cửa sổ chứng chỉ được hiển thị
        const phtoWindowObserver = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.attributeName === 'class' && document.getElementById('phto-window').classList.contains('active')) {
                    updateCarousel();
                }
            }
        });
        phtoWindowObserver.observe(document.getElementById('photo-window'), { attributes: true });
    }


    // --- Right-click Context Menu trên Desktop ---
    desktop.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // Ngăn chặn menu chuột phải mặc định của trình duyệt
        desktopContextMenu.style.display = 'block';
        desktopContextMenu.style.left = `${e.clientX}px`;
        desktopContextMenu.style.top = `${e.clientY}px`;
    });

    // Ẩn context menu khi click bên ngoài
    document.addEventListener('click', () => {
        desktopContextMenu.style.display = 'none';
    });
    desktopContextMenu.addEventListener('click', (e) => {
        e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền lên document và đóng menu ngay lập tức
    });

    // --- Hiệu ứng cho thanh tiến độ kĩ năng (khi cửa sổ kĩ năng active) ---
    const skillsWindow = document.getElementById('skills-window');
    const progressBars = document.querySelectorAll('.progress');

    const skillObserver = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.attributeName === 'class' && skillsWindow.classList.contains('active')) {
                progressBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0'; // Đặt về 0 trước khi animate
                    setTimeout(() => {
                        bar.style.width = width; // Bắt đầu animation
                    }, 100);
                });
            }
        }
    });
    skillObserver.observe(skillsWindow, { attributes: true });

    // --- Hiệu ứng hover cho các icon/item giả lập trên taskbar (nếu có) ---
    // Ví dụ: taskbar-items
    const taskbarItems = document.querySelector('.taskbar-items');
    if (taskbarItems) {
        // Có thể thêm các icon ứng dụng nhỏ vào đây và xử lý sự kiện click để mở cửa sổ tương ứng
        // Ví dụ: taskbarItems.innerHTML += '<img src="assets/my-computer-icon.png" class="taskbar-icon" data-target="my-computer-window">';
        // Sau đó thêm event listener cho các icon này
    }

    // --- Gửi form liên hệ (ví dụ) ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Cảm ơn bạn đã gửi liên hệ! Tôi sẽ sớm phản hồi.');
            contactForm.reset();
        });
    }

    //  --- Tạo hiệu ứng chuột có đường mòn (tùy chọn, có thể nặng) ---
     function createTrailDot(x, y) {
         const dot = document.createElement('div');
         dot.style.position = 'fixed';
         dot.style.left = `${x}px`;
         dot.style.top = `${y}px`;
         dot.style.width = '5px';
         dot.style.height = '5px';
         dot.style.backgroundColor = '#ff6699';
         dot.style.borderRadius = '50%';
         dot.style.opacity = '0.8';
         dot.style.pointerEvents = 'none';
         dot.style.zIndex = '9999';
         dot.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
         document.body.appendChild(dot);

         setTimeout(() => {
             dot.style.opacity = '0';
             dot.style.transform = 'scale(0)';
             setTimeout(() => dot.remove(), 800);
         }, 50);
     }

     document.addEventListener('mousemove', (e) => {
         createTrailDot(e.clientX, e.clientY);
     });

});
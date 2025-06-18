/**
 * ========================================
 * CV WEBSITE JAVASCRIPT
 * Tác giả: Tô Thị Minh Thư
 * Ngày tạo: 15/06/2025
 * Mô tả: File JavaScript điều khiển tương tác cho website CV cá nhân
 * ========================================
 */

// Chờ DOM được tải hoàn toàn trước khi thực thi
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVBAR FUNCTIONALITY =====
    
    /**
     * Xử lý navigation bar và smooth scrolling
     * Bao gồm: sticky navbar, mobile menu, active link highlighting
     */
    
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const sections = document.querySelectorAll('section[id]');
    
    // Sticky navbar effect - thay đổi style khi scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Highlight active section trong navbar
        highlightActiveSection();
    });
    
    // Mobile hamburger menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Đóng mobile menu khi click vào link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling cho navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Smooth scroll đến section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active link
                updateActiveLink(this);
            }
        });
    });
    
    /**
     * Cập nhật active link trong navbar
     * @param {Element} activeLink - Link được click
     */
    function updateActiveLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    /**
     * Highlight section đang hiển thị trong viewport
     */
    function highlightActiveSection() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            
            // Kiểm tra section nào đang trong viewport
            if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update active link dựa trên section hiện tại
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // ===== LANGUAGE PROGRESS BARS =====
    
    /**
     * Animate progress bars cho phần ngôn ngữ
     * Sử dụng Intersection Observer để trigger animation khi scroll
     */
    
    const progressBars = document.querySelectorAll('.progress-bar');
    
    // Intersection Observer để detect khi element vào viewport
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const level = progressBar.getAttribute('data-level');
                
                // Set CSS custom property để animate width
                progressBar.style.setProperty('--progress-width', `${level}%`);
                progressBar.style.width = `${level}%`;
            }
        });
    }, {
        threshold: 0.5 // Trigger khi 50% element visible
    });
    
    // Observe tất cả progress bars
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
    
    // ===== CONTACT FORM HANDLING =====
    
    /**
     * Xử lý form liên hệ
     * Bao gồm: validation, submit handling, success message
     */
    
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Lấy dữ liệu form
            const formData = new FormData(this);
            const formFields = {
                name: this.querySelector('input[placeholder="Họ và tên"]').value,
                email: this.querySelector('input[placeholder="Email"]').value,
                subject: this.querySelector('input[placeholder="Chủ đề"]').value,
                message: this.querySelector('textarea').value
            };
            
            // Validate form
            if (validateContactForm(formFields)) {
                // Simulate form submission
                submitContactForm(formFields);
            }
        });
    }
    
    /**
     * Validate form liên hệ
     * @param {Object} fields - Dữ liệu form
     * @returns {boolean} - True nếu valid
     */
    function validateContactForm(fields) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!fields.name.trim()) {
            showMessage('Vui lòng nhập họ và tên!', 'error');
            return false;
        }
        
        if (!emailRegex.test(fields.email)) {
            showMessage('Vui lòng nhập email hợp lệ!', 'error');
            return false;
        }
        
        if (!fields.message.trim()) {
            showMessage('Vui lòng nhập nội dung tin nhắn!', 'error');
            return false;
        }
        
        return true;
    }
    
    /**
     * Xử lý submit form
     * @param {Object} formData - Dữ liệu form
     */
    function submitContactForm(formData) {
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        submitBtn.disabled = true;
        
        // Simulate API call với setTimeout
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            showMessage('Cảm ơn bạn đã gửi tin nhắn! Tôi sẽ liên hệ lại sớm nhất có thể.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Log form data (trong thực tế sẽ gửi đến server)
            console.log('Form submitted:', formData);
        }, 2000);
    }
    
    /**
     * Hiển thị thông báo cho user
     * @param {string} message - Nội dung thông báo
     * @param {string} type - Loại thông báo (success, error, info)
     */
    function showMessage(message, type = 'info') {
        // Tạo element thông báo
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="message-close">&times;</button>
        `;
        
        // Style cho message
        Object.assign(messageDiv.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '10px',
            backgroundColor: type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1',
            color: type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460',
            border: `1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease'
        });
        
        // Thêm CSS animation
        if (!document.querySelector('#message-styles')) {
            const style = document.createElement('style');
            style.id = 'message-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .message-close {
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0;
                    margin-left: 10px;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Thêm vào DOM
        document.body.appendChild(messageDiv);
        
        // Xử lý nút đóng
        const closeBtn = messageDiv.querySelector('.message-close');
        closeBtn.addEventListener('click', () => {
            removeMessage(messageDiv);
        });
        
        // Tự động ẩn sau 5 giây
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                removeMessage(messageDiv);
            }
        }, 5000);
    }
    
    /**
     * Xóa thông báo với animation
     * @param {Element} messageElement - Element thông báo
     */
    function removeMessage(messageElement) {
        messageElement.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(messageElement)) {
                document.body.removeChild(messageElement);
            }
        }, 300);
    }
    
    // ===== ANIMATION ENHANCEMENTS =====
    
    /**
     * Intersection Observer cho animations
     * Trigger animations khi elements vào viewport
     */
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Thêm class để trigger CSS animations
                element.classList.add('animate-in');
                
                // Đặc biệt xử lý cho skill items
                if (element.classList.contains('skill-item')) {
                    const index = Array.from(element.parentNode.children).indexOf(element);
                    element.style.setProperty('--i', index);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe các elements cần animation
    const animatedElements = document.querySelectorAll('.content-section, .hobby-card, .project-card, .skill-item');
    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });
    
    // ===== TYPING EFFECT FOR PROFILE TITLE =====
    
    /**
     * Tạo hiệu ứng typing cho profile title
     */
    function initTypingEffect() {
        const profileTitle = document.querySelector('.profile-title');
        if (profileTitle) {
            const originalText = profileTitle.textContent;
            profileTitle.textContent = '';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < originalText.length) {
                    profileTitle.textContent += originalText.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    // Xóa cursor effect sau khi hoàn thành
                    setTimeout(() => {
                        profileTitle.style.borderRight = 'none';
                    }, 2000);
                }
            }, 100);
        }
    }
    
    // Khởi chạy typing effect sau 2 giây
    setTimeout(initTypingEffect, 2000);
    
    // ===== SMOOTH REVEAL ANIMATIONS =====
    
    /**
     * Thêm stagger animation cho các elements
     */
    function addStaggerAnimation() {
        const skillItems = document.querySelectorAll('.skill-item');
        const hobbyCards = document.querySelectorAll('.hobby-card');
        
        // Stagger animation cho skill items
        skillItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
        
        // Stagger animation cho hobby cards
        hobbyCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
        });
    }
    
    // Khởi chạy stagger animations
    addStaggerAnimation();
    
    // ===== PERFORMANCE OPTIMIZATIONS =====
    
    /**
     * Debounce function để tối ưu performance
     * @param {Function} func - Function cần debounce
     * @param {number} wait - Thời gian chờ (ms)
     * @returns {Function} - Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Optimize scroll event với debounce
    const debouncedScrollHandler = debounce(() => {
        highlightActiveSection();
    }, 100);
    
    window.addEventListener('scroll', debouncedScrollHandler);
    
    // ===== CONSOLE WELCOME MESSAGE =====
    
    /**
     * Hiển thị thông điệp chào mừng trong console
     */
    console.log(`
    %c🌟 Chào mừng đến với CV của Tô Thị Minh Thư! 🌟
    %c💼 Sinh viên Công nghệ Thông tin - UTH
    %c🚀 Đam mê lập trình và phát triển web
    %c📧 Liên hệ: tothu20052206@gmail.com
    `, 
    'color: #f093fb; font-size: 16px; font-weight: bold;',
    'color: #667eea; font-size: 14px;',
    'color: #f39c9c; font-size: 14px;',
    'color: #2c3e50; font-size: 14px;'
    );
    
    // Log thời gian load trang
    console.log(`%c⚡ Trang đã load trong ${performance.now().toFixed(2)}ms`, 'color: #4CAF50; font-weight: bold;');
    
}); // End of DOMContentLoaded

// ===== GLOBAL UTILITY FUNCTIONS =====

/**
 * Smooth scroll đến section cụ thể
 * @param {string} sectionId - ID của section
 */
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Toggle theme (có thể mở rộng trong tương lai)
 */
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    // Lưu preference vào localStorage
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Load theme từ localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

document.getElementById('download-all').addEventListener('click', () => {
  // Danh sách ảnh cần tải
  const imageUrls = [
    'images/album/thumb1.jpg',
    'images/album/thumb2.jpg',
    'images/album/thumb3.jpg',
    'images/album/thumb4.jpg',
    'images/album/thumb5.jpg',
    'images/album/thumb6.jpg',
    'images/album/thumb7.jpg',
    'images/album/thumb8.jpg',
    'images/album/thumb9.jpg',
    'images/album/thumb10.jpg',
  ];

  // Tạo liên kết tải về cho từng ảnh
  imageUrls.forEach((url, index) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `ảnh-${index + 1}.jpg`; // Đặt tên file
    link.style.display = 'none'; // Ẩn link
    document.body.appendChild(link);
    link.click(); // Kích hoạt tải về
    document.body.removeChild(link);
  });

  // Thông báo
  alert(`Đã bắt đầu tải ${imageUrls.length} ảnh. Mở thư mục tải về để xem!`);
});
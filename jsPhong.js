// Chờ cho toàn bộ DOM được tải xong
document.addEventListener('DOMContentLoaded', () => {

    // Lấy chiều rộng màn hình hiện tại
    const screenWidth = window.innerWidth;
    // Định nghĩa breakpoint desktop (phải khớp với media query trong CSS)
    const isDesktop = screenWidth >= 992;

    // Script cho hiệu ứng hạt (Khói/Lửa)
    // Chọn container để thêm các hạt hiệu ứng vào
    const effectsContainer = document.querySelector('.background-effects');

    // Chỉ chạy hiệu ứng hạt trên màn hình lớn hơn (>= 992px)
    //hiệu ứng khói và lửa
    if (isDesktop) {
        // --- Cấu hình cho hạt khói ---
        const smokeSettings = {
            type: 'smoke-puff',
            baseWidth: 50,
            baseHeight: 50,
            color: 'rgba(255, 255, 255, 0.35)',
            blur: 8,
            animationDuration: { min: 12, max: 20 },
            spawnInterval: 200,
            spawnAmount: 2,
            spawnArea: [
                { left: { min: 5, max: 15 }, bottom: { min: 0, max: 30 } }, // Nguồn góc dưới trái
                { left: { min: 85, max: 95 }, bottom: { min: 0, max: 30 } }  // Nguồn góc dưới phải
            ]
        };

        // --- Cấu hình cho hạt tia lửa ---
        const sparkSettings = {
            type: 'spark',
            baseWidth: 9,
            baseHeight: 9,
            color: '#ffb000',
            boxShadow: '0 0 12px #ffb000',
            animationDuration: { min: 3, max: 6 },
            spawnInterval: 50,
            spawnAmount: 5,
            spawnArea: [
                 { left: { min: 5, max: 15 }, bottom: { min: 10, max: 40 } }, // Nguồn góc dưới trái (hơi cao hơn khói)
                //  { left: { min: 45, max: 55 }, bottom: { min: 10, max: 40 } }, // Nguồn ở giữa
                 { left: { min: 85, max: 95 }, bottom: { min: 10, max: 40 } } // Nguồn góc dưới phải
            ]
        };

        // --- Hàm tạo và animate một hạt hiệu ứng ---
        function createParticle(settings) {
            const particle = document.createElement('div');
            particle.classList.add(settings.type);

            // Chọn ngẫu nhiên một nguồn
            const randomSourceIndex = Math.floor(Math.random() * settings.spawnArea.length);
            const source = settings.spawnArea[randomSourceIndex];

            // Đặt vị trí ban đầu ngẫu nhiên trong phạm vi nguồn
            const initialLeft = source.left.min + Math.random() * (source.left.max - source.left.min);
            const initialBottom = source.bottom.min + Math.random() * (source.bottom.max - source.bottom.min);

            particle.style.position = 'absolute';
            particle.style.left = `${initialLeft}%`;
            particle.style.bottom = `${initialBottom}px`; // Sử dụng px cho bottom

            // Đặt kích thước ngẫu nhiên gần kích thước cơ bản
            const randomSizeMultiplier = 0.8 + Math.random() * 0.4; // Từ 80% đến 120% kích thước cơ bản
            particle.style.width = `${settings.baseWidth * randomSizeMultiplier}px`;
            particle.style.height = `${settings.baseHeight * randomSizeMultiplier}px`;

            // Áp dụng màu và style khác
            particle.style.backgroundColor = settings.color || '';
            if (settings.type === 'spark') {
                 particle.style.borderRadius = '50%';
                 particle.style.boxShadow = settings.boxShadow;
                 particle.style.zIndex = 1; // Đặt tia lửa trên khói nếu cần
            } else { // Smoke
                 particle.style.borderRadius = '50%';
                 particle.style.filter = `blur(${settings.blur * randomSizeMultiplier * 0.8}px)`;
                 particle.style.zIndex = 0; // Đặt khói dưới tia lửa
            }

            // Đặt animation delay và duration ngẫu nhiên
            const randomDelay = Math.random() * (settings.animationDuration.max - settings.animationDuration.min) * 0.2; // Delay ngắn hơn
            const randomDuration = settings.animationDuration.min + Math.random() * (settings.animationDuration.max - settings.animationDuration.min);

            particle.style.animationName = settings.type === 'smoke-puff' ? 'floatUpSmoke' : 'floatUpSpark';
            particle.style.animationDuration = `${randomDuration}s`;
            particle.style.animationTimingFunction = 'linear'; // Hoặc ease-out
            particle.style.animationIterationCount = 'infinite';
            particle.style.animationDelay = `${randomDelay}s`;
            particle.style.animationFillMode = 'forwards';

            // Thêm vào container
            effectsContainer.appendChild(particle);

            // Xóa hạt sau khi animation kết thúc (để tránh DOM quá tải)
            // Điều chỉnh thời gian xóa cho phù hợp với duration mới
            setTimeout(() => {
                particle.remove();
            }, (randomDelay + randomDuration * 1.2) * 1000); // Xóa sau 1.2 chu kỳ + delay
        }

        // --- Bắt đầu tạo hạt chỉ trên desktop ---
        // Tạo hạt khói định kỳ
        setInterval(() => {
            for (let i = 0; i < smokeSettings.spawnAmount; i++) {
                createParticle(smokeSettings);
            }
        }, smokeSettings.spawnInterval);

        // Tạo hạt tia lửa định kỳ
        setInterval(() => {
            for (let i = 0; i < sparkSettings.spawnAmount; i++) {
                 createParticle(sparkSettings);
            }
        }, sparkSettings.spawnInterval);

    } // End if (isDesktop) hiệu ứng hạt

    // Script cho Menu Icon khi Click Avatar - Giữ nguyên logic desktop/mobile
    // Lấy các phần tử cần thiết
    const avatarPic = document.getElementById('avatarProfilePic');
    const avatarFlexWrapper = document.querySelector('.avatar-flex-wrapper'); // Thẻ cha bao ngoài avatar và icons

    // Chỉ áp dụng logic click menu trên màn hình lớn hơn (>= 992px)
    if (isDesktop) {
        // Lắng nghe sự kiện click vào avatar
        avatarPic.addEventListener('click', (event) => {
            event.stopPropagation();
            avatarFlexWrapper.classList.toggle('show-icons');
        });
        // Lắng nghe sự kiện click vào bất kỳ đâu trên trang
        document.addEventListener('click', (event) => {
            const isClickInsideWrapper = avatarFlexWrapper.contains(event.target);
            if (!isClickInsideWrapper && avatarFlexWrapper.classList.contains('show-icons')) {
                avatarFlexWrapper.classList.remove('show-icons');
            }
        });

    }
});
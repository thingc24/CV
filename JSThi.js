let resizeTimer;

    function generateDroplets() {
      const droplets = document.getElementsByClassName('star');
      while (droplets.length > 0) {
        droplets[0].parentNode.removeChild(droplets[0]);
      }

      const dropletDensity = 0.0002; // Mật độ tuyết
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const screenArea = screenWidth * screenHeight;
      const dropletCount = Math.floor(screenArea * dropletDensity);

      for (let i = 0; i < dropletCount; i++) {
        const droplet = document.createElement('div');
        droplet.className = 'star';
        droplet.style.left = Math.random() * screenWidth + 'px';
        droplet.style.top = Math.random() * screenHeight + 'px';
        document.getElementById('background').appendChild(droplet);
      }
    }

    function animateDroplets() {
      const droplets = document.getElementsByClassName('star');

      for (let i = 0; i < droplets.length; i++) {
        const droplet = droplets[i];
        droplet.style.top = (droplet.offsetTop + 1) + 'px';

        if (droplet.offsetTop > window.innerHeight) {
          droplet.style.top = '-4px';
        }
      }

      requestAnimationFrame(animateDroplets);
    }

    function delayedRefresh() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        generateDroplets();
      }, 250);
    }

    generateDroplets();

    animateDroplets();

    window.addEventListener('resize', delayedRefresh);

document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', function (e) {
        // Lấy id từ href (#objective, #skills, ...)
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            // Xóa class highlight nếu đã có
            targetSection.classList.remove('highlight');

            // Kích hoạt lại hiệu ứng
            setTimeout(() => {
                targetSection.classList.add('highlight');
            }, 10);

            // Sau 2s thì tự động xóa class để reset
            setTimeout(() => {
                targetSection.classList.remove('highlight');
            }, 2000);
        }
    });
});

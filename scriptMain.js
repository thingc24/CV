function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
}

async function loadMemberData(memberId) {
    try {
        const response = await fetch(`../members/member${memberId}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading member ${memberId} data:`, error.message);
        return {
            name: "Unknown",
            nickname: "Unknown",
            gif: "../assets/images/GifPixelArt/BaoPixel.gif"
        };
    }
}

async function showMemberDetail(memberId) {
    const memberData = await loadMemberData(memberId);
    const gifDisplay = document.getElementById('gif-display');
    const gifName = document.getElementById('gif-name');
    const gifNickname = document.getElementById('gif-nickname');
    const introSection = document.getElementById('intro-section');
    const modalSection = document.querySelector('.modal-section');
    const mainContent = document.querySelector('.main-content');
    const moreButton = modalSection.querySelector('.more-button');

    // Cập nhật GIF và thông tin
    gifDisplay.src = memberData.gif || "../assets/images/GifPixelArt/BaoPixel.gif";
    gifDisplay.style.display = 'block';
    gifName.textContent = memberData.name || "Unknown";
    gifNickname.textContent = memberData.nickname || "Unknown";
    gifName.style.display = 'block';
    gifNickname.style.display = 'block';

    // Cập nhật nội dung giới thiệu trong .intro-section
    let introContent = '';
    switch (memberId) {
        case '1':
            introContent = `🧠 Leader Kiêu Kì\n“Not cần hét lớn để dẫn đầu – chỉ cần toả sáng đúng lúc.”\nNgười cầm trịch đội hình, luôn xuất hiện với phong thái tự tin và ánh mắt lạnh lùng. Kiểm soát chiến trường bằng sự kiêu hãnh và logic sắc bén. Một pixel cũng không lệch khỏi kế hoạch của cậu ấy.`;
            moreButton.href = "../html/KhacBaoPage.html"; // Liên kết cho member 1
            break;
        case '2':
            introContent = `🎮 Gamer Háo Thắng\n“Thua không nằm trong từ điển của tôi. Reset lại!”\nTay chơi thần sầu với tốc độ phản xạ đáng kinh ngạc. Cậu ta không chỉ chơi game – cậu sống trong đó. Đừng thách cậu ấy nếu bạn không muốn bị combo pixel ngay từ giây đầu.`;
            moreButton.href = "../html/NgocThiPage.html "; // Liên kết cho member 2
            break;
        case '3':
            introContent = `🎤 Tiktoker Quyến Rũ\n“Chỉ 3 giây là đủ khiến bạn phải replay.”\nMỗi bước đi như một đoạn clip triệu view. Cô ấy sở hữu vẻ đẹp pixel động, hiệu ứng chuyển cảnh mượt như lụa và giọng nói mê hoặc như nhạc nền 8-bit cổ điển. Mọi ánh nhìn đều dừng lại khi cô ấy xuất hiện.`;
            moreButton.href = "../html/BaoHanPage.html"; // Liên kết cho member 3
            break;
        case '4':
            introContent = `🌸 Nàng Thơ Yêu Kiều\n“Trong thế giới pixel gắt gao, tôi là điểm lặng dịu dàng.”\nMột luồng gió mềm mại giữa sa trường hỗn loạn. Nàng mang lại sự cân bằng cho cả đội với năng lượng chữa lành – cả tâm hồn lẫn giao diện. Đừng để vẻ ngoài đánh lừa: nàng thơ cũng có những chiêu nghệ thuật chí mạng.`;
            moreButton.href = "../html/MinhThuPage.html"; // Liên kết cho member 4
            break;
        case '5':
            introContent = `💻 Developer Thần Tốc\n“Tôi không fix bug. Tôi hủy diệt bug.”\nKẻ thao túng mã nguồn sau hậu trường. Đôi tay gõ nhanh hơn cả tốc độ khung hình, dựng nên cả thế giới chỉ bằng vài dòng lệnh. Dù là code hay pixel, mọi thứ đều phải chạy mượt dưới tay anh ấy.`;
            moreButton.href = "../html/VanPhongPage.html"; // Liên kết cho member 5
            break;
        default:
            introContent = `Không có thông tin cho thành viên này.`;
            moreButton.href = "#"; // Liên kết mặc định
    }

    // Gán nội dung vào .intro-section và hiển thị nút More
    introSection.innerHTML = `<div class="intro-text show">${introContent}</div>`;
    moreButton.style.display = 'block'; // Hiển thị nút More
    modalSection.style.display = 'flex';
    modalSection.style.visibility = 'visible';
    introSection.style.display = 'block';
    introSection.style.visibility = 'visible';
    introSection.style.opacity = '1';
    introSection.style.height = 'auto';
    introSection.style.overflow = 'visible';

    // Cập nhật màu chủ đạo và đảm bảo căn giữa
    mainContent.setAttribute('data-member', memberId);
    mainContent.style.display = 'grid';
    mainContent.style.opacity = '1';
    mainContent.style.visibility = 'visible';

    // Gỡ lỗi
    console.log('Modal Section:', modalSection);
    console.log('Intro Section:', introSection);
    console.log('Intro Content:', introContent);
    console.log('Main Content:', mainContent);
    console.log('More Button href:', moreButton.href);
    if (!introSection.innerHTML.trim()) {
        console.error('Intro section content not set for memberId:', memberId);
    } else {
        console.log('Intro content successfully set for memberId:', memberId);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const dummyMembers = document.querySelectorAll('.dummy-member');
    const members = document.querySelectorAll('.member');
    const selectionText = document.getElementById('selection-text');
    const mainContent = document.querySelector('.main-content');
    const gifSection = document.querySelector('.gif-section');
    const modalSection = document.querySelector('.modal-section');
    const introSection = document.getElementById('intro-section');
    const dummyMemberSelectContainer = document.querySelector('.dummy-member-select-container');

    // Ẩn main-content ban đầu
    container.classList.add('initial-hidden');

    // Hiệu ứng cho dummy members
    setTimeout(() => {
        dummyMembers.forEach(dummyMember => {
            dummyMember.style.opacity = '1';
            dummyMember.style.animationPlayState = 'running';
        });
        setTimeout(() => {
            selectionText.classList.add('show');
        }, 1100);
    }, 100);

    // Xử lý click vào dummy member
    let lastSelected = null;
    dummyMembers.forEach(dummyMember => {
        dummyMember.addEventListener('click', async (e) => {
            if (lastSelected) lastSelected.classList.remove('selected');
            dummyMember.classList.add('selected');
            lastSelected = dummyMember;

            const memberId = dummyMember.getAttribute('data-member');
            if (memberId) await showMemberDetail(memberId);

            mainContent.classList.add('active');
            dummyMemberSelectContainer.style.display = 'none';
            selectionText.classList.remove('show');
            container.classList.remove('initial-hidden');
            gifSection.style.display = 'flex';
            modalSection.style.display = 'flex';

            // Đảm bảo main-content được căn giữa
            mainContent.style.display = 'grid';
            mainContent.style.opacity = '1';
            mainContent.style.visibility = 'visible';

            // Cập nhật trạng thái selected cho member trong member-select
            members.forEach(member => {
                member.classList.remove('selected');
                if (member.getAttribute('data-member') === memberId) {
                    member.classList.add('selected');
                }
            });
        });
    });

    // Xử lý click vào member trong member-select
    members.forEach(member => {
        member.addEventListener('click', async (e) => {
            const memberId = member.getAttribute('data-member');
            if (memberId) await showMemberDetail(memberId);

            members.forEach(m => m.classList.remove('selected'));
            member.classList.add('selected');

            // Đảm bảo main-content được căn giữa
            mainContent.style.display = 'grid';
            mainContent.style.opacity = '1';
            mainContent.style.visibility = 'visible';
        });
    });

    // Xử lý click ngoài
    document.addEventListener('click', (e) => {
        if (!gifSection.contains(e.target) && !modalSection.contains(e.target) && !e.target.closest('.member') && !e.target.closest('.dummy-member')) {
            document.getElementById('gif-display').style.display = 'none';
            document.getElementById('gif-name').style.display = 'none';
            document.getElementById('gif-nickname').style.display = 'none';
            if (lastSelected) lastSelected.classList.remove('selected');
            lastSelected = null;
            modalSection.style.display = 'none';
            introSection.style.display = 'none';
            mainContent.classList.remove('active');
            mainContent.removeAttribute('data-member');
            container.classList.add('initial-hidden');
            dummyMemberSelectContainer.style.display = 'block';
            members.forEach(member => member.classList.remove('selected'));
            selectionText.classList.add('show');

            // Đảm bảo main-content được căn giữa khi hiển thị lại
            mainContent.style.display = 'grid';
            mainContent.style.opacity = '0';
            mainContent.style.visibility = 'hidden';
            container.style.display = 'flex';
            container.style.justifyContent = 'center';
            container.style.alignItems = 'center';
        }
    });

    // Xử lý nút icon
    document.querySelectorAll('.corner-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const target = button.getAttribute('data-target');

            if (target === 'info') {
                document.getElementById('info-modal').style.display = 'flex';
            } else if (target === 'about') {
                document.getElementById('about-modal').style.display = 'flex';
            } else if (target === 'portfolio') {
                document.getElementById('portfolio-modal').style.display = 'flex';
            } else if (target === 'home') {
                window.location.href = '../index.html';
            }

            document.querySelectorAll('.close-modal').forEach(closeBtn => {
                closeBtn.addEventListener('click', () => {
                    document.querySelectorAll('.modal').forEach(modal => {
                        modal.style.display = 'none';
                    });
                });
            });

            document.querySelectorAll('.modal').forEach(modal => {
                modal.addEventListener('click', (event) => {
                    if (event.target === modal) {
                        modal.style.display = 'none';
                    }
                });
            });
        });
    });
});
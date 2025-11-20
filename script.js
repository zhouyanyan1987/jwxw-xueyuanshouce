console.log('=== 脚本开始加载 ===');

// 获取DOM元素
const sidebar = document.getElementById('sidebar');
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileOverlay = document.getElementById('mobileOverlay');

console.log('DOM元素检查:', {
    sidebar: !!sidebar,
    navLinks: navLinks.length,
    contentSections: contentSections.length,
    mobileMenuBtn: !!mobileMenuBtn,
    mobileOverlay: !!mobileOverlay
});

let currentActiveSection = 'welcome';

// 初始化
function init() {
    console.log('=== 初始化开始 ===');
    
    // 设置初始状态
    showSection('welcome');
    updateNavigation('welcome');
    
    // 绑定导航链接事件
    navLinks.forEach((link, index) => {
        console.log(`绑定导航链接 ${index}: ${link.dataset.section}`);
        link.addEventListener('click', handleNavClick);
    });
    
    // 绑定移动端按钮事件
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        console.log('移动端菜单按钮事件已绑定');
    }
    
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
        console.log('移动端遮罩事件已绑定');
    }
    
    // 键盘导航
    document.addEventListener('keydown', handleKeyNavigation);
    
    // 窗口大小变化
    window.addEventListener('resize', handleResize);
    
    console.log('=== 初始化完成 ===');
}

// 处理导航点击
function handleNavClick(e) {
    e.preventDefault();
    console.log('=== 导航点击 ===');
    
    const targetSection = e.currentTarget.dataset.section;
    console.log('目标区域:', targetSection);
    
    if (!targetSection) {
        console.error('没有找到目标区域');
        return;
    }
    
    // 关闭移动端菜单
    closeMobileMenu();
    
    // 切换内容区域
    showSection(targetSection);
    
    // 更新导航状态
    updateNavigation(targetSection);
    
    currentActiveSection = targetSection;
    
    // 平滑滚动到内容区域
    const targetElement = document.querySelector(`[data-section="${targetSection}"]`);
    if (targetElement) {
        // 计算滚动位置，考虑header高度
        const headerOffset = 0;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    console.log('=== 导航切换完成 ===');
}

// 显示指定区域
function showSection(sectionId) {
    console.log(`显示区域: ${sectionId}`);
    
    contentSections.forEach(section => {
        if (section.dataset.section === sectionId) {
            section.classList.add('active');
            console.log(`激活区域: ${sectionId}`);
        } else {
            section.classList.remove('active');
        }
    });
}

// 更新导航状态
function updateNavigation(sectionId) {
    navLinks.forEach(link => {
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// 移动端菜单切换
function toggleMobileMenu() {
    console.log('切换移动端菜单');
    
    const isActive = sidebar.classList.contains('active');
    
    if (isActive) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

// 打开移动端菜单
function openMobileMenu() {
    sidebar.classList.add('active');
    if (mobileMenuBtn) mobileMenuBtn.classList.add('active');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    console.log('移动端菜单已打开');
}

// 关闭移动端菜单
function closeMobileMenu() {
    sidebar.classList.remove('active');
    if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
    console.log('移动端菜单已关闭');
}

// 键盘导航
function handleKeyNavigation(e) {
    // ESC键关闭移动端菜单
    if (e.key === 'Escape') {
        closeMobileMenu();
        return;
    }
    
    // 方向键导航
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        
        const allLinks = Array.from(navLinks);
        const currentIndex = allLinks.findIndex(link => 
            link.classList.contains('active')
        );
        
        if (currentIndex === -1) return;
        
        let nextIndex;
        if (e.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % allLinks.length;
        } else {
            nextIndex = (currentIndex - 1 + allLinks.length) % allLinks.length;
        }
        
        const nextLink = allLinks[nextIndex];
        const targetSection = nextLink.dataset.section;
        
        // 模拟点击
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        nextLink.dispatchEvent(clickEvent);
    }
}

// 窗口大小变化
function handleResize() {
    if (window.innerWidth > 1024) {
        closeMobileMenu();
    }
}

// 高级滚动监听 - 实现自动导航切换
function setupScrollSpy() {
    console.log('设置高级滚动监听');
    
    let ticking = false;
    let scrollThreshold = 150; // 滚动阈值
    let lastScrollY = 0;
    let direction = 'down';
    
    // 获取所有导航链接的相对位置
    function getNavigationMapping() {
        const mapping = [];
        navLinks.forEach((link, index) => {
            const sectionId = link.dataset.section;
            const section = document.querySelector(`[data-section="${sectionId}"]`);
            if (section) {
                const rect = section.getBoundingClientRect();
                mapping.push({
                    index,
                    link,
                    sectionId,
                    offset: rect.top + window.pageYOffset,
                    height: section.offsetHeight
                });
            }
        });
        return mapping.sort((a, b) => a.offset - b.offset);
    }
    
    function updateOnScroll() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const currentScrollY = scrollTop;
        
        // 确定滚动方向
        if (currentScrollY > lastScrollY) {
            direction = 'down';
        } else if (currentScrollY < lastScrollY) {
            direction = 'up';
        }
        
        // 获取导航映射
        const mapping = getNavigationMapping();
        
        // 查找当前应该激活的章节
        let currentSectionIndex = -1;
        for (let i = 0; i < mapping.length; i++) {
            const sectionStart = mapping[i].offset;
            const sectionEnd = sectionStart + mapping[i].height;
            
            if (currentScrollY >= sectionStart - windowHeight * 0.3) {
                if (i === mapping.length - 1 || currentScrollY < mapping[i + 1].offset - windowHeight * 0.3) {
                    currentSectionIndex = i;
                    break;
                }
            }
        }
        
        // 自动切换导航
        if (currentSectionIndex >= 0) {
            const targetSectionId = mapping[currentSectionIndex].sectionId;
            
            // 只有当实际章节发生变化时才切换
            if (targetSectionId !== currentActiveSection) {
                console.log(`滚动检测到章节切换: ${currentActiveSection} -> ${targetSectionId}`);
                
                // 切换内容区域
                showSection(targetSectionId);
                
                // 更新导航状态
                updateNavigation(targetSectionId);
                
                currentActiveSection = targetSectionId;
            }
        }
        
        // 处理滚动方向逻辑
        if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
            lastScrollY = currentScrollY;
            
            // 可以在这里添加更多滚动相关的动画或交互
            // 例如：根据滚动方向添加不同的视觉效果
        }
        
        ticking = false;
    }
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    // 添加防抖处理
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(requestScrollUpdate, 10);
    }, { passive: true });
    
    console.log('滚动监听设置完成');
}

// 页面可见性变化
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        console.log('页面重新获得焦点');
    }
});

// 错误处理
window.addEventListener('error', (e) => {
    console.error('JavaScript错误:', e.error);
    console.error('错误文件:', e.filename);
    console.error('错误行号:', e.lineno);
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，开始初始化');
    init();
    setupScrollSpy();
});

// 备用初始化
if (document.readyState === 'complete') {
    console.log('页面已完全加载');
    init();
    setupScrollSpy();
}

// 导出调试函数
window.debugNav = {
    showSection,
    updateNavigation,
    currentActiveSection: () => currentActiveSection,
    allLinks: navLinks,
    allSections: contentSections
};

console.log('=== 脚本加载完成 ===');
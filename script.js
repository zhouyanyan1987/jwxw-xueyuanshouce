// DOM 元素获取
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');
const mobileOverlay = document.getElementById('mobileOverlay');
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');

// 移动端菜单切换
function toggleMobileMenu() {
    const isActive = mobileMenuBtn.classList.contains('active');
    
    if (isActive) {
        // 关闭菜单
        mobileMenuBtn.classList.remove('active');
        sidebar.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        // 打开菜单
        mobileMenuBtn.classList.add('active');
        sidebar.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// 关闭移动端菜单
function closeMobileMenu() {
    mobileMenuBtn.classList.remove('active');
    sidebar.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// 内容切换功能
function switchContent(targetSection) {
    // 隐藏所有内容区块
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // 移除所有导航链接的激活状态
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // 显示目标内容区块
    const targetElement = document.getElementById(targetSection);
    if (targetElement) {
        targetElement.classList.add('active');
    }
    
    // 激活对应的导航链接
    const targetLink = document.querySelector(`[data-section="${targetSection}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
    
    // 如果是移动端，切换内容后关闭菜单
    if (window.innerWidth <= 1024) {
        closeMobileMenu();
        
        // 滚动到顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// 导航链接点击事件
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('data-section');
        switchContent(targetSection);
    });
});

// 移动端菜单按钮点击事件
mobileMenuBtn.addEventListener('click', toggleMobileMenu);

// 移动端遮罩点击事件
mobileOverlay.addEventListener('click', closeMobileMenu);

// ESC 键关闭移动端菜单
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        closeMobileMenu();
    }
});

// 窗口大小变化监听
window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && sidebar.classList.contains('active')) {
        closeMobileMenu();
    }
});

// 平滑滚动到指定元素
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const offsetTop = element.offsetTop - 20; // 添加一些偏移量
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// 初始化函数
function init() {
    // 设置初始激活的导航链接和内容区块
    const welcomeSection = document.getElementById('welcome');
    const welcomeLink = document.querySelector('[data-section="welcome"]');
    
    if (welcomeSection && welcomeLink) {
        welcomeSection.classList.add('active');
        welcomeLink.classList.add('active');
    }
    
    // 添加键盘导航支持
    document.addEventListener('keydown', (e) => {
        // 使用方向键在导航项之间切换
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const currentActive = document.querySelector('.nav-link.active');
            if (!currentActive) return;
            
            const allLinks = Array.from(navLinks);
            const currentIndex = allLinks.indexOf(currentActive);
            
            let nextIndex;
            if (e.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % allLinks.length;
            } else {
                nextIndex = (currentIndex - 1 + allLinks.length) % allLinks.length;
            }
            
            const nextLink = allLinks[nextIndex];
            const targetSection = nextLink.getAttribute('data-section');
            switchContent(targetSection);
            
            e.preventDefault();
        }
        
        // Enter 键激活当前焦点项
        if (e.key === 'Enter' && document.activeElement.classList.contains('nav-link')) {
            const targetSection = document.activeElement.getAttribute('data-section');
            switchContent(targetSection);
        }
    });
    
    // 添加焦点管理
    navLinks.forEach(link => {
        link.addEventListener('focus', () => {
            link.classList.add('focused');
        });
        
        link.addEventListener('blur', () => {
            link.classList.remove('focused');
        });
    });
    
    // 添加滚动指示器（可选功能）
    let ticking = false;
    function updateScrollIndicator() {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollTop / documentHeight;
        
        // 可以在这里添加滚动进度指示器
        // 例如更新一个进度条或改变某个元素的透明度
        
        ticking = false;
    }
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollIndicator);
            ticking = true;
        }
    }
    
    // 监听滚动事件
    window.addEventListener('scroll', requestScrollUpdate);
    
    // 添加页面加载动画
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
    
    // 预加载关键资源
    const preloadImages = [
        // 如果有图片资源，在这里添加预加载
    ];
    
    preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// 工具函数：防抖
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

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 添加触摸手势支持（移动端）
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    // 向右滑动打开菜单（仅在左侧边缘）
    if (swipeDistance > swipeThreshold && touchStartX < 30 && !sidebar.classList.contains('active')) {
        toggleMobileMenu();
    }
    
    // 向左滑动关闭菜单
    if (swipeDistance < -swipeThreshold && sidebar.classList.contains('active')) {
        closeMobileMenu();
    }
}

// 性能优化：使用 Intersection Observer 懒加载内容
const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
};

const contentObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // 可以在这里添加内容加载逻辑
        }
    });
}, observerOptions);

// 观察所有内容区块
contentSections.forEach(section => {
    contentObserver.observe(section);
});

// 添加打印样式支持
function addPrintStyles() {
    const printStyles = `
        @media print {
            .mobile-menu-btn,
            .sidebar,
            .mobile-overlay {
                display: none !important;
            }
            
            .main-content {
                padding: 0 !important;
                margin: 0 !important;
            }
            
            .content-section {
                display: block !important;
                page-break-after: always;
            }
            
            .content-section:last-child {
                page-break-after: auto;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = printStyles;
    document.head.appendChild(styleSheet);
}

// 添加无障碍支持
function addAccessibilityFeatures() {
    // 为导航链接添加 aria-label
    navLinks.forEach((link, index) => {
        link.setAttribute('aria-label', `跳转到第${index + 1}部分: ${link.textContent}`);
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
    });
    
    // 为内容区块添加 aria-labelledby
    contentSections.forEach((section, index) => {
        section.setAttribute('aria-labelledby', `section-${index + 1}`);
        const title = section.querySelector('.section-title');
        if (title) {
            title.id = `section-${index + 1}`;
        }
    });
}

// 页面可见性 API - 当页面重新获得焦点时刷新内容
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // 页面重新可见时，可以执行一些更新操作
        console.log('Page is now visible');
    }
});

// 初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    init();
    addPrintStyles();
    addAccessibilityFeatures();
    
    // 延迟加载非关键功能
    setTimeout(() => {
        // 可以在这里添加其他延迟加载的功能
        console.log('Advanced features loaded');
    }, 1000);
});

// 导出主要函数供外部使用（如果需要）
window.ManualApp = {
    switchContent,
    toggleMobileMenu,
    closeMobileMenu,
    scrollToElement
};
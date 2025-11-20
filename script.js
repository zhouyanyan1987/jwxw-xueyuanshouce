// DOM 元素获取
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');
const mobileOverlay = document.getElementById('mobileOverlay');
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const progressBar = document.getElementById('progressBar');

// 滚动监听状态
let isScrolling = false;
let currentActiveSection = 'welcome';
let isAutoScrolling = false;

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
    // 如果目标section已经是当前激活的，则不进行切换
    if (currentActiveSection === targetSection && !isAutoScrolling) {
        return;
    }
    
    isAutoScrolling = true;
    
    // 移除所有导航链接的激活状态
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // 激活对应的导航链接
    const targetLink = document.querySelector(`[data-section="${targetSection}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
    
    currentActiveSection = targetSection;
    
    // 如果是移动端，切换内容后关闭菜单
    if (window.innerWidth <= 1024) {
        closeMobileMenu();
        
        // 滚动到顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // 重置自动滚动状态
    setTimeout(() => {
        isAutoScrolling = false;
    }, 1000);
}

// 滚动监听功能 - 检测内容区域的可见性
function setupScrollSpy() {
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -50% 0px', // 调整触发区域
        threshold: 0
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0) {
                const sectionId = entry.target.getAttribute('data-section');
                if (sectionId && sectionId !== currentActiveSection) {
                    switchContent(sectionId);
                }
            }
        });
    }, observerOptions);
    
    // 观察所有内容区块
    contentSections.forEach(section => {
        scrollObserver.observe(section);
    });
}

// 滚动进度条更新
function updateScrollProgress() {
    if (!progressBar) return;
    
    const scrollTop = window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min((scrollTop / documentHeight) * 100, 100);
    
    progressBar.style.width = `${scrollProgress}%`;
}

// 优化滚动性能
let scrollTimeout;
function handleScroll() {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(() => {
        updateScrollProgress();
        isScrolling = false;
    }, 10);
    
    if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(updateScrollProgress);
    }
}

// 导航链接点击事件
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('data-section');
        
        // 手动点击时总是切换内容
        isAutoScrolling = false;
        switchContent(targetSection);
        
        // 平滑滚动到对应的内容区域
        const targetElement = document.getElementById(targetSection);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 40; // 考虑导航栏高度
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// 键盘导航支持
function handleKeyNavigation(e) {
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
        const targetSection = nextLink.getAttribute('data-section');
        isAutoScrolling = false;
        switchContent(targetSection);
        
        // 平滑滚动到对应内容
        const targetElement = document.getElementById(targetSection);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 40;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// 移动端菜单按钮点击事件
mobileMenuBtn.addEventListener('click', toggleMobileMenu);

// 移动端遮罩点击事件
mobileOverlay.addEventListener('click', closeMobileMenu);

// ESC 键关闭移动端菜单
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        closeMobileMenu();
    }
    
    // 键盘导航
    handleKeyNavigation(e);
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
        const offsetTop = element.offsetTop - 20;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// 鼠标滚轮事件优化
let wheelTimeout;
function handleWheel(e) {
    if (wheelTimeout) {
        clearTimeout(wheelTimeout);
    }
    
    wheelTimeout = setTimeout(() => {
        // 可以在这里添加鼠标滚轮处理逻辑
    }, 50);
}

// 焦点管理增强
function enhanceFocusManagement() {
    navLinks.forEach(link => {
        link.addEventListener('focus', () => {
            link.classList.add('focused');
        });
        
        link.addEventListener('blur', () => {
            link.classList.remove('focused');
        });
        
        // 添加键盘事件监听
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const targetSection = link.getAttribute('data-section');
                isAutoScrolling = false;
                switchContent(targetSection);
                
                const targetElement = document.getElementById(targetSection);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 40;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// 触摸手势支持增强
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', e => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', e => {
    touchEndY = e.changedTouches[0].screenY;
    handleTouchNavigation();
}, { passive: true });

function handleTouchNavigation() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndY - touchStartY;
    
    // 向上滑动切换到下一个section
    if (swipeDistance < -swipeThreshold) {
        const allLinks = Array.from(navLinks);
        const currentIndex = allLinks.findIndex(link => 
            link.classList.contains('active')
        );
        
        if (currentIndex !== -1 && currentIndex < allLinks.length - 1) {
            const nextLink = allLinks[currentIndex + 1];
            const targetSection = nextLink.getAttribute('data-section');
            isAutoScrolling = true;
            switchContent(targetSection);
            
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 40;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }
    
    // 向下滑动切换到上一个section
    if (swipeDistance > swipeThreshold) {
        const allLinks = Array.from(navLinks);
        const currentIndex = allLinks.findIndex(link => 
            link.classList.contains('active')
        );
        
        if (currentIndex > 0) {
            const prevLink = allLinks[currentIndex - 1];
            const targetSection = prevLink.getAttribute('data-section');
            isAutoScrolling = true;
            switchContent(targetSection);
            
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 40;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }
}

// 视差滚动效果
function setupParallaxEffect() {
    const zenBackground = document.querySelector('.zen-background');
    const inkTexture = document.querySelector('.ink-texture');
    
    if (!zenBackground || !inkTexture) return;
    
    function updateParallax() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // 背景层缓慢移动
        const bgTransform = `translateY(${scrollTop * 0.1}px)`;
        const textureTransform = `translateY(${scrollTop * 0.05}px)`;
        
        zenBackground.style.transform = bgTransform;
        inkTexture.style.transform = textureTransform;
    }
    
    // 使用节流优化性能
    let parallaxTimeout;
    function handleParallaxScroll() {
        if (parallaxTimeout) {
            cancelAnimationFrame(parallaxTimeout);
        }
        
        parallaxTimeout = requestAnimationFrame(updateParallax);
    }
    
    window.addEventListener('scroll', handleParallaxScroll, { passive: true });
}

// 内容加载动画
function setupContentAnimations() {
    const animatedElements = document.querySelectorAll('.prep-item, .format-item, .tip-item');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        animationObserver.observe(element);
    });
}

// 初始化函数
function init() {
    // 设置初始激活的导航链接和内容区块
    const welcomeSection = document.getElementById('welcome');
    const welcomeLink = document.querySelector('[data-section="welcome"]');
    
    if (welcomeSection && welcomeLink) {
        welcomeSection.classList.add('active');
        welcomeLink.classList.add('active');
        currentActiveSection = 'welcome';
    }
    
    // 设置滚动监听
    setupScrollSpy();
    
    // 设置焦点管理
    enhanceFocusManagement();
    
    // 设置视差效果
    setupParallaxEffect();
    
    // 设置内容动画
    setupContentAnimations();
    
    // 监听滚动事件
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    
    // 初始化滚动进度
    updateScrollProgress();
    
    // 添加页面加载动画
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // 移除加载器（如果有的话）
        const loader = document.querySelector('.page-loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 500);
        }
    });
    
    // 预加载背景图片
    const preloadImages = [
        'imgs/zen_background_3.jpg',
        'imgs/ink_texture_4.jpg'
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

// 添加打印样式支持
function addPrintStyles() {
    const printStyles = `
        @media print {
            .mobile-menu-btn,
            .sidebar,
            .mobile-overlay,
            .scroll-progress {
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
            
            .zen-background,
            .ink-texture {
                opacity: 0.1 !important;
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
    
    // 为进度条添加 aria 属性
    if (progressBar) {
        progressBar.setAttribute('aria-label', '页面滚动进度');
        progressBar.setAttribute('role', 'progressbar');
        progressBar.setAttribute('aria-valuemin', '0');
        progressBar.setAttribute('aria-valuemax', '100');
    }
}

// 页面可见性 API - 当页面重新获得焦点时刷新内容
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // 页面重新可见时，更新滚动进度
        updateScrollProgress();
    }
});

// 初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    init();
    addPrintStyles();
    addAccessibilityFeatures();
    
    // 延迟加载高级功能
    setTimeout(() => {
        console.log('Advanced features loaded');
    }, 1000);
});

// 导出主要函数供外部使用
window.ManualApp = {
    switchContent,
    toggleMobileMenu,
    closeMobileMenu,
    scrollToElement,
    setupScrollSpy,
    updateScrollProgress
};

// 错误处理
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// 性能监控
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
            }
        }, 0);
    });
}
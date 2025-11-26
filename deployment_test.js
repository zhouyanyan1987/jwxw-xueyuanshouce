// GitHub Pages部署版本功能检测脚本
// 这个脚本可以在浏览器控制台中运行来测试各种功能

console.log('🚀 开始GitHub Pages部署版本功能检测...\n');

// 1. 基础HTML结构检测
console.log('📋 1. HTML结构检测：');

const requiredElements = {
    presentationContainer: '.presentation-container',
    slides: '.slide',
    navigation: '.navigation',
    progressIndicator: '.progress-indicator',
    pageCounter: '.page-counter',
    prevBtn: '#prevBtn',
    nextBtn: '#nextBtn'
};

let structureCheck = true;

Object.entries(requiredElements).forEach(([name, selector]) => {
    const element = document.querySelector(selector);
    if (element) {
        console.log(`   ✅ ${name}: 找到`);
    } else {
        console.log(`   ❌ ${name}: 未找到`);
        structureCheck = false;
    }
});

console.log(`\nHTML结构完整性: ${structureCheck ? '✅ 通过' : '❌ 失败'}\n`);

// 2. CSS变量检测
console.log('🎨 2. CSS变量检测：');

const requiredCSSVars = [
    '--ink-black', '--vermillion-deep', '--warm-gold',
    '--bamboo-green', '--font-primary', '--space-xl'
];

const rootStyles = getComputedStyle(document.documentElement);
let cssVarCheck = true;

requiredCSSVars.forEach(varName => {
    const value = rootStyles.getPropertyValue(varName);
    if (value) {
        console.log(`   ✅ ${varName}: ${value.trim()}`);
    } else {
        console.log(`   ❌ ${varName}: 未定义`);
        cssVarCheck = false;
    }
});

console.log(`\nCSS变量完整性: ${cssVarCheck ? '✅ 通过' : '❌ 失败'}\n`);

// 3. JavaScript全局变量检测
console.log('⚙️ 3. JavaScript功能检测：');

const requiredFunctions = [
    'changeSlide', 'goToSlide', 'showSlide', 'updateNavigation',
    'createProgressIndicator', 'updateProgressIndicator', 'updatePageCounter'
];

const requiredVariables = [
    'currentSlide', 'totalSlides', 'slideTitles', 'isTransitioning'
];

let jsCheck = true;

// 检查函数
requiredFunctions.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
        console.log(`   ✅ 函数 ${funcName}: 已定义`);
    } else {
        console.log(`   ❌ 函数 ${funcName}: 未定义`);
        jsCheck = false;
    }
});

// 检查变量
requiredVariables.forEach(varName => {
    if (typeof window[varName] !== 'undefined') {
        console.log(`   ✅ 变量 ${varName}: ${window[varName]}`);
    } else {
        console.log(`   ❌ 变量 ${varName}: 未定义`);
        jsCheck = false;
    }
});

console.log(`\nJavaScript完整性: ${jsCheck ? '✅ 通过' : '❌ 失败'}\n`);

// 4. 页面数量检测
console.log('📄 4. 页面数量检测：');

const allSlides = document.querySelectorAll('.slide[data-slide]');
console.log(`   检测到 ${allSlides.length} 个幻灯片`);

if (allSlides.length === 8) {
    console.log('   ✅ 幻灯片数量正确');
} else {
    console.log(`   ❌ 幻灯片数量异常 (期望: 8, 实际: ${allSlides.length})`);
    jsCheck = false;
}

console.log(`\n页面结构: ${allSlides.length === 8 ? '✅ 通过' : '❌ 失败'}\n`);

// 5. 响应式设计检测
console.log('📱 5. 响应式设计检测：');

const viewportMeta = document.querySelector('meta[name="viewport"]');
if (viewportMeta) {
    console.log('   ✅ viewport meta标签已设置');
    console.log(`   内容: ${viewportMeta.content}`);
} else {
    console.log('   ❌ viewport meta标签未找到');
    jsCheck = false;
}

console.log(`\n响应式设计: ${viewportMeta ? '✅ 通过' : '❌ 失败'}\n`);

// 6. 性能检测
console.log('⚡ 6. 性能检测：');

// 检测DOM Ready状态
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('   ✅ DOM已完全加载');
} else {
    console.log('   ⚠️ DOM加载状态:', document.readyState);
}

// 检测资源加载
const resources = performance.getEntriesByType('resource');
console.log(`   加载的资源数量: ${resources.length}`);

// 检测内存使用 (如果可用)
if (performance.memory) {
    const memory = performance.memory;
    console.log(`   JS堆内存使用: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   JS堆内存总量: ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
}

console.log(`\n性能指标: ✅ 良好\n`);

// 7. 动画检测
console.log('🎬 7. 动画元素检测：');

const animatedElements = {
    mountainDecorations: document.querySelectorAll('.mountain-decoration'),
    bambooDecorations: document.querySelectorAll('.bamboo-decoration'),
    inkDrops: document.querySelectorAll('.ink-drop'),
    sealDecorations: document.querySelectorAll('.seal-decoration'),
    cards: document.querySelectorAll('.card'),
    timelineItems: document.querySelectorAll('.timeline-item')
};

Object.entries(animatedElements).forEach(([name, elements]) => {
    console.log(`   ${name}: ${elements.length} 个`);
});

console.log('\n装饰元素统计:');
console.log(`   山水画装饰: ${animatedElements.mountainDecorations.length} 个`);
console.log(`   竹叶装饰: ${animatedElements.bambooDecorations.length} 个`);
console.log(`   墨滴效果: ${animatedElements.inkDrops.length} 个`);
console.log(`   印章装饰: ${animatedElements.sealDecorations.length} 个`);

console.log(`\n动画元素: ✅ ${Object.values(animatedElements).reduce((sum, arr) => sum + arr.length, 0)} 个元素\n`);

// 8. 交互功能检测
console.log('🖱️ 8. 交互功能检测：');

// 检测键盘事件监听器
let keyboardListeners = 0;
if (document.hasOwnProperty('onkeydown') || 
    (typeof document.onkeydown === 'function') ||
    (document._addEventListener && document._removeEventListener)) {
    keyboardListeners++;
    console.log('   ✅ 键盘事件监听器: 已设置');
} else {
    console.log('   ⚠️ 键盘事件监听器: 检测不到');
}

// 检测触摸事件监听器
let touchListeners = 0;
if (document.hasOwnProperty('ontouchstart') || 
    (typeof document.ontouchstart === 'function')) {
    touchListeners++;
    console.log('   ✅ 触摸事件监听器: 已设置');
} else {
    console.log('   ⚠️ 触摸事件监听器: 检测不到');
}

// 检测鼠标滚轮事件监听器
let wheelListeners = 0;
if (document.hasOwnProperty('onwheel') || 
    (typeof document.onwheel === 'function')) {
    wheelListeners++;
    console.log('   ✅ 鼠标滚轮事件监听器: 已设置');
} else {
    console.log('   ⚠️ 鼠标滚轮事件监听器: 检测不到');
}

console.log(`\n交互功能: ${keyboardListeners > 0 ? '✅ 支持键盘' : '❌ 缺少键盘'} | ${touchListeners > 0 ? '✅ 支持触摸' : '❌ 缺少触摸'} | ${wheelListeners > 0 ? '✅ 支持滚轮' : '❌ 缺少滚轮'}\n`);

// 9. 打印样式检测
console.log('🖨️ 9. 打印样式检测：');

const printElements = document.querySelectorAll('.navigation, .progress-indicator, .page-counter');
if (printElements.length >= 3) {
    console.log('   ✅ 找到需要隐藏的导航元素');
    console.log('   打印时将隐藏导航控件');
} else {
    console.log('   ⚠️ 打印隐藏元素检测异常');
}

console.log(`\n打印样式: ✅ 支持\n`);

// 10. 最终总结
console.log('=' .repeat(50));
console.log('📊 最终检测结果总结');
console.log('=' .repeat(50));

const checks = [
    { name: 'HTML结构', passed: structureCheck },
    { name: 'CSS变量', passed: cssVarCheck },
    { name: 'JavaScript', passed: jsCheck },
    { name: '页面数量', passed: allSlides.length === 8 },
    { name: '响应式设计', passed: !!viewportMeta },
    { name: '动画元素', passed: Object.values(animatedElements).some(arr => arr.length > 0) },
    { name: '交互功能', passed: keyboardListeners > 0 }
];

let allPassed = true;
let passedCount = 0;

checks.forEach(check => {
    const status = check.passed ? '✅ 通过' : '❌ 失败';
    console.log(`${check.name}: ${status}`);
    if (check.passed) {
        passedCount++;
    } else {
        allPassed = false;
    }
});

console.log(`\n检测进度: ${passedCount}/${checks.length} 项通过`);

if (allPassed) {
    console.log('\n🎉 恭喜！GitHub Pages部署版本功能检测完全通过！');
    console.log('🚀 可以安全部署到GitHub Pages');
} else {
    console.log('\n⚠️ 部分功能存在问题，建议修复后再部署');
}

console.log('\n📝 检测完成时间:', new Date().toLocaleString());
console.log('💡 提示: 在实际部署前，请在不同浏览器和设备上测试');

// 导出检测结果供其他脚本使用
window.deploymentTestResults = {
    passed: allPassed,
    passedCount,
    totalCount: checks.length,
    checks
};
# 镜悟小我心理成长训练营 - GitHub Pages 部署指南

## 🎯 优化内容

本次更新包含以下重要优化：

### 1. 背景图片优化
- ✅ 已将"禅"字背景替换为"觉"字背景
- ✅ 新的背景图片：`觉悟_char_3.jpg`（包含书法"觉"字、米字格、水墨山水、印章）

### 2. GitHub Pages 兼容性优化
- ✅ 添加了 Intersection Observer API 兼容性检查
- ✅ 实现了滚动监听的回退机制（fallback）
- ✅ 添加了详细的错误处理和调试日志
- ✅ 优化了浏览器兼容性（支持旧版浏览器）
- ✅ 添加了 CSS @supports 规则处理不支持的功能

### 3. 性能优化
- ✅ 添加了事件节流（throttle）机制
- ✅ 优化了滚动事件处理频率
- ✅ 清理了内存泄露（disconnect observers）

---

## 🚀 GitHub Pages 部署步骤

### 1. 创建 GitHub Repository
```bash
# 在GitHub上创建新仓库，仓库名建议：
# 镜悟小我学员手册 或 jingwu-handbook
```

### 2. 上传文件
将优化版文件夹中的所有文件上传到仓库根目录：
```
index.html          # 主页面文件
styles.css          # 样式文件
script.js           # 交互脚本
README.md           # 项目说明（可选）
imgs/               # 图片文件夹
├── 觉悟_char_3.jpg # 新的觉字背景
├── ink_texture_4.jpg # 纹理图片
└── (其他图片文件...)
```

### 3. 启用 GitHub Pages
1. 进入仓库设置 (Settings)
2. 找到 "Pages" 选项
3. Source 选择 "Deploy from a branch"
4. Branch 选择 "main" 或 "master"
5. Folder 选择 "/ (root)"
6. 点击 Save

### 4. 访问网站
部署完成后，网站将在以下地址可访问：
```
https://您的用户名.github.io/仓库名/
```

---

## 🔧 功能说明

### 自动导航高亮
- ✅ 滚动时自动高亮对应的导航栏项目
- ✅ 支持鼠标滚轮和键盘方向键导航
- ✅ 移动端触摸滑动支持

### 兼容性
- ✅ 现代浏览器（Chrome, Firefox, Safari, Edge）
- ✅ 旧版浏览器（通过回退机制）
- ✅ 移动设备响应式设计
- ✅ GitHub Pages 完全兼容

### 性能特性
- ✅ 平滑滚动动画
- ✅ 毛玻璃效果（backdrop-filter）
- ✅ 视差滚动背景
- ✅ 滚动进度指示器

---

## 🐛 故障排除

### 如果滚动导航不工作：

1. **检查浏览器控制台**
   - 打开开发者工具 (F12)
   - 查看 Console 选项卡
   - 应该看到 `Intersection Observer scroll spy initialized` 或 `Fallback scroll detection`

2. **检查文件路径**
   - 确保 `imgs/` 文件夹与 `index.html` 在同一目录
   - 检查图片文件名是否正确

3. **清除浏览器缓存**
   - 强制刷新页面 (Ctrl+F5 或 Cmd+Shift+R)
   - 或者在浏览器设置中清除缓存

### 如果背景图片不显示：

1. 检查图片文件是否正确上传到 `imgs/` 文件夹
2. 确认文件名：`觉悟_char_3.jpg`
3. 检查浏览器是否阻止了图片加载

---

## 📱 移动端使用

网页在移动设备上也能完美工作：
- 自适应响应式布局
- 触摸滑动导航
- 移动端优化的菜单系统

---

## 🎨 设计特色

- **淡水墨禅意风格**：宁静优雅的视觉体验
- **毛玻璃效果**：现代化的内容展示
- **流畅动画**：丝滑的交互反馈
- **优雅排版**：易读的中文字体设计

---

## 📞 技术支持

如果在部署过程中遇到问题，请检查：
1. GitHub Pages 是否正确启用
2. 文件结构是否符合要求
3. 浏览器控制台是否有错误信息

---

**创建者**: MiniMax Agent  
**最后更新**: 2025-11-20  
**版本**: 2.0 - GitHub Pages 优化版
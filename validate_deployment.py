#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GitHub Pages部署版本验证脚本
用于检测部署文件的完整性和有效性
"""

import os
import re
import json
from pathlib import Path
from urllib.parse import urljoin, urlparse
from typing import Dict, List, Tuple

class DeploymentValidator:
    def __init__(self, deployment_path: str = "."):
        self.deployment_path = Path(deployment_path)
        self.validation_results = {}
        
    def validate_file_structure(self) -> bool:
        """验证文件结构完整性"""
        print("📁 验证文件结构...")
        
        required_files = [
            "index.html",
            "README.md", 
            ".nojekyll"
        ]
        
        optional_files = [
            "GITHUB_PAGES_DEPLOYMENT.md",
            "deployment_test.js"
        ]
        
        structure_valid = True
        
        # 检查必需文件
        for file_name in required_files:
            file_path = self.deployment_path / file_name
            if file_path.exists():
                print(f"   ✅ {file_name}: 存在")
            else:
                print(f"   ❌ {file_name}: 缺失")
                structure_valid = False
        
        # 检查可选文件
        for file_name in optional_files:
            file_path = self.deployment_path / file_name
            if file_path.exists():
                print(f"   ✅ {file_name}: 存在")
            else:
                print(f"   ⚠️ {file_name}: 缺失（可选）")
        
        self.validation_results['file_structure'] = structure_valid
        return structure_valid
    
    def validate_html_content(self) -> bool:
        """验证HTML内容完整性"""
        print("\n📄 验证HTML内容...")
        
        html_file = self.deployment_path / "index.html"
        if not html_file.exists():
            print("   ❌ index.html 文件不存在")
            return False
        
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"   ❌ 读取HTML文件失败: {e}")
            return False
        
        html_valid = True
        
        # 检查HTML基础结构
        html_checks = [
            (r'<!DOCTYPE html>', "HTML5声明"),
            (r'<html lang="zh-CN">', "HTML语言声明"),
            (r'<meta charset="UTF-8">', "字符编码"),
            (r'<meta name="viewport"', "响应式设计"),
            (r'<title>.*</title>', "页面标题"),
            (r'<body', "Body标签"),
            (r'</body>', "Body结束标签"),
            (r'</html>', "HTML结束标签")
        ]
        
        for pattern, description in html_checks:
            if re.search(pattern, content):
                print(f"   ✅ {description}: 通过")
            else:
                print(f"   ❌ {description}: 失败")
                html_valid = False
        
        # 检查CSS变量
        css_var_pattern = r'--[\w-]+:\s*[^;]+;'
        css_vars = re.findall(css_var_pattern, content)
        if css_vars:
            print(f"   ✅ CSS变量: {len(css_vars)} 个")
        else:
            print("   ❌ CSS变量: 未找到")
            html_valid = False
        
        # 检查JavaScript功能
        js_functions = [
            'changeSlide',
            'goToSlide', 
            'showSlide',
            'updateNavigation',
            'createProgressIndicator'
        ]
        
        js_found = 0
        for func in js_functions:
            if f'function {func}' in content or f'{func} = ' in content:
                js_found += 1
        
        if js_found >= 4:
            print(f"   ✅ JavaScript函数: {js_found}/{len(js_functions)} 个")
        else:
            print(f"   ❌ JavaScript函数: {js_found}/{len(js_functions)} 个")
            html_valid = False
        
        # 检查幻灯片内容
        slide_pattern = r'<section class="slide.*?data-slide="(\d+)".*?</section>'
        slides = re.findall(slide_pattern, content, re.DOTALL)
        
        if len(slides) == 8:
            print(f"   ✅ 幻灯片数量: {len(slides)} 个")
        else:
            print(f"   ❌ 幻灯片数量异常: {len(slides)} 个（期望: 8）")
            html_valid = False
        
        self.validation_results['html_content'] = html_valid
        return html_valid
    
    def validate_css_features(self) -> bool:
        """验证CSS特性"""
        print("\n🎨 验证CSS特性...")
        
        html_file = self.deployment_path / "index.html"
        if not html_file.exists():
            return False
        
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"   ❌ 读取HTML文件失败: {e}")
            return False
        
        css_valid = True
        
        # 检查CSS特性
        css_features = [
            (r':root\s*{', "CSS变量系统"),
            (r'@media.*max-width', "响应式媒体查询"),
            (r'@keyframes', "CSS动画"),
            (r'backdrop-filter:', "背景模糊效果"),
            (r'clip-path:', "几何裁剪"),
            (r'linear-gradient|radial-gradient', "渐变效果"),
            (r'transform:', "变换效果"),
            (r'transition:', "过渡效果"),
            (r'backdrop-filter: blur', "毛玻璃效果"),
            (r'overflow:', "溢出处理")
        ]
        
        for pattern, description in css_features:
            if re.search(pattern, content):
                print(f"   ✅ {description}: 支持")
            else:
                print(f"   ❌ {description}: 不支持")
                css_valid = False
        
        self.validation_results['css_features'] = css_valid
        return css_valid
    
    def validate_responsive_design(self) -> bool:
        """验证响应式设计"""
        print("\n📱 验证响应式设计...")
        
        html_file = self.deployment_path / "index.html"
        if not html_file.exists():
            return False
        
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"   ❌ 读取HTML文件失败: {e}")
            return False
        
        responsive_valid = True
        
        # 检查viewport meta标签
        if 'viewport' in content and 'width=device-width' in content:
            print("   ✅ viewport meta标签: 已设置")
        else:
            print("   ❌ viewport meta标签: 未设置")
            responsive_valid = False
        
        # 检查媒体查询
        if '@media' in content:
            print("   ✅ 媒体查询: 已实现")
            
            # 检查断点
            breakpoints = re.findall(r'@media.*?(\d+)px', content)
            unique_breakpoints = sorted(set(int(bp) for bp in breakpoints if bp.isdigit()))
            
            if unique_breakpoints:
                print(f"   📊 检测到的断点: {unique_breakpoints}px")
                if 768 in unique_breakpoints:
                    print("   ✅ 移动端断点 (768px): 已设置")
                else:
                    print("   ⚠️ 移动端断点: 未设置")
            else:
                print("   ⚠️ 断点信息: 无法解析")
        else:
            print("   ❌ 媒体查询: 未实现")
            responsive_valid = False
        
        self.validation_results['responsive_design'] = responsive_valid
        return responsive_valid
    
    def validate_file_sizes(self) -> Dict[str, int]:
        """验证文件大小"""
        print("\n📊 文件大小统计...")
        
        file_sizes = {}
        
        for file_path in self.deployment_path.iterdir():
            if file_path.is_file():
                size = file_path.stat().st_size
                file_sizes[file_path.name] = size
                print(f"   {file_path.name}: {size:,} 字节 ({size/1024:.2f} KB)")
        
        self.validation_results['file_sizes'] = file_sizes
        return file_sizes
    
    def validate_external_dependencies(self) -> bool:
        """验证外部依赖"""
        print("\n🔗 验证外部依赖...")
        
        html_file = self.deployment_path / "index.html"
        if not html_file.exists():
            return False
        
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"   ❌ 读取HTML文件失败: {e}")
            return False
        
        # 查找外部资源
        external_patterns = [
            r'<link[^>]*href=[\'"](https?://[^\'">]+)[\'"]',
            r'<script[^>]*src=[\'"](https?://[^\'">]+)[\'"]',
            r'<img[^>]*src=[\'"](https?://[^\'">]+)[\'"]',
            r'@import\s+[\'"](https?://[^\'">]+)[\'"]'
        ]
        
        external_deps = set()
        for pattern in external_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            external_deps.update(matches)
        
        if not external_deps:
            print("   ✅ 无外部依赖: 单文件部署")
            return True
        else:
            print("   ⚠️ 发现外部依赖:")
            for dep in external_deps:
                print(f"      - {dep}")
            print("   ⚠️ 建议使用内联资源以确保离线可用")
            return False
    
    def generate_deployment_report(self) -> str:
        """生成部署报告"""
        report = []
        report.append("# GitHub Pages 部署验证报告")
        report.append(f"生成时间: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("")
        
        # 验证结果汇总
        report.append("## 验证结果汇总")
        for category, passed in self.validation_results.items():
            if isinstance(passed, bool):
                status = "✅ 通过" if passed else "❌ 失败"
                report.append(f"- **{category}**: {status}")
        
        # 文件大小统计
        if 'file_sizes' in self.validation_results:
            report.append("\n## 文件大小统计")
            for file_name, size in self.validation_results['file_sizes'].items():
                report.append(f"- **{file_name}**: {size:,} 字节")
        
        # 建议
        report.append("\n## 部署建议")
        if all(not isinstance(v, bool) or v for v in self.validation_results.values()):
            report.append("🎉 所有验证都通过，可以安全部署到GitHub Pages！")
        else:
            report.append("⚠️ 存在一些问题，建议修复后再部署：")
            failed_categories = [k for k, v in self.validation_results.items() 
                               if isinstance(v, bool) and not v]
            for category in failed_categories:
                report.append(f"   - 修复 {category} 问题")
        
        return "\n".join(report)
    
    def run_full_validation(self) -> bool:
        """运行完整验证流程"""
        print("🚀 开始GitHub Pages部署验证")
        print("=" * 50)
        
        validations = [
            self.validate_file_structure,
            self.validate_html_content,
            self.validate_css_features,
            self.validate_responsive_design,
            self.validate_file_sizes,
            self.validate_external_dependencies
        ]
        
        all_passed = True
        
        for validation in validations:
            try:
                result = validation()
                if isinstance(result, bool) and not result:
                    all_passed = False
            except Exception as e:
                print(f"   ❌ 验证过程出错: {e}")
                all_passed = False
            print()
        
        # 生成报告
        print("=" * 50)
        report = self.generate_deployment_report()
        print(report)
        
        # 保存报告
        report_file = self.deployment_path / "deployment_validation_report.md"
        try:
            with open(report_file, 'w', encoding='utf-8') as f:
                f.write(report)
            print(f"\n📄 报告已保存到: {report_file}")
        except Exception as e:
            print(f"\n❌ 保存报告失败: {e}")
        
        print("\n" + "=" * 50)
        if all_passed:
            print("🎉 验证完成！部署版本准备就绪！")
        else:
            print("⚠️ 验证完成！建议修复问题后再部署。")
        
        return all_passed

def main():
    """主函数"""
    validator = DeploymentValidator()
    success = validator.run_full_validation()
    
    # 退出码
    exit(0 if success else 1)

if __name__ == "__main__":
    main()
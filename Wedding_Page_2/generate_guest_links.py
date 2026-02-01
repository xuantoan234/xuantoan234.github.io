#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script để tạo đường dẫn thiệp mời cưới với tên khách từ file danh sách
"""

import urllib.parse
import os

# Cấu hình
BASE_URL = "https://xuantoan234.github.io/Wedding_Page_2/story.html"
INPUT_FILE = "assets/danhsachkhachmoicuoi_nhatrai.txt"
OUTPUT_FILE = "guest_invitation_links_nhatrai.txt"

def generate_guest_links(input_file, output_file, base_url):
    """
    Đọc danh sách khách mời và tạo các đường dẫn tương ứng
    
    Args:
        input_file: Đường dẫn file danh sách khách mời
        output_file: Đường dẫn file output chứa các link
        base_url: URL cơ bản của trang web
    """
    
    try:
        # Đọc danh sách khách mời
        with open(input_file, 'r', encoding='utf-8') as f:
            guests = [line.strip() for line in f if line.strip()]
        
        print(f"📋 Đã đọc {len(guests)} khách mời từ file: {input_file}")
        print("-" * 60)
        
        # Tạo các đường dẫn
        links = []
        for i, guest_name in enumerate(guests, 1):
            # Encode tên khách để đưa vào URL
            encoded_name = urllib.parse.quote(guest_name)
            full_url = f"{base_url}?guest={encoded_name}"
            
            links.append({
                'index': i,
                'name': guest_name,
                'url': full_url
            })
            
            print(f"{i:2d}. {guest_name}")
            print(f"    🔗 {full_url}")
            print()
        
        # Lưu vào file output
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("DANH SÁCH ĐƯỜNG DẪN THIỆP MỜI CƯỚI\n")
            f.write("=" * 80 + "\n\n")
            
            for link in links:
                f.write(f"{link['index']:2d}. {link['name']}\n")
                f.write(f"    {link['url']}\n\n")
            
            f.write("-" * 80 + "\n")
            f.write(f"Tổng số khách mời: {len(links)}\n")
            f.write("-" * 80 + "\n")
        
        print("=" * 60)
        print(f"✅ Đã tạo thành công {len(links)} đường dẫn!")
        print(f"📄 File output: {output_file}")
        print("=" * 60)
        
        return links
        
    except FileNotFoundError:
        print(f"❌ Lỗi: Không tìm thấy file {input_file}")
        return []
    except Exception as e:
        print(f"❌ Lỗi: {str(e)}")
        return []

def generate_production_links(input_file, output_file, production_url):
    """
    Tạo links cho production (xuantoan234.github.io)
    """
    print("\n🌐 TẠO LINKS CHO PRODUCTION:")
    return generate_guest_links(input_file, output_file, production_url)

if __name__ == "__main__":
    print("🎊 BỘ TẠO ĐƯỜNG DẪN THIỆP MỜI CƯỚI 🎊")
    print()
    
    # Tạo links cho localhost
    print("💻 TẠO LINKS CHO LOCALHOST:")
    generate_guest_links(INPUT_FILE, OUTPUT_FILE, BASE_URL)
    
    # Hỏi có muốn tạo links cho production không
    print("\n" + "=" * 60)
    create_prod = input("Bạn có muốn tạo links cho production? (y/n): ").lower()
    
    if create_prod == 'y':
        prod_url = input("Nhập URL production (mặc định: https://xuantoan234.github.io/Wedding_Page_2/story.html): ").strip()
        if not prod_url:
            prod_url = "https://xuantoan234.github.io/Wedding_Page_2/story.html"
        
        prod_output = "guest_invitation_links_production.txt"
        generate_production_links(INPUT_FILE, prod_output, prod_url)
    
    print("\n✨ Hoàn thành! Chúc đám cưới vui vẻ! ✨")
s
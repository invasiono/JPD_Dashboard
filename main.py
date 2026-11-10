#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
Nihongo Master (日本語マスター) - Server & Web Launcher
-----------------------------------------------------------------------------
Khởi chạy máy chủ HTTP cục bộ và tự động mở ứng dụng trên trình duyệt web.
Tác vụ độc lập, không yêu cầu cài đặt thư viện bên ngoài (Zero Dependencies).
=============================================================================
"""

import sys
import os
import socket
import argparse
import webbrowser
import threading
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler

# Thiết lập bảng mã UTF-8 cho Windows console tránh lỗi charmap
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# Cấu hình mặc định
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8000
MAX_PORT_ATTEMPTS = 50

# Mã màu ANSI cho Terminal chuyên nghiệp
class Colors:
    HEADER    = '\033[95m'
    BLUE      = '\033[94m'
    CYAN      = '\033[96m'
    GREEN     = '\033[92m'
    YELLOW    = '\033[93m'
    RED       = '\033[91m'
    BOLD      = '\033[1m'
    UNDERLINE = '\033[4m'
    RESET     = '\033[0m'

def print_banner(host: str, port: int):
    """Hiển thị Banner chào mừng và thông tin khởi động trên Terminal."""
    banner = f"""
{Colors.CYAN}{Colors.BOLD}
  _   _ _ _                            __  __           _            
 | \\ | (_) |__   ___  _ __   __ _  ___ |  \\/  | __ _ ___| |_ ___ _ __ 
 |  \\| | | '_ \\ / _ \\| '_ \\ / _` |/ _ \\| |\\/| |/ _` / __| __/ _ \\ '__|
 | |\\  | | | | | (_) | | | | (_| | (_) | |  | | (_| \\__ \\ ||  __/ |   
 |_| \\_|_|_| |_|\\___/|_| |_|\\__, |\\___/|_|  |_|\\__,_|___/\\__\\___|_|   
                            |___/                                      
{Colors.RESET}
{Colors.BOLD}* Nihongo Master (Japanese Learning & Kana Typing Web App){Colors.RESET}
{Colors.BLUE}-----------------------------------------------------------------------------{Colors.RESET}
  {Colors.GREEN}* Trang thai:{Colors.RESET}     {Colors.BOLD}May chu dang hoat dong{Colors.RESET}
  {Colors.GREEN}* Dia chi web:{Colors.RESET}    {Colors.CYAN}{Colors.BOLD}http://localhost:{port}{Colors.RESET} hoac {Colors.CYAN}http://{host}:{port}{Colors.RESET}
  {Colors.GREEN}* Thu muc goc:{Colors.RESET}    {os.path.abspath(os.getcwd())}
  {Colors.GREEN}* Dung may chu:{Colors.RESET}   Nhan {Colors.YELLOW}{Colors.BOLD}Ctrl + C{Colors.RESET} tren ban phim
{Colors.BLUE}-----------------------------------------------------------------------------{Colors.RESET}
"""
    print(banner)

class CustomHTTPRequestHandler(SimpleHTTPRequestHandler):
    """
    HTTP Request Handler tùy chỉnh:
    - Đảm bảo MIME types chuẩn xác cho JS (ES6 modules), CSS, JSON, Fonts
    - Tắt cache trình duyệt trong quá trình phát triển (no-cache headers)
    - Định dạng thông báo log truy cập gọn gàng, đẹp mắt
    """

    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        '.js': 'application/javascript; charset=utf-8',
        '.mjs': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.html': 'text/html; charset=utf-8',
        '.woff2': 'font/woff2',
        '.woff': 'font/woff',
        '.ttf': 'font/ttf',
    }

    def end_headers(self):
        # Thêm header vô hiệu hóa cache để luôn nạp phiên bản mã nguồn mới nhất
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        # Hiển thị log yêu cầu HTTP ngắn gọn, chuyên nghiệp
        path = args[0] if len(args) > 0 else ""
        code = args[1] if len(args) > 1 else ""
        
        # Đổi màu mã phản hồi HTTP
        code_str = str(code)
        if code_str.startswith('2'):
            colored_code = f"{Colors.GREEN}{code_str}{Colors.RESET}"
        elif code_str.startswith('3'):
            colored_code = f"{Colors.YELLOW}{code_str}{Colors.RESET}"
        else:
            colored_code = f"{Colors.RED}{code_str}{Colors.RESET}"

        timestamp = time.strftime("%H:%M:%S")
        sys.stdout.write(f"  {Colors.BLUE}[{timestamp}]{Colors.RESET} {colored_code} {path}\n")
        sys.stdout.flush()

def is_port_available(host: str, port: int) -> bool:
    """Kiểm tra xem cổng chỉ định có đang trống hay không."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        try:
            s.bind((host, port))
            return True
        except socket.error:
            return False

def find_available_port(host: str, start_port: int) -> int:
    """Tự động tìm kiếm cổng còn trống kế tiếp nếu cổng mặc định đã bị chiếm."""
    for p in range(start_port, start_port + MAX_PORT_ATTEMPTS):
        if is_port_available(host, p):
            return p
    raise RuntimeError(f"Khong tim thay cong trong nao trong khoang {start_port} - {start_port + MAX_PORT_ATTEMPTS}!")

def open_browser(url: str, delay: float = 0.6):
    """Mở trình duyệt web mặc định sau một khoảng thời gian trễ ngắn."""
    def _open():
        time.sleep(delay)
        print(f"  {Colors.GREEN}OK{Colors.RESET} Dang mo ung dung tren trinh duyet web mac dinh...")
        try:
            webbrowser.open(url)
        except Exception as err:
            print(f"  {Colors.YELLOW}Khong the tu dong mo trinh duyet:{Colors.RESET} {err}")
            print(f"  Vui long mo thu cong tai dia chi: {Colors.CYAN}{url}{Colors.RESET}")
    
    threading.Thread(target=_open, daemon=True).start()

def main():
    """Hàm điều hành chính khởi động máy chủ."""
    parser = argparse.ArgumentParser(
        description="Nihongo Master - Development Server & Web Launcher"
    )
    parser.add_argument(
        "-p", "--port",
        type=int,
        default=DEFAULT_PORT,
        help=f"Port to run the server on (default: {DEFAULT_PORT})"
    )
    parser.add_argument(
        "-H", "--host",
        type=str,
        default=DEFAULT_HOST,
        help=f"Host address (default: {DEFAULT_HOST})"
    )
    parser.add_argument(
        "--no-browser",
        action="store_true",
        help="Do not automatically open browser"
    )
    args = parser.parse_args()

    # Đảm bảo thư mục làm việc luôn là thư mục chứa tệp main.py
    project_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_dir)

    # Tìm cổng trống nếu cổng người dùng chọn đã có tiến trình khác sử dụng
    port = args.port
    if not is_port_available(args.host, port):
        print(f"{Colors.YELLOW}Port {port} is busy, searching for an available port...{Colors.RESET}")
        port = find_available_port(args.host, port)

    server_address = (args.host, port)
    app_url = f"http://localhost:{port}"

    try:
        httpd = HTTPServer(server_address, CustomHTTPRequestHandler)
    except Exception as e:
        print(f"{Colors.RED}Server startup error:{Colors.RESET} {e}")
        sys.exit(1)

    print_banner(args.host, port)

    # Tự động mở trình duyệt web
    if not args.no_browser:
        open_browser(app_url)

    # Lắng nghe và phục vụ các kết nối
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}Stopping server...{Colors.RESET}")
        httpd.server_close()
        print(f"{Colors.GREEN}Server stopped safely. Sayonara!{Colors.RESET}\n")
        sys.exit(0)

if __name__ == "__main__":
    main()

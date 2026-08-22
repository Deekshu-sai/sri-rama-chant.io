#!/usr/bin/env python3
"""
Simple HTTP server for local development.
Serves the app with proper headers for Service Worker and ES modules.
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

class SpaHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add headers for PWA and ES modules
        self.send_header('Service-Worker-Allowed', '/')
        self.send_header('Cache-Control', 'no-cache, must-revalidate')
        super().end_headers()

    def guess_type(self, path):
        mimetype = super().guess_type(path)
        # Ensure correct MIME types
        if path.endswith('.js'):
            return 'application/javascript'
        if path.endswith('.json'):
            return 'application/json'
        if path.endswith('.webmanifest'):
            return 'application/manifest+json'
        return mimetype

def main():
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass

    # Change to the script's directory
    os.chdir(Path(__file__).parent)

    with socketserver.TCPServer(("", port), SpaHandler) as httpd:
        print("Sri Rama Chant Counter")
        print(f"Serving at http://localhost:{port}")
        print("Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")

if __name__ == '__main__':
    main()
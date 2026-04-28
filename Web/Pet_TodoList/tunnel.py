import pyngrok.ngrok as ngrok
import os

os.chdir(r"d:\vsCode\Attempt")

http_tunnel = ngrok.connect(8080, "http")
print(f"公开访问地址: {http_tunnel.public_url}")
print("按 Ctrl+C 停止隧道")
ngrok.process_forever()
import os
from dotenv import load_dotenv
from supabase import create_client
import requests

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

print(f"Testing Connection to: {url}")

# 1. Direct Ping Check
try:
    response = requests.get(f"{url}/rest/v1/", timeout=5)
    print(f"✅ Network Ping: Success ({response.status_code})")
except Exception as e:
    print(f"❌ Network Ping Failed: {e}")

# 2. Supabase Client Check
try:
    supabase = create_client(url, key)
    data = supabase.table("profiles").select("*").limit(1).execute()
    print("✅ Supabase DB: Connected!")
    print(data)
except Exception as e:
    print(f"❌ Supabase DB Failed: {e}")
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ API Key Missing!")
else:
    print(f"🔑 Checking models for Key: {api_key[:5]}*******")
    genai.configure(api_key=api_key)
    
    try:
        print("\n📋 Available Models:")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
    except Exception as e:
        print(f"❌ Error: {e}")
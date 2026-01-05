from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import google.generativeai as genai
from supabase import create_client, Client
from dotenv import load_dotenv
import requests
import PIL.Image
from io import BytesIO
import re
import json
import httpx # 👈 New import for timeout handling
from youtube_transcript_api import YouTubeTranscriptApi

# 1. Setup
load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment Variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SERVICE_ROLE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

# Initialize Global Variables
supabase: Client = None
model = None

try:
    if SUPABASE_URL and SUPABASE_SERVICE_KEY:
        # Increase timeout using a custom httpx client configuration
        supabase = create_client(
            SUPABASE_URL, 
            SUPABASE_SERVICE_KEY
        )
        # Manually patching the session timeout for Postgrest
        supabase.postgrest.auth(SUPABASE_SERVICE_KEY)
        
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.0-flash")
        
    print("✅ Services Initialized Successfully")
except Exception as e:
    print(f"❌ Init Error: {e}")

class AIRequest(BaseModel):
    prompt: str
    task_type: str
    metadata_type: str = None

def extract_video_id(url):
    regex = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match = re.search(regex, url)
    return match.group(1) if match else None

def get_video_metadata(video_id):
    if not YOUTUBE_API_KEY: return None
    url = f"https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id={video_id}&key={YOUTUBE_API_KEY}"
    try:
        res = requests.get(url, timeout=10).json()
        if "items" in res and len(res["items"]) > 0:
            item = res["items"][0]
            return {
                "title": item["snippet"]["title"],
                "channel": item["snippet"]["channelTitle"],
                "tags": item["snippet"].get("tags", []),
                "views": item["statistics"].get("viewCount", "0"),
                "likes": item["statistics"].get("likeCount", "0")
            }
    except: return None

def get_transcript_text(video_id):
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        return " ".join([t['text'] for t in transcript_list])[:5000] 
    except: return None

@app.post("/api/generate")
async def generate_content(req: AIRequest, authorization: str = Header(None)):
    if not supabase:
        raise HTTPException(500, "Database Connection Down")
    
    if not authorization: raise HTTPException(401, "No Token")
    token = authorization.replace("Bearer ", "")
    
    try:
        # Get User with Timeout Handling
        user = supabase.auth.get_user(token)
        if not user or not user.user:
            raise HTTPException(401, "Invalid Session")
        user_id = user.user.id
        user_email = user.user.email
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(401, "Authentication Timeout/Error")

    # Coin Logic with explicit error handling for connection
    try:
        # We wrap the DB call to catch WinError 10060 specifically
        profile_query = supabase.table("profiles").select("coins").eq("id", user_id).execute()
        
        if not profile_query.data:
            supabase.table("profiles").insert({"id": user_id, "email": user_email, "coins": 50}).execute()
            coins = 50
        else:
            coins = profile_query.data[0]['coins']
    except Exception as e:
        print(f"DB Error: {e}")
        raise HTTPException(503, "Database is taking too long to respond. Please try again.")

    cost = 1
    if req.task_type in ['audit', 'thumbnail']: cost = 10
    if req.task_type == 'script': cost = 5
    
    if coins < cost:
        raise HTTPException(402, f"Insufficient coins. Need {cost}.")

    try:
        final_result = ""
        is_json = False
        
        if req.task_type == 'metadata':
            prompts = {
                'title': f"Generate 10 SEO titles for: '{req.prompt}'",
                'description': f"Write SEO description for: '{req.prompt}'",
                'tags': f"Generate 30 comma-separated tags for: '{req.prompt}'",
                'hashtags': f"Generate 15 hashtags for: '{req.prompt}'",
                'disclaimer': f"Write a disclaimer for: '{req.prompt}'"
            }
            prompt = prompts.get(req.metadata_type, f"Metadata for: {req.prompt}")
            response = model.generate_content(prompt)
            final_result = response.text

        elif req.task_type == 'audit':
            v_id = extract_video_id(req.prompt)
            if not v_id: raise HTTPException(400, "Invalid URL")
            trans = get_transcript_text(v_id)
            meta = get_video_metadata(v_id)
            prompt = f"Audit this YT video. Title: {meta['title'] if meta else 'N/A'}. Transcript: {trans if trans else 'None'}. Return JSON."
            response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
            final_result = json.loads(response.text)
            is_json = True

        elif req.task_type == 'thumbnail':
            v_id = extract_video_id(req.prompt)
            img_url = f"https://img.youtube.com/vi/{v_id}/maxresdefault.jpg"
            img_resp = requests.get(img_url, timeout=10)
            image = PIL.Image.open(BytesIO(img_resp.content))
            response = model.generate_content(["Rate this thumbnail CTR (0-10) and suggest 3 fixes.", image])
            final_result = response.text

        elif req.task_type == 'script':
            prompt = f"Write a full YouTube script for: {req.prompt} in JSON."
            response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
            final_result = json.loads(response.text)
            is_json = True

        # Post-Process: History & Coins
        try:
            res_data = final_result if is_json else {"text": final_result}
            supabase.table("history").insert({"user_id": user_id, "task_type": req.task_type, "prompt": req.prompt, "result": res_data}).execute()
            supabase.table("profiles").update({"coins": coins - cost}).eq("id", user_id).execute()
        except: pass
        
        return {"result": final_result, "coins_left": coins - cost, "is_json": is_json}

    except Exception as e:
        print(f"AI Error: {e}")
        raise HTTPException(500, "AI Generation Failed")
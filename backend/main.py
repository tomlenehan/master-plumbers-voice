import os
import asyncio
import json
import base64
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import websockets

# Load environment variables from .env (project root or backend dir)
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

XAI_API_KEY = os.getenv("xAI_Key") or os.getenv("XAI_API_KEY")
XAI_VOICE_WS_URL = os.getenv("API_URL", "wss://api.x.ai/v1/realtime")
VOICE = os.getenv("VOICE", "ara")
INSTRUCTIONS = os.getenv(
    "INSTRUCTIONS",
    """You are a helpful voice assistant for Master Plumbers, a professional plumbing service company based in Philadelphia serving customers across the USA.

COMPANY INFORMATION:
- Name: Master Plumbers
- Location: Philadelphia, serving customers nationwide
- Experience: 15+ years in business
- Rating: #1 Rated Plumbing Service in Philadelphia with 500+ reviews
- Credentials: Fully licensed, bonded, and insured
- Availability: 24/7 emergency service
- Response Time: 60 minutes guaranteed for emergency calls
- Pricing: Upfront, transparent flat-rate pricing with no hidden fees

SERVICES OFFERED:
- Emergency Repairs: 24/7 service for burst pipes, leaks, and urgent repairs
- Fast Response: Local technicians ready to help
- Licensed & Insured: All plumbers fully credentialed with guaranteed work
- Upfront Pricing: No surprise charges, quotes provided before work begins

HOW IT WORKS:
1. Book Online or Call: Schedule through website or phone with flexible appointment times
2. Free Inspection: Licensed plumber arrives on time, diagnoses issue, provides transparent upfront quote
3. Expert Repair: Quality parts and proven techniques with satisfaction guarantee
4. Follow-Up Support: Post-service check-in and ongoing support

YOUR ROLE:
- Answer plumbing-related questions professionally
- Help customers schedule service appointments
- Provide general pricing guidance (emphasize quotes given after inspection)
- Handle emergency situations calmly and direct to immediate help
- Be friendly, professional, and conversational
- Keep responses concise since they will be spoken aloud
- Always offer to connect them with a human if needed

PHONE NUMBER: (973) 865-3494""",
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

app = FastAPI(title="Voice Service")

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes must be defined BEFORE static file mount

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "voice-service"}


@app.get("/api/call/initiate")
async def initiate_call():
    """REST endpoint to initiate a call and return connection details."""
    if not XAI_API_KEY:
        return {"status": "error", "message": "xAI API key not configured"}
    return {
        "status": "ok",
        "websocket_url": "/ws/voice",
        "voice": VOICE,
    }


async def xai_voice_proxy(frontend_ws: WebSocket):
    """Proxy audio between frontend WebSocket and xAI Realtime Voice API."""
    xai_ws = None
    try:
        headers = {"Authorization": f"Bearer {XAI_API_KEY}"}
        xai_ws = await websockets.connect(
            XAI_VOICE_WS_URL,
            extra_headers=headers,
            open_timeout=10,
            close_timeout=5,
        )

        # Send session update to configure voice and instructions
        session_update = {
            "type": "session.update",
            "session": {
                "voice": VOICE,
                "instructions": INSTRUCTIONS,
                "modalities": ["audio", "text"],
                "turn_detection": {
                    "type": "server_vad",
                    "threshold": 0.85,
                    "silence_duration_ms": 500,
                    "prefix_padding_ms": 333,
                },
                "audio": {
                    "input": {
                        "format": {
                            "type": "audio/pcm",
                            "rate": 24000,
                        }
                    },
                    "output": {
                        "format": {
                            "type": "audio/pcm",
                            "rate": 24000,
                        }
                    },
                },
            },
        }
        await xai_ws.send(json.dumps(session_update))

        async def frontend_to_xai():
            """Read audio/text from frontend and forward to xAI."""
            try:
                while True:
                    message = await frontend_ws.receive_text()
                    data = json.loads(message)
                    msg_type = data.get("type")

                    if msg_type == "audio":
                        # Forward audio chunk to xAI
                        audio_event = {
                            "type": "input_audio_buffer.append",
                            "audio": data.get("audio", ""),
                        }
                        await xai_ws.send(json.dumps(audio_event))
                    elif msg_type == "audio_commit":
                        await xai_ws.send(json.dumps({"type": "input_audio_buffer.commit"}))
                    elif msg_type == "ping":
                        await frontend_ws.send_text(json.dumps({"type": "pong"}))
                    elif msg_type == "end":
                        await xai_ws.send(json.dumps({"type": "response.cancel"}))
                        break
                    else:
                        # Pass through other events
                        await xai_ws.send(message)
            except WebSocketDisconnect:
                pass
            except Exception:
                pass

        async def xai_to_frontend():
            """Read audio/text from xAI and forward to frontend."""
            try:
                async for message in xai_ws:
                    event = json.loads(message)
                    event_type = event.get("type")

                    if event_type == "response.output_audio.delta":
                        await frontend_ws.send_text(
                            json.dumps({
                                "type": "audio",
                                "audio": event.get("delta", ""),
                            })
                        )
                    elif event_type == "response.text.delta":
                        await frontend_ws.send_text(
                            json.dumps({
                                "type": "transcript",
                                "delta": event.get("delta", ""),
                            })
                        )
                    elif event_type == "response.done":
                        await frontend_ws.send_text(
                            json.dumps({"type": "response_done"})
                        )
                    elif event_type == "session.updated":
                        await frontend_ws.send_text(
                            json.dumps({"type": "session_ready"})
                        )
                    elif event_type == "error":
                        await frontend_ws.send_text(
                            json.dumps({
                                "type": "error",
                                "message": event.get("error", {}).get("message", "Unknown xAI error"),
                            })
                        )
                    else:
                        # Forward other events as-is for extensibility
                        await frontend_ws.send_text(message)
            except websockets.exceptions.ConnectionClosed:
                pass
            except Exception:
                pass

        # Run both directions concurrently
        await asyncio.gather(frontend_to_xai(), xai_to_frontend())

    except websockets.exceptions.InvalidStatusCode as e:
        await frontend_ws.send_text(
            json.dumps({
                "type": "error",
                "message": f"xAI connection failed: HTTP {e.status_code}",
            })
        )
    except Exception as e:
        await frontend_ws.send_text(
            json.dumps({"type": "error", "message": str(e)})
        )
    finally:
        if xai_ws is not None:
            try:
                await xai_ws.close()
            except Exception:
                pass


@app.websocket("/ws/voice")
async def voice_websocket(websocket: WebSocket):
    """WebSocket endpoint for voice communication."""
    await websocket.accept()
    if not XAI_API_KEY:
        await websocket.send_text(
            json.dumps({"type": "error", "message": "xAI API key not configured"})
        )
        await websocket.close()
        return

    await websocket.send_text(json.dumps({"type": "connected"}))
    try:
        await xai_voice_proxy(websocket)
    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        try:
            await websocket.close()
        except Exception:
            pass


# Mount static files (React build output) — must be LAST
app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

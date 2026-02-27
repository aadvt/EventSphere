from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from fastapi import HTTPException, status
from app.config import settings
from app.database import supabase
from postgrest.exceptions import APIError

# Demo mode: use simple password comparison instead of bcrypt
# For production, replace with proper hashing (bcrypt/argon2)

def hash_password(password: str) -> str:
    # Demo: store as plaintext
    return password

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Demo: simple comparison (supports both plaintext and bcrypt if needed)
    return plain_password == hashed_password

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_user_by_email(email: str) -> dict | None:
    try:
        response = supabase.table("users").select("*").eq("email", email).maybe_single().execute()
        return response.data
    except Exception as e:
        print(f"[AUTH ERROR] get_user_by_email failed: {type(e).__name__}: {e}")
        return None

def create_user(data: dict) -> dict:
    response = supabase.table("users").insert(data).execute()
    if not response.data:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create user")
    return response.data[0]

from fastapi import Depends, HTTPException, Header

# async def get_current_user(authorization: str = Header()):
#     token = authorization.replace("Bearer ", "")

#     user = verify_token(token)

#     if not user:
#         raise HTTPException(status_code=401, detail="Invalid token")

#     return user

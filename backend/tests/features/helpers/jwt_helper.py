import jwt


class JwtHelper:
    SECRET = "test-secret-key"
    ALGORITHM = "HS256"

    def generate_token(self, user_id: int) -> str:
        payload = {"user_id": user_id}
        return jwt.encode(payload, self.SECRET, algorithm=self.ALGORITHM)

    def decode_token(self, token: str) -> dict:
        return jwt.decode(token, self.SECRET, algorithms=[self.ALGORITHM])

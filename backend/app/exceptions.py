from fastapi.responses import JSONResponse

VIOLATION_STATUS_MAP = {
    "UNAUTHORIZED": 401,
    "FORBIDDEN": 403,
    "NOT_FOUND": 404,
    "MISSING_REQUIRED_FIELD": 400,
    "INVALID_VALUE": 400,
    "INVALID_STATUS_TRANSITION": 422,
    "ALREADY_EXISTS": 422,
}


def error_response(violation_type: str) -> JSONResponse:
    status = VIOLATION_STATUS_MAP.get(violation_type, 400)
    return JSONResponse(
        status_code=status,
        content={"success": False, "error": {"violation_type": violation_type}},
    )


class BusinessError(Exception):
    def __init__(self, violation_type: str):
        self.violation_type = violation_type
        super().__init__(violation_type)


class NotFoundError(Exception):
    def __init__(self, message: str = "Resource not found"):
        self.message = message
        super().__init__(message)

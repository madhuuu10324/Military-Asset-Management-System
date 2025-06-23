# Create a new file: mams_project/middleware.py
import logging

logger = logging.getLogger(__name__)

class APILoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log before the view is called
        if request.path.startswith('/api/'):
            user = request.user if request.user.is_authenticated else 'Anonymous'
            log_data = f"API Request: {request.method} {request.path} by User: {user}"
            logger.info(log_data)
        
        response = self.get_response(request)
        
        # Could also log response data here if needed
        return response
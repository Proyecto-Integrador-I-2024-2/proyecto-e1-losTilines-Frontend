from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token

@database_sync_to_async
def get_user_from_token(token_key):
    try:
        token = Token.objects.get(key=token_key)
        return token.user
    except Token.DoesNotExist:
        return AnonymousUser()

class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        try:
            query_string = scope['query_string'].decode()
            token_key = query_string.split('token=')[-1]
            if token_key:
                scope['user'] = await get_user_from_token(token_key)
            else:
                scope['user'] = AnonymousUser()
        except Exception as e:
            print(f"Error de autenticación del token: {e}")
            scope['user'] = AnonymousUser()
        return await super().__call__(scope, receive, send)
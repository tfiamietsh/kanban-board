from channels.generic.websocket import AsyncJsonWebsocketConsumer
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from channels.db import database_sync_to_async
from django.db import close_old_connections


UNAUTH_CLOSE_CODE = 4001


class BoardConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self) -> None:
        qs = self.scope.get('query_string', b'').decode()
        token = None

        for part in qs.split('&'):
            if part.startswith('token='):
                token = part.split('=', 1)[1]
                break

        user = None
        if token:
            try:
                UntypedToken(token)

                auth = JWTAuthentication()
                validated = auth.get_validated_token(token)
                user = await database_sync_to_async(auth.get_user)(validated)

                close_old_connections()
            except Exception:
                user = None

        if not user:
            await self.close(code=UNAUTH_CLOSE_CODE)
            return

        self.user = user
        self.board_id = self.scope['url_route']['kwargs'].get('board_id')

        if self.board_id:
            await self.channel_layer.group_add(
                f'board:{self.board_id}',
                self.channel_name
            )
        await self.accept()

    async def disconnect(self, _) -> None:
        if getattr(self, 'board_id', None):
            await self.channel_layer.group_discard(
                f'board:{self.board_id}',
                self.channel_name
            )

    async def receive_json(self, content: dict[str, str], **kwargs) -> None:
        typ = content.get('type')
        cid = content.get('id')

        if typ == 'ping':
            await self.send_json({'type': 'pong', 'id': cid})
        else:
            await self.send_json({
                'type': 'error',
                'id': cid,
                'message': 'unsupported_in_ws'
            })

    async def broadcast_payload(self, event) -> None:
        payload = event.get('payload')

        await self.send_json(payload)

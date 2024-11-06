from channels.generic.websocket import AsyncWebsocketConsumer
import json

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if user.is_authenticated:
            self.room_group_name = f'notifications_{user.id}'
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
            print(f"Usuario en conexión WebSocket: {user}") 
        else:
            print("Usuario no autenticado, cerrando conexión.")
            await self.close()

    async def disconnect(self, close_code):
        user = self.scope['user']
        self.room_group_name = f'notifications_{user.id}'

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

    async def send_notification(self, event):
        message = event['message']
        print(f"Enviando mensaje: {message}")  # Mensaje para verificar el envío
        await self.send(text_data=json.dumps({
            'message': message
        }))
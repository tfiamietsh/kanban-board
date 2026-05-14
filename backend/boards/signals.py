from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from boards.models import Board, Column, Item
from boards.serializers import BoardSerializer, ColumnSerializer, ItemSerializer


channel_layer = get_channel_layer()


def send_board_event(board_id: int, payload: dict[str, str]) -> None:
    async_to_sync(channel_layer.group_send)(
        f'board:{board_id}', {
            'type': 'broadcast.payload',
            'payload': payload
        }
    )


@receiver(post_save, sender=Board)
def board_saved(sender: Board, instance: Board, created: bool, **kwargs) -> None:
    ser = BoardSerializer(instance).data
    payload = {
        'type': 'update' if not created else 'create',
        'model': 'board',
        'object_id': instance.id,
        'data': ser
    }

    if instance:
        send_board_event(instance.id, payload)


@receiver(post_delete, sender=Board)
def board_deleted(sender: Board, instance: Board, **kwargs) -> None:
    payload = {
        'type': 'delete',
        'model': 'board',
        'object_id': instance.id
    }

    if instance:
        send_board_event(instance.id, payload)


@receiver(post_save, sender=Column)
def column_saved(sender: Column, instance: Column, created: bool, **kwargs) -> None:
    ser = ColumnSerializer(instance).data
    payload = {
        'type': 'update' if not created else 'create',
        'model': 'column',
        'object_id': instance.id,
        'data': ser
    }

    if instance:
        send_board_event(instance.board_id, payload)


@receiver(post_delete, sender=Column)
def column_deleted(sender: Column, instance: Column, **kwargs) -> None:
    board_id = getattr(instance, 'board_id', None)
    payload = {
        'type': 'delete',
        'model': 'column',
        'object_id': instance.id
    }

    if board_id:
        send_board_event(board_id, payload)


@receiver(post_save, sender=Item)
def item_saved(sender: Item, instance: Item, created: bool, **kwargs) -> None:
    ser = ItemSerializer(instance).data
    payload = {
        'type': 'update' if not created else 'create',
        'model': 'item',
        'object_id': instance.id,
        'data': ser
    }

    if instance.column and instance.column.board_id:
        send_board_event(instance.column.board_id, payload)


@receiver(post_delete, sender=Item)
def item_deleted(sender: Item, instance: Item, **kwargs) -> None:
    board_id = getattr(instance.column, 'board_id', None)
    payload = {
        'type': 'delete',
        'model': 'item',
        'object_id': instance.id
    }

    if board_id:
        send_board_event(board_id, payload)

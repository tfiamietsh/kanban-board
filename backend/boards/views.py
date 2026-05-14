from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from boards.models import Board, Column, Label, Item
from boards.serializers import BoardSerializer, ColumnSerializer
from boards.serializers import ItemSerializer, LabelSerializer


class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer


class ColumnViewSet(viewsets.ModelViewSet):
    queryset = Column.objects.all()
    serializer_class = ColumnSerializer


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.select_related('column').prefetch_related('labels')
    serializer_class = ItemSerializer

    @action(detail=True, methods=['post'])
    def move(self, request, pk=None) -> Response:
        dest_column_id = request.data.get('column_id')

        if not dest_column_id:
            return Response(
                {'detail': 'column_id required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            item = Item.objects.select_for_update().get(pk=pk)
            item.column_id = dest_column_id

            item.version = item.version + 1
            item.save(update_fields=['column_id', 'version'])
            serializer = self.get_serializer(item)

        return Response(serializer.data)


class LabelViewSet(viewsets.ModelViewSet):
    queryset = Label.objects.all()
    serializer_class = LabelSerializer

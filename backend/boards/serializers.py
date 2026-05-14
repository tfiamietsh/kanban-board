from rest_framework import serializers
from boards.models import Board, Column, Label, Item


class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = 'id', 'text'


class ItemSerializer(serializers.ModelSerializer):
    labels = LabelSerializer(many=True, required=False)

    class Meta:
        model = Item
        fields = 'id', 'title', 'description', 'author', 'assignee', \
          'created_at', 'deadline', 'column', 'labels', 'version'

    def create(self, validated_data: dict[str, str]) -> Item:
        labels_data = validated_data.pop('labels', [])
        item = super().create(validated_data)

        for data in labels_data:
            label, _ = Label.objects.get_or_create(text=data.get('text'))
            item.labels.add(label)
        return item

    def update(self, instance: Item, validated_data: dict[str, str]) -> Item:
        incoming_version = validated_data.get('version', None)

        if incoming_version is None or incoming_version != instance.version:
            raise serializers.ValidationError({'version': 'version mismatch'})

        labels_data = validated_data.pop('labels', None)
        instance = super().update(instance, validated_data)

        if labels_data is not None:
            instance.labels.clear()
            for data in labels_data:
                label, _ = Label.objects.get_or_create(text=data.get('text'))
                instance.labels.add(label)

        instance.version = instance.version + 1
        instance.save(update_fields=['version'])
        return instance


class ColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Column
        fields = 'id', 'name', 'board', 'items'

    items = ItemSerializer(many=True, read_only=True)


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = 'id', 'name', 'owner', 'editors', 'viewers', 'columns'

    columns = ColumnSerializer(many=True, read_only=True)

from __future__ import annotations
from datetime import datetime
from django.db import models
from accounts.models import User


class BoardManager(models.Manager):
    def get_or_create_with(
        self,
        name: str = None,
        owner: User = None,
        editors: list[User] = None,
        viewers: list[User] = None
    ) -> tuple[Board, bool]:
        if not name:
            raise ValueError('Board\'s name required')

        board, created = self.get_or_create(name=name, owner=owner)

        if created:
            if editors:
                board.editors.add(*editors)
            if viewers:
                board.viewers.add(*viewers)
        return board, created


class Board(models.Model):
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['name', 'owner'],
                name='unique_board'
            )
        ]

    name = models.CharField(max_length=30)
    owner = models.ForeignKey(
        User,
        null=True,
        on_delete=models.CASCADE,
        related_name='owned_boards'
    )
    editors = models.ManyToManyField(
        User,
        blank=True,
        related_name='editable_boards'
    )
    viewers = models.ManyToManyField(
        User,
        blank=True,
        related_name='viewable_boards'
    )

    objects = BoardManager()

    def __str__(self):
        return self.name


class ColumnManager(models.Manager):
    def get_or_create_with(
        self,
        name: str = None,
        board: Board = None
    ) -> tuple[Column, bool]:
        if not name:
            raise ValueError('Column\'s name required')
        if not name:
            raise ValueError('Column\'s board required')

        return self.get_or_create(name=name, board=board)


class Column(models.Model):
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['name', 'board'],
                name='unique_column'
            )
        ]

    name = models.CharField(max_length=20)
    board = models.ForeignKey(
        Board,
        null=True,
        on_delete=models.CASCADE,
        related_name='columns'
    )

    objects = ColumnManager()

    def __str__(self):
        return f'{self.board_id}:{self.name}'


class LabelManager(models.Manager):
    def get_or_create_with(self, text: str = None) -> tuple[Label, bool]:
        if not text:
            raise ValueError('Label\'s text required')

        return self.get_or_create(text=text)


class Label(models.Model):
    text = models.CharField(max_length=20, unique=True)

    objects = LabelManager()

    def __str__(self):
        return self.text


class ItemManager(models.Manager):
    def get_or_create_with(
        self,
        title: str = None,
        description: str = None,
        deadline: datetime = None,
        column: Column = None,
        author: User = None,
        assignee: User = None,
        labels: list[Label] = []
    ) -> tuple[Item, bool]:
        if not title:
            raise ValueError('Item\'s title required')
        if not description:
            raise ValueError('Item\'s description required')
        if not column:
            raise ValueError('Item\'s column required')
        if not author:
            raise ValueError('Item\'s author required')
        if not assignee:
            raise ValueError('Item\'s assignee required')

        defaults = {
            'description': description,
            'deadline': deadline,
            'author': author,
            'assignee': assignee
        }

        item, created = self.get_or_create(
            title=title,
            column=column,
            defaults=defaults
        )

        if created and labels:
            item.labels.add(*labels)
        return item, created


class Item(models.Model):
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['title', 'column'],
                name='unique_item'
            )
        ]

    title = models.CharField(max_length=30)
    description = models.CharField(max_length=400)
    author = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='authored_items')
    assignee = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='assigned_items')
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(null=True)
    column = models.ForeignKey(Column, null=True, on_delete=models.CASCADE, related_name='items')
    labels = models.ManyToManyField(Label, blank=True)
    version = models.PositiveIntegerField(default=0)

    objects = ItemManager()

    def __str__(self):
        return self.title

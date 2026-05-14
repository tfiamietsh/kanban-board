from typing import Type
from django.utils import timezone
from django.core.management.base import BaseCommand
from accounts.models import User
from boards.models import Board, Column, Label, Item


class Command(BaseCommand):
    help = 'Seed initial data'

    def __create[T](self, model_class: Type[T], **kwargs) -> T:
        instance, created = model_class.objects.get_or_create_with(**kwargs)

        if created:
            success_msg = f'Created initial record: {instance}'
            self.stdout.write(self.style.SUCCESS(success_msg))
        return instance

    def handle(self, *args, **opts) -> None:
        heth = self.__create(
            User,
            email='heth@silent.hill',
            password='heather'
        )
        clem = self.__create(
            User,
            email='clem@walking.dead',
            password='clementine'
        )
        lucy = self.__create(
            User,
            email='lucy@cyber.punk',
            password='lucy'
        )

        board = self.__create(
            Board,
            name='Heth\'s board',
            owner=heth,
            editors=[clem],
            viewers=[lucy]
        )

        backlog = self.__create(Column, name='Backlog', board=board)
        ready = self.__create(Column, name='Ready', board=board)

        good_idea = self.__create(Label, text='Good Idea')
        not_crit = self.__create(Label, text='Not Critical')
        normal = self.__create(Label, text='Normal')

        self.__create(Column, name='Doing', board=board)
        self.__create(Column, name='Review', board=board)
        self.__create(Column, name='Done', board=board)

        self.__create(
            Item,
            title='Forest',
            description='Go to walk in forest',
            deadline=timezone.now().replace(month=12, day=31),
            column=ready,
            author=heth,
            assignee=clem,
            labels=[good_idea, not_crit]
        )

        self.__create(
            Item,
            title='Night Drive',
            description='Go to night drive on rural dim-lit highway',
            column=backlog,
            author=heth,
            assignee=heth,
            labels=[good_idea, normal]
        )

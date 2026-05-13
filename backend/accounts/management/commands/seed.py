from django.core.management.base import BaseCommand
from accounts.models import User

class Command(BaseCommand):
    help = 'Seed initial users'

    def __create_user(self, email: str, password: str) -> None:
        if not User.objects.filter(email=email).exists():
            User.objects.create_superuser(email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f'Created user with email: {email}'))

    def handle(self, *args, **opts) -> None:
        self.__create_user('heth@silent.hill', 'heather')
        self.__create_user('clem@walking.dead', 'clementine')
        self.__create_user('lucy@cyber.punk', 'lucy')

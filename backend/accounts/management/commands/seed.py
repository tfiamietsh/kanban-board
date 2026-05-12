from django.core.management.base import BaseCommand
from accounts.models import User

class Command(BaseCommand):
    ADMIN_EMAIL = 'admin@example.com'
    MODERATOR_EMAIL = 'mod@example.com'
    USER_EMAIL = 'user@example.com'

    help = 'Seed initial users and roles'

    def handle(self, *args, **opts):
        if not User.objects.filter(email=ADMIN_EMAIL).exists():
            User.objects.create_superuser(email=ADMIN_EMAIL, password='adminpass')
            self.stdout.write(self.style.SUCCESS('Created admin'))

        if not User.objects.filter(email=MODERATOR_EMAIL).exists():
            User.objects.create_user(email=MODERATOR_EMAIL, password='modpass', role='moderator')
            self.stdout.write(self.style.SUCCESS('Created moderator'))

        if not User.objects.filter(email=USER_EMAIL).exists():
            User.objects.create_user(email=USER_EMAIL, password='userpass', role='user')
            self.stdout.write(self.style.SUCCESS('Created user'))

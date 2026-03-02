from django.db import migrations


def seed_roles(apps, schema_editor):
    Role = apps.get_model('accounts', 'Role')
    for name in ['CUSTOMER', 'PARTNER', 'ADMIN']:
        Role.objects.get_or_create(name=name)


def remove_roles(apps, schema_editor):
    Role = apps.get_model('accounts', 'Role')
    Role.objects.filter(name__in=['CUSTOMER', 'PARTNER', 'ADMIN']).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_alter_user_managers'),
    ]

    operations = [
        migrations.RunPython(seed_roles, remove_roles),
    ]

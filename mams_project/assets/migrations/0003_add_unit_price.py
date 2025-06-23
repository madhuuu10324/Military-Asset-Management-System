# Generated manually to fix missing unit_price column

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assets', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='purchaserecord',
            name='unit_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
    ] 
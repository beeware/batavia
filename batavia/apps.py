# A Django app declaration for Batavia

import os

from django.apps import AppConfig


class BataviaAppConfig(AppConfig):
    name = 'batavia'
    label = 'batavia'
    verbose_name = 'Batavia'
    path = os.path.dirname(__file__)

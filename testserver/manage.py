#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":

    if sys.version_info[0] != 3:
        sys.stderr.write('Batavia requires Python 3' + os.linesep)
        sys.exit(1)

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)

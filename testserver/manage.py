#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    
    if 'python3' not in sys.executable:  # might be better to check version also.
    # if sys.hexversion < 0x03000000:
        import distutils
        python3_path = distutils.spawn.find_executable('python3')
        if python3_path is not None:
            os.execvp(sys.executable + '3', [sys.executable + '3'] + sys.argv)
            #TODO what to do if it is None?
    
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)

import io
import os
import re
from setuptools import setup, find_packages

with io.open('README.rst', encoding='utf8') as readme:
    long_description = readme.read()

with io.open('batavia/__init__.py', encoding='utf8') as version_file:
    version_match = re.search(r"^__version__ = ['\"]([^'\"]*)['\"]", version_file.read(), re.M)
    if version_match:
        version = version_match.group(1)
    else:
        raise RuntimeError("Unable to find version string.")


setup(
    name='batavia',
    version=version,
    description='A Javascript implementation of the Python virtual machine.',
    long_description=long_description,
    author='Russell Keith-Magee',
    author_email='russell@keith-magee.com',
    url='https://pybee.org/batavia',
    packages=find_packages(exclude=['django', 'tests']),
    include_package_data=True,
    license='New BSD',
    classifiers=[
        'Development Status :: 2 - Pre-Alpha',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3 :: Only',
        'Topic :: Software Development',
        'Topic :: Utilities',
    ],
    test_suite='tests'
)

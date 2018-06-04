import io
import json
from setuptools import setup, find_packages


with io.open('README.rst', encoding='utf8') as readme:
    long_description = readme.read()

with io.open('package.json', encoding='utf8') as package:
    data = json.load(package)


setup(
    name='batavia',
    version=data['version'].replace('dev.', 'dev'),
    description=data['description'],
    long_description=long_description,
    author=data['author'],
    author_email='russell@keith-magee.com',
    url=data['homepage'],
    packages=find_packages(exclude=['docs', 'tests']),
    python_requires='>=3.4, <=3.5',
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
    test_suite='tests',
    package_urls={
        'Funding': 'https://pybee.org/contributing/membership/',
        'Documentation': 'http://batavia.readthedocs.io/en/latest/',
        'Tracker': data['bugs']['url'],
        'Source': 'https://github.com/pybee/batavia',
    },
)

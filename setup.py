import io
from setuptools import setup, find_packages


with io.open('README.rst', encoding='utf8') as readme:
    long_description = readme.read()


setup(
    name='batavia',
    version='3.4.0.dev1',
    description='Tools to run Python bytecode on the Javascript VM.',
    long_description=long_description,
    author='Russell Keith-Magee',
    author_email='russell@keith-magee.com',
    url='http://pybee.org/batavia',
    packages=find_packages(exclude=['docs', 'tests']),
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

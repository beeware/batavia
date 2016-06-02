Testing Batavia
====================

Batavia uses an external Continuous Integration (CI) tool called `Travis`_. However, you 
can also run the tests that Travis does on your local machine

.. _Travis: https://travis-ci.org/pybee/batavia


.travis.yml is your friend
----------------------------


Travis does have some smarts, but because it's a language agnostic being, it needs to be told
what to do. 

Your best bet in any project that you want to test is to see if the README has a Travis CI
badge, and if it does, look at the .travis.yml file

Here is a simplified sample of what the Batavia .travis.yml file looks like: 

.. code-block:: yml
  sudo: required
  language: python
  python:
    - "3.4.2"
  install:
    - "pip install ."
    - mkdir foobar
    - wget https://...
    - tar -xvf ...
    - export PATH=$PWD/...
  script:
    - "python setup.py test"
   

The basic gist is that if you want to run the test yourself, confirm you are running the right version of python as per the "python" section, run the one-time "install" commands, and then test by running the script in the "script" section.

Always use the most recent master version of the .travis.yml file as a guide. If the README has a green badge, it means that it's all working!


#!/bin/bash

# Download and unpack code at the test SHA
curl -s -L -u $GITHUB_USERNAME:$GITHUB_ACCESS_TOKEN https://github.com/$GITHUB_OWNER/$GITHUB_PROJECT_NAME/archive/$SHA.zip -o code.zip
unzip code.zip

echo "Python version=`python --version`"

cd $GITHUB_PROJECT_NAME-$SHA
pip install -e .

echo "================================================================================"
echo python setup.py test
python setup.py test

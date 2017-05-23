version: 2
jobs:
  build:
    working_directory: /tmp/batavia
    docker:
      - image: python:3.4
        environment:
            TZ: "Australia/Perth"
    steps:
      - checkout
    
      - run: 
          name: "install node"
          command: "curl https://nodejs.org/dist/v6.9.1/node-v6.9.1-linux-x64.tar.gz | tar xzvf - --exclude CHANGELOG.md --exclude LICENSE --exclude README.md --strip-components 1 -C /usr/local/"

      - run:
          name: "install npm"
          command: "npm install -g npm && npm install && npm run prepare && npm run build"
 
      - run: 
          name: "install pytest"
          command: "pip install pytest git+https://github.com/pybee/pytest-circleci"
  
      - run: 
          name: "test"
          command: "py.test tests"

      - run: 
          name: "eslint"
          command: "node_modules/.bin/eslint batavia"


# Use the BeeKeeper Python image as a starting point.
FROM beekeeper/py36

# Set the working directory to /app
WORKDIR /app

# Copy the runtest script into the container
ADD . /app

# Add the node package source and install nodejs
RUN curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
RUN chmod 755 nodesource_setup.sh
RUN ./nodesource_setup.sh
RUN apt-get install -yy nodejs
RUN npm install -g npm

# Run the test with a waggle report
CMD ["./run.sh"]

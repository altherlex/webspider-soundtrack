# Use an official Python runtime as a parent image
FROM node:10

# Set the working directory to /app
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /app
# COPY . /usr/src/app
COPY package*.json ./

# Install any needed packages specified in requirements.txt
RUN npm install
# RUN createdb webspider-soundtrack
# RUN node init_db createTables
# RUN node init_db addColumns

# Bundle app source
COPY . .

# Make port 80 available to the world outside this container
# EXPOSE 80
EXPOSE 8080

# Define environment variable

# Run app.py when the container launches
# CMD [ "npm", "start" ]

CMD npm start
# Use the ultra-lightweight Nginx Alpine base image
FROM nginx:alpine

# Copy all local static files into the Nginx default public directory
COPY . /usr/share/nginx/html

# Expose port 80 to allow traffic to the container
EXPOSE 80

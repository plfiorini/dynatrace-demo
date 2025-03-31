FROM nginx:alpine

# Create custom configuration
#

# Copy SSL certificates
#COPY ./certificates/acmecorp.com.key /etc/nginx/ssl/server.key
#COPY ./certificates/acmecorp.com.crt /etc/nginx/ssl/server.crt

# Expose ports
EXPOSE 80
EXPOSE 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
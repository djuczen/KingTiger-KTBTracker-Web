FROM nginx

# Add Angular distribution to static files directory
COPY --chown=1001:0  dist/ /usr/share/nginx/html

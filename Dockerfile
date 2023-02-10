FROM nginx

# HACK to fix font 404's
RUN ln -s /usr/share/nginx/html /etc/nginx/html

# Add Angular distribution to static files directory
COPY --chown=1001:0  dist/ /usr/share/nginx/html

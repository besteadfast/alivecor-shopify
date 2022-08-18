# Docker
```
docker run -dt -p 9292:9292 -p 3456:3456 -p 80:80 --name shopify-dev zingstudios/shopify-cli:latest
docker exec -it shopify-dev /bin/zsh -c "shopify login --store alivecor.myshopify.com"
docker exec -it shopify-dev /bin/zsh -c "shopify theme serve --host 0.0.0.0 --port 9292"
node18 /bin/sh -c "npm i && npm run tailwind"
```
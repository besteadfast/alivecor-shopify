.PHONY: start login serve pull push

start:
	@docker run -dt -p 9292:9292 -p 3456:3456 -p 80:80 -v "$PWD":/home/zing/shopify-dev --name shopify-dev zingstudios/shopify-cli:latest $(filter-out $@,$(MAKECMDGOALS))
login:
	@docker exec -it shopify-dev /bin/zsh -c "shopify login --store alivecor.myshopify.com" $(filter-out $@,$(MAKECMDGOALS))
serve:
	@docker exec -it shopify-dev /bin/zsh -c "shopify theme serve --host 0.0.0.0 --port 9292" $(filter-out $@,$(MAKECMDGOALS))
pull:
	@docker exec -it shopify-dev /bin/zsh -c "shopify theme pull" $(filter-out $@,$(MAKECMDGOALS))
push:
	@docker exec -it shopify-dev /bin/zsh -c "shopify theme push" $(filter-out $@,$(MAKECMDGOALS))
%:
	@:
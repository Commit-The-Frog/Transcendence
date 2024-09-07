COMPOSE_DIR=	./docker-compose.yml

.PHONY:	all clean fclean re

all:
	docker compose -f $(COMPOSE_DIR) up -d --build

down:
	docker compose -f $(COMPOSE_DIR) down

logs:
	docker compose -f $(COMPOSE_DIR) logs

restart: clean all

clean:
	docker compose -f $(COMPOSE_DIR) down -v

fclean:	clean
	docker system prune -a

re:	fclean all

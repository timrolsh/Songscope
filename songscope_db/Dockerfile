FROM postgres
ENV POSTGRES_USER=root
ENV POSTGRES_PASSWORD=root
EXPOSE 5432
# Schema SQL from this directory will be automatically run by the Postgres image from the following directory
COPY ./Schema.sql /docker-entrypoint-initdb.d/
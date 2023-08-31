FROM node:latest AS builder
COPY . ./CollectionIndexer
WORKDIR /CollectionIndexer
RUN npm i
CMD [ "ng", "build" ]

FROM nginx:latest
COPY --from=builder /CollectionIndexer/dist/collection-indexer/ /usr/share/nginx/html
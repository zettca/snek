FROM denoland/deno:alpine

WORKDIR /snek

USER deno

COPY . .

RUN deno cache server.ts 

EXPOSE 8080

CMD ["task", "start"]

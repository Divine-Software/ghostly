FROM mcr.microsoft.com/playwright:v1.9.2-focal
ARG version
RUN apt-get update && apt-get install tini && npm -g install @divine/ghostly-cli@${version}
ENTRYPOINT ["/bin/tini", "--"]
CMD ["ghostly-cli", "--debug", "--page-cache=10", "--user=pwuser", "--http=:80"]

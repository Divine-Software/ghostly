FROM mcr.microsoft.com/playwright:v1.17.1-focal
ARG version
RUN apt-get update && \
    apt-get install -y tini && \
    npm -g install @divine/ghostly-cli@${version} && \
    rm -rf /var/lib/apt/lists/*

LABEL description="Ghostly template/print formatter" \
          license="Apache-2.0" \
       maintainer="martin@blom.org" \
           vendor="Divine Software" \
          version="${version}"

ENTRYPOINT ["/bin/tini", "--", "ghostly-cli" ]
CMD ["--debug", "--page-cache=10", "--user=pwuser", "--http=:80"]

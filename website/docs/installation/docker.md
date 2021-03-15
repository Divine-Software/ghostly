---
title: Docker Image
---

To run the Ghostly WS API server, just forward port 80 and run the Docker image without arguments:

```bash
docker run -p 8888:80 divinesoftware/ghostly
```

The server is then ready to accept requests on <http://localhost:8888/>.

You may also replace the default options to `ghostly-cli`. For instance, the following command is exactly equivalent to the previous example:

```bash
docker run -p 8888:80 divinesoftware/ghostly --debug --page-cache=10 --user=pwuser --http=:80
```

This means that you can also execute `ghostly-cli` in command-line mode. Just remember that the local filesystem and
`localhost` refers to the local Docker instance's resources, not the host's.

```bash
echo '[ null, "one", 2, { "three": [ false, true ] } ]' > model.json

docker run -i divinesoftware/ghostly \
    --template https://divine-software.github.io/ghostly/examples/ghostly-plainjs-template.html \
    --format application/pdf \
    - < model.json > model.pdf
```

See [Command Line Interface](./cli) for more information.

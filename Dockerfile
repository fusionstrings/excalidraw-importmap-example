FROM denoland/deno:1.16.1

# The port that your application listens to.
# EXPOSE 8080

WORKDIR /app

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
# COPY deps.js .
# RUN deno cache --unstable deps.js

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache --unstable server.js
CMD ["run", "--allow-net", " --allow-read", "--allow-env", "--unstable", "server.js"]
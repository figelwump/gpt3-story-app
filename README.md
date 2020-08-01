An app to collaboratively write a story with GPT-3. Examples: https://twitter.com/figelwump/status/1289292359348318208?s=20

How to run:

### Backend

This is the backend wrapper around the openai API

-   cd gpt
-   source .venv/bin/activate
-   export OPENAI_KEY="<api key>"
-   run_gpt_api.py

### Frontend

-   cd web-ui; npm run watch
-   live-server web-ui/dist-dev (install live-server here if you don't have it: https://www.npmjs.com/package/live-server)

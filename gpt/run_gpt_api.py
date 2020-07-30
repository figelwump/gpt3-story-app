from http import HTTPStatus
import json
import os
import openai

from flask import Flask, request, Response
from flask_cors import CORS


def run_web_app():
    """Creates Flask app to serve the React app."""
    app = Flask(__name__)
    CORS(app)  # allow CORS for all routes, all domains

    openai.api_key = os.getenv('OPENAI_KEY')

    # def error(err_msg, status_code):
    #     return Response(json.dumps({"error": err_msg}), status=status_code)

    @app.route("/gpt", methods=["GET", "POST"])
    def gpt():
        # pylint: disable=unused-variable
        print("in gpt route: ")
        print(request)
        prompt = request.json["prompt"]
        print(prompt)

        res = openai.Completion.create(
            engine="davinci",
            prompt=prompt,
            max_tokens=200,
            temperature=1.0,
            top_p=1,
            n=2,
            frequency_penalty=0.8,
            stop="\n"
        )
        print(res)
        for choice in res['choices']:
            if choice['text'].strip() is not "":
                return {'gptResponse': choice['text']}

        # API didn't return any non-empty completions
        return {'gptResponse': ""}

    app.run(port=3001)


#
# start it
#
run_web_app()

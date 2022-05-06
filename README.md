# Serverless Everything

## Setup

1. Install [Docker Compose](https://docs.docker.com/get-docker/)

1. Install [`sops`](https://github.com/mozilla/sops)

1. Create and fill out your personal `.env` file:

    ```bash
    AWS_ACCESS_KEY_ID=
    AWS_REGION=us-west-2 # If you change this, find and replace all other instances in the code
    AWS_SECRET_ACCESS_KEY=

    LOCALSTACK_API_KEY=
    ```

1. Run `./scripts/terragrunt/cli run-all apply` to deploy the application and generate your personal AWS KMS key

1. Once the application is finished deploying, get your AWS KMS key from AWS and update the `.sops.yaml` file with your AWS KSM key

1. Next, since you do not have access to my personal AWS KSM key you cannot decrypt `.sops.json` files that I created, so you will need to delete and then create your own personal `secrets.sops.json` files:
    1. Delete `./src/hello-world-v0/secrets.sops.json`
    1. Run `sops ./src/hello-world-v0/secrets.sops.json`
    1. Add and save `"MY_SOPS_MESSAGE": "My Secrete Sops Value!!!"` to the file

1. Run `./scripts/localstack/cli ./src/hello-world-v0/ version` to update the `hello-world-v0` version

1. Run `./scripts/terragrunt/cli run-all apply` to update the `hello-world-v0` lambda with your new version which contains your new `secrets.sops.json` file

1. Once the application is finished deploying, in the AWS Lambda console for `hello-world-v0`, you should be able to "Test" your lambda successfully

1. Setup local development by running `docker compose up -d`

1. Once the `localstack` service is running, publish, build, and invoke the `hello-world-v0` lambda locally with `./scripts/localstack/cli ./src/hello-world-v0 publish,build,invoke`

1. If you make a change to the `hello-world-v0` lambda, run `./scripts/localstack/cli ./src/hello-world-v0 build,version,invoke '{ "my": "payload" }'` to re-build the image

## Notes

* To run a lambda in a local terminal run `node -e "const lambda = require('./index.js'); lambda.handler().then(console.log).catch(console.error);"` in the lambda directory

module "serverless_docker_function" {
	source  = "1Mill/serverless-docker-function/aws"
	version = "0.0.4"

	docker = { build = abspath(path.module) }
	environment = { NODE_ENV = "production" }
	function = {
		name = "erik-ekberg-testing"
		version = "v1.0.0"
	}
}

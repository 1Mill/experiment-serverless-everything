module "config" {
	source  = "1Mill/file-to-object/local"
	version = "0.0.3"

	filename = "${path.module}/config.bash"
}
module "serverless_docker_function" {
	source  = "1Mill/serverless-docker-function/aws"
	version = "0.0.6"

	docker = { build = abspath(path.module) }
	environment = {
		NODE_ENV = "production"
	}
	function = {
		memory = module.config.data.MEMORY
		name = module.config.data.NAME
		timeout = module.config.data.TIMEOUT
		version = module.config.data.VERSION
	}
}

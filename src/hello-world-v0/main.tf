module "serverless_docker_function" {
	source = "./modules/"

	function = { name = "TESTING" }
	environment = {
		NODE_ENV = "production"
	}
}

locals {
	docker = defaults(var.docker, {
		build = abspath(path.module)
	})
	function = defaults(var.function, {
		memory = 128
		timeout = 3
	})
	registry = defaults(var.registry, {
		name = local.function.name
	})
}

module "docker_image" {
	source = "terraform-aws-modules/lambda/aws//modules/docker-build"
	version = "3.1.0"

	create_ecr_repo = true
	ecr_repo = local.registry.name
	ecr_repo_lifecycle_policy = jsonencode({
		rules = [
			{
				action = { type = "expire" }
				description = "Keep the latest bulid"
				rulePriority = 1
				selection = {
					countNumber = 1
					countType = "imageCountMoreThan"
					tagStatus = "any"
				}
			}
		]
	})
	image_tag = local.function.version
	image_tag_mutability = "IMMUTABLE"
	source_path = local.docker.build
}

module "lambda" {
	source = "terraform-aws-modules/lambda/aws"
	version = "3.1.0"

	create_package = false
	environment_variables = var.environment
	function_name = local.function.name
	image_uri = module.docker_image.image_uri
	memory_size = local.function.memory
	package_type = "Image"
	timeout = local.function.timeout
}

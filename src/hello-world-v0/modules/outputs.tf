output "docker_image" {
        description = "AWS ECR resources"
        value = module.docker_image
}

output "lambda" {
        description = "AWS lambda resources"
        value = module.lambda
}

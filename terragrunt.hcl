terraform {
	extra_arguments "retry_lock" {
		arguments = ["-lock-timeout=2m"]
		commands  = get_terraform_commands_that_need_locking()
	}
}

remote_state {
	backend = "s3"
	config = {
		// access_key = ENVIRONMENT AWS_ACCESS_KEY_ID
		// region = ENVIRONMENT AWS_REGION
		// secret_key = ENVIRONMENT AWS_SECRET_ACCESS_KEY

		bucket = "experiment-terraform-state"
		dynamodb_table = "experiment-terraform-state-locks"
		encrypt = true
		key = "${path_relative_to_include()}/terraform.tfstate"
		region = "us-east-1"
	}
	generate = {
		if_exists = "overwrite_terragrunt"
		path = "backend.tf"
	}
}

generate "versions" {
	contents = <<-EOF
		terraform {
			required_version = "~> 1.1"

			required_providers {
				aws = {
					source  = "hashicorp/aws"
					version = "~> 4.10"
				}
			}
		}
	EOF
	if_exists = "skip"
	path = "versions.tf"
}

data "github_repository" "this" {
	full_name = "1Mill/experiment-serverless-everything"
}

module "iam_user" {
	source  = "terraform-aws-modules/iam/aws//modules/iam-user"
	version = "~> 5.3.0"

	create_iam_access_key = true
	force_destroy = true
	name = "experiment-serverless-everything-cicd-v0-2022-08-14"
	password_length = 64
}

resource "github_actions_secret" "aws_access_key_id" {
	plaintext_value = module.iam_user.iam_access_key_id
	repository = data.github_repository.this.name
	secret_name = "CICD_V0_AWS_ACCESS_KEY_ID"
}

resource "github_actions_secret" "aws_region" {
	plaintext_value = "ca-central-1"
	repository = data.github_repository.this.name
	secret_name = "CICD_V0_AWS_REGION"
}

resource "github_actions_secret" "aws_secret_access_key" {
	plaintext_value = module.iam_user.iam_access_key_secret
	repository = data.github_repository.this.name
	secret_name = "CICD_V0_AWS_SECRET_ACCESS_KEY"
}

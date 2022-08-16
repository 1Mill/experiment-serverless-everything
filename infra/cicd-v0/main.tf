provider "github" {}

data "github_repository" "this" {
	full_name = "1Mill/experiment-serverless-everything"
}

locals {
	active_date = element(local.dates, 0)
	dates = [
		# ! When rotating, place the newest date first
		# ! so that it is used by "local.active_date"
		"2022-08-15",
		# ! ---
	]
}

module "iam_user" {
	for_each = toset(local.dates)

	source  = "terraform-aws-modules/iam/aws//modules/iam-user"
	version = "~> 5.3.0"

	create_iam_access_key = true
	force_destroy = true
	name = "experiment-serverless-everything-cicd-v0-${each.key}"
	password_length = 64
}

resource "aws_iam_user_policy_attachment" "this" {
	for_each = toset([for iam_user in module.iam_user : iam_user.iam_user_name])

	policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
	user = each.key
}

resource "github_actions_secret" "aws_access_key_id" {
	plaintext_value = module.iam_user[local.active_date].iam_access_key_id
	repository = data.github_repository.this.name
	secret_name = "INFRA_CICD_V0_AWS_ACCESS_KEY_ID"
}

resource "github_actions_secret" "aws_region" {
	plaintext_value = "ca-central-1"
	repository = data.github_repository.this.name
	secret_name = "INFRA_CICD_V0_AWS_REGION"
}

resource "github_actions_secret" "aws_secret_access_key" {
	plaintext_value = module.iam_user[local.active_date].iam_access_key_secret
	repository = data.github_repository.this.name
	secret_name = "INFRA_CICD_V0_AWS_SECRET_ACCESS_KEY"
}

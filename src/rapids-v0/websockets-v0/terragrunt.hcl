include "root" { path = find_in_parent_folders() }
include "version" { path = find_in_parent_folders("terraform-versions/1.2.hcl") }

dependency "aws_kms_v0" {
	config_path = "../../aws-kms-v0"
	mock_outputs = { policy = "" }
}

inputs = { policy = dependency.aws_kms_v0.outputs.policy }

include "root" { path = find_in_parent_folders() }

dependency "aws_kms_v0" { config_path = "../aws-kms-v0" }

inputs = { policy = dependency.aws_kms_v0.outputs.policy }

# Generated by Terragrunt. Sig: nIlQXj57tbuaRZEa
terraform {
  backend "s3" {
    bucket         = "experiment-terraform-state"
    dynamodb_table = "experiment-terraform-state-locks"
    encrypt        = true
    key            = "src/aws-kms-v0/terraform.tfstate"
    region         = "us-east-1"
  }
}

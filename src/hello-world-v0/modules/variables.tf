variable "docker" {
	default = {}
	type = object({
		build = optional(string)
	})
}
variable "environment" {
	default = {}
        type = any
}
variable "function" {
	type = object({
		memory = optional(string)
		name = string
		timeout = optional(string)
		version = optional(string)
	})
}
variable "registry" {
	default = {}
	type = object({
		name = optional(string)
	})
}

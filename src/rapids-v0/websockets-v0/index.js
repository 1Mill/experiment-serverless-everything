const { Sops } = require('@1mill/sops')

const sops = new Sops({})

exports.handler = async (cloudevent = {}, ctx) => {
	return {
		ABLY_API_KEY: await sops.decrypt('ABLY_API_KEY')
	}
}

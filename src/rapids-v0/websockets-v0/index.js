const { Sops } = require('@1mill/sops')

const sops = new Sops({})

exports.handler = async (cloudevent = {}, ctx) => {
	// * Validate the invoking cloudevent arguments.
	if (!cloudevent.id) { throw new Error('Cloudevent "id" is required') }
	if (!cloudevent.source) { throw new Error('Cloudevent "source" is required') }
	if (!cloudevent.type) { throw new Error('Cloudevent "type" is required') }

	return true
}

const { Sops } = require('@1mill/sops')

const sops = new Sops({})

exports.handler = async (cloudevent = {}, ctx) => {
	// * Validate the invoking cloudevent arguments.
	const { id, source, type, wschannelid } = cloudevent

	if (!id) { throw new Error('Cloudevent "id" is required') }
	if (!source) { throw new Error('Cloudevent "source" is required') }
	if (!type) { throw new Error('Cloudevent "type" is required') }
	if (!wschannelid) { throw new Error('Cloudevent "wschannelid" is required') }

	return true
}

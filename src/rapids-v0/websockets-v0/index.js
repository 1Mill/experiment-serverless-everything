const Ably = require('ably')
const { Sops } = require('@1mill/sops')

const sops = new Sops({})

const CHANNEL_JOINER = ':'
const CHANNEL_PREFIX = 'rapids-v0-2022-09-24'

exports.handler = async (cloudevent = {}, ctx = {}) => {
	const { id, source, type, wschannelid } = cloudevent

	// * Validate the input cloudevent attributes
	if (!id) { throw new Error('Cloudevent "id" is required') }
	if (!source) { throw new Error('Cloudevent "source" is required') }
	if (!type) { throw new Error('Cloudevent "type" is required') }
	if (!wschannelid) { throw new Error('Cloudevent "wschannelid" is required') }

	const ablyClient = Ably.Rest.Promise({
		key: await sops.decrypt('ABLY_API_KEY')
	})
	const name = [CHANNEL_PREFIX, wschannelid].join(CHANNEL_JOINER)
	const channel = ablyClient.channels.get(name, {
		modes: ['PUBLISH']
	})
	await channel.publish(type, cloudevent)

	return true
}

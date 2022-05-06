const { Cloudevent } = require('@1mill/cloudevents')

exports.handler = async (cloudevent, ctx) => {
	return 'Hello world'
}

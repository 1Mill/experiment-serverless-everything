const { Cloudevent } = require('@1mill/cloudevents')

exports.handler = async (event, ctx) => {
	return new Cloudevent({
		data: JSON.stringify({
			MY_SECRET_MESSAGE: process.env.MY_SECRET_MESSAGE,
			event,
			isWorking: true,
		}),
		source: ctx.invokedFunctionArn,
		type: 'fct.said-hello-to-world.v0',
	})
}

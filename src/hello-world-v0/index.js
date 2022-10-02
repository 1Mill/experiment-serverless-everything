const { Cloudevent } = require('@1mill/cloudevents')
const { Lambda } = require('@1mill/lambda')
const { Sops } = require('@1mill/sops')

const lambda = new Lambda({})
const sops = new Sops({ file: 'secrets.sops.json' })

exports.handler = async (cloudevent = {}, ctx = {}) => {
	const ce = new Cloudevent({
		data: JSON.stringify({
			MY_SECRET_MESSAGE: process.env.MY_SECRET_MESSAGE,
			decrypted_sops_mesage: await sops.decrypt('MY_SOPS_MESSAGE'),
			isWorking: true,
		}),
		source: ctx.invokedFunctionArn,
		type: 'fct.said-hello-to-world.v0',
	})
	.origin({ cloudevent })
	.wschannel({ wschannelid: 'testing-my-ws-channel-integration' })

	await lambda.invoke({
		cloudevent: ce,
		functionName: 'rapids-v0-hydrator-v0',
	})

	return ce
}

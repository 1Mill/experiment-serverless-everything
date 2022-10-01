const fs = require('fs')
const { Lambda } = require('@1mill/lambda')

const ROUTES_DIR = './routes/'
const WEBSOCKETS_FUNCTIONNAME = 'rapids-v0-websockets-v0'

const lambda = new Lambda({})

exports.handler = async (cloudevent = {}, ctx = {}) => {
	// * Validate the invoking cloudevent arguments.
	if (!cloudevent.id) { throw new Error('Cloudevent "id" is required') }
	if (!cloudevent.source) { throw new Error('Cloudevent "source" is required') }
	if (!cloudevent.type) { throw new Error('Cloudevent "type" is required') }

	// * Get all file names
	const files = fs.readdirSync(ROUTES_DIR)

	// * Import all "route" objects and then only keep the routes that
	// * have the same cloudevent type as our invoking cloudevent.
	const routes = files
		.map(file => require(ROUTES_DIR + file).routes)
		.flat()
		.filter(route => route.cloudeventType === cloudevent.type)

	// * Find each unique function name so that we only invoke each lambda once.
	const functionNames = Array.from(new Set(routes.map(item => item.functionName)))

	// * Create a proimse for each lambda function we need to invoke.
	// * Also, check if we need to send the cloudevent to our websockets lambda.
	const promises = [
		...(cloudevent.wschannelid ? [WEBSOCKETS_FUNCTIONNAME] : []),
		...functionNames,
	].map(functionName => lambda.invoke({ cloudevent, functionName, invocationType: 'Event' }))

	// * Wait for every promise to finish and collect all success and error responses.
	const results = await Promise.allSettled(promises)

	// * Throw an error if any promise encounted an error.
	const rejections = results.filter(r => r.status === 'rejected').map(r => r.reason).join('; ')
	if (rejections) { throw new Error(rejections) }

	return true
}

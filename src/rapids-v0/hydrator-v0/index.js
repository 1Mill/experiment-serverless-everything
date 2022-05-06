const fs = require('fs')
const { Cloudevent } = require('@1mill/cloudevents')
const { Lambda } = require('@1mill/lambda')

const ROUTES_DIR = Object.freeze('./routes/')
const WEBSOCKETS_FUNCTIONNAME = Object.freeze('rapids-v0-websockets-v0')

const lambda = new Lambda({
	accessKeyId: 'palceholder',
	endpoint: 'http://localhost:4566/',
	region: 'us-west-2',
	secretAccessKey: 'palceholder',
})

exports.handler = async (cloudevent = {}, ctx) => {
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
	// * Also, check if we need to send the cloudevent to our websockets lambda.
	const functionNames = Array.from(new Set(routes.map(item => item.functionName)))
	const useWebsockets = routes.some(item => item.useWebsockets)

	// * Create a proimse for each lambda function we need to invoke.
	const promises = [
		...(useWebsockets ? [WEBSOCKETS_FUNCTIONNAME] : []),
		...functionNames,
	].map(functionName => lambda.invoke({ cloudevent, functionName, invocationType: 'Event' }))

	// * Wait for every promise to finish, regardless of error status.
	const results = await Promise.allSettled(promises)
	results.filter(r => r.status === 'rejected').forEach(r => console.error(r.reason))

	return true
}

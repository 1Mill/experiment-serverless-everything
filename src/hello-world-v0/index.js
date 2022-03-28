exports.handler = async (event, ctx) => {
	return {
		MY_SECRET_MESSAGE: process.env.MY_SECRET_MESSAGE,
		event,
		isWorking: true,
	}
}

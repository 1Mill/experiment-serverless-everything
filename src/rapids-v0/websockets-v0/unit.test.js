const proxyquire = require('proxyquire')
const { expect } = require('chai')

class MockSops {
	decrypt(name) {
		if (name === 'ABLY_API_KEY') { return 'someAblyApikey'}
	}
}

const { handler } = proxyquire.noCallThru().load('.', {
	'@1mill/sops': { Sops: MockSops }
})

describe('handler', () => {
	it('returns hello world', async () => {
		const result = await handler()
		expect(result).to.equal('someAblyApikey')
	})
})

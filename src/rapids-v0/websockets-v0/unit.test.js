const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')
const sopsImport = require('@1mill/sops')

chai.use(chaiAsPromised)
const { expect } = chai

const MOCK_SOPS_DECRYPT_RESPONSES = Object.freeze({ ABLY_API_KEY: 'someAblyApikey' })

class MockSops {
	decrypt(name) {
		if (MOCK_SOPS_DECRYPT_RESPONSES[name]) { return MOCK_SOPS_DECRYPT_RESPONSES[name]}
		throw Error(`Missing mocked "decrypt('${name}')" implementation`)
	}
}

describe('MockSops', () => {
	const mockSops = new MockSops()

	describe('.decrypt', () => {
		describe('when the input value does not match a mocked response', () => {
			it ('throws the proper error', () => {
				const value = 'NO_MOCKED_RESPONSE'
				const expected = `Missing mocked "decrypt('${value}')" implementation`
				expect(() => mockSops.decrypt(value)).to.throw(expected)
			})
		})
		describe('when the input value does match a mocked response', () => {
			it('returns the proper payload', () => {
				Object.entries(MOCK_SOPS_DECRYPT_RESPONSES).forEach(([key, value]) => {
					expect(mockSops.decrypt(key)).to.eq(value)
				})
			})
		})
	})
})

describe('handler', () => {
	// * Mock imports
	let mockSopsImport
	beforeEach(() => {
		mockSopsImport = sinon.stub(sopsImport, 'Sops').returns(new MockSops)
	})
	afterEach(() => {
		mockSopsImport.reset()
	})

	// * The handler function must be imported
	// * and called inside a wrapper function
	// * so that it runs only after all necessary
	// * imports have been mocked.
	const handler = () => require('.').handler()

	describe('when the input cloudevent does not have an #id', () => {
		it ('throws the proper error', async () => {
			const cloudevent = { id: null }
			const expected = 'Cloudevent "id" is required'
			await expect(handler(cloudevent)).to.eventually.rejectedWith(expected)
		})
	})
})

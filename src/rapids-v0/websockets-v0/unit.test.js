const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')
const sopsImport = require('@1mill/sops')
const { expect } = require('chai')

chai.use(chaiAsPromised)

const MOCK_SOPS_DECRYPT_RESPONSES = Object.freeze({ ABLY_API_KEY: 'some-ably-api-key' })

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

describe('.handler', () => {
	let cloudevent
	let mockSopsImport

	beforeEach(() => {
		cloudevent = {
			id: 'some-id-value',
			source: 'some-source-value',
			type: 'some-type-value',
			wschannelid: 'some-wschannelid-value',
		}

		mockSopsImport = sinon.stub(sopsImport, 'Sops').returns(new MockSops)
	})

	afterEach(() => {
		mockSopsImport.restore()
	})

	// * The handler function must be imported
	// * and called inside a wrapper function
	// * so that it runs only after all necessary
	// * imports have been mocked.
	const handler = (...args) => require('.').handler(...args)

	describe('when the input cloudevent is not valid', () => {
		describe('when the input cloudevent is missing an #id', () => {
			it('throws the proper error message', async () => {
				cloudevent.id = null
				const expected = 'Cloudevent "id" is required'
				await expect(handler(cloudevent)).to.eventually.rejectedWith(expected)
			})
		})

		describe('when the input cloudevent is missing a #source', () => {
			it('throws the proper error message', async () => {
				cloudevent.source = null
				const expected = 'Cloudevent "source" is required'
				await expect(handler(cloudevent)).to.eventually.rejectedWith(expected)
			})
		})

		describe('when the input cloudevent is missing a #type', () => {
			it('throws the proper error message', async () => {
				cloudevent.type = null
				const expected = 'Cloudevent "type" is required'
				await expect(handler(cloudevent)).to.eventually.rejectedWith(expected)
			})
		})

		describe('when the input cloudevent is missing a #wschannelid', () => {
			it('throws the proper error message', async () => {
				cloudevent.wschannelid = null
				const expected = 'Cloudevent "wschannelid" is required'
				await expect(handler(cloudevent)).to.eventually.rejectedWith(expected)
			})
		})
	})

	xdescribe('when the input cloudevent is valid', () => {
		beforeEach(() => {
			// TODO: Discover how to mock Ably
		})

		it('returns true', async () => {
			const result = await handler(cloudevent)
			expect(result).to.be.true
		})

		it('publishes the cloudevent to the proper Ably channel', () => {})
	})
})

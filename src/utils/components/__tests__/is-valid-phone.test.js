import '@testing-library/jest-dom/extend-expect'
import isValidPhone from '../isValidPhone'

describe('Check isValidPhone function', () => {
    it('it should return false if we pass incorrect number', async () => {
        const phone = '999999'
        expect(isValidPhone(phone)).toBe(false)
    })

    it('it should return true if we pass correct number', async () => {
        const phone = '9999999999'
        expect(isValidPhone(phone)).toBe(true)
    })
})

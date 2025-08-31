import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Textfield from '../textfield'

describe('Test Textfield component', () => {
    describe('Check UI', () => {
        it('Checks if texfield is being rendred in dom', async () => {
            render(<Textfield value="testing" />)
            const el = screen.getByTestId('text-field')
            expect(el).toBeInTheDocument()
        })

        it('Checks if placeholder sent in props is being rendred in dom', async () => {
            render(<Textfield placeholder="placeholder" />)
            const el = screen.getByPlaceholderText(/placeholder/i)
            expect(el).toBeInTheDocument()
        })

        it('Checks if label sent in props is being rendred in dom', async () => {
            render(<Textfield label="label" />)
            const el = screen.getByLabelText(/label/i)
            expect(el).toBeInTheDocument()
        })

        it('Checks if the value passed in props is displayed correctly', async () => {
            render(<Textfield value="testing" placeholder="placeholder" />)
            const el = screen.getByPlaceholderText(/placeholder/i)
            const value = el.value
            expect(value).toBe('testing')
        })

        it('Checks width passed in props', async () => {
            render(<Textfield width={200} />)
            const el = screen.getByTestId('text-field')
            expect(getComputedStyle(el).width).toBe('200px')
        })

        it('Checks height of textfield', async () => {
            render(<Textfield />)
            const el = screen.getByTestId('text-field')
            expect(getComputedStyle(el).height).toBe('50px')
        })

        it('Checks if className passed in props is applied', async () => {
            render(<Textfield className="testing" />)
            const el = screen.getByTestId('text-field')
            expect(el.className).toMatch(/testing/i)
        })

        it('Checks if label applies its styles after entering value', async () => {
            const dom = render(<Textfield placeholder="placeholder" label="label" />)
            const el = screen.getByPlaceholderText(/placeholder/i)

            const isFocusedBefore = dom.container.getElementsByClassName(
                'MuiInputLabel-shrink',
            ).length

            fireEvent.change(el, { target: { value: 'change' } })

            const isFocusedAfrer = dom.container.getElementsByClassName(
                'MuiInputLabel-shrink',
            ).length

            expect(isFocusedBefore).toBe(0)
            expect(isFocusedAfrer).toBe(1)
        })
    })

    describe('Check callback function', () => {
        it('Checks if the onChange function is called on change', async () => {
            const mockOnChange = jest.fn((e) => e.target.value)
            render(
                <Textfield
                    value="testing"
                    placeholder="placeholder"
                    onChange={mockOnChange}
                />,
            )
            const el = screen.getByPlaceholderText(/placeholder/i)
            fireEvent.change(el, { target: { value: 'change' } })
            expect(mockOnChange).toHaveBeenCalled()
        })

        it('Checks if the onChange function is called with right argument', async () => {
            const mockOnChange = jest.fn((e) => e.target.value)
            render(
                <Textfield
                    value="testing"
                    placeholder="placeholder"
                    onChange={mockOnChange}
                />,
            )
            const el = screen.getByPlaceholderText(/placeholder/i)
            fireEvent.change(el, { target: { value: 'change' } })
            expect(mockOnChange).toHaveReturnedWith('change')
        })
    })
})

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Button from '../button'

describe('Test Button component', () => {
    describe('Check UI', () => {
        it('Checks if texfield is being rendred in dom', async () => {
            render(<Button dataTestId="testing" />)
            const el = screen.getByTestId('testing')
            expect(el).toBeInTheDocument()
        })

        it('Checks if label sent in props is being rendred in dom', async () => {
            render(<Button label="label" />)
            const el = screen.getByText(/label/i)
            expect(el).toBeInTheDocument()
        })

        it('Checks if className passed in props is applied', async () => {
            render(<Button className="testing" />)
            const el = screen.getByTestId('button')
            expect(el.className).toMatch(/testing/i)
        })

        it('Checks width passed in props', async () => {
            render(<Button width={200} />)
            const el = screen.getByTestId('button')
            expect(getComputedStyle(el).width).toBe('200px')
        })

        it('Checks height of button', async () => {
            render(<Button />)
            const el = screen.getByTestId('button')
            expect(getComputedStyle(el).height).toBe('50px')
        })

        it('Checks if loader is rendered if loading is passed true', async () => {
            render(<Button loading={true} />)
            const el = screen.getByTestId('loader')
            expect(el).toBeInTheDocument()
        })
    })

    describe('Check callback function', () => {
        it('Checks if the onClick passed in props is trigerred', async () => {
            const mockOnClick = jest.fn(() => {})
            render(<Button dataTestId="button" onClick={mockOnClick} />)
            const el = screen.getByTestId('button')
            fireEvent.click(el)
            expect(mockOnClick).toBeCalledTimes(1)
        })

        it('Checks if disabled is true, onClick is not trigerred', async () => {
            const mockOnClick = jest.fn(() => {})
            render(
                <Button disabled={true} dataTestId="button" onClick={mockOnClick} />,
            )
            const el = screen.getByTestId('button')
            fireEvent.click(el)
            expect(mockOnClick).toBeCalledTimes(0)
        })
    })
})

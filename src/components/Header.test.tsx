import { render } from 'solid-js/web'
import { Header } from './Header'

describe('Header', () => {
  it('should the back link', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: '< Back' })).toBeInTheDocument()
  })
})

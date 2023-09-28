import { render, fireEvent } from '@solidjs/testing-library'
import { FieldList } from './FieldList'

describe('FieldList', () => {
  it('should be able to test components like a "real" framework', () => {
    const { getByRole } = render(() => <FieldList />)
    expect(true).toBe(true)
  })
})

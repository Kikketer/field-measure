import { render, fireEvent } from '@solidjs/testing-library'
import { FieldList } from './FieldList'

describe('FieldList', () => {
  it('should render', () => {
    const { getByRole, unmount } = render(() => <FieldList />)
    expect(true).toBe(true)
    unmount()
  })
})

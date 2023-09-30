import { render, fireEvent } from '@solidjs/testing-library'
import { FieldList } from './FieldList'
import { Route, Router, Routes } from '@solidjs/router'

// We need to fake the store for EVERY test:
jest.mock('../utilities/FieldStore', () => ({
  getFields: () => [],
  getField: () => {},
  saveField: () => {},
}))

const setupTest = () => {
  return render(() => (
    <Router>
      <Routes>
        <Route path="/" component={FieldList} />
      </Routes>
    </Router>
  ))
}

describe('FieldList', () => {
  it('should be able to test components like a "real" framework', () => {
    const { getByRole } = setupTest()
    expect(true).toBe(true)
  })
})

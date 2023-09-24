import { render } from "@solidjs/testing-library"
import { FieldList } from "./FieldList"

describe('FieldList', () => {
  it('should render', () => {
    render(() => <FieldList />)
    expect(true).toBe(true)
  })
}
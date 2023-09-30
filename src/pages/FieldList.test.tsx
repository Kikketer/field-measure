import { generateFields } from '../testHelpers/generateData'
import { renderTest } from '../testHelpers/render'
import { getFields } from '../utilities/FieldStore'
import { FieldList } from './FieldList'
import { waitFor } from '@solidjs/testing-library'

jest.mock('../utilities/FieldStore', () => ({
  getFields: jest.fn(),
  getField: jest.fn(),
  saveField: jest.fn(),
}))

describe('FieldList', () => {
  it('should list all the fields properly', async () => {
    const generatedFields = generateFields()
    getFields.mockReturnValue(generatedFields)
    const { getByRole, getByText } = renderTest(FieldList)

    // Wait for the list to load:
    await waitFor(() => getByText('Nakuru 1'))
    expect(getByText('Nakuru 1')).toBeInTheDocument()
  })
})

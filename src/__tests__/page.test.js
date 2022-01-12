import { parse } from "../page.mjs"

jest.mock('fs', () => {
  return {
    promises: {
      readfile: jest.fn()
    }
  }
})
import { promises } from "fs"
describe("page", () => {
  it("reads a file", () => {
    //TODO: refactor this because reading a file is silly for this function
    promises.readfile.mockImplementationOnce(() => 
      Promise.resolve(`
Some Markdown
=============

this file exists.
      `)
    )
    const result = parse("filename", {})
    expect(result.markup).toEqual('helllo')
  })
})

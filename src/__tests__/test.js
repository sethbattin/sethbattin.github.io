/**
 * who tests the tester?
 * this file does.
 */

// make sure module imports work (mostly)
import { parse } from "../page.mjs"

// make sure jest stuff works
describe("page", () => {
  it("runs a test", () => {
    //produce some test output
    expect(true).toBe(true)
  })
})

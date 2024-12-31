/**
 * Specify required object
 *
 * @examples require(".").sampleData
 */
export interface IModel {
  code: string
}

export const sampleData: IModel[] = [
  {
    code: "123456"
  },
  {
    code: "654321"
  },
]

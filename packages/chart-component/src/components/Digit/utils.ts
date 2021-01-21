// 456,6,',' => '000,456'
export const formatDigit = (num: string | number) => {
  let temp = num.toString()

  if (temp.startsWith('$')) {
    // eslint-disable-next-line prefer-destructuring
    temp = temp.split('$')[1]
  }
  return ['0', ...temp.split('')].reverse()
}

export const getArr = (): any => {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
}

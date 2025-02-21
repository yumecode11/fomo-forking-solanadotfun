const splitArray = (ele: any[], number: number) => {
  let temp = []

  let element = []
  for (let i = 0; i < ele.length; i++) {
    if (i % number == 0 && i != 0) {
      temp.push(element.slice())
      element = []
    }
    element.push(ele[i])
  }

  if (element.length != 0) temp.push(element)

  return temp
}



export {
  splitArray
}
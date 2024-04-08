
const removeItemById=(arr, _id) =>{
    const objToRemove = arr.find(obj => obj._id === _id);
    if (objToRemove) {
      const index = arr.indexOf(objToRemove);
      arr.splice(index, 1); // Remove 1 element at the specified index
    }
    return arr;
}

export default removeItemById;
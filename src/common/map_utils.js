const renameKeys = (keysMap, obj) => {
  return Object
    .keys(obj)
    .reduce((acc, key) => {
      return {
        ...acc,
        ...{ [keysMap[key] || key]: obj[key] },
      };
    }, {});
};

export default renameKeys;

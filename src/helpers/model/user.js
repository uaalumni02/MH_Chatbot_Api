const isValidUserName = (userName) => {
    const regExp = /^([A-Za-z]+[,.]?[ ]?|[A-Za-z]+['-]?)+$/i;
    return regExp.test(userName);
  };
  
  export { isValidUserName };
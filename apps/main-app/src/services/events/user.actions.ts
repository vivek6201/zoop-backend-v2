const userActions = (message: string) => {
  const response: {
    type: string;
    data: Record<string, any>;
  } = JSON.parse(message);

  console.log(response);
};

export default userActions;

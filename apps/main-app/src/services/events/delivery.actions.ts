const deliveryActions = (message: string) => {
  const response: {
    type: string;
    data: Record<string, any>;
  } = JSON.parse(message);

  console.log(response);
};

export default deliveryActions;

export const handleResponse = (response, defaultResponse) => {
  if (response && response.status === 200) {
    return response.data.objects || response.data.object;
  }
  return defaultResponse;
};

export const handleError = (response) => {
  if (response && response.data) {
    return response.data.message;
  }
  return 'Cannot connect to services';
};

export const handleRequest = async (requestFunc, args, defaultResponse) => {
  try {
    return [
      handleResponse(await requestFunc(...args), defaultResponse),
      null,
    ];
  } catch (e) {
    return [
      null,
      handleError(e.response),
    ];
  }
};

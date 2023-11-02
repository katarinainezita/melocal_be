export const MelocalException = (res, code, message, status, error, data) => {
  if (status === "error") {
    return res.status(code).json({
      message: message,
      status: status,
      error: error,
      data: data
    });
  } else {
    return res.status(code).json({
      message: message,
      status: status,
      data: data
    });
  }
}

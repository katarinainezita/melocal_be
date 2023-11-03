export const MelocalException = (res, code, message, status, data) => {
  if (status === StatusResponse.ERROR) {
    return res.status(code).json({
      success: false,
      message: message,
      status: status,
      data: data
    });
  } else {
    return res.status(code).json({
      success: true,
      message: message,
      status: status,
      data: data
    });
  }
}

export const StatusResponse = {
  SUCCESS: 'success',
  ERROR: 'error'
}
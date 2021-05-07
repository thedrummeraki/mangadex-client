const hoursFromNow = (h) => {
  const now = new Date();
  const newTimestamp = now.setTime(now.getTime() + 60 * 60 * 1000 * h);

  return new Date(newTimestamp);
};

const isPast = (date) => date - new Date() <= 0;

exports.hoursFromNow = hoursFromNow;
exports.isPast = isPast;

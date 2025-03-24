export const differTime = (time: string) => {
  const currentTime = new Date();
  const targetTime = new Date(time);

  console.log(currentTime, targetTime);

  // @ts-ignore
  const differenceInMilliseconds = currentTime - targetTime;
  const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
  const differenceInHours = Math.floor(differenceInMinutes / 60);

  if (differenceInHours < 1) {
    if (differenceInMinutes < 1) {
      return '刚刚'
    }
    return `${differenceInMinutes}分钟前`;
  } else {
    return `${differenceInHours}小时前`;
  }
};
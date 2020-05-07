import dayjs from "dayjs";

export const formatDate = (date, type = "YYYY-MM-DD HH:mm:ss") => {
    if (date) {
      return dayjs(date).format(type);
    }
    return dayjs().format(type);
  };

export const formatDateSameMonth = (date, month) => {
    let sameMonth = formatDate(month).substring(0,7)
    let sameMonthData = date.filter((item) => {
        item.time = formatDate(item.time)
        console.log(item.time.match(sameMonth)) 
        if(item.time.match(sameMonth)){
            return item
        }
        
    })
    return sameMonthData
  };
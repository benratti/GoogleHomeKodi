/**
 * this fonction convert time object to seconds
 * @param time
 * @returns {*}
 */
const toSeconds = (time) =>  {
    return time.seconds + 60 * time.minutes + 60 * 60 * time.hours;
}

/**
 * This function calculate end time
 * @param time current time of the video
 * @param totaltime total time of the video
 * @returns {Date} returns the video end date
 */
exports.getEndDate = (time,totaltime) => {

    let currentTime = toSeconds(time);
    let duration = toSeconds(totaltime);

    let remainingTime = duration - currentTime;
    let date = new Date();

    date.setSeconds(date.getSeconds() + remainingTime + 3600);

    return date;

}

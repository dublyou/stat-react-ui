import axios from 'axios';

export const getScores = (day, month, year) => {
    return axios.get(`/games/data/daily_scores/${month}/${day}/${year}/`)
}
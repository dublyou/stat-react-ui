import axios from 'axios';
import { getUrl } from '../utils/url';

export const getScores = (day, month, year) => {
    return axios.get(getUrl(`/games/data/daily_scores/${month}/${day}/${year}/`))
}
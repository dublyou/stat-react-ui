import axios from 'axios';
import { getUrl } from '../utils/url';

export const getArticles = (start=0, end=5) => {
    return axios.get(getUrl(`/news_data/?start=${start}&end=${end}`))
}
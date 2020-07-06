import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.cryptowat.ch/',
});

export const getPairPrice = async (pair) => {
    pair = pair.toLowerCase()
    const res = await api.get('markets/coinbase/'+pair+'/price')
    return res.data.result.price
}
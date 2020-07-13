import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.coinbase.com/v2',
});

export const getPairPrice = async (pair) => {
    const res = await api.get('prices/'+pair+'/spot')
    return res.data.data.amount
}
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.pro.coinbase.com',
});

export const getPairPrice = async (pair) => {
    const res = await api.get('products/'+pair+'/ticker')
    return res.data.price
}
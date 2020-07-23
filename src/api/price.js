import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.pro.coinbase.com',
});

export const getPairPrice = async (pair, inverted) => {
    if(inverted) {
        pair = pair
            .split('-')
            .map((v, i, arr) => {
                if(i === 0) return arr[1]
                return arr[0]
            })
            .join('-')
    }
    const res = await api.get('products/'+pair+'/ticker')

    if(inverted) return 1 / res.data.price
    return res.data.price
}
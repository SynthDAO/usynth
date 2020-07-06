import NavBar from '../../src/components/NavBar.vue';
import Positions from '../../src/screens/Positions.vue';

export default {
  title: 'Positions',
  component: Positions,
};

export const WithSynths = () => ({
  components: { Positions, NavBar },
  data: () => {
    return {
      synths:{
        ETHBTC:{
          name:"ETHBTC-AUG20",
          priceFeed:"ETH/BTC",
          price:"0.025238 BTC",
          usdPrice:243.52,
          expirationTimestamp:Date.now() + 10000000,
          creq:200,
          liquidationThresh:120,
          daiBalance:"100000000000000000000",
          synthBalance:"0",
          cratio:"300"
        }
      }
    }
  },
  template: `
  <div class="container">
  <NavBar/><Positions :synths="synths" />
  </div>`
});

export const WithPositions = () => ({
  components: { Positions, NavBar },
  template: `
  <div class="container">
  <NavBar/><Positions :positions="positions" />
  </div>`,
  data: () => {
    return {
      positions:[
        {
          name:"ETHBTC-AUG20",
          amount:10000,
          collateral:12000,
          cratio:"4743.44%",
          creq:"120%",
          pending:"none",
        },
        {
          name:"DAIBTC-AUG20",
          amount:1,
          collateral:2000,
          cratio:"200%",
          creq:"150%",
          pending:"Withdrawal: 300 DAI",
        }
      ]
    }
  }
});
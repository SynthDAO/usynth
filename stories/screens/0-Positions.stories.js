import NavBar from '../../src/components/NavBar.vue';
import Positions from '../../src/screens/Positions.vue';

export default {
  title: 'Positions',
  component: Positions,
};

export const Empty = () => ({
  components: { Positions, NavBar },
  template: `
  <div class="container">
  <NavBar/><Positions />
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
import Withdraw from '../../src/components/Withdraw.vue';

export default {
  title: 'Withdraw',
  component: Withdraw,
};

export const AboveCollateralRequirement = () => ({
  components: { Withdraw },
  template: `
  <div class="container">
    <Withdraw 
    name="ETHBTC-AUG20"
    currentCollateral="100000000000000000000"
    cratio="300"
    creq=200
    liquidationThresh=120 />
  </div>
  
  `
});

export const BelowCollateralRequirement = () => ({
  components: { Withdraw },
  template: `
  <div class="container">
    <Withdraw 
    name="ETHBTC-AUG20"
    currentCollateral="100000000000000000000"
    cratio="150"
    creq=200
    liquidationThresh=120 />
  </div>
  
  `
});

export const BelowLiquidationThreshold = () => ({
  components: { Withdraw },
  template: `
  <div class="container">
    <Withdraw 
    name="ETHBTC-AUG20"
    currentCollateral="100000000000000000000"
    cratio="100"
    creq=200
    liquidationThresh=120 />
  </div>
  
  `
});

import NavBar from '../../src/components/NavBar.vue';

export default {
  title: 'NavBar',
  component: NavBar,
};

export const Unauthed = () => ({
  components: { NavBar },
  template: `
  <div class="container">
    <NavBar :authed="false"/>
  </div>
  
  `
});

export const Authed = () => ({
  components: { NavBar },
  template: `
  <div class="container">
    <NavBar
    :authed="true"
    address="0x0000000000000000000000000000000000000001"
    network="Kovan"/>
  </div>
  
  `
});
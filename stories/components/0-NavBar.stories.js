import NavBar from '../../src/components/NavBar.vue';

export default {
  title: 'NavBar',
  component: NavBar,
};

export const Default = () => ({
  components: { NavBar },
  template: `
  <div class="container">
    <NavBar />
  </div>
  
  `
});
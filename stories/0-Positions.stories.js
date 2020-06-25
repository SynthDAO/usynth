import Positions from '../src/screens/Positions.vue';

export default {
  title: 'Positions',
  component: Positions,
};

export const Default = () => ({
  components: { Positions },
  template: '<Positions />'
});
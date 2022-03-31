import doubleClick from './doubleClick'

export default {
  install (Vm) {
    Vm.directive('btn', doubleClick)
  }
}

export default {
    // @param commit
    increment({ commit }) {
        commit('increment');
    },
    decrement({ commit }) {
        commit('decrement', 2);
    },
    double({ commit }) {
        commit('double');
    },
    toggleLoading({ commit }, chartTarget) {
        commit('toggleLoading', chartTarget);
    }
}
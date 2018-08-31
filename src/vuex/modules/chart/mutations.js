export default {
    increment(state) {
        state.counter++;
    },
    decrement(state, pload) {
        state.counter -= pload;
    },
    double(state) {
        state.counter *= 2;
    },
    toggleLoading(state, pload) {
        if (state.isShowloading) {
            pload.hideLoading();
            state.isShowloading = false;
        } else {
            pload.showLoading();
            state.isShowloading = true;
        }
    }
}
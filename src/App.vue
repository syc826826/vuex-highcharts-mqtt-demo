<template>
  <div id="app">
    <div class="logo">
      <img src="./assets/logo.png">
    </div>

    <div class="myInfo">
      <p v-if="isHaveMobile">欢迎您，{{mobile}}</p>
      <p @click="goLogin" v-if="!isHaveMobile">登录</p>
    </div>


    <!-- <addTodo></addTodo>
    <todoList></todoList> -->
    <chart></chart>

    <login v-if="isShowLogin"></login>
  </div>
</template>

<script>
import login from "./components/login";
import addTodo from "./components/addTodo";
import todoList from "./components/todoList";

import chart from "./components/Chart.vue";

export default {
  name: "app",
  computed: {
    isShowLogin: function() {
      return this.$store.state.login.isShowLogin;
    },
    mobile: function() {
      return this.$store.state.login.mobile;
    },
    isHaveMobile: function() {
      let mobile = this.$store.state.login.mobile;
      if (mobile.length == 11) {
        return true;
      } else {
        return false;
      }
    }
  },
  data() {
    return {};
  },
  components: {
    login,
    addTodo,
    todoList,
    chart
  },
  methods: {
    goLogin: function() {
      this.$store.dispatch("showLogin", true);
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 auto;
  margin-top: 60px;
  width: 70%;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.row > * {
  padding: 0 20px;
}
.logos {
  margin: 0 auto;
  width:50%;
}
.logo-hc {
  width: 70%;
  height: auto;
}
.logo-vue {
  width: 15%;
  height: auto;
}
.button-grp {
  margin: 20px 0;
}
button {
  padding: 10px 20px;
  outline: none;
  background: #828ea0;
  color: #fff;
  font-size: 16px;
  margin: 5px;
  border: 0px;
}
button:hover {
  background: #a7aeb8;
  transition: background 0.2s;
}
button:active {
  color: rgb(117, 117, 117);
}
.btnActive {
  color: #6fcd98
}
</style>

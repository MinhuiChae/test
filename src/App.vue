
<template>
<div>
  <div>
    <button class="btn btn-primary" @click="add()">Add</button>
  </div>
  <div class="container" style="margin-top:30px">
    <table class="userListTable">
      <thead>
        <th>Id</th>
        <th>Name</th>
        <th>Age</th>
        <th>Gender</th>
      </thead>
      <tr v-for="(userData, idx) in state.userDatas" :key="idx">
        <td>{{ userData.id }}</td>
        <td>{{ userData.name}}</td>
        <td>{{ userData.age}}</td>
        <td>{{ userData.gender}}</td>
        <td><button class="btn btn-primary" @click="add()">Update</button></td>
        <td><button class="btn btn-primary" @click="add()">Delete</button></td>
      </tr>
    </table>
  </div>
</div>
</template>

<script lang="ts">
import {reactive, defineComponent} from 'vue';
import axios, { AxiosResponse } from 'axios';

interface UserData {
  id: number,
  name: string,
  age: number,
  gender: string,
}

export default defineComponent({
  name: 'App',
  components: {
    
  },
  setup() {
    const state = reactive({
      userDatas: [] as UserData[],
    });

    const add = () => {
      axios.post("/api/user").then((res: AxiosResponse) => {
        console.log(res.status);
      })
    };

    axios.get("/api/user").then((res: any) => {
      console.log(res.status);
      state.userDatas = res.data.data as UserData[];
    });

    return {
      state, 
      add,
    };
  }
})

</script>

<style>
  .userListTable {
    width: 70%;
    height: 150px;
  }
  tr {
    text-align: center; 
  }
  tr:hover {
    background: lightgray;
  }
</style>
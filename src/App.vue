
<template>
<div>
  <div class="black-bg" v-if="state.modal === true">
    <div class="white-bg" >
      <div style="float: right" @click="closeModal">닫기</div>
      <table>
        <tr>
        <td>id: <input v-model="state.selectData.id" readonly></td>
        <td>name: <input v-model="state.selectData.name"></td>
        <td>age: <input v-model="state.selectData.age"></td>
        <td>gender: <input v-model="state.selectData.gender" ></td>
        <div>
          <button class="btn btn-primary" @click.stop="updateUser">update</button>
        </div>
        </tr>
      </table>
    </div>
  </div>
  
  <div class="container" style="margin-top:30px">
    <table class="userListTable">
      <thead>
        <th>Id</th>
        <th>Name</th>
        <th>Age</th>
        <th>Gender</th>
      </thead>
      <tr v-for="(userData, idx) in state.userDatas" :key="idx" id="userDataList">
        <td>{{ userData.id }}</td>
        <td>{{ userData.name}}</td>
        <td>{{ userData.age}}</td>
        <td>{{ userData.gender}}</td>
        <td><button class="btn btn-primary" @click.stop="openModal(idx)">Update</button></td>
        <td><button class="btn btn-primary" @click.stop="deleteUser(userData.id )">Delete</button></td>
      </tr>
    </table>
  </div>
</div>
</template>

<script lang="ts">
import {reactive, defineComponent} from 'vue';
import axios from 'axios';

interface UserData {
  id: number,
  name: string,
  age: number,
  gender: string,
}

const userData: UserData = {
  id: 0,
  name: '',
  age: 0,
  gender: '',
};

export default defineComponent({

  name: 'App',
  setup() {
    const state = reactive({
      userDatas: [] as UserData[],
      modal: false,
      selectData: userData, //1
      selectedIdx: 0,
    });

    const add = () => {
      try {
        axios.post("/api/user",
          {
            id:state.selectData.id,
            name: state.selectData.name,
            age: state.selectData.age,
            gender: state.selectData.gender
          }
        );
        alert("User posted!");
      } catch (e) {
        console.log(e);
      }
    };

    axios.get("/api/user").then((res: any) => {
      state.userDatas = res.data.data as UserData[];
    });

    const updateUser = () => {
      try {
        axios.put("/api/user",
          {
            id:state.selectData.id,
            name: state.selectData.name,
            age: state.selectData.age,
            gender: state.selectData.gender
          }
        );
        state.userDatas[state.selectedIdx] = state.selectData;
        alert("User updated!");
      } catch (e) {
        console.log(e);
      }
    }

   const deleteUser = (id: number) => {
      try {
       // axios.delete("/api/user/" + id).then;
        state.userDatas.splice(1,1);
        console.log( state.userDatas);
        console.log(id);
        // alert("User deleted!");
      } catch (e) {
        console.log(e);
      }
    }

    const openModal = (idx: number) => {
      state.modal = true;
      state.selectedIdx = idx;
      state.selectData = Object.assign({}, state.userDatas[idx]);
      console.log(state.selectData);
    }

    const closeModal = () => {
      state.modal = false;
    }

    return {
      state, 
      add,
      openModal,
      closeModal,
      updateUser,
      deleteUser
    };
  }
})

</script>

<style>
  body {
    margin: 0;
  }
  div {
    box-sizing: border-box;
  }
  .black-bg {
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    position: fixed; padding: 20px;
  }
  .white-bg {
    width: 100%; 
    background: white;
    border-radius: 8px; padding: 20px;
  }
  .userListTable {
    width: 70%;
  }
  tr {
    text-align: center; 
  }
  #userDataList:hover {
    background: lightgray;
  }
</style>
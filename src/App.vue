<template>


  <div>
    <modal-view v-if="state.modal === true " @close-modal="state.modal = false" >
      <Content msg="Hello Vue in CodeSandbox!" />
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
    </modal-view>
    <button @click="state.modal = true">open</button>
  </div>









  
  <div class="container">
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
        <td><button class="btn btn-primary" @click.stop="openUpdateModal(idx)">Update</button></td>
        <td><button class="btn btn-primary" @click.stop="deleteUser(userData.id )">Delete</button></td>
      </tr>
    </table>
  </div>
  <div>
    <button class="btn-add" @click.stop="openAddModal">add</button>
  </div>


</template>

<script lang="ts">
import {reactive, defineComponent, onMounted} from 'vue';
import axios from 'axios';
import ModalView from "./components/modalView.vue"
import Content from "./components/content.vue";

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
  components: {
    ModalView,
    Content,
  },
  setup() {
    /**
     * 동적으로 감시를 해주는 변수를 선언한 후 동적으로 처리해주어야 하는 것들을 선언한다.
     * 유저들의 데이터와 함수를 실행할 때 해당하는 유저의 정보를 넣어준다.
     * 유저들의 데이터는 따로 인터페이스를 선언하여 형식에 어긋나지 않게 만들어주고 배열로 선언한다.
     * 유저의 정보를 update 하거나 delete 할 때 띄어지는 모달창의 상태 값도 false 로 지정
     * selectData는 선택된 데이터를 담기위하여 선언한다.
     * addData는 추가할 데이터 복사 값을 위해 선언.
     * selectIdx는 선택된 데이터의 값이 userDatas 배열 중에서 몇 번 째인지를 담는다.
     */
    const state = reactive({
      userDatas: [] as UserData[],
      modal: false,
      selectData: userData, 
      addData: userData,
      selectedIdx: 0,
    });


    /**
     * 유저의 정보를 가져온다음 서버에 보내주고 status 코드가 200번이면 성공하였다는 메세지와 함께 업데이트 된 리스트를 뿌려준다
     * 그렇지 않을 경우 해당 status 코드에 맞는 메세지를 alert 창에 뿌려주고 리스트를 보여준다.
     */
    const addUser = () => {
      try {
        axios.post("/api/user", {
          id:state.selectData.id,
          name: state.selectData.name,
          age: state.selectData.age,
          gender: state.selectData.gender
        }).then((res: any) => {
          state.userDatas = res.data.data as UserData[];          
          alert(res.data.msg);
          state.modal = false;
        }).catch((res:any) => alert(res.response.data.msg))
      } catch (e) {
        console.log(e);
      }
    };

    /**
     * 동적변화를 하는 userDatas 리스트를 요청된 리스트로 업데이트 한다.
     */
    const getUser = () => axios.get("/api/user").then((res: any) => {
      state.userDatas = res.data.data as UserData[];
    });   

    /**
     * Update 할 유저정보를 서버에 보내주고 status 코드가 200번이면 성공하였다는 메세지와 업데이트된 리스트를 뿌려준다
     * 그렇지 않을 경우 해당 status 코드에 맞는 메세지를 alert 창에 뿌려주고 리스트를 보여준다.
     */
    const updateUser = () => {
      try {
        axios.put("/api/user", {
          id:state.selectData.id,
          name: state.selectData.name,
          age: state.selectData.age,
          gender: state.selectData.gender
        }).then((res: any) => {
            state.userDatas = res.data.data as UserData[];
            state.modal = false;
            alert(res.data.msg);
        }).catch((res:any) => alert(res.response.data.msg))
      } catch (e) {
        console.log(e);
      }
    }
   
    /**
     * 삭제 할 유저의 아이디를 가져와서 서버에 넘겨준다. status 코드가 200번이면 유저의 리스트를 업데이트 해주고
     * 그렇지 않으면 해당하는 오류메세지를 뿌려준다
     */
    const deleteUser = (id: number) => {      
      try {
        axios.delete("/api/user/" + id).then((res: any) => {
          state.userDatas = res.data.data as UserData[];
          alert(res.data.msg);
        }).catch((res:any) => alert(res.response.data.msg))
      } catch (e) {
        console.log(e);
      }
    }

    /**
     * 업데이트 버튼을 클릭하면 열리는 모달
     * updateModal 이 true 일 때만 열리게 구현해야 하므로 여기서는 state.updateModal 을 true로 정해준다
     * 유저의 인덱스를 변수로 받아 state.selectIdx에 넣어주어 동적이게 만든다.
     * state.selectData 변수에 유저 리스트 중 idx번째 유저의 정보를 복사한다.
     */
    const openUpdateModal = (idx: number) => {
      state.modal = true;
      state.selectedIdx = idx;
      state.selectData = Object.assign({}, state.userDatas[idx]);
    }

    const openAddModal = () => {
      state.modal = true;
      state.selectData = Object.assign({}, state.addData);
    }

    const closeModal = () => {
      state.modal = false;
    }
    
    onMounted(() => {
      getUser()
    })

    return {
      state, 
      addUser,
      openUpdateModal,
      closeModal,
      updateUser,
      deleteUser,
      openAddModal,
    };
  }
})

</script>

<style lang="scss">

</style>
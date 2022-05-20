<template>
  <div>
    <modal-view v-if="state.modal === true " @close-modal="state.modal = false" >
      <div style="float: right" @click="closeModal">닫기</div>
      <Content 
        :selectedData = "state.selectData"
        :updateModal = "state.updateModal"
        :addModal = "state.addModal"
        @changeData = "onChangeSelectData"
      ></Content>
    </modal-view>
    <alert-modal v-if="state.alertModal === true" @close-modal="state.alertModal = false">
    <div style="float: right" @click="state.alertModal = false">닫기</div>
      <alert-content
        :alertMsg = "state.alertMsg">
      </alert-content>
    </alert-modal>
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
import alertModal from './components/alertModal.vue';
import alertContent from "./components/alertContent.vue"

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

export {UserData} ;
export default defineComponent({

  name: 'App',
  components: {
    ModalView,
    Content,
    alertModal,
    alertContent
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
      updateModal: false,
      addModal: false,
      alertModal: false,
      alertMsg: ''
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
          callUpdateList(res);   
          alertSuccessMessage(res);
        }).catch((res:any) => alertFailMessage(res))
      } catch (e) {
        console.log(e);
      }
    };

    /**
     * 동적변화를 하는 userDatas 리스트를 요청된 리스트로 업데이트 한다.
     */
    const getUser = () => axios.get("/api/user").then((res: any) => {
      callUpdateList(res);
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
            callUpdateList(res);
            alertSuccessMessage(res);
        }).catch((res:any) => alertFailMessage(res))
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
          callUpdateList(res);
          alertSuccessMessage(res);
        }).catch((res:any) => alertFailMessage(res))
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
      state.updateModal = true;
      state.addModal = false;
    }

    const openAddModal = () => {
      state.modal = true;
      state.selectData = Object.assign({}, state.addData);
      state.updateModal = false;
      state.addModal = true;
    }

    const closeModal = () => {
      state.modal = false;
    }

    const onChangeSelectData = (changeData: UserData) => {
      console.log("changeData> ", changeData);
      state.selectData = changeData;
      if(state.updateModal === true) {
        updateUser();
      } else if(state.addModal === true) {
        addUser();
      }
    }

    const callUpdateList = (res: any) => {
      state.userDatas = res.data.data as UserData[];
    }

    const alertSuccessMessage = (res: any) => {
      state.alertModal = true; 
      state.alertMsg = res.data.msg;
      state.modal = false;
    }

    const alertFailMessage = (res: any) => {
      state.alertModal = true; 
      state.alertMsg = res.response.data.msg;
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
      onChangeSelectData,
    };
  }
})

</script>
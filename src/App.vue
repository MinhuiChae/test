<template>
  <h1 class = 'text-align-center'>UserList</h1>
  <div>
    <ModalView class="userModal" v-if="state.modal === true" 
    :useCloseAction="true" 
    :overlCloseAction = "true"
    :useCloseBtn = "true"
    @closeModal = "closeModal">
      <Content 
        :selectedData = "state.selectData"
        :updateModal = "state.updateModal"
        :addModal = "state.addModal"
        @changeData = "onChangeSelectData"
        @checkFormList="alertCheckMessage"
        @checkName="checkNameForm"
      ></Content>
    </ModalView>
    <ModalView class="alertModal" v-if = "state.alertModal === true" 
    :useCloseAction="true"  
    :overlCloseAction = "true"
    :useCloseBtn = "true"
    :isConfirmModal = "state.confirmDelete" 
    @confirmAction = "deleteConfirmAction"
    @closeModal = "closeAlertModal">
      <alertContent
        :alertMsg = "state.alertMsg">
      </alertContent>
    </ModalView>
  </div>

  <div>
    <button class="btn-add" @click.stop="openAddModal">add</button>
  </div>
 
  <div class = "container">
    <table class = "userListTable">
      <thead>
        <th @click="sort('id', state.sortBy)">Id</th>
        <th @click="sort('name', state.sortBy)">Name</th>
        <th @click="sort('age', state.sortBy)">Age</th>
        <th>Gender</th>        
      </thead>
      <tr v-for = "(userData) in getPaginatedData(state.pageNum)" :key = "userData.id" class = "userDataList">
        <td>{{ userData.id }}</td>
        <td>{{ userData.name }}</td>
        <td>{{ userData.age }}</td>
        <td>{{ userData.gender }}</td>
        <td><button class="btn btn-primary" @click.stop="openUpdateModal(userData.id)">Update</button></td>
        <td><button class="btn btn-primary" @click.stop="openDeleteModal(userData.id)">Delete</button></td>
      </tr>
    </table>
  </div>

  <div class="btn-cover">
    <button @click="onChangePageNum(-1)" :class="{'disabled': !canPrevPage}">
      이전
    </button>
    <span class="page-count">{{ state.pageNum }} / {{ getPagingTotalPageCount()}} 페이지</span>
    <button @click="onChangePageNum(+1) " :class="{'disabled': !canNextPage}">
      다음
    </button>
  </div>
</template>

<script lang="ts">

import {reactive, defineComponent, onMounted, computed} from 'vue';
import axios from 'axios';
import ModalView from "./components/modalView.vue"
import Content from "./components/content.vue";
import alertContent from "./components/alertContent.vue"
import { IUserData, ESortType } from "@/interface";
import Paging from "./paging"

export default defineComponent({

  name: 'App',
  components: {
    ModalView,
    Content,
    alertContent
  },
  setup() {

    const userData: IUserData = {
      id: 0,
      name: '',
      age: 0,
      gender: 'female',
    };

    /**
     * 동적으로 감시를 해주는 변수를 선언한 후 동적으로 처리해주어야 하는 것들을 선언한다.
     * 유저들의 데이터와 함수를 실행할 때 해당하는 유저의 정보를 넣어준다.
     * 유저들의 데이터는 따로 인터페이스를 선언하여 형식에 어긋나지 않게 만들어주고 배열로 선언한다.
     * 유저의 정보를 update 하거나 delete 할 때 띄어지는 모달창의 상태 값도 false 로 지정
     * selectData는 선택된 데이터를 담기위하여 선언한다.
     * addData는 추가할 데이터 복사 값을 위해 선언.
     * selectIdx는 선택된 데이터의 값이 userDatas 배열 중에서 몇 번 째인지를 담는다.
     * 
     * 
     */
    const state = reactive({
      userDatas: [] as IUserData[],
      modal: false,
      selectData: userData, 
      addData: userData,
      selectedIdx: 0,
      updateModal: false,
      addModal: false,
      alertModal: false,
      alertMsg: '',
      confirmDelete: false,
      userId: 0,
      sortType: '' as ESortType,
      sortBy: '',
      pageNum: 0,
      pageSize: 2,
      dir:'asc',
      sortCnt: 0
    });

    const paging = new Paging(state.pageSize);

    const getPaginatedData = (num: number) => {
      return paging.paginatedData(num);
    }

    const moveLastPageAfterDelete = (num: number) => {
      if(paging.paginatedData(num).length === 0) {
        state.pageNum --;
      }
    }

    const moveCurrentPageAfterAdd = (num: number) => {
      console.log("paging.paginatedData(num).length", paging.paginatedData(num).length)
      if(paging.paginatedData(num).length === state.pageSize && (getPagingTotalPageCount() > state.pageNum)) {
        state.pageNum ++;
      }
    }

    const canPrevPage = computed(() => paging.isActivePrevButton(state.pageNum));
    const canNextPage = computed(() => paging.isActiveNextButton(state.pageNum));

    const getPagingTotalPageCount = () => {
      return paging.totalPage;
    }


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
          updateList(res);   
          alertSuccessMessage(res);
          moveCurrentPageAfterAdd(state.pageNum);
        }).catch((res:any) => alertFailMessage(res));
      } catch (e) {        
        console.log(e);
      }
    };

    /**
     * 동적변화를 하는 userDatas 리스트를 요청된 리스트로 업데이트 한다.
     */
    const getUser = () => axios.get("/api/user").then((res: any) => {
      updateList(res);
      state.pageNum = 1;
      // onChangePageNum()
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
            updateList(res);
            alertSuccessMessage(res);
        }).catch((res:any) => alertFailMessage(res))
      } catch (e) {
        console.log(e);
      }
    }
    /**
     * 삭제여부를 묻는 모달창을 띄워주고
     * 아이디값을 받아와서 state.userId에 저장한다.
     */
    const openDeleteModal = (id: number) => { 
      state.userId = id;
      state.alertModal = true; 
      state.alertMsg = "정말 삭제하시겠습니까?";
      state.confirmDelete = true;
    }

    /**
     * 삭제여부를 묻는 모달창에서 확인버튼을 누르면 해당 모달창은 닫고 삭제행위를 시작한다. 
     * delete 할 유저의 정보는 confirmDeleteAction 에서 저장한 state.userId로 한다
     * 해당 id 를 서버에 넘긴 후 status code가 200번이면 delete를 한 후 업데이트 된 리스트를 뿌려준다. 
     * 그 후 성공했다는 메세지를 뿌려주고, 만약 status code가 200번이 아니면 그에 맞는 fail 메세지를 뿌려준다.
     */

    // 외부에서
    const deleteConfirmAction = () => {
      closeModal();
      deleteUser();
    }
  
    const deleteUser = () => {
      try {
        axios.delete("/api/user/" + state.userId).then((res: any) => {
          updateList(res);
          alertSuccessMessage(res);
          moveLastPageAfterDelete(state.pageNum);
        }).catch((res:any) => alertFailMessage(res));
      } catch (e) {
        console.log(e);
      }  
    }

    /**
     * 업데이트 버튼을 클릭하면 열리는 모달
     * updateModal 이 true 일 때만 열리게 구현해야 하므로 여기서는 state.updateModal 을 true로 정해준다
     * 유저의 아이디를 받아 UserDatas 에서 해당 아이디의 정보를 가져와서 state.selectData에 넣어준다.
     */
    const openUpdateModal = (id: number) => {
      const selectData = state.userDatas.find((key: IUserData) => key.id === id);
      if(selectData) state.selectData = selectData;
      state.modal = true;
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

    const closeAlertModal = () => {
      state.alertModal = false;
      state.confirmDelete = false;
    }

    const onChangeSelectData = (changeData: IUserData) => {
      state.selectData = changeData;
      if(state.updateModal === true) {
        updateUser();
      } else if(state.addModal === true) {
        addUser();
      }
    }

    const updateList = (res: any) => {
      state.userDatas = res.data.data as IUserData[];
      paging.setList(state.userDatas);
      if (state.sortType) doSort();
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

    const alertCheckMessage = (checkFormList: string[]) => {
      state.alertModal = true; 
      state.alertMsg = checkFormList + "를 확인하십시오";
    }

    const checkNameForm = (checkName: boolean) => {
      if(checkName) {
        state.alertModal = true; 
        state.alertMsg = "형식에 맞지않는 이름입니다.";
      }
    }

    const sort = (sortType: string, sortBy: string) => {
      state.sortCnt++;
      state.sortType = sortType as ESortType;
      console.log(state.sortCnt)
      if(state.sortCnt === 1) {
        console.log(1)
      }
      state.sortBy = sortBy;

       console.log(sortBy)

      doSort();
    }

    const doSort = () => {
      switch(state.sortType) {
        case ESortType.Id:
          sortByUserId(state.userDatas);
          break;
        case ESortType.Name:
          sortByUserName(state.userDatas);
          break;
        case ESortType.Age:
          sortByUserAge(state.userDatas);
          break;
      }
    }

    const sortByUserId = (userDatas: IUserData[]) => {
      userDatas.sort((a: IUserData, b: IUserData) => {
        return a.id - b.id;
      });

      return userDatas;
    }

    const sortByUserName = (userDatas: IUserData[]) => {
      userDatas.sort((a: IUserData, b: IUserData): number => {
        if(a.name > b.name) return 1;
        if(a.name < b.name) return -1;
        else return 0;
      });

      return userDatas;
    }

    const sortByUserAge = (userDatas: IUserData[]) => {
      userDatas.sort((a: IUserData, b: IUserData) => {
        return a.age - b.age;
      });
      
      return userDatas;
    }

    

    const onChangePageNum = (num: number) => {
      const changePageNum = state.pageNum + num;
      if( paging.isInvalidatePageNum(changePageNum) === false) {
        state.pageNum = changePageNum;        
      } 
    }

    onMounted(() => {
      getUser()
    })

    return {
      state, 
      addUser,
      openUpdateModal,
      closeModal,
      closeAlertModal,
      updateUser,
      openDeleteModal,
      openAddModal,
      onChangeSelectData,
      alertCheckMessage,
      checkNameForm,
      deleteConfirmAction,
      sort,
      paging,
      getPaginatedData,
      getPagingTotalPageCount,
      onChangePageNum,
      canPrevPage,
      canNextPage,
    };
  }
})

</script>
<style lang="scss">
.text-align-center {
  text-align: center;
}
.btn-cover {
  margin-top: 1.5rem;
  text-align: center;
}
.btn-cover .page-btn {
  width: 5rem;
  height: 2rem;
  letter-spacing: 0.5px;
}
.btn-cover .page-count {
  padding: 0 1rem;
}


.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

</style>
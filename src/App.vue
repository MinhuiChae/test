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
        <th @click="sort('id')">Id</th>
        <th @click="sort('name')">Name</th>
        <th @click="sort('age')">Age</th>
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
    <button @click="onChangePageNum(-1)" :class="{'disabled': !canPrevPage, 'page-btn': canPrevPage}">
      이전
    </button>
    <span class="page-count">{{ state.pageNum }} / {{ getPagingTotalPageCount()}} 페이지</span>
    <button @click="onChangePageNum(+1) " :class="{'disabled': !canNextPage, 'page-btn': canNextPage}">
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
import { IUserData, ESortType, ESortDir } from "@/interface";
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
      pageNum: 0,
      pageSize: 4,
      dir:'asc',
      sortIdCnt: 0,
      copiedDatas: [] as IUserData[],
      sortNameCnt: 0,
      sortAgeCnt: 0,
      addUserIndex:0,
      currendPage:0
    });

    const paging = new Paging(state.pageSize);

    const getPaginatedData = (num: number) => {
      return paging.paginatedData(num);
    }

    const moveCurrentPageAfterDelete = (num: number) => {
      if(paging.paginatedData(num).length === 0) {
        state.pageNum --;
      }
    }

    const division = (arr:any[], num: number) => {
      arr.push(String(arr.length))
      const length = arr.length;
      const divide = Math.floor(length / num) + (Math.floor(length % num) > 0 ? 1 : 0);
      const newArray = [];

      for(let i = 1; i <= divide; i++) {
        newArray.push(arr.splice(1, num));
      }

      return newArray;
    }

    const moveCurrentPageAfterAdd = () => {
      const dividedList = division(Object.keys(state.userDatas), state.pageSize);
      const addIndexs = String(state.addUserIndex+1);
      let index: number = 0;
        for(let key in dividedList) {
          if(dividedList[key].find((value) => value === addIndexs)) {
            index = Number(key)+1;
          }
        }
      return index;
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
          getIndexAfterAdd();
          alertSuccessMessage(res);
          moveCurrentPageAfterAdd();
          changePageNumAfterAdd();
        }).catch((res:any) => alertFailMessage(res));
      } catch (e) {        
        console.log(e);
      }
    };

    const getIndexAfterAdd = () => {
      state.addUserIndex = state.userDatas.findIndex((a:IUserData) => a.id === state.selectData.id);
    }

    const changePageNumAfterAdd = () => {
      state.pageNum = moveCurrentPageAfterAdd();
    }

    /**
     * 동적변화를 하는 userDatas 리스트를 요청된 리스트로 업데이트 한다.
     */
    const getUser = () => axios.get("/api/user").then((res: any) => {
      updateList(res);
      state.pageNum = 1;
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
  
  //삭제를 하기 전 리스트가 하나밖에 없으면 그 리스트가 삭제된 후 현재의 페이지가 바로 직전의 페이지로 이동 됨.
    const deleteUser = () => {
      try {
        axios.delete("/api/user/" + state.userId).then((res: any) => {
          updateList(res);
          alertSuccessMessage(res);
          moveCurrentPageAfterDelete(state.pageNum);
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
      state.copiedDatas.length = 0;
      state.userDatas.forEach((a:IUserData) => state.copiedDatas.push(a));
      paging.setList(state.userDatas);
      if (state.sortType) doSort();
    }

    const alertSuccessMessage = (res: any) => {
      state.alertModal = true; 
      state.alertMsg = res.data.msg;
      state.modal = false;
      state.confirmDelete = false;
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

    //어떤 방식으로 정렬을 할지 정해주는 함수
    //num 을 3으로 나눈 나머지가 1일 경우 asc, 2일경우 desc, 3일경우는 기존의 userList를 가져온다.
    const decideDirByCnt = (sortNum: number, num:number) => {
      if(sortNum % num === 1) {
        state.dir = ESortDir.ASC
      } else if(sortNum % num === 2) {
        state.dir = ESortDir.DESC
      } else if(sortNum % num === 0) {
        state.dir = ESortDir.ORIGIN
      }
    }

    //sortType 을 받아 key 별로 count를 해주어 decideDirByCnt에게 넘겨주어 decideDirByCnt가 정렬방식을 정해주면 해당 정렬방식으로 정렬한다.
    const sort = (sortType: string) => {
      state.sortType = sortType as ESortType;
      if(state.sortType === ESortType.Id) {
        state.sortIdCnt++;
        decideDirByCnt(state.sortIdCnt, 3);
      } else if(state.sortType === ESortType.Name) {
        state.sortNameCnt++;
        decideDirByCnt(state.sortNameCnt, 3);
      } else if(state.sortType === ESortType.Age) {
        state.sortAgeCnt++;
        decideDirByCnt(state.sortAgeCnt, 3);
      }
      doSort();
    }

    //sort에서 정해진 sortType 과 유저리스트, 정렬 방식을 가져와 직접적으로 정렬하는 함수
    const doSort = () => {
      sortBySortType(state.sortType, state.userDatas, state.dir);
    }

    const sortAsAsc = <K extends keyof IUserData>(userDatas: IUserData[], key: K) => {
      userDatas.sort((a: IUserData, b: IUserData) => {
        if(a[key] < b[key]) return -1;
        if(a[key] > b[key]) return 1;
        return 0; 
      });
    }

    const sortAsDesc = <K extends keyof IUserData>(userDatas: IUserData[], key: K) => {
      userDatas.sort((a: IUserData, b: IUserData) => {
        if(a[key] > b[key]) return -1;
        if(a[key] < b[key]) return 1;
        return 0; 
      });
    }

    //정렬방식별로 초기화객체인 userData에서 key 값을 가져와서 sortKey와 같은 값을 찾아서 sortByAsc 함수로 뿌려준다.
    //dir이 origin 즉, else 의 경우 이미 값이 바꿔진 userDatas를 초기화 한 후 처음 UserData를 복사해두었던 copiedDatas를 다시 넣어준다.
    const sortBySortType = (sortKey: string, userDatas: IUserData[], dir: string) => {
      if(dir === 'asc') {
        Object.keys(userData).find((key) => {
          if(key === sortKey) {
            sortAsAsc(userDatas, key as keyof IUserData);
          }
        })
      } else if(dir === 'desc') {
        Object.keys(userData).find((key) => {
          if(key === sortKey) {
            sortAsDesc(userDatas, key as keyof IUserData);
          }
        })
      } else {
        state.userDatas.length = 0;
        state.copiedDatas.forEach((a: IUserData) => state.userDatas.push(a))
      }

      return userDatas;
    }

    const onChangePageNum = (num: number) => {
      const changePageNum = state.pageNum + num;
      if(paging.isInvalidatePageNum(changePageNum) === false) {
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
  letter-spacing: 0.5px;
}
.btn-cover .page-count {
  padding: 0 1rem;
}

.disabled {
  width:100px;
  height:35px;
  border:0px;
  margin:0px;
  background-color: gray;
  color:#000;
}

</style>
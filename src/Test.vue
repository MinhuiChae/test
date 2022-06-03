<template>
  <div>
    <ul>
      <li>
          <div class ='row'>
          <div @click.stop = "sort('id')"> 아이다 </div>
          <div @click.stop = "sort('name')" > 이름 </div>
          <div @click.stop = "sort('age')" > 나이 </div>
          <div @click.stop = "sort('female')" > 성별 </div>
        </div>
      </li>
      <li v-for="data in paging.getPagingData(state.page, state.sortBy, state.dir)" :key="data.id">
        <div class ='row'>
          <div> {{ data.id }} </div>
          <div> {{ data.name }} </div>
          <div> {{ data.age }} </div>
          <div> {{ data.female }} </div>
        </div>
      </li>
      <li>
        <div class ='paging'>
          <div>
          Total Page : {{ paging.getTotalPage() }}
          now Page: {{ paging.getPage() }}
          </div>
          <div class = 'right'>
            <div @click.stop="onPageLoad(-1)"> Prev </div>
            <div @click.stop="onPageLoad(1)"> Next </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import {defineComponent, onMounted, reactive } from 'vue'


 class Paging  {
  datas = [];
  page =  0;
  divideCnt = 3;
  totalPage =  0;

  setDatas(datas: any) {
    this.datas = datas;
  }

  getPagingData (page: number, a: any, b: any): any[]  {
    this.page = page;
    const startPos = (this.divideCnt * (page - 1));
    console.log(a,b);
    return this.datas.slice(startPos, startPos + this.divideCnt);
  }

  getTotalPage (): number  {
    console.log("getTotalPage> ")
    this.totalPage = Math.ceil(this.datas.length / this.divideCnt);
    return this.totalPage;
  }

  getPage(): number {
    return this.page;
  }

  
}

export default defineComponent({
  name:'Test-App',
  setup() {

    const datas = [{
        id: 1,
        name: '헤이헤이',
        age: 23,
        female: 'man',
      },
      {
        id: 11,
        name: '마마',
        age: 33,
        female: 'female',
      },
      {
        id: 2,
        name: '크크루',
        age: 22,
        female: 'man',
      },
      {
        id: 22,
        name: '와크크루',
        age: 42,
        female: 'man',
      },
      {
        id: 25,
        name: '무하마드',
        age: 43,
        female: 'female',
      },
      {
        id: 31,
        name: '하하하',
        age: 43,
        female: 'man',
      },{
        id: 6,
        name: '에헤',
        age: 43,
        female: 'female',
      }
    ];

    const state = reactive({
      datas: [],
      page: 0,
      sortBy: '',
      reload: false,
      dir: 'asc',
    });

    const paging = new Paging();

    const getDatas = () => {
      setTimeout(() => {
        paging.setDatas(datas);
        state.page = 1;
      },500);
    }

    const onPageLoad = (num: number) => {
      const page = state.page + num;
      if (page > 0 && page <= paging.totalPage ) {
        state.page = page;
      }
    }

    const sort = (sortBy: string) => {
      if (sortBy === state.sortBy) {
        state.dir = state.dir === 'asc' ? 'desc': 'asc';
      } else {
        state.dir = 'asc';
      }
      state.sortBy = sortBy;

      switch(sortBy){
        case 'id':
          if (state.dir === 'asc') {
            datas.sort((a, b) => {
              if (a.id < b.id) return -1;
              if (a.id > b.id) return 1;
              return 0;
            });
          } else {
             datas.sort((a, b) => {
              if (a.id > b.id) return -1;
              if (a.id < b.id) return 1;
              return 0;
            });
          }

          break;
      }

      paging.setDatas(datas);
    }

    onMounted(() => {
      getDatas();
    })

    return {
      state,
      paging,
      onPageLoad,
      sort,
    }
  },
})
</script>
<style lang="scss">
  ul, li {
    list-style: none;
    text-decoration: none;
  }

  .row {
    display: flex;
    width: 500px;
    flex-direction: row;
    height:35px;
    align-items: center;

    div {
      flex:1;
      display: flex;
      align-items: center;
    }
  }

  .paging {
    display: flex;
    width: 500px;
    flex-direction: row;
    height:35px;
    align-items: center;

    .right {
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      div {
        flex: 1;
        display: flex;
        justify-content: center;
      }
    }
  }

</style>
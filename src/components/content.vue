<template>
  <div class = "content">
    <form ref = 'el'>
    <h1 class="userListTitle">{{ getTitle }}</h1>
      <ul>
        <li v-for ="input in inputList" :key = "input.name">
          <span class = 'label'>{{ input.name }}  </span>
          <input :type = "input.inputType" :name="input.name" :value="input.value" v-if="input.inputType !== 'select'" class="inputBox" :readonly="input.name === 'id' && getButtonName === 'update'"> 
          <select :name="input.name" :value="input.value" v-if="input.inputType === 'select'" class="selectBox">
            <option v-for="selectOption in input.selectOption" :key="selectOption"> {{ selectOption }} </option>
          </select>
        </li>
      </ul>
    </form>  
    <div> 
      <button class="changeInformBtn" @click.stop="changeUserInform" > {{ getButtonName }} </button>
    </div>
  </div>
 
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { IUserData, IUserInform } from '@/interface';
import useObject from '@/composition/useObject';
import { THTMLElement } from '@/types';

export default defineComponent({
  name: "Content-Popup",
  emits: ["changeData", "checkFormList", "checkName"],
  props: {
    selectedData: {
      type: Object as PropType<IUserData>
    },
    updateModal: {
      type: Boolean
    },
    addModal: {
      type: Boolean
    }
  },

  setup(props, context) {
    const el = ref<HTMLFormElement>();
    const changeIUserData: IUserData = Object.assign({}, props.selectedData);
    const { setProperty, getElementValue } = useObject();
    const checkFormList: string[] = [];
    let checkName: boolean = false;

    const inputList: IUserInform[] = [
      {
        name: 'id',
        value: props.selectedData?.id,
        inputType: 'number',
      },
      {
        name: 'name',
        value: props.selectedData?.name,
        inputType: 'text',
      }, 
      {
        name: 'age',
        value: props.selectedData?.age,
        inputType: 'number',
      },
      {
        name: 'gender',
        inputType: 'select',
        value: props.selectedData?.gender,
        selectOption: ['female', 'male'],
      }
    ]
    
    const changeUserInform = () => {
      const elements = el.value?.elements;
      console.log("elements", elements)
      if (elements) {
        [...elements].forEach(element => {
          const key = element.getAttribute("name");
          let value: string | number = getElementValue(element as THTMLElement);
          if (typeof changeIUserData[key as keyof IUserData] === "number") {
            value = parseInt(value as string);
          }
          if (key) {
            isValidInform(key, value);
          }
        });
      }
      
      if (checkFormList.length === 0 && checkName === false) {
        context.emit("changeData", changeIUserData);
      } else if(checkFormList.length !== 0){
        context.emit("checkFormList", checkFormList);
      } else { // 
        context.emit("checkName", checkName);
      }
      checkFormList.length = 0;
      checkName = false;
    };

    const checkNameForm = (value: any): boolean => {
      const nameForm = /^[가-힣]+$/;
      const checkName = nameForm.test(value);
      return checkName;
    }

    const isValidInform = (key: string, value: any) => {
      if (!value) {
        checkFormList.push(key);
      } else {
          if(key === 'name') {
            if(checkNameForm(value)) {
              setProperty(changeIUserData, key as keyof IUserData, value);
          } else {
              checkName = true;
          }
        } else {
          setProperty(changeIUserData, key as keyof IUserData, value);
        }
      }
    };

    const getButtonName = computed((): string => props.updateModal === true ? 'update' : props.addModal === true ? 'add' : '');
    const getTitle = computed((): string => props.updateModal === true ? 'UserUpdate' : props.addModal === true ? 'UserAdd' : '');
    
    return {
      props,
      changeUserInform,
      el,
      getButtonName,
      inputList,
      getTitle,
    };
  }
})
</script>
<style lang="scss" scoped>
  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    height:100%;

  }
  ul, li {
    text-decoration: none;
    list-style: none;
  }
  .userInputTable {
    text-align: left;
  }

  ul {
    display: flex;
    flex-direction: column;

    li {
      height:40px;
      display: flex;
      .label {
        display:inline-block;
        width: 100px;
      }

      input, select {
        flex:1;
        
        height:30px;
      }
    }
  }

  
</style>